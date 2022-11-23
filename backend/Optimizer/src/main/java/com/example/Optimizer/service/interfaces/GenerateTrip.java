package com.example.Optimizer.service.interfaces;

import com.example.Optimizer.DTO.GenerateTripUserInput;
import com.example.Optimizer.DTO.Response.SimpleResponse;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

public interface GenerateTrip {
    public CompletableFuture<SimpleResponse> generateTrip(GenerateTripUserInput input,String baseUrl) throws ExecutionException, InterruptedException;

}
