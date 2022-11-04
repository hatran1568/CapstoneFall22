package com.example.Optimizer.service.interfaces;

import com.example.Optimizer.DTO.GenerateTripUserInput;
import com.example.Optimizer.DTO.Response.SimpleResponse;
import com.example.Optimizer.entity.Trip;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

public interface GenerateTrip {
    public CompletableFuture<SimpleResponse> generateTrip(GenerateTripUserInput input) throws ExecutionException, InterruptedException;
    public CompletableFuture<SimpleResponse> fetchJob(String jobId);
    public CompletableFuture<SimpleResponse> fetchJobElseThrowException(String jobId) throws Exception;
    public Trip getOutput(String jobId) throws Exception;
    public SimpleResponse getJobStatus(String jobId) throws Throwable;
    public boolean cancelJob(String jobId,int userID);
}
