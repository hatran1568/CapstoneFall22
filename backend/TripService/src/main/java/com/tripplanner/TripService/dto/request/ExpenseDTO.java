package com.tripplanner.TripService.dto.request;

import lombok.Data;

@Data
public class ExpenseDTO {
    private double ammount;
    private String description;
    private int tripId;
    private int details;
}
