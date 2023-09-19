package com.tripplanner.TripService.dto.response;

import java.util.ArrayList;
import lombok.Data;

@Data
public class ChecklistDTO {

  private TripGeneralDTO trip;
  private ArrayList<ChecklistItemDTO> checklistItems;
}
