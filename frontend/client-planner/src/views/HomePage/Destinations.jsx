import React, { useState, useEffect } from "react";
import { json, useNavigate } from "react-router-dom";
import style from "./newhomepage.module.css";
import "react-datepicker/dist/react-datepicker.css";
import axios from "../../api/axios";

function Destinations() {
  const [destinations, setDestinations] = useState([]);
  useEffect(() => {
    async function getBlogs() {
      await axios
        .get(
          "http://localhost:8080/location/api/destination/get-destination-3",
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          setDestinations(response.data);
        });
    }
    getBlogs();
  }, []);
  return (
    <>
      {destinations && destinations.size != 0 ? (
        <section className={`${style.section} ${style.visitSection} section`}>
          <div className="container">
            <div className="row justify-content-center text-center mb-2">
              <div className="col-md-8 ">
                <h2 className={`heading ${style.h2}`} data-aos="fade-up">
                  Những điểm đến hàng đầu
                </h2>
                <p className="lead" data-aos="fade-up">
                  Khám phá những điểm đến đang được ưa chuộng.
                </p>
              </div>
            </div>
            <div className="row">
              {destinations.map((destination) => (
                <div
                  className={`col-lg-4 col-md-6 ${style.visit} mb-4`}
                  key={destination.destinationId}
                >
                  <a href={"../Destination?id=" + destination.destinationId}>
                    <img
                      src={
                        destination.thumbnail
                          ? destination.thumbnail.includes("img/", 0)
                            ? `../${destination.thumbnail}`
                            : destination.thumbnail
                          : "../img/homepage/blog_1.jpg"
                      }
                      alt="Image placeholder"
                      className="img-fluid"
                    />{" "}
                  </a>
                  <div className={style.text}>
                    <h3 className={`${style.h3} mb-1`}>
                      <a
                        href={"../Destination?id=" + destination.destinationId}
                      >
                        {destination.name}
                      </a>
                    </h3>
                    <div className={`${style.description}`}>
                      {destination.description}
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
export default Destinations;
