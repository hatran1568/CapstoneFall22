import React from "react";
import "./style.css";
function Forbiden() {
  return (
    <div>
      <div class="text-wrapper">
        <div class="title" data-content="404">
          403 - ACCESS DENIED
        </div>

        <div class="subtitle">
          Oops, Bạn không có quyền truy cập vào trang này.
        </div>

        <div class="buttons">
          <a class="button" href="http://www.localhost:3000">
            Về Trang chủ
          </a>
        </div>
      </div>
    </div>
  );
}
export default Forbiden;
