package es.codeurjc.mastercloudapps.grpc.server;

import es.codeurjc.mastercloudapps.grpc.TaskRequest;
import es.codeurjc.mastercloudapps.grpc.TaskResponse;
import es.codeurjc.mastercloudapps.grpc.TaskServiceGrpc;
import io.grpc.stub.StreamObserver;

import net.devh.boot.grpc.server.service.GrpcService;

@GrpcService
public class TaskService extends TaskServiceGrpc.TaskServiceImplBase {

    @Override
    public void toUpperCase(TaskRequest request, 
    		StreamObserver<TaskResponse> responseObserver) {
    	
        System.out.println("Request received from client:\n" + request);


        TaskResponse response = TaskResponse.newBuilder()
            .setResult(request.getText().toUpperCase())
            .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }
}
