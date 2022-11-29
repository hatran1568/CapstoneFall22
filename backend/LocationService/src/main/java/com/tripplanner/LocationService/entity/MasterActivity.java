package com.tripplanner.LocationService.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "master_activity")
public class MasterActivity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="activity_id",columnDefinition = "INT(1)")
    protected  int activityId;

    @Column(name="name",length = 255)
    protected String name;

    @Column(name="address",length=255)
    protected  String address;
}
