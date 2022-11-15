package com.planner.backendserver.controller;

import com.planner.backendserver.DTO.request.BlogDetailsDTO;
import com.planner.backendserver.DTO.request.POIListDTO;
import com.planner.backendserver.DTO.request.POIofDestinationDTO;
import com.planner.backendserver.DTO.request.UpdatePOIDTO;
import com.planner.backendserver.DTO.response.*;
import com.planner.backendserver.entity.MasterActivity;
import com.planner.backendserver.repository.POIRepository;
import com.planner.backendserver.repository.RequestRepository;
import com.planner.backendserver.service.interfaces.POIService;
import com.planner.backendserver.utils.GoogleDriveManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;

@RestController
@RequestMapping("/api/request")
public class RequestController {
    @Autowired
    private RequestRepository requestRepo;

    @PreAuthorize("hasAuthority('Admin')")
    @GetMapping("/list/{filter}/{nameKey}/{page}")
    public ResponseEntity<ArrayList<RequestListDTO>> getPOIListAdmin(@PathVariable("filter") String filter, @PathVariable("page") int page, @PathVariable("nameKey") String nameKey) {
        try {
            ArrayList<RequestListDTO> requests;
            if (nameKey.equals("*"))
                nameKey = "";
            requests = requestRepo.getEditRequestList(filter, nameKey, page*30, 30);
            return new ResponseEntity<>(requests, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PreAuthorize("hasAuthority('Admin')")
    @GetMapping("/images/{reqId}")
    public ResponseEntity<ArrayList<String>> getImages(@PathVariable("reqId") int reqId) {
        try {
            ArrayList<String> images = requestRepo.getRequestImages(reqId);
            return new ResponseEntity<>(images, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PreAuthorize("hasAuthority('Admin')")
    @GetMapping("/list/count/{nameKey}")
    public ResponseEntity<Integer> getPOIListAdminCount(@PathVariable("nameKey") String nameKey) {
        try {
            int count;
            if (nameKey.equals("*"))
                nameKey = "";
            count = requestRepo.getEditRequestListCount(nameKey);
            return new ResponseEntity<>(count, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PreAuthorize("hasAuthority('Admin')")
    @GetMapping("/details/{reqId}")
    public ResponseEntity<RequestDetailsDTO> getPOIListAdmin(@PathVariable("reqId") int reqId) {
        try {
            RequestDetailsDTO request = requestRepo.getEditRequestDetails(reqId);
            if (request == null)
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            return new ResponseEntity<>(request, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PreAuthorize("hasAuthority('Admin')")
    @RequestMapping(value = "/accept/{reqId}", produces = { "*/*" }, method = RequestMethod.POST)
    public ResponseEntity<?> acceptRequest(@PathVariable int reqId) {
        try{
            requestRepo.approveBlog(reqId);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        catch (Exception e){
            return  new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PreAuthorize("hasAuthority('Admin')")
    @RequestMapping(value = "/reject/{reqId}", produces = { "*/*" }, method = RequestMethod.POST)
    public ResponseEntity<?> rejectRequest(@PathVariable int reqId) {
        try{
            requestRepo.rejectBlog(reqId);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        catch (Exception e){
            return  new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
