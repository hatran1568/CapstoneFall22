import axios from "../../api/axios";
import { MDBCard, MDBIcon, MDBBtn } from "mdb-react-ui-kit";
import { React, useRef, useState } from "react";
import style from "./Profile.module.css";
function ProfileCard(props) {
  const ref = useRef();

  const [avatar, setAvatar] = useState(props.user.avatar);
  const [curUsername, setUsername] = useState(props.user.name);
  const [isEditing, setIsEditing] = useState(false);
  const handleClick = (e) => {
    ref.current.click();
  };
  const formData = new FormData();

  const onFileChange = (e) => {
    console.log(e.target.files[0]);
    const objectUrl = URL.createObjectURL(e.target.files[0]);
    setAvatar(objectUrl);
    const id = localStorage.getItem("id");
    formData.append("File", e.target.files[0]);

    axios.post("/user/api/user/edit-avatar/" + id, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    });
  };

  const toLongDate = (date) => {
    var today = new Date(date);
    return today.toLocaleDateString("en-IE");
  };

  const handleInput = (e) => {
    if (e.key === "Enter") {
      setIsEditing(false);
      console.log(curUsername);

      const newUser = {
        id: localStorage.getItem("id"),
        username: curUsername,
      };
      axios.post("/user/api/user/edit-username", newUser, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    }
  };

  return (
    <MDBCard className={`${style.card} p-3`}>
      <div
        className={` d-flex flex-column justify-content-center align-items-center`}
      >
        <div className={style.btn}>
          <img
            className={`${style.avatar}`}
            src={avatar ? avatar : "http://www.gravatar.com/avatar/?d=mp"}
            alt="avatar"
          />
          <MDBBtn
            tag="a"
            color="none"
            className={style.imageButton}
            onClick={handleClick}
          >
            <MDBIcon fas icon="camera" size="lg" />
            <input
              type="file"
              id="file"
              accept=".jpg,.jpeg,.png"
              ref={ref}
              onChange={onFileChange}
              style={{ display: "none" }}
            />
          </MDBBtn>
        </div>
        {isEditing ? (
          <input
            autoFocus
            onInput={(e) => setUsername(e.target.value)}
            onKeyDown={handleInput}
            defaultValue={curUsername}
            className={`${style.editInput} mt-3`}
            type="text"
          />
        ) : (
          <span className={`${style.name} mt-3 mx-auto`}>
            {curUsername}
            <MDBBtn
              tag="a"
              color="none"
              style={{
                position: "absolute",
                marginLeft: "5px",
              }}
              onClick={() => setIsEditing(true)}
            >
              <MDBIcon fas icon="pen" size="xs" style={{ color: "gray" }} />
            </MDBBtn>
          </span>
        )}

        <span className={style.email}>{props.user.email}</span>
        <div className={`px-2 rounded mt-4 ${style.date}`}>
          <span className={style.join}>
            Joined {toLongDate(props.user.dateCreated.split("T")[0])}
          </span>
        </div>
      </div>
    </MDBCard>
  );
}

export default ProfileCard;
