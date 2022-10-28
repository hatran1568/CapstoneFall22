import React from "react";
import ReactDOM from "react-dom";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import fontawesome from '@fortawesome/fontawesome'
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import axios from "../../api/axios";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
} from "mdb-react-ui-kit";
import style from "./BlogDetails.module.css";
fontawesome.library.add( faArrowRight, faArrowLeft );
function BlogDetails() {
  const [isLoading, setLoading] = useState(true);
  const queryParams = new URLSearchParams(window.location.search);
  const id = queryParams.get("id");
  const [nearbyBlogs, setNearbyBlogs] = useState([]);
  useEffect(() => {
    const listResp = async () => {
      await axios
        .get("http://localhost:8080/api/blog/nearby/" + id)
        .then((response) => {
          setNearbyBlogs(response.data);
          setLoading(false);
        });
    };
    listResp();
  }, []);
  const [blog, setBlog] = useState([]);
  useEffect(() => {
    const listResp = async () => {
      await axios
        .get("http://localhost:8080/api/blog/" + id)
        .then((response) => setBlog(response.data));
    };
    listResp();
  }, []);
  console.log(nearbyBlogs);
  if (blog.status != "PUBLISHED")
    return (
      <MDBContainer className={style.errorContainer}>
        <h1>This blog is not yet Published or has been Hidden or Deleted</h1>
        <b><a href="" className={style.returnBlogBtn}>Return to Blog list</a></b>
      </MDBContainer>
    )
  else if (!isLoading){
    return (
      <div>
        <img src={blog.thumbnail} className={style.thumbnail}/>
        <MDBContainer className={style.mainContainer}>
          <MDBCard className={style.mainCard}>
            <MDBCardBody className={style.mainCardBody}>
              <h2>{blog.title}</h2><br/>
              <MDBRow className={style.authorBox}>
                <MDBCol md={1}>
                  <img src={blog.avatar} className={style.avatar}/>
                </MDBCol>
                <MDBCol md={8}>
                  <b>Author</b><br/>
                  {blog.username}
                </MDBCol>
              </MDBRow>
              <div dangerouslySetInnerHTML={{__html:blog.content}} className={style.contentContainer}>            
              </div>
            </MDBCardBody>

          </MDBCard>
          <MDBCard id="navContainer" className={style.navContainer}>
            <MDBRow>
              <MDBCol className={style.arrowIconsBox}>
                <a href={"blog?id=" + nearbyBlogs[0].blogId} className={style.nearbyBlogBtn}>
                <FontAwesomeIcon className={style.arrowIcons} icon="arrow-left"/></a>
              </MDBCol>
              <MDBCol className={style.lastBlogBox}>
                <a href={"blog?id=" + nearbyBlogs[0].blogId} className={style.nearbyBlogBtn}>
                  <div className={style.nearbyTitle}>{nearbyBlogs[0].title}</div>
                </a>
              </MDBCol>
              <MDBCol className={style.nextBlogBox}>
                <a href={"blog?id=" + nearbyBlogs[1].blogId} className={style.nearbyBlogBtn}>
                  <div className={style.nearbyTitle}>{nearbyBlogs[1].title}</div>
                </a>
              </MDBCol>
              <MDBCol className={style.arrowIconsBox}>
                <a href={"blog?id=" + nearbyBlogs[1].blogId} className={style.nearbyBlogBtn}>
                <FontAwesomeIcon className={style.arrowIcons} icon="arrow-right"/></a>
              </MDBCol>
            </MDBRow>
          </MDBCard>
        </MDBContainer>
      </div>
    );
  }
    
}
export default BlogDetails;
