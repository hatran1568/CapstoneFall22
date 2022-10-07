package com.planner.backendserver.service.interfaces;

import com.planner.backendserver.entity.Provider;

public interface UserService {
    public void processOAuthPostLoginGoogle(String email);
    public void processOAuthPostLoginFacebook(String name);
    public void updateProvider(int usernID, Provider authType);
}
