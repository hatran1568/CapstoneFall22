import React from "react";
import ReactDOM from "react-dom";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faClock,
  faArrowLeft,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
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
  if (blog.status != "PUBLISHED")
    return (
      <MDBContainer className={style.errorContainer}>
        <h1>Bài blog này chưa được đăng hoặc đã được ẩn hoặc xóa</h1>
        <b>
          <a href="../" className={style.returnBlogBtn}>
            Quay lại trang chủ
          </a>
        </b>
      </MDBContainer>
    );
  else if (!isLoading) {
    document.title = blog.title + " | Tripplanner";
    const dateRaw = blog.dateModified;
    var options = {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    };
    var date = new Date(dateRaw);
    var username = blog.username;
    var avatar = blog.avatar;
    if (avatar == null || avatar == "")
      avatar = "https://t4.ftcdn.net/jpg/03/59/58/91/360_F_359589186_JDLl8dIWoBNf1iqEkHxhUeeOulx0wOC5.jpg";
    if (blog.userStatus == "DELETED") {
      username = "Người dùng này đã bị xóa"
      avatar = "https://static.thenounproject.com/png/418543-200.png";
    }
    date = date.toLocaleDateString("vi", options);
    console.log(date);
    return (
      <div>
        <img src={blog.thumbnail} className={style.thumbnail} />
        <MDBContainer className={style.mainContainer}>
          <MDBCard className={style.mainCard}>
            <MDBCardBody className={style.mainCardBody}>
              <h1>{blog.title}</h1>
              <br />
              <div className={style.dateBox}>
                <FontAwesomeIcon icon={faClock} size="sm" />
                <span className={style.date}>{date}</span>
                <FontAwesomeIcon icon={faUser} size="sm" />
                <span className={style.date}>{username}</span>
              </div>
              <div
                dangerouslySetInnerHTML={{ __html: blog.content }}
                className={style.contentContainer}
              ></div>
              <MDBRow className={style.authorBox}>
                <MDBCol md={1}>
                  <img src={avatar} className={style.avatar} />
                </MDBCol>
                <MDBCol md={8}>
                  <b>Tác giả</b>
                  <br />
                  {username}
                </MDBCol>
              </MDBRow>
            </MDBCardBody>
          </MDBCard>
          <MDBCard id="navContainer" className={style.navContainer}>
            <MDBRow>
              <MDBCol className={style.arrowIconsBox}>
                <a
                  href={"blog?id=" + nearbyBlogs[0].blogId}
                  className={style.nearbyBlogBtn}
                >
                  <FontAwesomeIcon
                    className={style.arrowIcons}
                    icon={faArrowLeft}
                  />
                </a>
              </MDBCol>
              <MDBCol className={style.lastBlogBox}>
                <a
                  href={"blog?id=" + nearbyBlogs[0].blogId}
                  className={style.nearbyBlogBtn}
                >
                  <div className={style.nearbyTitle}>
                    {nearbyBlogs[0].title}
                  </div>
                </a>
              </MDBCol>
              <MDBCol className={style.nextBlogBox}>
                <a
                  href={"blog?id=" + nearbyBlogs[1].blogId}
                  className={style.nearbyBlogBtn}
                >
                  <div className={style.nearbyTitle}>
                    {nearbyBlogs[1].title}
                  </div>
                </a>
              </MDBCol>
              <MDBCol className={style.arrowIconsBox}>
                <a
                  href={"blog?id=" + nearbyBlogs[1].blogId}
                  className={style.nearbyBlogBtn}
                >
                  <FontAwesomeIcon
                    className={style.arrowIcons}
                    icon={faArrowRight}
                  />
                </a>
              </MDBCol>
            </MDBRow>
          </MDBCard>
        </MDBContainer>
      </div>
    );
  }
}
export default BlogDetails;
