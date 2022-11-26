package com.example.BlogService.controller;

import com.example.BlogService.dto.response.AdminCountItemDTO;
import com.example.BlogService.dto.response.AdminCountTripDTO;
import com.example.BlogService.dto.response.AdminRatingTop3DTO;
import com.example.BlogService.dto.response.AdminTopPoiDTO;
import com.example.BlogService.repository.AdminRepository;
import com.example.BlogService.utils.GoogleDriveManager;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;

@RestController
@RequestMapping("/blog/api/admin")
public class AdminController {
    @Autowired
    private AdminRepository adminRepo;
    @Autowired
    GoogleDriveManager driveManager;
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @PreAuthorize("hasAuthority('Admin')")
    @GetMapping("/countall")
    public ResponseEntity<AdminCountItemDTO> countAllItems(){
        try{
            AdminCountItemDTO count = adminRepo.getCountAll();
            return new ResponseEntity<>(count, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @PreAuthorize("hasAuthority('Admin')")
    @GetMapping("/counttrip/{start}/{end}")
    public ResponseEntity<AdminCountTripDTO> countTripByDays(@PathVariable("start") String start, @PathVariable("end") String end){
        try{
            ArrayList<String> labels = new ArrayList<>();
            ArrayList<Integer> data = new ArrayList<>();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
            DateTimeFormatter formatterSQL = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDate startDate = LocalDate.parse(start);
            LocalDate endDate = LocalDate.parse(end);
            for (int i = 0;(startDate.compareTo(endDate.minusDays(i)) <= 0); i++) {
                LocalDate today = endDate.minusDays(i);
                String todayFormated = today.format(formatter);
                String todayFormatedSQL = today.format(formatterSQL);
                LocalDate tmr = today.plusDays(1);
                String tmrFormatedSQL = tmr.format(formatterSQL);

                labels.add(todayFormated);
                data.add(adminRepo.getTripCountByDay(todayFormatedSQL, tmrFormatedSQL));
            }
            AdminCountTripDTO count = new AdminCountTripDTO() {
                @Override
                public ArrayList<String> getLabels() {
                    return labels;
                }

                @Override
                public ArrayList<Integer> getData() {
                    return data;
                }
            };
            return new ResponseEntity<>(count, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @PreAuthorize("hasAuthority('Admin')")
    @GetMapping("/countuser/{start}/{end}")
    public ResponseEntity<ArrayList<AdminCountTripDTO>> countUserByDays(@PathVariable("start") String start, @PathVariable("end") String end){
        try{
            ArrayList<AdminCountTripDTO> countArr = new ArrayList<>();
            ArrayList<String> labels = new ArrayList<>();
            ArrayList<Integer> data = new ArrayList<>();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
            DateTimeFormatter formatterSQL = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDate startDate = LocalDate.parse(start);
            LocalDate endDate = LocalDate.parse(end);
            for (int i = 0;(startDate.compareTo(endDate.minusDays(i)) <= 0); i++) {
                LocalDate today = endDate.minusDays(i);
                String todayFormated = today.format(formatter);
                String todayFormatedSQL = today.format(formatterSQL);
                LocalDate tmr = today.plusDays(1);
                String tmrFormatedSQL = tmr.format(formatterSQL);

                labels.add(todayFormated);
                data.add(adminRepo.getUserCountByDay(todayFormatedSQL, tmrFormatedSQL, "LOCAL"));
            }
            AdminCountTripDTO count = new AdminCountTripDTO() {
                @Override
                public ArrayList<String> getLabels() {
                    return labels;
                }

                @Override
                public ArrayList<Integer> getData() {
                    return data;
                }
            };
            countArr.add(count);
            ArrayList<Integer> data2 = new ArrayList<>();
            for (int i = 0;(startDate.compareTo(endDate.minusDays(i)) <= 0); i++) {
                LocalDate today = endDate.minusDays(i);
                String todayFormated = today.format(formatter);
                String todayFormatedSQL = today.format(formatterSQL);
                LocalDate tmr = today.plusDays(1);
                String tmrFormatedSQL = tmr.format(formatterSQL);

                data2.add(adminRepo.getUserCountByDay(todayFormatedSQL, tmrFormatedSQL, "GOOGLE"));
            }
            AdminCountTripDTO count2 = new AdminCountTripDTO() {
                @Override
                public ArrayList<String> getLabels() {
                    return labels;
                }

                @Override
                public ArrayList<Integer> getData() {
                    return data2;
                }
            };
            countArr.add(count2);
            ArrayList<Integer> data3 = new ArrayList<>();
            for (int i = 0;(startDate.compareTo(endDate.minusDays(i)) <= 0); i++) {
                LocalDate today = endDate.minusDays(i);
                String todayFormated = today.format(formatter);
                String todayFormatedSQL = today.format(formatterSQL);
                LocalDate tmr = today.plusDays(1);
                String tmrFormatedSQL = tmr.format(formatterSQL);

                data3.add(adminRepo.getUserCountByDay(todayFormatedSQL, tmrFormatedSQL, "FACEBOOK"));
            }
            AdminCountTripDTO count3 = new AdminCountTripDTO() {
                @Override
                public ArrayList<String> getLabels() {
                    return labels;
                }

                @Override
                public ArrayList<Integer> getData() {
                    return data3;
                }
            };
            countArr.add(count3);
            return new ResponseEntity<>(countArr, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @PreAuthorize("hasAuthority('Admin')")
    @GetMapping("/toprating")
    public ResponseEntity<ArrayList<AdminRatingTop3DTO>> topRating(){
        try{
            ArrayList<AdminRatingTop3DTO> data = adminRepo.getTopRating();
            return new ResponseEntity<>(data, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @PreAuthorize("hasAuthority('Admin')")
    @GetMapping("/topcountrating")
    public ResponseEntity<ArrayList<AdminRatingTop3DTO>> topRatingCount(){
        try{
            ArrayList<AdminRatingTop3DTO> data = adminRepo.getTopRatingCount();
            return new ResponseEntity<>(data, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @PreAuthorize("hasAuthority('Admin')")
    @GetMapping("/poicount")
    public ResponseEntity<?> poiCount(){
        try{
            return new ResponseEntity<>(adminRepo.getPOICount(), HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @PreAuthorize("hasAuthority('Admin')")
    @GetMapping("/hotelcount")
    public ResponseEntity<?> hotelCount(){
        try{
            return new ResponseEntity<>(adminRepo.getHotelCount(), HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @PreAuthorize("hasAuthority('Admin')")
    @GetMapping("/toppoi")
    public ResponseEntity<ArrayList<AdminTopPoiDTO>> countTopPOI(){
        try{
            ArrayList<AdminTopPoiDTO> pois = adminRepo.getTopPOI();
            return new ResponseEntity<>(pois, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @PreAuthorize("hasAuthority('Admin')")
    @GetMapping("/ratingCount")
    public ResponseEntity<ArrayList<Integer>> ratingCount(){
        try{
            ArrayList<Integer> count = new ArrayList<>();
            count.add(adminRepo.getRatingCount(5));
            count.add(adminRepo.getRatingCount(4));
            count.add(adminRepo.getRatingCount(3));
            count.add(adminRepo.getRatingCount(2));
            count.add(adminRepo.getRatingCount(1));
            return new ResponseEntity<>(count, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
