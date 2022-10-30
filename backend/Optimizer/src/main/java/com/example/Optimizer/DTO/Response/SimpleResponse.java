package com.example.Optimizer.DTO.Response;

import com.example.Optimizer.entity.Trip;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SimpleResponse {
    private String id;
    private Trip trip;
    private RequestStatus status;
    String  port;
}
