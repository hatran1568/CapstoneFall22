package com.planner.backendserver.DTO.response;

import lombok.Data;

@Data
public class MasterActivityDTO {
    protected int activityId;
    protected String name;
    protected String address;
    protected boolean isCustom;
}
