package com.tripplanner.Optimizer.DTO;

import lombok.Data;

@Data
public class Distance {

  private POI startStation;

  private POI endStation;

  private double distance;
}
