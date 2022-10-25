package com.planner.backendserver.controller;

import com.planner.backendserver.DTO.ExpenseGraphDTO;
import com.planner.backendserver.DTO.GalleryImages;
import com.planner.backendserver.DTO.POIBoxDTO;
import com.planner.backendserver.DTO.TripExpenseDTO;
import com.planner.backendserver.entity.Destination;
import com.planner.backendserver.entity.ExpenseCategory;
import com.planner.backendserver.repository.DestinationRepository;
import com.planner.backendserver.repository.ExpenseRepository;
import com.planner.backendserver.service.UserDTOServiceImplementer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;

@RestController
@RequestMapping("/api")
public class ExpenseController {
    @Autowired
    private UserDTOServiceImplementer userDTOService;
    @Autowired
    private ExpenseRepository expenseRepo;

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
    public ResponseEntity<ArrayList<ExpenseCategory>> getExpenseCategories(){
        try{
            ArrayList<ExpenseCategory> expenseCategories = expenseRepo.getExpenseCategories();
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
}
