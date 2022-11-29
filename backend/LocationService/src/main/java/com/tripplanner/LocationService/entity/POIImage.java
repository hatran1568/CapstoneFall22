package com.tripplanner.LocationService.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "poi_id", nullable = false)
    private POI poi;

    @Column(name="url",columnDefinition = "text")
    private String url;


    @Column(name="description", columnDefinition = "text")
    private String description;
}
