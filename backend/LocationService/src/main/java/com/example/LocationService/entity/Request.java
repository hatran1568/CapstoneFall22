package com.example.LocationService.entity;


import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity
@Table(name="request")
public class Request {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="request_id",columnDefinition = "INT(1)")
    private int requestId;

    @ManyToOne
    @JoinColumn(name = "poi_id", nullable = false)
    private POI poi;


    @JoinColumn(name = "user_id", nullable = false)
    private int user;

    @Column(name="Name")
    private String name;

    @Column(name="description", columnDefinition = "text")
    private String Description;

    @Column(name="address")
    private String Address;



    @Column(name="telephone_number",columnDefinition = "text")
    private String phone;

    @Column(name="business_email")
    private String businessEmail;

    @Column(name="website")
    private String website;

    @Column(name="duration")
    private int duration;

    @Column(name="opening_time")
    private int openTime;

    @Column(name = "closing_time")
    private int closeTime;

    @Column(name = "typical_price")
    private double typicalPrice;

    @Column(name = "additional_information", columnDefinition = "text")
    private String additionalInformation;

    @Column(name="date_created")
    @Temporal(TemporalType.TIMESTAMP)
    @CreationTimestamp
    private Date dateCreated;



    @Column(name="date_modified")
    @Temporal(TemporalType.TIMESTAMP)
    @UpdateTimestamp
    private Date dateModified;

    @Enumerated(EnumType.STRING)
    @Column(name="status")
    private RequestStatus status;
}
