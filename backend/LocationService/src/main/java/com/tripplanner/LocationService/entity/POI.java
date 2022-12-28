package com.tripplanner.LocationService.entity;

import com.tripplanner.LocationService.dto.response.SearchType;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity
@Table(name = "poi")
public class POI extends MasterActivity {

//    @OneToOne(cascade = CascadeType.ALL)
//    @JoinColumn(name="poi_id")
//    private MasterActivity masterActivity;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(name = "description", columnDefinition = "text")
    private String Description;

    @Column(name = "google_rate")
    private double googleRate;

    @Column(name = "telephone_number", columnDefinition = "text")
    private String phone;

    @Column(name = "business_email")
    private String businessEmail;

    @Column(name = "website")
    private String website;

    @Column(name = "opening_time")
    private int openTime;

    @Column(name = "duration")
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
    @Column(name = "longitude")
    private Double longitude;
    @Column(name = "latitude")
    private Double latitude;
    @Column(name = "is_deleted")
    private boolean isDeleted;

    public static SearchType mapFromPOICategory(POI poi) {
        switch (poi.getCategory().getCategoryName()) {
            case "Văn hóa, nghệ thuật":
                return SearchType.ART_AND_CULTURE;
            case "Hoạt động ngoài trời":
                return SearchType.OUTDOORS;
            case "Tôn giáo":
                return SearchType.RELIGION;
            case "Lịch sử":
                return SearchType.HISTORIC_SIGHTS;
            case "Bảo tàng":
                return SearchType.MUSEUMS;
            case "Spa & Sức khỏe":
                return SearchType.SPAS_AND_WELLNESS;
            case "Bãi biển":
                return SearchType.BEACHES;
            case "Khách sạn":
                return SearchType.HOTELS;
            case "Mua sắm":
                return SearchType.SHOPPING;
            case "Hoạt động đêm":
                return SearchType.NIGHTLIFE;
            default:
                return SearchType.ENTERTAINMENTS;
        }
    }
}