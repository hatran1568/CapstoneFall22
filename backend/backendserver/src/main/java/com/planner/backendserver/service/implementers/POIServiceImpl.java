package com.planner.backendserver.service.implementers;

import com.planner.backendserver.DTO.response.RatingDTO;
import com.planner.backendserver.entity.Rating;
import com.planner.backendserver.repository.POIImageRepository;
import com.planner.backendserver.repository.POIRepository;
import com.planner.backendserver.service.interfaces.POIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;

@Service
public class POIServiceImpl implements POIService {
    @Autowired
    POIRepository poiRepository;

    @Autowired
    POIImageRepository poiImageRepository;

    @Override
    public ArrayList<RatingDTO> getRatingListByPOIId(int poiId) {
        ArrayList<RatingDTO> list = new ArrayList<>();
        ArrayList<Rating> ratings = poiRepository.getRatingsByPOIId(poiId);
        for (Rating rating : ratings) {
            RatingDTO ratingDTO = new RatingDTO(rating.getRateId(), rating.getRate(), rating.getComment(), rating.isDeleted(), rating.getDateCreated(), rating.getDateModified(), rating.getUser().getUserID(), rating.getUser().getName(), rating.getPOI().getActivityId());
            if (!ratingDTO.isDeleted()) {
                list.add(ratingDTO);
            }
        }
        return list;
    }

    @Override
    public void updateRatingInPOI(int rate, String comment, Date modified, int uid, int poiId) {
        poiRepository.updateRatingInPOI(rate, comment, modified, uid, poiId);
    }

    @Override
    public void createRatingInPOI(String comment, Date created, Date modified, int rate, int poiId, int uid) {
        poiRepository.createRatingInPOI(comment, created, modified, rate, poiId, uid);
    }
}
