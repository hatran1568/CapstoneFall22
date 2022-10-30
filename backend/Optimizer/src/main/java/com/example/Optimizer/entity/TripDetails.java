package com.example.Optimizer.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;
import java.sql.Date;

@Data
@Entity
@Table(name="trip_details")
public class TripDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="trip_details_id",columnDefinition = "INT(1)")
    private int tripDetailsId;

    @ManyToOne
    @JoinColumn(name = "master_activity_id", nullable = false,referencedColumnName = "activity_id")
    private MasterActivity masterActivity;


    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @Column(name = "start_time")
    private  int startTime;

    @Column(name="end_time")
    private  int endTime;

    @Column(name="date")
    private Date date;

    @Column(name="note",columnDefinition = "text")
    private String note;



}
