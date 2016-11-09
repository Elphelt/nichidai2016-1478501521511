package net.mybluemix;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;
/**
 * 起動クラスです。
 */
@SpringBootApplication  // same as @Configuration @EnableAutoConfiguration @ComponentScan
public class SimpleServlet extends SpringBootServletInitializer {
    /**
     * 処理を実行します。
     * @param args 引数
     * @throws Exception 例外が発生した場合
     */
    public static void main(String[] args) throws Exception {
        SpringApplication.run(SimpleServlet.class, args);
    }
    
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(SimpleServlet.class);
    }
}