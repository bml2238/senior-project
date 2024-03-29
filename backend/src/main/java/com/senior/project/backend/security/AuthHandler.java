package com.senior.project.backend.security;

import java.time.Instant;
import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.senior.project.backend.domain.Role;
import com.senior.project.backend.domain.User;
import com.senior.project.backend.security.domain.LoginRequest;
import com.senior.project.backend.security.domain.LoginResponse;
import com.senior.project.backend.security.domain.TokenType;
import com.senior.project.backend.security.verifiers.TokenVerificiationException;
import com.senior.project.backend.security.verifiers.TokenVerifier;
import com.senior.project.backend.security.verifiers.TokenVerifierGetter;
import com.senior.project.backend.users.UserService;

import reactor.core.publisher.Mono;

/**
 * Handler for authentication functions
 * 
 * @author Jimmy Logan - jrl9984@rit.edu
 */
@Component
public class AuthHandler {

    private static final String AUTHORIZATION_HEADER = "X-Authorization";

    private final Logger logger = LoggerFactory.getLogger(AuthHandler.class);

    private final Mono<ServerResponse> authFailedResponse = ServerResponse.status(401).bodyValue("Unauthorized.");
    private final Mono<ServerResponse> errorResponse = ServerResponse.status(403).bodyValue("An error ocurred during sign in");
    private final Mono<ServerResponse> refreshErrorResponse = ServerResponse.status(403).bodyValue("An error ocurred when refreshing the token");

    @Autowired
    private AuthService authService;

    @Autowired
    private UserService userService;

    @Autowired
    private TokenVerifierGetter tokenVerifierGetter;

    /**
     * Handler function for signing in
     * 
     * The function gets the data from the login request and verifies the authentication token
     * In the case an error ocurrs, the function catches the error
     * 
     * If a user who does not exist attempts to sign in, a minimal user is created for them
     * 
     * @param req - the server request with the login request
     * @return 
     *      200 for successful login
     *      403 If an error ocurred during sign in
     */
    public Mono<ServerResponse> signIn(ServerRequest req) {
        return req.bodyToMono(LoginRequest.class)
            .flatMap(request -> {
                String idToken = request.getIdToken();
                TokenType type = request.getTokenType();
                try {
                    TokenVerifier verifier = this.tokenVerifierGetter.getTokenVerifier(type);
                    String email = verifier.verifiyIDToken(idToken);

                    return userService.findByEmailAddress(email)
                        .switchIfEmpty(createUser(verifier, idToken, email))
                        .doOnNext(user -> { if (!user.isSignedUp()) userService.createOrUpdateUser(user); })
                        .flatMap(authService::login)
                        .flatMap(res -> ServerResponse.ok().body(Mono.just(res), LoginResponse.class))
                        .switchIfEmpty(errorResponse);
                } catch (Exception e) {
                    this.logger.error(e.getMessage());

                    // Obscure the reason for failure
                    return errorResponse;
                }
            });
    } 
    
    /**
     * Handler function for refreshing a token
     * 
     * The function takes an incoming token, verifies that it came from this server
     * and then generates a new token for the user
     * 
     * @param req - the server request with the refresh request
     * @return 
     *      200 for successful refresh
     *      403 If an error ocurred during token refresh
     */
    public Mono<ServerResponse> refresh(ServerRequest req) {
        try {
            String token = req
                .headers()
                .header(AUTHORIZATION_HEADER)
                .get(0)
                .split("Bearer ")[1];

            return authService.refreshToken(token)
                .flatMap(res -> ServerResponse.ok().body(Mono.just(res), LoginResponse.class));
        } catch (Exception e) {
            logger.error(e.getMessage());
            return refreshErrorResponse;
        }
    }

    /**
     * Handler function for requests that failed authentication
     * 
     * @param req - failed request
     * @return 401 Unauthorized
     */
    public Mono<ServerResponse> authenticationFailed(ServerRequest req) {
        return authFailedResponse;
    }

    /**
     * Signs out a user
     * 
     * @param req
     * @return
     */
    public Mono<ServerResponse> signOut(ServerRequest req) {
        authService.signOut(req);
        return ServerResponse.ok().body(Mono.just("User has signed out."), String.class);
    }

    /**
     * Signs up a user by updating the user object in the database
     * 
     * @param req
     * @return 200 if the user was updated successfully
     */
    public Mono<ServerResponse> signUp(ServerRequest req) {
        return req.bodyToMono(User.class)
            .doOnNext(user -> user.setSignedUp(true))
            .doOnNext(user -> user.setDateCreated(Date.from(Instant.now())))
            .doOnNext(user -> user.setLastLogin(Date.from(Instant.now())))
            .doOnNext(user -> user.setRole(Role.Student))
            .flatMap(user -> userService.createOrUpdateUser(user))
            .flatMap(user -> ServerResponse.ok().bodyValue(user));
    }

    /**
     * Creates a user with minimal details
     * 
     * @param tokenVerifier - the service used to extract a name from an id token
     * @param idToken - the token the name is in
     * @param email - the email of the user
     * @return a mono of the created user
     * @throws TokenVerificiationException
     */
    private Mono<User> createUser(TokenVerifier tokenVerifier, String idToken, String email) throws TokenVerificiationException {
        String[] name = tokenVerifier.retrieveName(idToken).split(" ");
        String firstName = name[0];
        String lastName = name[name.length - 1];

        return Mono.just(User.builder()
            .email(email)
            .firstName(firstName)
            .lastName(lastName)
            .signedUp(false)
            .build());
    }
}
