package com.tripplanner.TripService.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name="trip_details")
public class TripDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="trip_details_id",columnDefinition = "INT(1)")
    private Integer tripDetailsId;


    @Column(name = "master_activity_id", nullable = false)
    private int masterActivity;


    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @Column(name = "start_time")
    private  Integer startTime;

    @Column(name="end_time")
    private  Integer endTime;

    @Column(name="day_number")
    private Integer dayNumber;

    @Column(name="note",columnDefinition = "text")
    private String note;



}
