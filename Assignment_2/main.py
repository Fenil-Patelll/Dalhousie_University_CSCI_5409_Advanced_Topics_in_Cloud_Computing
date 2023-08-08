import grpc
from botocore.exceptions import NoCredentialsError

import computeandstorage_pb2
import computeandstorage_pb2_grpc
import boto3
from concurrent import futures


access_key = 'ASIAVF2E4BTJA262H65A'
secret_key = 'l1PMEYWukCyjg4bwVTdRCxnmlc78+2evqQHSkc87'
session_token = 'FwoGZXIvYXdzEH4aDBNCh4f9ZBnKaPzoMSLAAbYInnFRuAawfqv1vU+rOrGS32Z27MK3XmrlRJ9OtxopwVfFiY1iHjrjA/70++1dz29FaCibkOxX+UlGCEggxL20Lu7mRCKKb3UOft5vnIrqkxWZnaAHAGqQOQwkj7TYwT4A0tuYom+Gmld3rcWgjkdjfTavA9AYE82DzIl5AGrKA7a/HjStF6yAK32oxjifBDkhdFFDye6YhCXvFeeJ9hEx5XeFO4xvKrmwcfAd73pTNaxIZp4LXU8jznYEyTX9uyj2mZWkBjItUE6f1ZU2dMItc/J/XXzrUMYgsVM4WcpxD/x30XKZJNOjrBqCOaaxDPSFYDC6'
# gRPC server implementation
class EC2OperationsServicer(computeandstorage_pb2_grpc.EC2OperationsServicer):
    def StoreData(self, request, context):
        # Extract data from the request
        data = request.data
        print("in store data")
        # Store data in S3

        try:
            s3 = boto3.client('s3', aws_access_key_id=access_key, aws_secret_access_key=secret_key, aws_session_token=session_token)
            # Perform S3 operations using the s3 client
            response = s3.list_buckets()
            # ... additional S3 operations ...
        except:
            print("Unable to access AWS S3. Please check your credentials.")

        s3 = boto3.client('s3', aws_access_key_id=access_key, aws_secret_access_key=secret_key,
                          aws_session_token=session_token)
        response = s3.put_object(
            Bucket='a2-fenil',
            Key='file.txt',
            Body=data.encode('utf-8')
        )

        # Generate the publicly readable URL

        s3_url = "https://a2-fenil.s3.amazonaws.com/file.txt"

        # Return the response message
        return computeandstorage_pb2.StoreReply(s3uri=s3_url)

    def AppendData(self, request, context):
        # Extract data from the request
        data = request.data

        # Append data to the existing file in S3
        s3 = boto3.client('s3', aws_access_key_id=access_key, aws_secret_access_key=secret_key,
                          aws_session_token=session_token)

        response = s3.get_object(
            Bucket='a2-fenil',
            Key='file.txt'
        )
        current_data = response['Body'].read().decode('utf-8')
        updated_data = current_data + data

        s3.put_object(
            Bucket='a2-fenil',
            Key='file.txt',
            Body=updated_data.encode('utf-8')
        )

        return computeandstorage_pb2.AppendReply()

    def DeleteFile(self, request, context):
        # Extract the S3 URL from the request
        s3_url = request.s3uri

        # Delete the file from S3
        s3 = boto3.client('s3', aws_access_key_id=access_key, aws_secret_access_key=secret_key,
                          aws_session_token=session_token)
        response = s3.delete_object(
            Bucket='a2-fenil',
            Key='file.txt'
        )

        return computeandstorage_pb2.DeleteReply()

# Run the gRPC server
def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    computeandstorage_pb2_grpc.add_EC2OperationsServicer_to_server(EC2OperationsServicer(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    server.wait_for_termination()

if __name__ == '__main__':
    serve()
