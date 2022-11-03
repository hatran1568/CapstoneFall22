package com.example.Optimizer.DTO.Response;

import com.example.Optimizer.entity.Trip;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.concurrent.CompletableFuture;

@Data
@AllArgsConstructor
public class SimpleResponse {
    private String id;
    private Trip trip;
    private RequestStatus status;
    private int userID;
    String  port;
}
