package com.planner.backendserver.DTO;

import java.sql.Date;

public class CollectionDTO {
    private int collectionID;
    private String title;
    private String description;
    private Date dateModified;
    private boolean isDeleted;
    private int userID;
    private String imgUrl;

    public int getCollectionID() {
        return collectionID;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public Date getDateModified() {
        return dateModified;
    }

    public boolean isDeleted() {
        return isDeleted;
    }

    public int getUserID() {
        return userID;
    }

    public String getImgUrl() {
        return imgUrl;
    }
}
