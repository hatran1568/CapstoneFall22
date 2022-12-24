import React, { useState, useEffect } from "react";
import { json, useNavigate } from "react-router-dom";
import style from "./newhomepage.module.css";
import "react-datepicker/dist/react-datepicker.css";
import axios from "../../api/axios";
function Blogs() {
  const [blogs, setBlogs] = useState([]);
  useEffect(() => {
    async function getBlogs() {
      await axios
        .get("http://localhost:8080/blog/api/blog/get-blog-3", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setBlogs(response.data);
        });
    }
    getBlogs();
  }, []);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };
  return (
    <>
      {blogs && blogs.size != 0 ? (
        <section
          className={`section blog-post-entry slant-top ${style.section} ${style.blogSection}`}
        >
          <div className="container">
            <div className="row justify-content-center text-center mb-5">
              <div className="col-md-10 primary-bg-text">
                <h2 className={`heading`} data-aos="fade-up">
                  Xem những bài viết gần đây
                </h2>
              </div>
            </div>
            <div className="row">
              {blogs.map((blog) => (
                <div
                  className={`col-lg-4 col-md-6 col-sm-6 col-12 ${style.post}`}
                  data-aos="fade-up"
                  data-aos-delay="100"
                  key={blog.blogId}
                >
                  <div className={`media ${style.mediaCustom} d-block mb-4`}>
                    <a href={"../Blog/?id=" + blog.blogId} className=" d-block">
                      <img
                        src={
                          blog.thumbnail
                            ? blog.thumbnail.includes("img/", 0)
                              ? `../${blog.thumbnail.url}`
                              : blog.thumbnail
                            : "../img/homepage/blog_1.jpg"
                        }
                        className={`img-fluid ${style.blogThumbnail}`}
                      />
                    </a>
                    <div className={style.mediaBody}>
                      <span className={style.metaPost}>
                        {new Date(blog.dateModified).toLocaleDateString(
                          "vi",
                          options
                        )}
                      </span>
                      <h2 className="mt-0 mb-3">
                        <a href={"../Blog/?id=" + blog.blogId}>{blog.title}</a>
                      </h2>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
export default Blogs;
