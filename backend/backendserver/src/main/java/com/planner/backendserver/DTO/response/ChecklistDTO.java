package com.planner.backendserver.DTO.response;

import com.planner.backendserver.dto.response.TripGeneralDTO;
import java.util.ArrayList;
import lombok.Data;

@Data
public class ChecklistDTO {

  private TripGeneralDTO trip;
  private ArrayList<ChecklistItemDTO> checklistItems;
}
