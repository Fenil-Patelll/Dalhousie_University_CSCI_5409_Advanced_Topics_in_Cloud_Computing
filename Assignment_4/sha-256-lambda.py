import hashlib
import json
import requests

def lambda_handler(event, context):
    try:
        print("printing data")
        value = event['value']
        print("before the hashing")
        hashed_value = hashlib.sha256(value.encode('utf-8')).hexdigest()
        print("afer hashing")
        # Construct response JSON
        response = {
            "banner": "B00917151",
            "result": hashed_value,
            "arn": "arn:aws:lambda:us-east-1:283622577067:function:Lambda-sha256",
            "action": "sha256",
            "value": value
        }
        print("printing response...")
        print(response)
        
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
            "body": json.dumps("Error during SHA-256 hashing.")
        }

def send_response_to_client(course_uri, response):
    try:
        headers = {'Content-Type': 'application/json'}
        response_json = json.dumps(response)
        print(course_uri)
        print(response_json)
        response = requests.post(course_uri, data=response_json, headers=headers)
        response.raise_for_status()  # Check for any HTTP error
        return True
    except requests.exceptions.RequestException as e:
        print(f"Error sending response to the client: {e}")
        return False
