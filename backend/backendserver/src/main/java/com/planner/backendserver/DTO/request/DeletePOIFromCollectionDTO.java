package com.planner.backendserver.DTO.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DeletePOIFromCollectionDTO {

  int colId;
  int poiId;
  int uid;
}
