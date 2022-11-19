package com.planner.backendserver.DTO.response;

import java.sql.Timestamp;

public interface DesDetailsDTO {
    int getDesId();
    String getDescription();
    boolean getDeleted();
    String getName();
}
