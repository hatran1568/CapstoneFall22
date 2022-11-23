package com.example.Optimizer.DTO;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;

@Data

public class TripDetails {


    private Integer tripDetailsId;

    private MasterActivity masterActivity;


    @JsonIgnore
    private Trip trip;


    private  Integer startTime;


    private  Integer endTime;

    private Integer dayNumber;


    private String note;



}
