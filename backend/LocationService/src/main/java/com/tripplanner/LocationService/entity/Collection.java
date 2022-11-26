package com.tripplanner.LocationService.entity;

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity
@Table(name="collection")
public class Collection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="collection_id",columnDefinition = "INT(1)")
    private  int collectionId;


    @Column(name = "user_id", nullable = false)
    private int user;

    @Column(name = "title")
    private  String title;


    @Column(name="description",columnDefinition = "text")
    private String description;

    @Column(name="date_created")
    @Temporal(TemporalType.TIMESTAMP)
    @CreationTimestamp
    private Date dateCreated;

    @Column(name="is_deleted")

    private boolean isDeleted;

    @Column(name="date_modified")
    @UpdateTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateModified;


}
