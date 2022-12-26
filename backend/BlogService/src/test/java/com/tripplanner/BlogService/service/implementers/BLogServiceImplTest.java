package com.tripplanner.BlogService.service.implementers;

import com.tripplanner.BlogService.config.RestTemplateClient;
import com.tripplanner.BlogService.dto.request.BlogDetailsDTO;
import com.tripplanner.BlogService.dto.response.UserDetailResponseDTO;
import com.tripplanner.BlogService.entity.Blog;
import com.tripplanner.BlogService.repository.BlogRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static com.tripplanner.BlogService.entity.BlogStatus.PUBLISHED;
import static org.mockito.Mockito.*;

@SpringBootTest
class BLogServiceImplTest {
    @Autowired
    private BLogServiceImpl service;

    @MockBean
    private BlogRepository repo;

    @MockBean
    private DiscoveryClient discoveryClient;

    @MockBean
    private RestTemplateClient restTemplateClient;

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

    @Test
    void getBlogByIdTest() {
        Blog blog = new Blog();
        blog.setBlogId(1);
        blog.setUser(1);
        blog.setTitle("abc");
        blog.setContent("");
        blog.setStatus(PUBLISHED);
        Optional<Blog> blogOptional = Optional.of(blog);
        doReturn(blogOptional).when(repo).findById(1);
        List<ServiceInstance> instances = new ArrayList<>();
        ServiceInstance instance = mock(ServiceInstance.class);
        instances.add(instance);
        doReturn(instances).when(discoveryClient).getInstances("user-service");
        RestTemplate restTemplate = mock(RestTemplate.class);
        doReturn(restTemplate).when(restTemplateClient).restTemplate();
        UserDetailResponseDTO user = new UserDetailResponseDTO();
        user.setName("");
        user.setAvatar("");
        when(
                restTemplate.getForObject(
                        instance.getUri() + "/user/api/user/findById/" + blog.getUser(),
                        UserDetailResponseDTO.class
                )
        ).thenReturn(user);

        BlogDetailsDTO returned = service.getBlogById(1);

        Assertions.assertEquals(returned.getBlogId(), blog.getBlogId());
    }
}