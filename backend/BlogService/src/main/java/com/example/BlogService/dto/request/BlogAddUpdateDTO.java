package com.example.BlogService.dto.request;

public class BlogAddUpdateDTO {
    int blogId;
    String content;
    String status;
    String thumbnail;
    String title;
    int userId;

    public String getContent() { return content; }
    public int getBlogId() { return blogId; }
    public String getStatus() {
        return status;
    }

    public String getThumbnail() {
        return thumbnail;
    }

    public String getTitle() {
        return title;
    }

    public int getUserId() {
        return userId;
    }
}
