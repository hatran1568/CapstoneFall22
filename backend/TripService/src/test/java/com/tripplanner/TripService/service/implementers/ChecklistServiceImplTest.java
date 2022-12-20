package com.tripplanner.TripService.service.implementers;

import com.tripplanner.TripService.entity.Trip;
import com.tripplanner.TripService.repository.ChecklistItemRepository;
import com.tripplanner.TripService.repository.TripRepository;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ChecklistServiceImplTest {
    @Autowired
    private ChecklistServiceImpl service;

    @MockBean
    private TripRepository tripRepo;

    @MockBean
    private ChecklistItemRepository checklistItemRepo;

    @Nested
    class GetChecklistItemsByTripIdTest {
        @Test
        void ExistingItemCase() {
            Trip trip = new Trip();
            trip.setTripId(1);

        }
    }
}