package entity;

import lombok.Data;

import javax.persistence.*;
import java.sql.Date;

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

    @Column(name="date")
    private Date date;
}
