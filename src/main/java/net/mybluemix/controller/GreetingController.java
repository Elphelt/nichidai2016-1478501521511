package net.mybluemix.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import net.mybluemix.model.Choice;
import net.mybluemix.model.Greeting;
import net.mybluemix.model.Message;


@Controller
public class GreetingController {

//	@Autowired
//	private SimpMessagingTemplate simpmessage;

//	@SubscribeMapping("/choiceYes")
//	public void sendChoiceYes(String choiceYes) {
//		simpmessage.convertAndSend("/topic/admin", choiceYes);
//	}
//
//	@SubscribeMapping("/choiceNo")
//	public void sendChoiceNo(String choiceNo) {
//		simpmessage.convertAndSend("/topic/admin", choiceNo);
//	}

	@MessageMapping("/choice") // エンドポイントの指定
	@SendTo("/topic/admin") // メッセージの宛先を指定
	public Choice setChoice(Choice choice) {
		return choice;
	}

	
	@MessageMapping("/question") // エンドポイントの指定
	@SendTo("/topic/greetings") // メッセージの宛先を指定
	public Greeting setQuestion(Message message) {
		return new Greeting(message.getQuestion());
	}
	
	
}