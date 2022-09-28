package entity;


import lombok.Data;

import javax.persistence.*;

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

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name="Name")
    private String name;



    @Column(name="address")
    private String Address;



    @Column(name="telephone_number")
    private String phone;

    @Column(name="business_email")
    private String businessEmail;

    @Column(name="website")
    private String website;

    @Column(name="openning_time")
    private int openTime;

    @Column(name = "closing_time")
    private int closeTime;

    @Column(name = "typical_price")
    private double typicalPrice;

    @Column(name = "additional_information", columnDefinition = "text")
    private String additionalInformation;
}
