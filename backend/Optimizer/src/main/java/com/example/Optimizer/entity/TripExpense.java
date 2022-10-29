package com.example.Optimizer.entity;


import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name="trip_expense")
public class TripExpense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="trip_expense_id",columnDefinition = "INT(1)")
    private int tripExpenseId;

    @ManyToOne
    @JoinColumn(name = "expense_category_id", nullable = false)
    private ExpenseCategory expenseCategory;

    @ManyToOne
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @Column(name="amount")
    private int amount;

    @Column(name="Description",columnDefinition = "text")
    private String description;
}
