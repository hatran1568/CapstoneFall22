package com.tripplanner.Optimizer.service.interfaces;

import com.tripplanner.Optimizer.DTO.GenerateTripUserInput;
import com.tripplanner.Optimizer.DTO.Response.ComplexResponse;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import javax.mail.MessagingException;

public interface GenerateTrip {
  public CompletableFuture<ComplexResponse> generateTrip(
    GenerateTripUserInput input,
    String baseUrl,
    String token
  ) throws ExecutionException, InterruptedException, MessagingException;

  public CompletableFuture<ComplexResponse> insertToDB(
    ComplexResponse response
  ) throws ExecutionException, InterruptedException;
}
