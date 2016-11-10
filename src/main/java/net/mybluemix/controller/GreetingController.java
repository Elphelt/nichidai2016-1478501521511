package net.mybluemix.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;

import net.mybluemix.model.Greeting;
import net.mybluemix.model.Message;

@Controller
public class GreetingController {

	@Autowired
	private SimpMessagingTemplate simpmessage;

	@SubscribeMapping("/choice")
	public void sendChoice(String choice) {
		simpmessage.convertAndSend("/topic/admin", choice);
	}

	@MessageMapping("/question") // エンドポイントの指定
	@SendTo("/topic/greetings") // メッセージの宛先を指定
	public Greeting setQuestion(Message message) {
		return new Greeting(message.getQuestion());
	}
	
	
}