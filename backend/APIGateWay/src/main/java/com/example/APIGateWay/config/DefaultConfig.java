package com.example.APIGateWay.config;

import org.springframework.context.annotation.Configuration;

@Configuration
public class DefaultConfig {

//    @Value("${spring.gateway.excludedURLsNew}")
//    private String urlsStrings;
//
//    @Bean
//    @Qualifier("excludedUrls")
//    public List<String> excludedUrls() {
//        return Arrays.stream(urlsStrings.split(",")).collect(Collectors.toList());
//    }
//
//    @Bean
//    public ObjectMapper objectMapper() {
//        JsonFactory factory = new JsonFactory();
//        factory.configure(JsonGenerator.Feature.IGNORE_UNKNOWN, true);
//
//        ObjectMapper objectMapper = new ObjectMapper(factory);
//        objectMapper.configure(DeserializationFeature.FAIL_ON_IGNORED_PROPERTIES, false);
//        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
//        objectMapper.configure(DeserializationFeature.UNWRAP_ROOT_VALUE, true);
//        objectMapper.setDateFormat(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"));
//
//        return objectMapper;
//    }
//
//
//    @Bean
//    public RouteLocator routes(
//            RouteLocatorBuilder builder,
//            AuthenticationPrefilter authFilter) {
//        return builder.routes()
//                .route("auth-service-route", r -> r.path("/authentication-service/**")
//                        .filters(f ->
//                                f.rewritePath("/authentication-service(?<segment>/?.*)", "$\\{segment}")
//                                        .filter(authFilter.apply(
//                                                new AuthenticationPrefilter.Config())))
//                        .uri("lb://authentication-service"))
//                .route("user-service-route", r -> r.path("/user-service/**")
//                        .filters(f ->
//                                f.rewritePath("/user-service(?<segment>/?.*)", "$\\{segment}")
//                                        .filter(authFilter.apply(
//                                                new AuthenticationPrefilter.Config())))
//                        .uri("lb://user-service"))
//                .build();
//    }
}