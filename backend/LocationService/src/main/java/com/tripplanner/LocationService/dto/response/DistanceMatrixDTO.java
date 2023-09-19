package com.tripplanner.LocationService.dto.response;

import java.util.ArrayList;
import lombok.Data;

@Data
public class DistanceMatrixDTO {

  public ArrayList<String> destination_addresses;
  public ArrayList<String> origin_addresses;
  public ArrayList<Row> rows;
  public String status;
}
