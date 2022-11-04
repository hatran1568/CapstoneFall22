import React from "react";
import ReactDOM from "react-dom";
import { useState, useRef, useMemo  } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Editor } from "react-draft-wysiwyg";
import { Component } from 'react';
import { convertToRaw, EditorState, ContentState, convertFromHTML } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
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
  MDBTextArea
} from "mdb-react-ui-kit";
import {
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import style from "./BlogAddUpdate.module.css";
class BlogAddUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blog: {},
      editorState: EditorState.createEmpty(),
      dataLoaded: false,
      thumbnail: null,
      dataChanged: false,
    };
  }
  componentDidMount() {
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get("id");
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

    //Automatically saves every 1 minute
    setInterval(() => {
      if (document.getElementById("blogTitleInput").value != null && this.state.dataChanged) {
        const htmlPuri = draftToHtmlPuri(
        convertToRaw(this.state.editorState.getCurrentContent()));
        var titleValue = " ";
        if (document.getElementById("blogTitleInput").value != null || document.getElementById("blogTitleInput").value != "")
          titleValue = document.getElementById("blogTitleInput").value;
        axios({
          method: "post",
          url: "http://localhost:8080/api/blog/update",
          data: {
            blogId: id,
            content: htmlPuri,
            status: "DRAFT",
            thumbnail: this.state.thumbnail,
            title: titleValue,
            userId: localStorage.getItem("id"),
          },
          headers: {
            "Content-Type": "application/json",
          },
        }).then(function (response) {
          console.log("Draft saved.")
        });
      }
      this.setState({
        dataChanged: false,
      });
    }, 60000);
  }
  onEditorStateChange: Function = (editorState) => {
    this.setState({
      editorState,
      dataChanged: true,
    });
  };
  
  render() {
    //Upload images of Content
    const uploadCallback = (file) => {
      return new Promise(
        (resolve, reject) => {
          let imageLink;
          const formData = new FormData();
          formData.append("File", file);
    
          axios.post("/api/blog/uploadImg/", formData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }).then(response => 
            resolve({ data: { link: response.data } })
          );
        }
      );
    }
    const htmlPuri = draftToHtmlPuri(
      convertToRaw(this.state.editorState.getCurrentContent())
    );
    const config = {
      image: { uploadCallback: uploadCallback },
    };

    //Upload thumbnail
    const handleClick = (e) => {
      document.getElementById("fileUpload").click();
    };
    const onFileChange = (e) => {
      const formData = new FormData();
      console.log(e.target.files[0]);
      formData.append("File", e.target.files[0]);

      axios.post("/api/blog/uploadImg/", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }).then(response => 
        this.setState({
          thumbnail: response.data,
        }),
      );
    };

    //Publish or save Blog manually
    const publishBlog = (e) => {
      const queryParams = new URLSearchParams(window.location.search);
      const id = queryParams.get("id");
      var titleValue = " ";
      if (document.getElementById("blogTitleInput").value != null || document.getElementById("blogTitleInput").value != "")
        titleValue = document.getElementById("blogTitleInput").value;
      axios({
        method: "post",
        url: "http://localhost:8080/api/blog/update",
        data: {
          blogId: id,
          content: htmlPuri,
          status: "PUBLISHED",
          thumbnail: this.state.thumbnail,
          title: titleValue,
          userId: localStorage.getItem("id"),
        },
        headers: {
          "Content-Type": "application/json",
        },
      }).then(function (response) {
        window.location.href = "./?id=" + id;
      });
    };
    const saveDraft = (e) => {
      const queryParams = new URLSearchParams(window.location.search);
      const id = queryParams.get("id");
      var titleValue = " ";
      if (document.getElementById("blogTitleInput").value != null || document.getElementById("blogTitleInput").value != "")
        titleValue = document.getElementById("blogTitleInput").value;
      axios({
        method: "post",
        url: "http://localhost:8080/api/blog/update",
        data: {
          blogId: id,
          content: htmlPuri,
          status: "DRAFT",
          thumbnail: this.state.thumbnail,
          title: titleValue,
          userId: localStorage.getItem("id"),
        },
        headers: {
          "Content-Type": "application/json",
        },
      }).then(function (response) {
        window.location.href = "./list";
    });
    };
    const titleChanged = (e) => {
      this.setState({
        dataChanged: true,
      });
    };
    const onInput = (e) => {
      e.currentTarget.style.height = "5px";
      e.currentTarget.style.height = (e.currentTarget.scrollHeight)+"px";
    }

    //Set initial content
    if (this.state.dataLoaded){
      document.getElementById("blogTitleInput").value = this.state.blog.title;
      document.getElementById("blogTitleInput").classList.add("active");
      const contentBlock = typeof window !== 'undefined' ? htmlToDraft(this.state.blog.content) : null;
      if(contentBlock) {
        const
          contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks),
          editorState = EditorState.createWithContent(contentState);
          
        this.setState({
          editorState: editorState,
          thumbnail: this.state.blog.thumbnail,
          dataLoaded: false,
        });
        if (this.state.blog.thumbnail == " ")
        this.setState({
          thumbnail: "https://twimg0-a.akamaihd.net/a/1350072692/t1/img/front_page/jp-mountain@2x.jpg"
        })
      }
      document.getElementById("blogTitleInput").style.height = "5px";
      document.getElementById("blogTitleInput").style.height = (document.getElementById("blogTitleInput").scrollHeight)+"px";
    }
    return (
      <MDBContainer className={style.mainContainer}>
        <div className={style.nav}>
          <a className={style.navItem} href="./list"><b>Quản lí blog</b></a><FontAwesomeIcon className={style.arrowIcon} icon={faAngleRight}/><b>Chỉnh sửa blog</b>
        </div>
        <h2 style={{'textAlign':'center'}}>Cập nhật Blog</h2>
        <MDBCard className={style.btnBar}>
          <MDBCardBody>
            <MDBBtn color="info" onClick={handleClick} className={style.leftBtn}>
              Thay đổi ảnh nền
            </MDBBtn>
            <input
              type="file"
              id="fileUpload"
              accept=".jpg,.jpeg,.png"
              onChange={onFileChange}
              style={{ display: "none" }}
            />
            <span className={style.autosave}>Tự động lưu sau mỗi phút</span>
            <MDBBtn color="info" onClick={publishBlog} className={style.rightBtn}>
              Đăng bài
            </MDBBtn>
            <MDBBtn color="info" onClick={saveDraft} className={style.rightBtn}>
              Lưu bản nháp
            </MDBBtn>
          </MDBCardBody>
        </MDBCard>
        <img
          className={style.thumbnail}
          src={this.state.thumbnail ? this.state.thumbnail : "https://twimg0-a.akamaihd.net/a/1350072692/t1/img/front_page/jp-mountain@2x.jpg"}
          alt="avatar"
        />
        <MDBTextArea
          label="Tiêu đề"
          id="blogTitleInput"
          type="text"
          maxLength="200"
          placeholder="Enter a title for your blog."
          onClick={onInput}
          onChange={titleChanged}
          onInput={onInput}
          className={style.titleInput}
          rows={1}
        />
        <Editor
          toolbar={config}
          editorState={this.state.editorState}
          wrapperClassName={style.editor}
          editorClassName={style.editorContent}
          onEditorStateChange={this.onEditorStateChange}
        />
        {/* <div id="content">{htmlPuri}</div> */}
      </MDBContainer>
    )
  }
}
export default BlogAddUpdate;
