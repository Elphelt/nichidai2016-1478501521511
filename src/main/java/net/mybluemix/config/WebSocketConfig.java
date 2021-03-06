package net.mybluemix.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.AbstractWebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;

@EnableWebSocketMessageBroker // WebSocketのメッセージブローカーのBean定義を有効化する
@Configuration
public class WebSocketConfig extends AbstractWebSocketMessageBrokerConfigurer { // AbstractWebSocketMessageBrokerConfigurerを継承しWebSocket関連のBean定義をカスタマイズする

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
//        registry.addEndpoint("/hello").setAllowedOrigins("*").withSockJS().setClientLibraryUrl("//cdnjs.cloudflare.com/ajax/libs/sockjs-client/1.1.1/sockjs.js"); // WebSocketのエンドポイント (接続時に指定するエンドポイント)を指定
    	registry.addEndpoint("/hello").withSockJS().setClientLibraryUrl("//cdnjs.cloudflare.com/ajax/libs/sockjs-client/1.1.1/sockjs.js").setWebSocketEnabled(true);
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/app"); // アプリケーション(Controller)でハンドリングするエンドポイントのプレフィックス
        registry.enableSimpleBroker("/topic", "/queue"); // Topic(Pub-Sub)とQueue(P2P)を有効化 >>> メッセージブローカーがハンドリングする
        registry.setUserDestinationPrefix("/user");
    }

}