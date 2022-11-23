package com.example.Optimizer.DTO;


import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Data

public class Trip {

    private int tripId;


    private Integer user;


    private double budget;

    private Date startDate;


    private Date endDate;


    private String name;

    private Date dateCreated;

    private Date dateModified;


    private TripStatus status;
    private List<TripDetails> listTripDetails;

}
