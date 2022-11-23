package com.planner.backendserver.DTO.response;
import com.planner.backendserver.dto.response.TripGeneralDTO;
import lombok.Data;

import java.util.ArrayList;

@Data
public class ChecklistDTO {
    private TripGeneralDTO  trip;
    private ArrayList<ChecklistItemDTO> checklistItems;
}
