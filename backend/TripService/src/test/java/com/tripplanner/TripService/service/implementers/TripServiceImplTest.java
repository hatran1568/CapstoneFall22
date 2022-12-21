package com.tripplanner.TripService.service.implementers;

import com.tripplanner.TripService.config.RestTemplateClient;
import com.tripplanner.TripService.repository.ExpenseCategoryRepository;
import com.tripplanner.TripService.repository.ExpenseRepository;
import com.tripplanner.TripService.repository.TripDetailRepository;
import com.tripplanner.TripService.repository.TripRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.cloud.client.discovery.DiscoveryClient;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class TripServiceImplTest {
    @Autowired
    private TripServiceImpl service;

    @MockBean
    private RestTemplateClient restTemplateClient;

    @MockBean
    private ModelMapper mapper;

    @MockBean
    private TripRepository tripRepository;

    @MockBean
    private TripDetailRepository tripDetailRepository;

    @MockBean
    private ExpenseRepository expenseRepository;

    @MockBean
    private DiscoveryClient discoveryClient;
}