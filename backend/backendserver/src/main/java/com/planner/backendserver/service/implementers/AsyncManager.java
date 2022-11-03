package com.planner.backendserver.service.implementers;


import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Service
public class AsyncManager {
    private  final ConcurrentMap<Integer, String> userMap;
    private  final ConcurrentMap<Integer, String> userMapPort;
    public AsyncManager() {
        this.userMap = new ConcurrentHashMap<>();
        this.userMapPort = new ConcurrentHashMap<>();
    }

    public void putJob(String id, int uid) {
        userMap.put(uid,id);

    }

    public void putPort(int uid,String port){
        userMapPort.put(uid,port);
    }


    public boolean checkExistUser(int id){
        return  userMap.containsKey(id);
    }
    public String getJobByUserId(int jobId) {
        return userMap.get(jobId);
    }

    public String getPortByUserId(int jobId) {
        return userMapPort.get(jobId);
    }
    public void removeUser(int jobId) {
        userMap.remove(jobId);
    }
    public void removeUserPort(int jobId) {
        userMapPort.remove(jobId);
    }
}
