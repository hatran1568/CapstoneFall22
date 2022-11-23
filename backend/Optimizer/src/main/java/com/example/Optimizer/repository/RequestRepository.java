package com.example.Optimizer.repository;

import com.example.Optimizer.entity.OptimizerRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface RequestRepository extends JpaRepository<OptimizerRequest,Long> {
    @Query(value = "select * from optimizer_request  o where o.request_id=?1",nativeQuery = true)
    OptimizerRequest getByRequestId(int id);

    @Query(value = "Insert into optimizer_request ('status','instance_uri','trip_id','user_id') value(?1,?2,null,?3)",nativeQuery = true)
    void insert(String status,String uri,int userId);
}
