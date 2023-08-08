const bcrypt = require('bcryptjs');
const axios = require('axios');

exports.handler = async (event, context) => {
    try {
       
        const value = event.value;
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedValue = await bcrypt.hash(value, salt);

        // Construct response JSON
        const response = {
            "banner": "B00917151",
            "result": hashedValue,
            "arn": "arn:aws:lambda:us-east-1:283622577067:function:Lambda-bcrypt",
            "action": "bcrypt",
            "value": value
        };
        console.log("before sending respone...")
        // Send the response to the client's app
        const courseUri = event.course_uri;
        console.log("before sending response to client")
        console.log(response);
        await sendResponseToClient(courseUri, response);

        return {
            "statusCode": 200,
            "body": JSON.stringify("Hashing operation completed.")
        };
    } catch (e) {
        return {
            "statusCode": 500,
            "body": JSON.stringify("Error during Bcrypt hashing.")
        };
    }
};

async function sendResponseToClient(courseUri, response) {
    try {
        console.log("in sendresponse api")
        const headers = { 'Content-Type': 'application/json' };
        const responseJson = JSON.stringify(response);
        await axios.post(courseUri, responseJson, { headers });
        return true;
    } catch (e) {
        console.error(`Error sending response to the client: ${e.message}`);
        return false;
    }
}
