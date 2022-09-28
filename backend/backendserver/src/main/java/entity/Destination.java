package entity;

import lombok.Data;

import javax.persistence.*;

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

    @Column(name="introduction", columnDefinition = "text")
    private String introduction;

    @Column(name="description", columnDefinition = "text")
    private String description;


}
