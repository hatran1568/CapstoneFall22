package com.example.Optimizer.service;

import com.example.Optimizer.DTO.Response.SimpleResponse;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Service
public class AsyncJobsManager {
    private final ConcurrentMap<String, CompletableFuture<SimpleResponse>> map;

    public AsyncJobsManager() {
        map = new ConcurrentHashMap<String, CompletableFuture<SimpleResponse>>();
    }

    public void putJob(String id, CompletableFuture<SimpleResponse> theJob) {
        map.put(id, theJob);
    }

    public CompletableFuture<SimpleResponse> getJob(String jobId) {
        return map.get(jobId);
    }

    public void removeJob(String jobId) {
        map.remove(jobId);
    }
}
