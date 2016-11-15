package net.mybluemix.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import net.mybluemix.model.Choice;
import net.mybluemix.model.FlickPlayer;
import net.mybluemix.model.Greeting;
import net.mybluemix.model.Message;


@Controller
public class GreetingController {

	@Autowired
	private SimpMessagingTemplate simpmessage;

	private Integer rank=0;

	@MessageMapping("/choice") // エンドポイントの指定
	@SendTo("/topic/admin") // メッセージの宛先を指定
	public Choice setChoice(Choice choice) {
		return choice;
	}

	@MessageMapping("/reset") // エンドポイントの指定
	public void resetRank() {
		rank=0;
		return;
	}

	@MessageMapping("/flick") // エンドポイントの指定
	@SendToUser // メッセージの宛先を指定
	public Greeting backResult(FlickPlayer flick) {
		rank++;
		flick.setRank(rank);
		simpmessage.convertAndSend("/topic/result", flick);
		return new Greeting(rank.toString());
	}
	
	
	@MessageMapping("/question") // エンドポイントの指定
	@SendTo("/topic/greetings") // メッセージの宛先を指定
	public Greeting setQuestion(Message message) {
		return new Greeting(message.getQuestion());
	}
	
	
}