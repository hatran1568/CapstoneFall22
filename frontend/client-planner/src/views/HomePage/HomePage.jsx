import React from "react";
import {
    MDBBtn,
    MDBBtnGroup,
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

function HomePage() {
    return (
        <>
            <div className='bg-image'>
                <img
                    src='https://myhugesavings.com/wp-content/uploads/revslider/travelslider/travel-page-bg.jpg'
                    className={style.img}
                    height='auto'
                    width='100%'
                    alt='travel'
                />
                <div className='mask' style={{ backgroundColor: "rgba(0, 0, 0, 0)" }}>
                    <div className={style.splashContainer}>
                        <div className={style.splash}>
                            <div className='px-5' id={style["splash-text"]}>
                                <h2 className='text-dark text-center'>Make planning great!</h2>
                                <p className='text-muted text-center'>Ease your head on decisions.</p>
                                <MDBBtnGroup className={style.btn}>
                                    <MDBBtn color='info'>Generate&nbsp;trip</MDBBtn>
                                    <MDBBtn color='info'>Create&nbsp;trip</MDBBtn>
                                </MDBBtnGroup>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <MDBContainer>
                <h2 className='text-center mt-5 mb-3'>Goodies from our services</h2>
                <MDBRow className='gx-0'>
                    <MDBCol size='6'>
                        <MDBCard>
                            <MDBCardImage src='https://getwallpapers.com/wallpaper/full/a/8/6/618432.jpg' />
                        </MDBCard>
                    </MDBCol>
                    <MDBCol size='6' className='d-flex align-items-center'>
                        <MDBCard className='border-0'>
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
                    <MDBCol size='6' className='d-flex align-items-center'>
                        <MDBCard className='border-0'>
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
                    <MDBCol size='6' className='d-flex align-items-center'>
                        <MDBCard className='border-0'>
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
