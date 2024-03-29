package com.senior.project.backend.security.verifiers;

/**
 * Interface for verifiying an ID token from an authentication source
 * 
 * @author Jimmy Logan - jrl9984@rit.edu
 */
public interface TokenVerifier {

    /**
     * Verifies an ID token by verifying its structures, signature, and claims
     * 
     * @param token - token being verified
     * @return - A user's email
     * @throws TokenVerificiationException - thrown when an error occurs during the verification
     */
    String verifiyIDToken(String token) throws TokenVerificiationException;

    /**
     * Retrieves a users name from the token
     * 
     * @param token - token being verified
     * @return - A user's name
     * @throws TokenVerificiationException - thrown when an error occurs during the verification
     */
    String retrieveName(String token) throws TokenVerificiationException;
}
