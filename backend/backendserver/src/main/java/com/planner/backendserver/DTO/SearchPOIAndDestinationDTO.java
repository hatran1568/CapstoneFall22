package com.planner.backendserver.DTO;


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
}
