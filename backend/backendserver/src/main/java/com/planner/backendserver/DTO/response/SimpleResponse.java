package com.planner.backendserver.DTO.response;

import com.planner.backendserver.entity.Trip;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SimpleResponse {
    private String id;
    private Trip trip;
    private RequestStatus status;
    private int userID;
    String  port;

    public SimpleResponse() {

    }
}
