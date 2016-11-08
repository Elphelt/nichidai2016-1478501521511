package net.mybluemix.servlet;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class GreetingController {

    @MessageMapping("/hello") // エンドポイントの指定
    @SendTo("/topic/greetings") // メッセージの宛先を指定
    public Greeting greeting(Message message) {
        return new Greeting("Hello, " + message.getName() + "!");
    }

}