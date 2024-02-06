package com.senior.project.backend.Activity;

import com.senior.project.backend.domain.Event;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.core.publisher.Flux;
import reactor.test.StepVerifier;
import java.util.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class EventServiceTest {

    @InjectMocks
    private EventService eventService;

    @Mock
    private EventRepository eventRepository;

    @Test
    public void testAll() {
        Event event1 = new Event();
        event1.setId(1L);
        Event event2 = new Event();
        event2.setId(2L);
        List<Event> events = new ArrayList<>();
        events.add(event1);
        events.add(event2);

        when(eventRepository.findAll()).thenReturn(Flux.fromIterable(events));
        Flux<Event> result = eventService.all();
        StepVerifier.create(result).expectNext(event1).expectNext(event2).expectComplete().verify();
    }

    @Test
    public void testDashboard() {
        Event event1 = new Event();
        event1.setId(1L);
        Event event2 = new Event();
        event2.setId(2L);
        Event event3 = new Event();
        event3.setId(2L);
        List<Event> events = new ArrayList<>();
        events.add(event1);
        events.add(event2);
        events.add(event3);

        when(eventRepository.findAll()).thenReturn(Flux.fromIterable(events));
        Flux<Event> result = eventService.dashboard();
        StepVerifier.create(result).expectNext(event1).expectNext(event2).expectNext(event3).expectComplete().verify();
    }
}
