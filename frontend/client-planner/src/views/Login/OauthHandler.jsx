import React from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";

function OAuthHandler() {
  const getUrlParameter = (name) => {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");

    var results = regex.exec(this.props.location.search);
    return results === null
      ? ""
      : decodeURIComponent(results[1].replace(/\+/g, " "));
  };

  const token = getUrlParameter("token");
  const role = getUrlParameter("role");
  const id = getUrlParameter("id");

  const location = useLocation();

  const from = location.state?.from?.pathname || "/";
  if (token) {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("id", id);
    <Navigate to="/" />;
  } else {
    <Navigate to="/login" />;
  }
}

export default OAuthHandler;
