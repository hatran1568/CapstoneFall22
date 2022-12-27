import React from "react";
import "./style.css";
function NotFound() {
  return (
    <div>
      <div class="text-wrapper">
        <div class="title" data-content="404">
          404 - NOT FOUND
        </div>

        <div class="subtitle">
          Oops, Chúng tôi không tìm thấy trang bạn muốn đến.
        </div>

        <div class="buttons">
          <a class="button" href="http://www.localhost:3000">
            Về trang chủ
          </a>
        </div>
      </div>
    </div>
  );
}
export default NotFound;
