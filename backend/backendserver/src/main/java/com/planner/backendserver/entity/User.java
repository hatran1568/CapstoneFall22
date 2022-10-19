package com.planner.backendserver.entity;

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity
@Table(name="user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="user_id",columnDefinition = "INT(1)")
    private int userID;

    @Column(name="avatar")
    private String avatar;

    @Column(name="email",unique=true)
    private String email;

    @Column(name="password")
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name="status")
    private  UserStatus status;

    @Column(name="name",length = 255)
    private String name;

    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @Column(name="date_created")
    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateCreated;

    @Column(name="date_modified")
    @UpdateTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateModified;

    @Column(name="provider")
    @Enumerated(EnumType.STRING)
    private Provider provider;
}
