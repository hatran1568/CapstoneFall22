package com.planner.backendserver.DTO.response;

import com.planner.backendserver.entity.Trip;
import lombok.Data;

@Data
public class ChecklistItemDTO {
    private int itemId;
    private int tripId;
    private boolean checked;
    private String title;
    private String note;
}
