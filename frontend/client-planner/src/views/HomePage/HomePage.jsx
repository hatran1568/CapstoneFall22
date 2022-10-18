import React from "react";
import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardHeader,
    MDBCardImage,
    MDBCardText,
    MDBCardTitle,
    MDBCol,
    MDBContainer,
    MDBRow,
} from "mdb-react-ui-kit";
import style from "./HomePage.module.css";
import POISearchBar from "../../components/POISearchBar/POISearchBar";

function HomePage() {
    return (
        <>
            <div className='bg-image'>
                <img
                    src='https://journalistontherun.com/wp-content/uploads/2015/10/o-SOLO-TRAVEL-facebook.jpg'
                    className='img-fluid'
                    height='auto'
                    width='100%'
                    alt='sea'
                />
                <div className='mask' style={{ backgroundColor: "rgba(0, 0, 0, 0)" }}>
                    <MDBRow className="d-flex align-items-stretch">
                        <MDBCol size="4">
                            <div className="bg-white" width="100%" height="100%"></div>
                        </MDBCol>
                        <MDBCol size="8">

                        </MDBCol>
                    </MDBRow>
                    {/*<div className='d-flex justify-content-center align-items-center h-100'>
                        <div>
                            <p className='text-white fs-1 fw-bold text-center mb-1'>Ad astra abyssoque!</p>
                            <p className='text-white fs-2 text-center mb-2'>
                                Let the wind lead, to the stars and beyond!
                            </p>
                            <div className='d-flex justify-content-center'>
                                <MDBBtn href='/generate' color='success'>
                                    Generate trip
                                </MDBBtn>
                            </div>
                        </div>
                    </div>*/}
                </div>
            </div>
            <MDBContainer className='w-50'>
                <h2 className='text-center mt-5 mb-3'>Goodies from our services</h2>
                <MDBRow className='gx-0'>
                    <MDBCol size='6'>
                        <MDBCard>
                            <MDBCardImage src='https://getwallpapers.com/wallpaper/full/a/8/6/618432.jpg' />
                        </MDBCard>
                    </MDBCol>
                    <MDBCol size='6'>
                        <MDBCard>
                            <MDBCardBody>
                                <MDBCardText>
                                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dignissimos earum libero
                                    impedit enim est corrupti fugiat vero ratione maiores explicabo nesciunt porro
                                    aspernatur, debitis, veniam, dicta modi expedita exercitationem tenetur fuga vel
                                    quos autem nam.
                                </MDBCardText>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
                <MDBRow className='gx-0'>
                    <MDBCol size='6'>
                        <MDBCard>
                            <MDBCardBody>
                                <MDBCardText>
                                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dignissimos earum libero
                                    impedit enim est corrupti fugiat vero ratione maiores explicabo nesciunt porro
                                    aspernatur, debitis, veniam, dicta modi expedita exercitationem tenetur fuga vel
                                    quos autem nam.
                                </MDBCardText>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                    <MDBCol size='6'>
                        <MDBCard>
                            <MDBCardImage src='https://architecturesideas.com/wp-content/uploads/2017/03/beautiful-photography-of-nature.jpeg' />
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
                <MDBRow className='gx-0'>
                    <MDBCol size='6'>
                        <MDBCard>
                            <MDBCardImage src='https://www.rxwallpaper.site/wp-content/uploads/1080p-nature-wallpapers-wallpaper-cave-800x800.jpg' />
                        </MDBCard>
                    </MDBCol>
                    <MDBCol size='6'>
                        <MDBCard>
                            <MDBCardBody>
                                <MDBCardText>
                                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dignissimos earum libero
                                    impedit enim est corrupti fugiat vero ratione maiores explicabo nesciunt porro
                                    aspernatur, debitis, veniam, dicta modi expedita exercitationem tenetur fuga vel
                                    quos autem nam.
                                </MDBCardText>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </>
    );
}

export default HomePage;
