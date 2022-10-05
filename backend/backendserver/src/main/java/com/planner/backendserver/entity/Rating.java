package com.planner.backendserver.entity;

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity
@Table(name="rating")
public class Rating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="rate_id",columnDefinition = "INT(1)")
    private int rateId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false,unique = true)
    private User user;

    @ManyToOne
    @JoinColumn(name = "poi_id", nullable = false,unique = true)
    private POI POI;

    @JoinColumn(name = "rate")
    private int rate;

    @JoinColumn(name = "comment",columnDefinition = "text")
    private String Comment;

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

}
