package com.tripplanner.TripService.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class TripListDTO {
    List<TripGeneralDTO> list;
    int totalPage;
    int currentPage;
}
