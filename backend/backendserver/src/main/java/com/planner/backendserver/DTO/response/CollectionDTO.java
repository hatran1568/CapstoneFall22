package com.planner.backendserver.DTO.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CollectionDTO {
    private int collectionId;
    private String title;
    private String description;
    private Date dateModified;
    private boolean isDeleted;
    private int userID;
    private String imgUrl;
    private ArrayList<POIOfCollectionDTO> poiList;
}
