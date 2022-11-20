package com.planner.backendserver.DTO.response;

import lombok.Data;

import java.util.ArrayList;


@Data
public class DistanceMatrixDTO{
    public ArrayList<String> destination_addresses;
    public ArrayList<String> origin_addresses;
    public ArrayList<Row> rows;
    public String status;
}

