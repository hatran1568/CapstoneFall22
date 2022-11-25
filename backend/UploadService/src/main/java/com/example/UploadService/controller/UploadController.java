package com.example.UploadService.controller;

import com.example.UploadService.service.GoogleDriveManager;
import com.example.UploadService.service.MailSenderManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/upload/api/upload")
public class UploadController {
    @Autowired
    GoogleDriveManager driveManager;

    @PostMapping("/add")
    public ResponseEntity<String> addItem(@RequestPart("File") MultipartFile file,@RequestPart("Path" )String path) throws Exception {
        String result;
//        try{
            result= driveManager.uploadFile(file,path);
            return new ResponseEntity<>(result,HttpStatus.OK);
//        } catch (Exception e){
//            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//        }
    }

    @PostMapping("/delete")
    public ResponseEntity deleteItem(@RequestPart("Path" )String path){
        try{
            driveManager.deleteFile(path);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
