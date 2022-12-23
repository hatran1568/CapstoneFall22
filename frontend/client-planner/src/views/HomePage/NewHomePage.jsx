import React, { useState } from "react";
import style from "./newhomepage.module.css";
import "react-datepicker/dist/react-datepicker.css";
import axios from "../../api/axios";
import GenerateModal from "./GenerateModal";
function NewHomePage() {
  const [generateModal, setGenerateModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const toggleShowGenerate = () => {
    checkGenerating();
    setGenerateModal(!generateModal);
    console.log("generate show: ", generateModal);
  };
  const checkGenerating = () => {
    axios({
      method: "get",
      url:
        "http://localhost:8080/trip/optimize/checkGenerating/" +
        localStorage.getItem("id"),

      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }).then(function (response) {
      if (response.data == true) {
        setIsGenerating(true);
      } else {
        setIsGenerating(false);
      }
      //connect(id,response.data);
    });
  };
  const submitGenerateTrip = (data) => {
    axios({
      method: "post",
      url: "http://localhost:8080/trip/optimize/generate",
      data: {
        userId: localStorage.getItem("id"),
        budget: data.budget,
        destinationId: data.destinationId,
        startDate: data.startDate,
        endDate: data.endDate,
        startTime: "30600",
        endTime: "75600",
        userPreference: data.userPreference,
      },
      headers: {
        "Content-Type": "application/json",
      },
    }).then(function (response) {
      toggleOffGenerate();
      toast(
        "Chuyến đi của bạn sẽ sẵn sàng trong ít phút. Kết quả sẽ được gửi đến mail của bạn.",
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
      setIsGenerating(true);
      setRequest(response.data.id);
      setPort(response.data.port);
      //connect(id,response.data);
    });
  };
  const closeGenerate = () => {
    setGenerateModal(false);
  };
  return (
    <>
      <section className={`${style.siteHero} ${style.overlay}`}>
        <img
          src="../img/homepage/hero_1.jpg"
          className={style.backgroundImage}
        />
        <div className="container">
          <div
            className={`row ${style.siteHeroInner} justify-content-center align-items-center`}
          >
            <div className="col-md-10 text-center">
              <h1 className={`${style.heading} mb-4`} data-aos="fade-up">
                Trip Planner System
              </h1>
              <p
                className={`mb-5 ${style.subHeading}`}
                data-aos="fade-up"
                data-aos-delay="100"
              >
                Sử dụng dịch vụ gợi ý của chúng tôi, hoặc tự tạo kế hoạch của
                riêng bạn
              </p>
              <p className="pt-4" data-aos="fade-up" data-aos-delay="100">
                <a
                  className="btn uppercase btn-light d-sm-inline d-block py-3"
                  onClick={toggleShowGenerate}
                >
                  Gợi ý chuyến đi
                </a>
                <GenerateModal
                  show={generateModal}
                  isGenerating={isGenerating}
                  toggleShowGenerate={toggleShowGenerate}
                  onSubmit={(data) => submitGenerateTrip(data)}
                  closeGenerate={closeGenerate}
                />
              </p>
            </div>
          </div>
          <p data-aos="fade-up" data-aos-offset="-500">
            <a
              href="#next-section"
              className={`smoothscroll ${style.scrollDown}`}
            >
              {" "}
              <span className="fa fa-play"></span> Scroll Down
            </a>
          </p>
        </div>
      </section>

      <section className={style.section} id="next-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4" data-aos="fade-up">
              <p>
                <img
                  src="../img/homepage/img_1_long.jpg"
                  alt="Free Template by Free-Template.co"
                  className="img-fluid"
                />
              </p>
            </div>
            <div
              className={`col-lg-6 pl-lg-5 ${style.rightCol}`}
              data-aos="fade-up"
            >
              <h2 className={`mb-4 ${style.h2}`}>Welcome To Our Website</h2>
              <p>
                Far far away, behind the word mountains, far from the countries
                Vokalia and Consonantia, there live the blind texts. Separated
                they live in Bookmarksgrove right at the coast of the Semantics,
                a large language ocean.
              </p>
              <p>
                A small river named Duden flows by their place and supplies it
                with the necessary regelialia.{" "}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={`section ${style.bgLight2} ${style.section}`}>
        <div className="container">
          <div className="row justify-content-center text-center mb-5">
            <div className="col-md-8">
              <h2 className={`heading ${style.h2}`} data-aos="fade-up">
                Experience Once In Your Life Time
              </h2>
              <p className="lead" data-aos="fade-up" data-aos-delay="100">
                Far far away, behind the word mountains, far from the countries
                Vokalia and Consonantia, there live the blind texts. Separated
                they live in Bookmarksgrove right at the coast of the Semantics,
                a large language ocean.
              </p>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 col-lg-4 mb-4" data-aos="fade-up">
              <div className={`d-block ${style.imgFlaticon}`}>
                <img
                  src="../img/homepage/icons/001-breakfast.svg"
                  alt="Free Template by Free-Template.co"
                  className="img-fluid mb-4"
                />
                <h3 className={style.h3}>Good Foods</h3>
                <p>
                  Far far away, behind the word mountains, far from the
                  countries Vokalia and Consonantia, there live the blind texts.{" "}
                </p>
              </div>
            </div>
            <div
              className="col-md-6 col-lg-4 mb-4"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className={`d-block ${style.imgFlaticon}`}>
                <img
                  src="../img/homepage/icons/002-planet-earth.svg"
                  alt="Free Template by Free-Template.co"
                  className="img-fluid mb-4"
                />
                <h3 className={style.h3}>Travel Anywhere</h3>
                <p>
                  Far far away, behind the word mountains, far from the
                  countries Vokalia and Consonantia, there live the blind texts.{" "}
                </p>
              </div>
            </div>
            <div
              className="col-md-6 col-lg-4 mb-4"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className={`d-block ${style.imgFlaticon}`}>
                <img
                  src="../img/homepage/icons/003-airplane.svg"
                  alt="Free Template by Free-Template.co"
                  className="img-fluid mb-4"
                />
                <h3 className={style.h3}>Airplane</h3>
                <p>
                  Far far away, behind the word mountains, far from the
                  countries Vokalia and Consonantia, there live the blind texts.{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className={`section blog-post-entry bg-light slant-top ${style.section} ${style.blogSection}`}
      >
        <div className="container">
          <div className="row justify-content-center text-center mb-5">
            <div className="col-md-8 primary-bg-text">
              <h2 className={`heading`} data-aos="fade-up">
                Recent Blog Post
              </h2>
              <p data-aos="fade-up">
                Far far away, behind the word mountains, far from the countries
                Vokalia and Consonantia, there live the blind texts. Separated
                they live in Bookmarksgrove right at the coast of the Semantics,
                a large language ocean.
              </p>
            </div>
          </div>
          <div className="row">
            <div
              className={`col-lg-4 col-md-6 col-sm-6 col-12 ${style.post}`}
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className={`media ${style.mediaCustom} d-block mb-4`}>
                <a href="#" className="mb-4 d-block">
                  <img
                    src="../img/homepage/blog_1.jpg"
                    alt="Image placeholder"
                    className="img-fluid"
                  />
                </a>
                <div className={style.mediaBody}>
                  <span className={style.metaPost}>February 26, 2018</span>
                  <h2 className="mt-0 mb-3">
                    <a href="#">45 Best Places To Unwind</a>
                  </h2>
                  <p>
                    Far far away, behind the word mountains, far from the
                    countries Vokalia and Consonantia, there live the blind
                    texts.{" "}
                  </p>
                </div>
              </div>
            </div>
            <div
              className={`col-lg-4 col-md-6 col-sm-6 col-12 ${style.post}`}
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className={`media ${style.mediaCustom} d-block mb-4`}>
                <a href="#" className="mb-4 d-block">
                  <img
                    src="../img/homepage/blog_3.jpg"
                    alt="Image placeholder"
                    className="img-fluid"
                  />
                </a>
                <div className={style.mediaBody}>
                  <span className={style.metaPost}>February 26, 2018</span>
                  <h2 className="mt-0 mb-3">
                    <a href="#">45 Best Places To Unwind</a>
                  </h2>
                  <p>
                    Far far away, behind the word mountains, far from the
                    countries Vokalia and Consonantia, there live the blind
                    texts.{" "}
                  </p>
                </div>
              </div>
            </div>
            <div
              className={`col-lg-4 col-md-6 col-sm-6 col-12 ${style.post}`}
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className={`media ${style.mediaCustom} d-block mb-4`}>
                <a href="#" className="mb-4 d-block">
                  <img
                    src="../img/homepage/blog_3.jpg"
                    alt="Image placeholder"
                    className="img-fluid"
                  />
                </a>
                <div className={style.mediaBody}>
                  <span className={style.metaPost}>February 26, 2018</span>
                  <h2 className="mt-0 mb-3">
                    <a href="#">45 Best Places To Unwind</a>
                  </h2>
                  <p>
                    Far far away, behind the word mountains, far from the
                    countries Vokalia and Consonantia, there live the blind
                    texts.{" "}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`${style.section} ${style.visitSection} section`}>
        <div className="container">
          <div className="row justify-content-center text-center mb-5">
            <div className="col-md-8 ">
              <h2 className={`heading ${style.h2}`} data-aos="fade-up">
                Top Destination
              </h2>
              <p className="lead" data-aos="fade-up">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. In
                dolor, iusto doloremque quo odio repudiandae sunt eveniet? Enim
                facilis laborum voluptate id porro, culpa maiores quis,
                blanditiis laboriosam alias. Sed.
              </p>
            </div>
          </div>
          <div className="row">
            <div className={`col-lg-4 col-md-6 ${style.visit} mb-4`}>
              <a href="#">
                <img
                  src="../img/homepage/blog_1.jpg"
                  alt="Image placeholder"
                  className="img-fluid"
                />{" "}
              </a>
              <h3 className={style.h3}>
                <a href="#">Food &amp; Wines</a>
              </h3>
              <span className="reviews-count float-right">3,239 reviews</span>
            </div>
            <div
              className={`col-lg-4 col-md-6 ${style.visit} mb-4`}
              data-aos="fade-right"
              data-aos-delay="100"
            >
              <a href="#">
                <img
                  src="../img/homepage/blog_2.jpg"
                  alt="Image placeholder"
                  className="img-fluid"
                />{" "}
              </a>
              <h3>
                <a href="#">Resort &amp; Spa</a>
              </h3>
              <span className="reviews-count float-right">4,921 reviews</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export default NewHomePage;
