package com.planner.backendserver.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class POIControllerTest {
    POIController poiController;

    @BeforeEach
    public void setUp() {
        poiController = new POIController();
    }

    @Test
    public void shouldGetPOIDetails() {
        poiController.getPOIDetails(1);
    }
}