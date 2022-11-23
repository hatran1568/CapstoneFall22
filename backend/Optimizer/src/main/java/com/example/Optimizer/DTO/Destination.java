package com.example.Optimizer.DTO;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Data
public class Destination {

    private int destinationId;

    @Column(name="name")
    private String name;




    private String description;


    private Date dateCreated;

    private boolean isDeleted;



    private Date dateModified;

    private Destination belongTo;


    private Set<Destination> listDest = new HashSet<>();

}
