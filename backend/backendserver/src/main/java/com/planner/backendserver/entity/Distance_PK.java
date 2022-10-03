package com.planner.backendserver.entity;


import java.io.Serializable;
import java.util.Objects;

public class Distance_PK  implements Serializable {
    private POI startStation;
    private POI endStation;

    public Distance_PK(POI startStation, POI endStation) {
        this.startStation = startStation;
        this.endStation = endStation;
    }

    public Distance_PK() {
    }

    //Getters and setters are omitted for brevity

    @Override
    public boolean equals(Object o) {
        if ( this == o ) {
            return true;
        }
        if ( o == null || getClass() != o.getClass() ) {
            return false;
        }
        Distance_PK pk = (Distance_PK) o;
        return Objects.equals( startStation, pk.startStation ) &&
                Objects.equals( endStation, pk.endStation );
    }

    @Override
    public int hashCode() {
        return Objects.hash(startStation, endStation );
    }
}
