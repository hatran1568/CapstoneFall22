package com.tripplanner.Optimizer.DTO;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

@Data

public class TripExpense {

    private int tripExpenseId;


    private ExpenseCategory expenseCategory;

    @JsonIgnore
    private Trip trip;


    private int amount;


    private String description;


    private TripDetails tripDetails;

}
