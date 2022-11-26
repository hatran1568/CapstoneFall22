package com.tripplanner.Optimizer.DTO;


import lombok.Data;

import java.util.Date;

@Data

public class POI extends MasterActivity {





    private Category category;


    private String Description;


    private double googleRate;

    private String phone;
 private String businessEmail;


    private String website;

    private int openTime;

    private int duration;

    private int closeTime;

    private double typicalPrice;

    private String additionalInformation;

    private Date dateCreated;

    private Date dateModified;

    private Double longitude;

    private Double latitude;

    private boolean isDeleted;

    }
