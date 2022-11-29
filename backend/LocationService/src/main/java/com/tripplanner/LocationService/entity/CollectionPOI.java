package com.tripplanner.LocationService.entity;


import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "collection_poi")
@IdClass(Collection_POI_Relationship_PK.class)
public class CollectionPOI {
    @Id
    @ManyToOne
    @JoinColumn(name = "collection_id", nullable = false)
    private Collection collection;

    @Id
    @ManyToOne
    @JoinColumn(name = "poi_id", nullable = false,referencedColumnName = "activity_id")
    private POI poi;
}
