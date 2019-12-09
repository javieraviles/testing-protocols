package es.codeurjc.mastercloudapps.amqp;

public class TaskModel {
	private String id;
	private String text;
	private int progress;
	private Boolean completed;
	private String result;

	public TaskModel() {
		super();
	}
	public TaskModel(String id, String text) {
		super();
		this.id = id;
		this.text = text;
		this.progress = 0;
		this.completed = false;
		this.result = null;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public int getProgress() {
		return progress;
	}

	public void setProgress(int progress) {
		this.progress = progress;
	}

	public Boolean getCompleted() {
		return completed;
	}

	public void setCompleted(Boolean completed) {
		this.completed = completed;
	}

	public String getResult() {
		return result;
	}

	public void setResult(String result) {
		this.result = result;
	}
}
