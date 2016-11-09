package net.mybluemix.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import net.mybluemix.model.Greeting;
import net.mybluemix.model.Message;

@Controller
public class GreetingController {

    @MessageMapping("/hello") // エンドポイントの指定
    @SendTo("/topic/greetings") // メッセージの宛先を指定
    public Greeting greeting(Message message) {
        return new Greeting(message.getName());
    }

}