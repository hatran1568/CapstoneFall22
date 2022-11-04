package com.planner.backendserver.DTO.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class POIOfCollectionDTO {
    private int activityId;
    private String name;
    private String address;
    private String category;
    private double googleRate;
    private String imgUrl;
}
