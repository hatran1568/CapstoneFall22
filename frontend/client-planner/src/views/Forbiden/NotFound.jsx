import React from "react";
import style from "./for.module.css";
function NotFound() {
  return (
    <div>
      <div className={style.wrapper}>
        <div className={style.title} data-content="404">
          404 - NOT FOUND
        </div>

        <div className={style.subtitle}>
          Oops, Chúng tôi không tìm thấy trang này.
        </div>

        <div className={style.buttons}>
          <a className={style.link} href="http://www.localhost:3000">
            Về Trang chủ
          </a>
        </div>
      </div>
    </div>
  );
}
export default NotFound;
