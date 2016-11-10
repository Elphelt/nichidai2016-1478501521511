package net.mybluemix.model;

public class Message {
    private String name;
    private String choice;
    
    public String getChoice() {
		return choice;
	}
	public void setChoice(String choice) {
		this.choice = choice;
	}
	public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
}