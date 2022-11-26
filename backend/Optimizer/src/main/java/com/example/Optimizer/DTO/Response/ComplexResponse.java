package com.example.Optimizer.DTO.Response;

import com.example.Optimizer.DTO.GenerateTripUserInput;
import com.example.Optimizer.DTO.Solution;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ComplexResponse {
    private Solution s;
    private com.example.Optimizer.DTO.Data data;
    private GenerateTripUserInput input;
}
