package net.mybluemix.model;

public class Greeting {
    private String content;
    private String qId;
    
    public Greeting(String content) {
        this.content = content;
    }

    public Greeting(String content, String qId) {
        this.content = content;
        this.qId = qId;
    }
    
    public String getContent() {
        return content;
    }
	public void setContent(String content) {
		this.content = content;
	}
	
	public String getqId() {
		return qId;
	}
	public void setqId(String qId) {
		this.qId = qId;
	}

}