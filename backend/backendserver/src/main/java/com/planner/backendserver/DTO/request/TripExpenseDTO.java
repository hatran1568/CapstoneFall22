package com.planner.backendserver.DTO.request;

public interface TripExpenseDTO {
  int getExpenseId();
  int getTripId();
  double getAmount();
  int getExpenseCategoryId();
  String getDescription();
  String getName();
  String getIcon();
}
