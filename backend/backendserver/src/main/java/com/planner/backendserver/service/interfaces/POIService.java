package com.planner.backendserver.service.interfaces;

import com.planner.backendserver.DTO.response.RatingDTO;

import java.util.ArrayList;
import java.util.Date;

public interface POIService {
    ArrayList<RatingDTO> getRatingListByPOIId(int poiId);
    void updateRatingInPOI(int rate, String comment, Date modified, int uid, int poiId);
    void createRatingInPOI(String comment, Date created, Date modified, int rate, int poiId, int uid);
}
