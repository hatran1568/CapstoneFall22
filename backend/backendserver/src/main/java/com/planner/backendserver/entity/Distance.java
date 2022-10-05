package com.planner.backendserver.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "distance")
@IdClass(Distance_PK.class)
public class Distance {
    @Id
    @ManyToOne
    @JoinColumn(name = "src_poi", nullable = false)
    private POI startStation;

    @Id
    @ManyToOne

    @JoinColumn(name = "dest_poi", nullable = false)
    private POI endStation;

    @Column(name = "distance")
    private double distance;
}
