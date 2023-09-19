package com.planner.backendserver.DTO.response;

import java.util.ArrayList;
import lombok.Data;

@Data
public class DistanceMatrixDTO {

  public ArrayList<String> destination_addresses;
  public ArrayList<String> origin_addresses;
  public ArrayList<Row> rows;
  public String status;
}
