package com.planner.backendserver.entity;

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity
@Table(name="blog")
public class Blog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="blog_id",columnDefinition = "INT(1)")
    private int blogId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "title")
    private  String title;

    @Column(name = "content", columnDefinition = "text")
    private  String content;

    @Column(name="thumbnail",columnDefinition = "text")
    private  String thumbnail;

    @Column(name="date_created")
    @Temporal(TemporalType.TIMESTAMP)
    @CreationTimestamp
    private Date dateCreated;

    @Column(name="date_modified")
    @Temporal(TemporalType.TIMESTAMP)
    @UpdateTimestamp
    private Date dateModified;

    @Enumerated(EnumType.STRING)
    @Column(name= "status")
    private BlogStatus status;
}
