package com.tripplanner.Optimizer.DTO.Response;

import com.tripplanner.Optimizer.DTO.GenerateTripUserInput;
import com.tripplanner.Optimizer.DTO.Solution;
import com.tripplanner.Optimizer.entity.OptimizerRequest;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ComplexResponse {

  private Solution s;
  private com.tripplanner.Optimizer.DTO.Data data;
  private GenerateTripUserInput input;
  private OptimizerRequest request;
  private String token;
}
