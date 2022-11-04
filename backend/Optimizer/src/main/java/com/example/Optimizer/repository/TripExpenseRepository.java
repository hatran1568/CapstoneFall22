package com.example.Optimizer.repository;

import com.example.Optimizer.entity.TripDetails;
import com.example.Optimizer.entity.TripExpense;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TripExpenseRepository extends JpaRepository<TripExpense, Integer> {
}
