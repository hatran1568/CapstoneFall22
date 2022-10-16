package com.planner.backendserver.repository;

import com.planner.backendserver.entity.Blog;
import com.planner.backendserver.entity.Destination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.ArrayList;

public interface BlogRepository  extends JpaRepository<Blog,Integer> {
    @Query("SELECT b from Blog b where b.title like  CONCAT('%',:keyword,'%')")
    public ArrayList<Blog> getBlogsByKeyword(String keyword);
}
