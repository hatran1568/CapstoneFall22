package com.example.Optimizer.DTO;

import lombok.Data;

import javax.persistence.*;

@Data

public class Distance {

    private POI startStation;



    private POI endStation;


    private double distance;
}
