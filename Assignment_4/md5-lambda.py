import hashlib
import json
import requests

def lambda_handler(event, context):
    try:
        
        value = event['value']
        hashed_value = hashlib.md5(value.encode('utf-8')).hexdigest()

        # Construct response JSON
        response = {
            "banner": "B00917151",
            "result": hashed_value,
            "arn": "arn:aws:lambda:us-east-1:283622577067:function:Lambda-md5",
            "action": "md5",
            "value": value
        }

        # Send the response to the client's app
        course_uri = event["course_uri"]
        send_response_to_client(course_uri, response)

        return {
            "statusCode": 200,
            "body": json.dumps("Hashing operation completed.")
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps("Error during MD5 hashing.")
        }

def send_response_to_client(course_uri, response):
    try:
        headers = {'Content-Type': 'application/json'}
        response_json = json.dumps(response)
        response = requests.post(course_uri, data=response_json, headers=headers)
        response.raise_for_status()  # Check for any HTTP error
        return True
    except requests.exceptions.RequestException as e:
        print(f"Error sending response to the client: {e}")
        return False

