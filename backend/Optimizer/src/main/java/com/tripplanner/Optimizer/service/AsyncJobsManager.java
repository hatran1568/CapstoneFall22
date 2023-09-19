package com.tripplanner.Optimizer.service;

import com.tripplanner.Optimizer.DTO.Response.SimpleResponse;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import org.springframework.stereotype.Service;

@Service
public class AsyncJobsManager {

  private final ConcurrentMap<String, CompletableFuture<SimpleResponse>> map;
  private final ConcurrentMap<Integer, CompletableFuture<SimpleResponse>> userMap;

  public AsyncJobsManager() {
    userMap =
      new ConcurrentHashMap<Integer, CompletableFuture<SimpleResponse>>();
    map = new ConcurrentHashMap<String, CompletableFuture<SimpleResponse>>();
  }

  public void putJob(
    String id,
    int uid,
    CompletableFuture<SimpleResponse> theJob
  ) {
    userMap.put(uid, theJob);
    map.put(id, theJob);
  }

  public CompletableFuture<SimpleResponse> getJob(String jobId) {
    return map.get(jobId);
  }

  public boolean checkExistUser(int id) {
    return userMap.containsKey(id);
  }

  public CompletableFuture<SimpleResponse> getJobByUserId(int jobId) {
    return userMap.get(jobId);
  }

  public void removeJob(String jobId) {
    map.remove(jobId);
  }

  public void removeUser(int jobId) {
    userMap.remove(jobId);
  }
}
