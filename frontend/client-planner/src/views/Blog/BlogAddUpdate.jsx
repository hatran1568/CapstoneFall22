import React from "react";
import ReactDOM from "react-dom";
import { useState, useRef, useMemo  } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Editor } from "react-draft-wysiwyg";
import { Component } from 'react';
import { convertToRaw, EditorState } from 'draft-js';
import draftToHtmlPuri from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import axios from "../../api/axios";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBInput,
  MDBIcon,
} from "mdb-react-ui-kit";
import style from "./BlogAddUpdate.module.css";
class BlogAddUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      blog: null,
      dataLoaded: false,
      thumbnail: null,
    };
  }
  componentDidMount() {
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get("id");
    if (id != 0)
      axios.get(`http://localhost:8080/api/blog/` + id).then((res) => {
        const data = res.data;
        this.setState({
          blog: data,
          dataLoaded: true,
        });
      }).catch(
        function (error) {
          console.log(error)
          return Promise.reject(error)
        }
      );
  }
  onEditorStateChange: Function = (editorState) => {
    this.setState({
      editorState,
    });
  };
  
  render() {
    const uploadCallback = (file) => {
      return new Promise(
        (resolve, reject) => {
          resolve({ data: { link: "http://dummy_image_src.com" } });
        }
      );
    }
    const { editorState } = this.state;
    const htmlPuri = draftToHtmlPuri(
      convertToRaw(this.state.editorState.getCurrentContent())
    );
    const config = {
      image: { uploadCallback: uploadCallback },
    };
    const formData = new FormData();
    const onFileChange = (e) => {
      console.log(e.target.files[0]);
      formData.append("File", e.target.files[0]);

      axios.post("/api/blog/uploadImg/", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }).then(response => 
        console.log(response),
        // this.setState({
        //   thumbnail: response.data,
        // })
      );
    };
    const handleClick = (e) => {
      // ref.current.click();
      document.getElementById("fileUpload").click();
    };
    return (
      <MDBContainer className={style.mainContainer}>
        <MDBCard className={style.btnBar}>
          <MDBCardBody>
            <MDBBtn color="info" onClick={handleClick} className={style.leftBtn}>
              Change Thumbnail
            </MDBBtn>
            <input
              type="file"
              id="fileUpload"
              accept=".jpg,.jpeg,.png"
              onChange={onFileChange}
              style={{ display: "none" }}
            />
            <MDBBtn color="info" className={style.rightBtn}>
              Publish
            </MDBBtn>
            <MDBBtn color="info" className={style.rightBtn}>
              Save as Draft
            </MDBBtn>
          </MDBCardBody>
        </MDBCard>
        <img
          className={style.thumbnail}
          src={this.state.thumbnail ? this.state.thumbnail : "https://twimg0-a.akamaihd.net/a/1350072692/t1/img/front_page/jp-mountain@2x.jpg"}
          alt="avatar"
        />
        <MDBInput
          label="Title"
          id="blogTitleInput"
          type="text"
          maxLength="200"
          className={style.titleInput}
        />
        <Editor
          toolbar={config}
          initialEditorState={editorState}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          onEditorStateChange={this.onEditorStateChange}
        />
        <div id="content">{htmlPuri}</div>
      </MDBContainer>
    )
  }
}
export default BlogAddUpdate;
