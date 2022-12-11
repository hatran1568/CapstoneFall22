package com.tripplanner.BlogService.service.implementers;

import com.tripplanner.BlogService.entity.Blog;
import com.tripplanner.BlogService.repository.BlogRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.ArrayList;
import java.util.List;

import static com.tripplanner.BlogService.entity.BlogStatus.PUBLISHED;
import static org.mockito.Mockito.doReturn;

@SpringBootTest
class BLogServiceImplTest {
    @Autowired
    private BLogServiceImpl service;

    @MockBean
    private BlogRepository repo;

    @Test
    void getBlogByKeyWordTest() {
        List<Blog> list = new ArrayList<>();
        Blog blog = new Blog();
        blog.setBlogId(1);
        blog.setUser(1);
        blog.setTitle("abc");
        blog.setContent("");
        blog.setStatus(PUBLISHED);
        list.add(blog);
        doReturn(list).when(repo).getBlogsByKeyword("a");

        List<Blog> returnedList = service.getBlogByKeyWord("a");

        Assertions.assertSame(returnedList, list);
    }

    @Nested
    class GetBlogByIdTest {
        @Test
        void existingBlogCase() {
            Blog blog = new Blog();
            blog.setBlogId(1);
            blog.setUser(1);
            blog.setTitle("");
            blog.setContent("");
            blog.setStatus(PUBLISHED);
        }

        @Test
        void nonExistingBlogCase() {

        }
    }
}