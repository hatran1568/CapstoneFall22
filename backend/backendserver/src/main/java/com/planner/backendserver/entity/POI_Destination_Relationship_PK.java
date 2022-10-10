package com.planner.backendserver.entity;

import java.io.Serializable;
import java.util.Objects;

public class POI_Destination_Relationship_PK implements Serializable {
    private POI poi;
    private  Destination destination;

    public POI_Destination_Relationship_PK(POI poi, Destination destination) {
        this.poi = poi;
        this.destination = destination;
    }

    public POI_Destination_Relationship_PK() {
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof POI_Destination_Relationship_PK)) return false;
        POI_Destination_Relationship_PK that = (POI_Destination_Relationship_PK) o;
        return Objects.equals(poi, that.poi) && Objects.equals(destination, that.destination);
    }

    @Override
    public int hashCode() {
        return Objects.hash(poi, destination);
    }
}
