package com.tripplanner.Optimizer.DTO.request;

import lombok.Data;

@Data
public class ExpenseDTO {

  private double amount;
  private String description;
  private int tripId;
  private int details;
}
