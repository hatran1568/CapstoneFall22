package entity;

import lombok.Data;

import javax.persistence.*;
import java.sql.Date;

@Data
@Entity
@Table(name="collection")
public class Collection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="request_id",columnDefinition = "INT(1)")
    private  int requestId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false,unique = true)
    private User user;

    @Column(name = "title")
    private  String title;


    @Column(name="date")
    private Date date;
}
