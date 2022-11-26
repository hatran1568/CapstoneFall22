package com.example.UploadService.controller;

import com.example.UploadService.dto.uploadDTO;
import com.example.UploadService.service.GoogleDriveManager;
import com.example.UploadService.service.MailSenderManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Nullable;
import org.springframework.http.server.reactive.ServerHttpRequest;

@RestController
@RequestMapping("/upload/api/upload")
public class UploadController {
    @Autowired
    GoogleDriveManager driveManager;

    @RequestMapping(value = "/add", method = RequestMethod.POST, produces = "multipart/form-data", consumes = "*/*")
    public ResponseEntity<String> addItem(ServerHttpRequest request, @RequestPart(value = "File") MultipartFile file, @RequestPart(value = "Path") String path) throws Exception {
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
