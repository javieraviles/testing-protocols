package es.codeurjc.mastercloudapps.amqp;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import es.codeurjc.mastercloudapps.grpc.TaskRequest;
import es.codeurjc.mastercloudapps.grpc.TaskResponse;
import es.codeurjc.mastercloudapps.grpc.TaskServiceGrpc.TaskServiceBlockingStub;
import net.devh.boot.grpc.client.inject.GrpcClient;

@Component
public class Consumer {
	
	@GrpcClient("taskServer")
	private TaskServiceBlockingStub client;

	@Autowired
	RabbitTemplate rabbitTemplate;

	@RabbitListener(queues = "messages", ackMode = "AUTO")
	public void received(String message) {
		try {
			// task received from queue
			System.out.println("Task received from queue messages: " + message);
			ObjectMapper objectMapper = new ObjectMapper();
			TaskModel task = objectMapper.readValue(message, TaskModel.class);
			
			// call real GRPC server to carry out the task
			TaskRequest request = TaskRequest.newBuilder()
		            .setText(task.getText())
		            .build();
			TaskResponse responseFromGrpcServer = client.toUpperCase(request);
		    System.out.println("Response received from GRPC server:\n" + responseFromGrpcServer.getResult());
		    
		    // now emulate slow process
			for (int i = 0; i < 100; i++) {
				Thread.sleep(150);
				task.setProgress(i);
				task.setCompleted(false);
				rabbitTemplate.convertAndSend("tasksProgress", objectMapper.writeValueAsString(task));
				System.out.println("Task progress increased, sending update to queue tasksProgress: " + objectMapper.writeValueAsString(task));
			}
			Thread.sleep(150);
			task.setProgress(100);
			task.setCompleted(true);
			
			// task would now be completed, set result with grpc server output and send it to tasksProgess queue
			task.setResult(responseFromGrpcServer.getResult());
			rabbitTemplate.convertAndSend("tasksProgress", objectMapper.writeValueAsString(task));
			System.out.println("Task completed, sending to queue tasksProgress: " + objectMapper.writeValueAsString(task));
		} catch (InterruptedException | JsonProcessingException e) {
			System.out.println(e.getMessage());
		}

	}
}
