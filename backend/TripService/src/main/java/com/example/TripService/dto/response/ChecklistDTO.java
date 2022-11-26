package com.example.TripService.dto.response;

import lombok.Data;

import java.util.ArrayList;

@Data
public class ChecklistDTO {
    private TripGeneralDTO  trip;
    private ArrayList<ChecklistItemDTO> checklistItems;
}

