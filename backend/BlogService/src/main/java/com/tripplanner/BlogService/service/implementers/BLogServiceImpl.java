package com.tripplanner.BlogService.service.implementers;

import com.tripplanner.BlogService.config.RestTemplateClient;
import com.tripplanner.BlogService.dto.request.BlogDetailsDTO;
import com.tripplanner.BlogService.dto.response.BlogGeneralDTO;
import com.tripplanner.BlogService.dto.response.UserDetailResponseDTO;
import com.tripplanner.BlogService.entity.Blog;
import com.tripplanner.BlogService.repository.BlogRepository;
import com.tripplanner.BlogService.service.interfaces.BlogService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BLogServiceImpl implements BlogService {
    @Autowired
    private DiscoveryClient discoveryClient;
    @Autowired
    BlogRepository blogRepository;
    @Autowired
    RestTemplateClient restTemplateClient;
    @Override
    public BlogDetailsDTO getBlogById(int id) {
        Blog blog = blogRepository.findById(id).get();
        if(blog==null)
         return null;
        BlogDetailsDTO blogDetailsDTO = new BlogDetailsDTO() ;
        blogDetailsDTO.setBlogId(id);
        blogDetailsDTO.setStatus(blog.getStatus());
        blogDetailsDTO.setUserId(blog.getUser());
        blogDetailsDTO.setContent(blog.getContent());
        blogDetailsDTO.setThumbnail(blog.getThumbnail());
        blogDetailsDTO.setTitle(blog.getTitle());
        List<ServiceInstance> instances = discoveryClient.getInstances("user-service");
        ServiceInstance instance = instances.get(0);
        UserDetailResponseDTO user = restTemplateClient.restTemplate().getForObject(instance.getUri()+"/user/api/user/findById/"+blog.getUser(), UserDetailResponseDTO.class);
        blogDetailsDTO.setAvatar(user.getAvatar());
        blogDetailsDTO.setUsername(user.getName());
        return  blogDetailsDTO;
    }

    @Override
    public List<Blog> getBlogByKeyWord(String keyword) {

            return  blogRepository.getBlogsByKeyword(keyword);

    }
    public List<BlogGeneralDTO> getLatestBlogs(){
        ArrayList<Blog> blogs = blogRepository.getLatestBlogs();
        List<BlogGeneralDTO> blogGeneralDTOS = blogs.stream().map(blog -> {
            BlogGeneralDTO dto = new BlogGeneralDTO();
            dto.setBlogId(blog.getBlogId());
            dto.setDateModified(blog.getDateModified());
            dto.setDateCreated(blog.getDateCreated());
            dto.setTitle(blog.getTitle());
            dto.setStatus(blog.getStatus());
            dto.setThumbnail(blog.getThumbnail());
            return dto;
        }).collect(Collectors.toList());
        return blogGeneralDTOS;
    }
}
