package com.planner.backendserver.DTO.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RatingDTO {
    private int rateId;
    private int rate;
    private String comment;
    private boolean deleted;
    private Date created;
    private Date modified;
    private int userId;
    private String userName;
    private int poiId;
}
