package com.example.LocationService.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name="destination")
public class Destination {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="destination_id",columnDefinition = "INT(1)")
    private int destinationId;

    @Column(name="name")
    private String name;



    @Column(name="description", columnDefinition = "text")
    private String description;

    @Column(name="date_created")
    @Temporal(TemporalType.TIMESTAMP)
    @CreationTimestamp
    private Date dateCreated;

    @Column(name="is_deleted")
    private boolean isDeleted;

    @Column(name="date_modified")
    @Temporal(TemporalType.TIMESTAMP)

    @UpdateTimestamp
    private Date dateModified;
    @ManyToOne(cascade={CascadeType.ALL})
    @JoinColumn(name="belong_to")
    @JsonIgnore
    private Destination belongTo;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "belongTo", cascade = CascadeType.REMOVE)
    private Set<Destination> listDest = new HashSet<>();

}
