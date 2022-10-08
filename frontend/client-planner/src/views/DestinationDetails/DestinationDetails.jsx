import React from "react";
import {useState} from 'react';
import POIBox from './POIBox.jsx'
import imageData from './imagedata.json'
import dataPOI from './data.json'
import MyGallery from './MyGallery.jsx'
import {
    MDBBtn,
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBRow,
    MDBCol,
    MDBInput,
  } from "mdb-react-ui-kit";
import './DestinationDetails.css';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
function DestinationDetails(){
    const imgs = imageData;
    return(
        <MDBContainer className="container">
            <br/>
            <MDBCard className="contentbox">
                <h1 id="destinationName">Hà Nội</h1><br/><br/>
                <MyGallery images={imgs}/>

                <MDBCardBody id="description">
                    Hồ Hoàn Kiếm (chữ Nôm: 湖還劍 hoặc 還劍湖) còn được gọi là Hồ Gươm là một hồ nước ngọt tự nhiên nằm ở trung tâm thành phố Hà Nội. Hồ có diện tích khoảng 12 ha[2]. Trước kia, hồ còn có các tên gọi là hồ Lục Thủy (vì nước có màu xanh quanh năm), hồ Thủy Quân (dùng để duyệt thủy binh), hồ Tả Vọng và Hữu Vọng (trong thời Lê mạt). Tên gọi Hoàn Kiếm xuất hiện vào đầu thế kỷ 15 gắn với truyền thuyết vua Lê Lợi trả lại gươm thần cho Rùa thần. Theo truyền thuyết, trong một lần vua Lê Thái Tổ dạo chơi trên thuyền, bỗng một con rùa vàng nổi lên mặt nước đòi nhà vua trả thanh gươm mà Long Vương cho mượn để đánh đuổi quân Minh xâm lược. Nhà vua liền trả gươm cho rùa thần và rùa lặn xuống nước biến mất. Từ đó hồ được lấy tên là hồ Hoàn Kiếm. Tên hồ còn được lấy để đặt cho một quận trung tâm của Hà Nội (quận Hoàn Kiếm) và là hồ nước duy nhất của quận này cho đến ngày nay.
                </MDBCardBody><br/><br/>
                <MDBCardBody className="container2">
                    <h3>Traveling to Hanoi?</h3>
                    <MDBBtn className="button-2" role="button" id="generateTrip">Plan your trip</MDBBtn><br/><br/>
                    <h2 id="destinationName">Places and activities in Hà Nội</h2>
                </MDBCardBody>
                <MDBCardBody>
                  <MDBRow className="row">
                    <POIBox name="Hồ Hoàn Kiếm" url="./assets/images/hanoi6.png" rating={4.3} category="Outdoors"/>
                    <POIBox name="Hồ Hoàn Kiếm" url="./assets/images/hanoi6.png" rating={4.3} category="Outdoors"/>
                    <POIBox name="Hồ Hoàn Kiếm" url="./assets/images/hanoi6.png" rating={4.3} category="Outdoors"/>
                  </MDBRow>
                </MDBCardBody>
                <MDBCardBody className="container2">
                    <MDBBtn className="button-2" role="button" id="poiList">Find more places in Hanoi</MDBBtn><br/><br/>
                </MDBCardBody>
            </MDBCard>
        </MDBContainer>
    )
}
export default DestinationDetails;