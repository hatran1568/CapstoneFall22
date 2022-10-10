package com.planner.backendserver.DTO;

import com.planner.backendserver.entity.Destination;
import com.planner.backendserver.entity.DestinationImage;
import com.planner.backendserver.entity.POI;

import java.lang.reflect.Array;
import java.util.ArrayList;

public class DestinationDetailsDTO {
    Destination destination;
    ArrayList<String> imageURLs;
    ArrayList<POI> first3pois;

    public void setDestination(Destination d){
        destination = d;
    }
    public void setImages(ArrayList<String> i){
        imageURLs = i;
    }
    public void setPOIs(ArrayList<POI> f){
        first3pois = f;
    }
    public String getName() {
        return destination.getName();
    }
    public String getDescription() {
        return destination.getDescription();
    }
    public boolean isDeleted() {return destination.isDeleted();}
    public ArrayList<String> getImages() {return imageURLs;}
    public ArrayList<POI> getPOIs() {return first3pois;}


}
