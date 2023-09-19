package com.tripplanner.Optimizer.repository;

import com.tripplanner.Optimizer.entity.OptimizerRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface RequestRepository
  extends JpaRepository<OptimizerRequest, Long> {
  @Query(
    value = "select * from optimize_request o where o.request_id=?1",
    nativeQuery = true
  )
  OptimizerRequest getByRequestId(int id);

  @Modifying
  @Transactional
  @Query(
    value = "Insert into optimize_request ('status','instance_uri','trip_id','user_id') value(?1,?2,null,?3)",
    nativeQuery = true
  )
  void insert(String status, String uri, int userId);

  @Modifying
  @Transactional
  @Query(
    value = "Update `user`  set optimizer_request_id= null where user_id=?1",
    nativeQuery = true
  )
  void changeSuccess(int id);

  @Modifying
  @Transactional
  @Query(
    value = "Update `user`  set optimizer_request_id= ?1 where user_id=?2",
    nativeQuery = true
  )
  void changeInProgress(int id, int userId);

  @Modifying
  @Transactional
  @Query(
    value = "update optimize_request set `status` = ?1 where request_id =?2",
    nativeQuery = true
  )
  void changeStatusRequest(String status, int userId);
}
