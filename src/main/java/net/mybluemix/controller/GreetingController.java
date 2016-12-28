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
import net.mybluemix.model.Timer;

@Controller
public class GreetingController {

	@Autowired
	private SimpMessagingTemplate simpmessage;

	private Integer rank = 0;
	private Timer stopwatch = new Timer();
	private String randomUUIDString;
	private Integer connectCt = 0;
	private Message nowMessage;

	@MessageMapping("/choice") // エンドポイントの指定
	@SendTo("/topic/admin") // メッセージの宛先を指定
	public Choice setChoice(Choice choice) {
		if (choice.getqId().equals(randomUUIDString))
			return choice;
		else {
			choice.setChoiceNo(0);
			choice.setChoiceYes(0);
			return choice;
		}
	}

	@MessageMapping("/reset") // エンドポイントの指定
	public void resetRank() {
		rank = 0;
		nowMessage = new Message();
		return;
	}

	@MessageMapping("/flick") // エンドポイントの指定
	@SendToUser // メッセージの宛先を指定
	public Greeting backResult(FlickPlayer flick) {
		double buf = getRank();
		flick.setRank(rank);
		String numBuf = String.format("%.0f", buf / 1000) + "." + String.format("%.0f", buf % 1000);
		flick.setTime(numBuf);
		simpmessage.convertAndSend("/topic/result", flick);
		return new Greeting(rank.toString() + " Time(秒): " + numBuf);
	}

	public synchronized double getRank() {
		rank++;
		double buf = stopwatch.getTime();
		notifyAll();
		return buf;
	}

	@MessageMapping("/question") // エンドポイントの指定
	@SendTo("/topic/greetings") // メッセージの宛先を指定
	public Greeting setQuestion(Message message) {
		stopwatch.start();
		randomUUIDString = message.getqId();
		nowMessage = message;
		return new Greeting(message.getQuestion(), randomUUIDString);
	}

	@MessageMapping("/resetHb") // エンドポイントの指定
	@SendTo("/topic/clientHeartBeat")
	public Greeting resetHB() {
		simpmessage.convertAndSend("/topic/adminHb", connectCt);
		connectCt = 0;
		return new Greeting("");
	}

	@MessageMapping("/getq") // エンドポイントの指定
	@SendTo("/topic/greetings") // メッセージの宛先を指定
	public Greeting getQuestion() {
		randomUUIDString = nowMessage.getqId();
		return new Greeting(nowMessage.getQuestion(), randomUUIDString);
	}

	@MessageMapping("/heartBeat") // エンドポイントの指定
	public void setHB() {
		addCt();
	}

	public synchronized void addCt() {
		connectCt++;
		notifyAll();
	}
}