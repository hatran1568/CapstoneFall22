package com.tripplanner.LocationService.dto.response;

import java.util.ArrayList;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
