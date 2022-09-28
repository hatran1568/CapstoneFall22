package entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name="poi")
public class POI {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="poi_id",columnDefinition = "INT(1)")
    private int poiId;

    @ManyToOne
    @JoinColumn(name = "destination_id", nullable = false)
    private Destination destination;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(name="Name")
    private String name;

    @Column(name="introduction")
    private String Introduction;

    @Column(name="description")
    private String Description;

    @Column(name="address")
    private String Address;

    @Column(name="google_rate")
    private double googleRate;

    @Column(name="telephone_number")
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

    @Column(name = "additional_information")
    private String additionalInformation;
}
