package com.planner.backendserver.entity;


import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name="poi_image")
public class POIImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="image_id",columnDefinition = "INT(1)")
    private int imageId;

    @ManyToOne
    @JoinColumn(name = "poi_id", nullable = false)
    private POI poi;

    @Column(name="url")
    private String URL;


    @Column(name="description", columnDefinition = "text")
    private String description;
}
