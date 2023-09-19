package com.planner.backendserver.service.interfaces;

import com.planner.backendserver.DTO.SearchPOIAndDestinationDTO;
import com.planner.backendserver.DTO.request.HotelsRequestDTO;
import com.planner.backendserver.DTO.response.RatingDTO;
import com.planner.backendserver.entity.POI;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.springframework.data.domain.Page;

public interface POIService {
  ArrayList<RatingDTO> getRatingListByPOIId(int poiId);
  void updateRatingInPOI(
    int rate,
    String comment,
    Date modified,
    int uid,
    int poiId
  );
  void createRatingInPOI(
    String comment,
    Date created,
    Date modified,
    int rate,
    int poiId,
    int uid
  );
  ArrayList<SearchPOIAndDestinationDTO> getHotelsByDestination(
    HotelsRequestDTO input
  );
  Page<SearchPOIAndDestinationDTO> listToPage(
    List<SearchPOIAndDestinationDTO> list,
    int page,
    int size
  );
}
