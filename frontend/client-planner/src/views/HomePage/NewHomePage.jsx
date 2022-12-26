import React, { useState } from "react";
import { json, useNavigate } from "react-router-dom";
import style from "./newhomepage.module.css";
import "react-datepicker/dist/react-datepicker.css";
import axios from "../../api/axios";
import GenerateModal from "./GenerateModal";
import CreateModal from "./CreateModal";
import MyTrips from "./MyTrips";
import Blogs from "./Blogs";
import Destinations from "./Destinations";
import RecentTrips from "./RecentTrips";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function NewHomePage() {
  document.title = "🌏 Trip Planner";
  const navigate = useNavigate();
  const [generateModal, setGenerateModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const toggleShowGenerate = () => {
    if (localStorage.getItem("token")) {
      checkGenerating();
      setGenerateModal(!generateModal);
    } else {
      window.location.href = "http://localhost:3000/login";
    }
  };
  const toggleShowCreateModal = () => {
    setShowCreateModal(!showCreateModal);
  };
  const closeGenerate = () => {
    setGenerateModal(false);
  };
  const closeCreateModal = () => {
    setShowCreateModal(false);
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
      //   toggleOffGenerate();
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
    });
  };
  const submitCreateTrip = (createData) => {
    var userId = -1;
    if (
      localStorage.getItem("id") != null &&
      typeof localStorage.getItem("id") != undefined
    )
      userId = localStorage.getItem("id");
    axios({
      method: "post",
      url: "http://localhost:8080/trip/createTrip",
      data: {
        userId: userId,
        budget: createData.budget,
        name: createData.name,
        startDate: createData.startDate,
        endDate: createData.endDate,
      },
      headers: {
        "Content-Type": "application/json",
      },
    }).then(function (response) {
      if (!localStorage.getItem("id"))
        localStorage.setItem("id", response.data.user);
      if (!localStorage.getItem("role")) localStorage.setItem("role", "Guest");
      if (localStorage.getItem("role").toLowerCase() == "guest") {
        var trips = localStorage.getItem("trips");
        if (trips) {
          trips = JSON.parse(trips);
          trips.push(response.data.tripId);
        } else {
          trips = [];
          trips.push(response.data.tripId);
        }
        localStorage.setItem("trips", JSON.stringify(trips));
      }
      navigate("../Timeline/" + response.data.tripId);
      window.location.reload(false);
    });
  };
  return (
    <>
      <GenerateModal
        show={generateModal}
        isGenerating={isGenerating}
        toggleShowGenerate={toggleShowGenerate}
        onSubmit={(data) => submitGenerateTrip(data)}
        closeGenerate={closeGenerate}
      />

      <CreateModal
        show={showCreateModal}
        onSubmit={(data) => submitCreateTrip(data)}
        closeCreateModal={closeCreateModal}
      />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <section className={`${style.siteHero} ${style.overlay} ${style.body}`}>
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
                  className={`btn uppercase btn-light d-sm-inline d-block py-3 ${style.createBtn}`}
                  onClick={toggleShowGenerate}
                >
                  Gợi ý chuyến đi
                </a>
                <a
                  className={`btn uppercase btn-light d-sm-inline d-block py-3 ${style.createBtn}`}
                  onClick={toggleShowCreateModal}
                >
                  Tạo chuyến đi
                </a>
              </p>
            </div>
          </div>
          <p data-aos="fade-up" data-aos-offset="-500">
            <a href="#my-trips" className={`smoothscroll ${style.scrollDown}`}>
              {" "}
              <span className="fa fa-play"></span> Khám phá
            </a>
          </p>
        </div>
      </section>
      <div id="my-trips">
        <MyTrips />
      </div>
      <RecentTrips />

      <section className={`section ${style.section} ${style.introSection}`}>
        <div className="container">
          <div className="row justify-content-center text-center mb-5">
            <div className="col-md-8">
              <h2 className={`heading ${style.h2}`} data-aos="fade-up">
                Tận hưởng những trải nghiệm tuyệt vời
              </h2>
              <p className="lead" data-aos="fade-up" data-aos-delay="100">
                TPS cung cấp thông tin, blog và đánh giá về các địa điểm yêu
                thích để giúp bạn lựa chọn địa điểm để đi cho chuyến đi của bạn
              </p>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 col-lg-4 mb-4" data-aos="fade-up">
              <div className={`d-block ${style.imgFlaticon}`}>
                <img
                  src="../img/homepage/icons/002-planet-earth.svg"
                  alt="Free Template by Free-Template.co"
                  className="img-fluid mb-4"
                />
                <h3 className={style.h3}>Gợi ý chuyến đi</h3>
                <p>
                  Thuật toán đề xuất của chúng tôi dựa trên thông tin nhập vào
                  để về điểm đến du lịch, thời gian, ngân sách và sở thích của
                  bạn để tự động tạo một chuyến đi{" "}
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
                  src="../img/homepage/icons/edit.png"
                  alt="Free Template by Free-Template.co"
                  className="img-fluid mb-4"
                />
                <h3 className={style.h3}>Tùy chỉnh chuyến đi</h3>
                <p>
                  Tạo và chỉnh sửa chi tiết chuyến đi của bạn trên thời gian
                  biểu và mốc thời gian, quản lí chi phí và danh sách việc cần
                  làm{" "}
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
                  src="../img/homepage/icons/hotel.png"
                  alt="Free Template by Free-Template.co"
                  className="img-fluid mb-4"
                />
                <h3 className={style.h3}>Nhà nghỉ & Khách sạn</h3>
                <p>
                  Tìm nhà nghỉ hoặc khách sạn gần nhất so với các địa điểm trong
                  chuyến đi của bạn{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Blogs />
      <Destinations />
    </>
  );
}
export default NewHomePage;
