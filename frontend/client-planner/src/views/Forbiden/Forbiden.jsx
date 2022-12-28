import React from "react";
import style from "./for.module.css";
function Forbiden() {
  return (
    <div>
      <div className={style.wrapper}>
        <div className={style.title} data-content="404">
          403 - ACCESS DENIED
        </div>

        <div className={style.subtitle}>
          Oops, Bạn không có quyền truy cập vào trang này.
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
export default Forbiden;
