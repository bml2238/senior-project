package com.senior.project.backend.users;

import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.senior.project.backend.Constants;
import com.senior.project.backend.domain.User;

import jakarta.persistence.EntityNotFoundException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {
    @InjectMocks
    private UserService userService;

    @Mock
    private UserRepository userRepository;

    @Test
    public void testAll() {
        when(userRepository.findAll()).thenReturn(Constants.USERS);
        Flux<User> result = userService.allUsers();
        StepVerifier.create(result)
            .expectNext(Constants.user1)
            .expectNext(Constants.user2)
            .expectComplete()
            .verify();
    }

    @Test
    public void findUserByEmailHappy() {
        when(userRepository.findUserByEmail(anyString())).thenReturn(Optional.of(Constants.user1));
        Mono<User> result = userService.findByEmailAddress(Constants.user1.getEmail());
        StepVerifier.create(result)
            .expectNext(Constants.user1)
            .expectComplete()
            .verify();
    }

    @Test
    public void findUserByEmailUnhappy() {
        when(userRepository.findUserByEmail(anyString())).thenReturn(Optional.empty());

        try {
            userService.findByEmailAddress(Constants.user1.getEmail());
            fail("Error should have been thrown");
        } catch (EntityNotFoundException e) {
            return;
        }
    }
}
