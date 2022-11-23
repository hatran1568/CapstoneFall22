package com.example.TripService.controller;


import com.example.TripService.dto.request.ExpenseCategorySelectDTO;
import com.example.TripService.dto.request.ExpenseGraphDTO;
import com.example.TripService.dto.request.TripExpenseDTO;
import com.example.TripService.dto.response.TripDetailDTO;
import com.example.TripService.dto.response.TripExpenseAddDTO;
import com.example.TripService.repository.ExpenseRepository;
import com.example.TripService.repository.TripRepository;
import com.example.TripService.service.interfaces.TripService;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.ArrayList;

@RestController
@RequestMapping("/trip/api")
public class ExpenseController {

    @Autowired
    private ExpenseRepository expenseRepo;
    @Autowired
    private TripRepository tripRepo;

    @Autowired
    private TripService tripService;

    @GetMapping("/expense/{tripId}/{orderBy}")
    public ResponseEntity<ArrayList<TripExpenseDTO>> getDestinationById(@PathVariable int tripId, @PathVariable int orderBy){
        try{
            String filter = "";
            ArrayList<TripExpenseDTO> expenses = expenseRepo.getExpensesOfTrip(tripId);;
            switch (orderBy){
                case 1:{
                    expenses = expenseRepo.getExpensesOfTripAmountDesc(tripId);
                    break;
                }
                case 2:{
                    expenses = expenseRepo.getExpensesOfTripAmountAsc(tripId);
                    break;
                }
                case 3:{
                    expenses = expenseRepo.getExpensesOfTripName(tripId);
                    break;
                }
                default:{}
            }
            if (expenses.isEmpty()){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(expenses, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/expense/categories")
    public ResponseEntity<ArrayList<ExpenseCategorySelectDTO>> getExpenseCategories(){
        try{
            ArrayList<ExpenseCategorySelectDTO> expenseCategories = expenseRepo.getExpenseCategories();
            if (expenseCategories.isEmpty()){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(expenseCategories, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/expense/total/{tripId}")
    public ResponseEntity<Double> getTotalExpense(@PathVariable int tripId){
        try{
            Double expense = expenseRepo.getTotalExpense(tripId);
            return new ResponseEntity<>(expense, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/expense/user/{tripId}")
    public ResponseEntity<Integer> getTripUserId(@PathVariable int tripId){
        try{
            Integer userId = tripRepo.getTripUserId(tripId);
            return new ResponseEntity<>(userId, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/expense/graph/{tripId}")
    public ResponseEntity<ArrayList<ExpenseGraphDTO>> getDestinationImages(@PathVariable int tripId){
        try{
            ArrayList<ExpenseGraphDTO> graphData = expenseRepo.getExpensesGraph(tripId);
            if (graphData.isEmpty()){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(graphData, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping(value = "/expense/{id}")
    public ResponseEntity<Integer> deleteExpense(@PathVariable Integer id) {
        var isRemoved = expenseRepo.deleteExpense(id);
        if (isRemoved == 0) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(id, HttpStatus.OK);
    }
    @RequestMapping(value = "/expense/new", consumes = "application/json", produces = { "*/*" }, method = RequestMethod.POST)
    public ResponseEntity<?> addExpense(@RequestBody TripExpenseAddDTO expense) {
        try{
            expenseRepo.addExpense(expense.getAmount(), expense.getDescription(), expense.getExpenseCategoryId(), expense.getTripId());
            return new ResponseEntity<>(HttpStatus.OK);
        }
        catch (Exception e){
            return  new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @RequestMapping(value = "/expense/update", consumes = "application/json", produces = { "*/*" }, method = RequestMethod.POST)
    public ResponseEntity<?> updateExpense(@RequestBody TripExpenseAddDTO expense) {
        try{
            expenseRepo.updateExpense(expense.getAmount(), expense.getDescription(), expense.getExpenseCategoryId(), expense.getExpenseId());
            return new ResponseEntity<>(HttpStatus.OK);
        }
        catch (Exception e){
            return  new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/insertGenerated")
    public ResponseEntity<?> addCustomTripDetail(@RequestBody ObjectNode objectNode){
        try{
            Double amount = objectNode.get("amount").asDouble();
            String description = objectNode.get("description").asText();
            int trip = objectNode.get("tripId").asInt();
            int details = objectNode.get("details").asInt();

            tripService.insertExpense(amount,description,trip,details);
            return new ResponseEntity<>( HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
