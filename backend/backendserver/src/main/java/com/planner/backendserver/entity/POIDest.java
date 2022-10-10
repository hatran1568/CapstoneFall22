package com.planner.backendserver.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "poi_destination")
@IdClass(POI_Destination_Relationship_PK.class)
public class POIDest {

    @Id
    @ManyToOne
    @JoinColumn(name = "poi_id", nullable = false)
    private POI poi;

    @Id
    @ManyToOne
    @JoinColumn(name = "destination_id", nullable = false)
    private Destination destination;


}
