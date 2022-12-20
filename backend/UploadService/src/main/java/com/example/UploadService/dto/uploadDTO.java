package com.example.UploadService.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class uploadDTO {
    private MultipartFile File;
    private String Path;
}
