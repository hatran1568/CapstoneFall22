package com.example.LocationService.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

public interface RatingDBDTO {
    int getRateId();
     String getComment();
     Date getCreated();
     Date getModified();
     boolean getDeleted();
     int getRate();
     int getPoiId();


    int getUserId();

}

