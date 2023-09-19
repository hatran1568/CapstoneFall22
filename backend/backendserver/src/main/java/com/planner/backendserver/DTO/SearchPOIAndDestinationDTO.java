package com.planner.backendserver.DTO;

import com.planner.backendserver.DTO.response.SearchRespondeDTO;
import com.planner.backendserver.entity.POI;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SearchPOIAndDestinationDTO {

  private int Id;
  private String name;
  private SearchType type;
  private double rate;
  private int numberOfRate;
  private String description;
  private String thumbnail;
  private boolean isPOI;
  private double latitude;
  private double longitude;
  private String website;
  private double price;

  public SearchPOIAndDestinationDTO(
    int id,
    String name,
    SearchType type,
    double rate,
    int numberOfRate,
    String des,
    String thumbnail,
    boolean isPOI
  ) {
    this.Id = id;
    this.name = name;
    this.type = type;
    this.rate = rate;
    this.numberOfRate = numberOfRate;
    this.description = des;
    this.thumbnail = thumbnail;
    this.isPOI = isPOI;
  }
}
