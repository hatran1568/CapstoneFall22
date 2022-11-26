package com.example.LocationService.dto.response;

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.util.Date;

@Data

public class Blog {

    private int blogId;


    private Integer user;

    private  String title;

    private  String content;

    private  String thumbnail;


    private Date dateCreated;


    private Date dateModified;


    private BlogStatus status;
}
