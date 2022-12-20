package com.tripplanner.LocationService.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class SearchRespondeDTO {
    List<SearchPOIAndDestinationDTO> list;
    int totalPage;
    int currentPage;
}
