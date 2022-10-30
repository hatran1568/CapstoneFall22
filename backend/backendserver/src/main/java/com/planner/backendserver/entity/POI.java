package com.planner.backendserver.entity;

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Data
@Entity
@Table(name="poi")
public class POI extends MasterActivity {

//    @OneToOne(cascade = CascadeType.ALL)
//    @JoinColumn(name="poi_id")
//    private MasterActivity masterActivity;


    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(name="description", columnDefinition = "text")
    private String Description;

    @Column(name="google_rate")
    private double googleRate;

    @Column(name="telephone_number",columnDefinition = "text")
    private String phone;

    @Column(name="business_email")
    private String businessEmail;

    @Column(name="website")
    private String website;

    @Column(name="opening_time")
    private int openTime;

    @Column(name="duration")
    private int duration;

    @Column(name = "closing_time")
    private int closeTime;

    @Column(name = "typical_price")
    private double typicalPrice;

    @Column(name = "additional_information", columnDefinition = "text")
    private String additionalInformation;

    @Column(name = "date_created")
    @Temporal(TemporalType.TIMESTAMP)
    @CreationTimestamp
    private Date dateCreated;

    @Column(name = "date_modified")
    @Temporal(TemporalType.TIMESTAMP)
    @UpdateTimestamp
    private Date dateModified;

    @Column(name="is_deleted")
    private boolean isDeleted;

}