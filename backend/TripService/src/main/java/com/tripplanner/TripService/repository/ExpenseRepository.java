package com.tripplanner.TripService.repository;


import com.tripplanner.TripService.dto.request.ExpenseCategorySelectDTO;
import com.tripplanner.TripService.dto.request.ExpenseGraphDTO;
import com.tripplanner.TripService.dto.request.TripExpenseDTO;
import com.tripplanner.TripService.entity.ExpenseCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

@Repository
public interface ExpenseRepository extends JpaRepository<ExpenseCategory, Double> {
    @Query(
            value = "SELECT te.trip_expense_id as expenseId, te.trip_id as tripId, te.expense_category_id as expenseCategoryId, te.amount, te.description, ec.name, ec.icon from trip_expense te LEFT JOIN expense_category ec on te.expense_category_id = ec.expense_category_id where te.trip_id = ?1\n",
            nativeQuery = true)
    ArrayList<TripExpenseDTO> getExpensesOfTrip(int tripId);

    @Query(
            value = "SELECT te.trip_expense_id as expenseId, te.trip_id as tripId, te.expense_category_id as expenseCategoryId, te.amount, te.description, ec.name, ec.icon from trip_expense te LEFT JOIN expense_category ec on te.expense_category_id = ec.expense_category_id where te.trip_id = ?1 ORDER BY te.amount DESC\n",
            nativeQuery = true)
    ArrayList<TripExpenseDTO> getExpensesOfTripAmountDesc(int tripId);

    @Query(
            value = "SELECT te.trip_expense_id as expenseId, te.trip_id as tripId, te.expense_category_id as expenseCategoryId, te.amount, te.description, ec.name, ec.icon from trip_expense te LEFT JOIN expense_category ec on te.expense_category_id = ec.expense_category_id where te.trip_id = ?1 ORDER BY te.amount\n",
            nativeQuery = true)
    ArrayList<TripExpenseDTO> getExpensesOfTripAmountAsc(int tripId);

    @Query(
            value = "SELECT te.trip_expense_id as expenseId, te.trip_id as tripId, te.expense_category_id as expenseCategoryId, te.amount, te.description, ec.name, ec.icon from trip_expense te LEFT JOIN expense_category ec on te.expense_category_id = ec.expense_category_id where te.trip_id = ?1 ORDER BY ec.name\n",
            nativeQuery = true)
    ArrayList<TripExpenseDTO> getExpensesOfTripName(int tripId);

    @Query(
            value = "SELECT ec.expense_category_id as value, ec.name as label FROM expense_category ec",
            nativeQuery = true)
    ArrayList<ExpenseCategorySelectDTO> getExpenseCategories();

    @Query(
            value = "SELECT ec.expense_category_id as expenseCategoryId, ec.name as name, SUM(te.amount) as amount\n" +
                    "FROM trip_expense te LEFT JOIN expense_category ec ON te.expense_category_id = ec.expense_category_id\n" +
                    "WHERE te.trip_id = ?1\n" +
                    "GROUP BY te.expense_category_id;",
            nativeQuery = true)
    ArrayList<ExpenseGraphDTO> getExpensesGraph(int tripId);

    @Query(
            value = "SELECT SUM(te.amount) FROM trip_expense te WHERE te.trip_id = ?1",
            nativeQuery = true)
    double getTotalExpense(int tripId);

    @Modifying
    @Transactional
    @Query(
            value = "DELETE FROM trip_expense te WHERE te.trip_expense_id = ?1",
            nativeQuery = true)
    int deleteExpense(int expenseId);

    @Modifying
    @Transactional
    @Query(
            value = "INSERT INTO trip_expense (amount, description, expense_category_id, trip_id) VALUE (?1, ?2, ?3, ?4)",
            nativeQuery = true)
    void addExpense(double amount, String description, int expenseCategoryId, int tripId);

    @Modifying
    @Transactional
    @Query(
            value = "UPDATE trip_expense te\n" +
                    "SET te.amount = ?1, te.description = ?2, te.expense_category_id = ?3\n" +
                    "WHERE te.trip_expense_id = ?4",
            nativeQuery = true)
    void updateExpense(double amount, String description, int expenseCategoryId, int expenseId);

    @Modifying
    @Transactional
    @Query(value = "insert into trip_expense (amount,description,expense_category_id,trip_id,trip_details_id) VALUE(?1,?2,8,?3,?4)", nativeQuery = true)
    void insertExpense(double amount, String description, int trip_id, int details);

    @Modifying
    @Transactional
    @Query(value = "delete te from trip_expense te left join trip_details td on te.trip_details_id = td.trip_details_id where td.trip_id=:tripId and td.day_number > :numberOfDays", nativeQuery = true)
    void deleteByRange(int tripId, int numberOfDays);
}
