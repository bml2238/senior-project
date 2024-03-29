package com.senior.project.backend.submissions;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import com.senior.project.backend.Constants;
import com.senior.project.backend.domain.Submission;
import com.senior.project.backend.security.CurrentUserUtil;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class SubmissionServiceTest {
    
    @InjectMocks
    private SubmissionService submissionService;

    @Mock
    private SubmissionRepository submissionRepository;

    @Mock
    private CurrentUserUtil currentUserUtil;

    @Test
    public void testAddSubmission() {
        when(submissionRepository.saveAndFlush(any())).thenReturn(Constants.submission1);

        Mono<Submission> result = submissionService.addSubmission(Constants.submission1);

        StepVerifier.create(result)
            .expectNext(Constants.submission1)
            .expectComplete()
            .verify();
    }

    @Test
    public void testAddSubmissionEmpty() {
        when(submissionRepository.saveAndFlush(any())).thenThrow(new NullPointerException());

        Mono<Submission> result = submissionService.addSubmission(Constants.submission1);

        StepVerifier.create(result)
            .expectComplete()
            .verify();
    }

    @Test
    public void testGetPreviousSubmission() {
        when(submissionRepository.findAllWithUserAndTask(any(), anyInt())).thenReturn(Constants.SUBMISSIONS);

        Flux<Submission> result = submissionService.getSubmissions(Constants.userAdmin.getId(), 1);

        StepVerifier.create(result)
            .expectNext(Constants.submission1)
            .expectNext(Constants.submission2)
            .expectComplete()
            .verify();
    }

    @Test
    public void testScrubArtifact() {
        when(submissionRepository.saveAndFlush(any())).thenReturn(Constants.submission1);

        Mono<Submission> result = submissionService.scrubArtifact(Constants.submission1)
            .map((submission) -> {
                assertEquals(submission.getArtifactId(), 1);
                submission.setArtifactId(2); // reset id to original state
                return submission;
            });

        StepVerifier.create(result)
            .expectNext(Constants.submission1)
            .expectComplete()
            .verify();
    }

    @Test
    public void testGetStudentSubmissions() {
        when(currentUserUtil.getCurrentUser()).thenReturn(Mono.just(Constants.userAdmin));
        
        when(submissionRepository.findAllWithUser(Constants.userAdmin.getId())).thenReturn(Constants.SUBMISSIONS);

        Flux<Submission> result = submissionService.getStudentSubmissions(Constants.userAdmin.getId());

        StepVerifier.create(result)
            .expectNext(Constants.submission1)
            .expectNext(Constants.submission2)
            .expectComplete()
            .verify();
    }

    @Test
    public void testGetWrongStudentSubmissions() {
        when(currentUserUtil.getCurrentUser()).thenReturn(Mono.just(Constants.userAdmin));
        
        Flux<Submission> result = submissionService.getStudentSubmissions(Constants.userAdmin.getId());

        StepVerifier.create(result).expectErrorMatches(throwable -> throwable instanceof ResponseStatusException &&
            throwable.getMessage().equals("Can't get submissions for other users"));
    }

    @Test
    public void testGetStudentSubmissionsFaculty() {        
        when(submissionRepository.findAllWithUser(Constants.userAdmin.getId())).thenReturn(Constants.SUBMISSIONS);

        Flux<Submission> result = submissionService.getStudentSubmissionsFaculty(Constants.userAdmin.getId());

        StepVerifier.create(result)
            .expectNext(Constants.submission1)
            .expectNext(Constants.submission2)
            .expectComplete()
            .verify();
    }

    @Test
    public void testFindByArtifactHappy() {
        when(submissionRepository.findSubmissionByArtifactId(anyInt())).thenReturn(Optional.of(Constants.submission1));

        Mono<Submission> result = submissionService.findByArtifact(1);

        StepVerifier.create(result)
            .expectNext(Constants.submission1)
            .expectComplete()
            .verify();
    }

    @Test
    public void testFindByArtifactEmpty() {
        when(submissionRepository.findSubmissionByArtifactId(anyInt())).thenReturn(Optional.empty());

        Mono<Submission> result = submissionService.findByArtifact(1);

        StepVerifier.create(result)
            .expectComplete()
            .verify();
    }
}
