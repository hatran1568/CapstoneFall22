package com.tripplanner.TripService.dto.response;

import lombok.Data;

@Data
public class ChecklistItemDTO {

  private int itemId;
  private int tripId;
  private boolean checked;
  private String title;
  private String note;
}
