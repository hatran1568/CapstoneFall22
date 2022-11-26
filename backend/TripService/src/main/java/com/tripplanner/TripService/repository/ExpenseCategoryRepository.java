package com.tripplanner.TripService.repository;


import com.tripplanner.TripService.entity.ExpenseCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ExpenseCategoryRepository extends JpaRepository<ExpenseCategory, Integer> {
    @Query(value="select * from expense_category i where i.name = :name limit 1",nativeQuery=true)
    ExpenseCategory findByName(String name);
}
