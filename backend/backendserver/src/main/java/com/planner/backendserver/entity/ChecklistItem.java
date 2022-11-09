package com.planner.backendserver.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity
@Table(name="checklist_item")
public class ChecklistItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="checklist_id",columnDefinition = "INT(1)")
    private int itemId;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @Column(name = "checked")
    private boolean checked;

    @Column(name="content", columnDefinition = "text")
    private String content;

    @Column(name="date_created")
    @Temporal(TemporalType.TIMESTAMP)
    @CreationTimestamp
    private Date dateCreated;

    @Column(name="date_modified")
    @Temporal(TemporalType.TIMESTAMP)
    @UpdateTimestamp
    private Date dateModified;

    @Column(name="is_deleted")
    private boolean isDeleted;
}
