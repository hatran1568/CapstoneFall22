package com.planner.backendserver.DTO;

public class TripExpenseAddDTO {
    double amount;
    String description;
    int expenseCategoryId;
    int tripId;
    int expenseId;

    public double getAmount(){
        return amount;
    };
    public String getDescription(){
        return description;
    };
    public int getExpenseCategoryId(){
        return expenseCategoryId;
    };
    public int getTripId(){
        return tripId;
    };
    public int getExpenseId(){
        return expenseId;
    };
}
