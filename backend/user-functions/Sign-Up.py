import json
import os
import boto3
import botocore
import hmac, hashlib, base64


#headers for the return statement
HEADERS = {
    "Access-Control-Allow-Origin": os.environ.get("ALLOWED_ORIGIN"),
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,POST",
    "Access-Control-Allow-Credentials": True,
}

#creates a secret hash to be used when creating the user
#the specifications for how to do this are from AWS documentation
#https://aws.amazon.com/premiumsupport/knowledge-center/cognito-unable-to-verify-secret-hash/
def createSecretHash(username):
    app_client_id = os.environ.get("CLIENT_ID")
    message = bytes(username + app_client_id,'utf-8')
    key = bytes(os.environ.get("SECRET_KEY"),'utf-8')
    secret_hash = base64.b64encode(hmac.new(key, message, digestmod=hashlib.sha256).digest()).decode()
    return secret_hash


#adds a user to the cognito userpool.
#returns a boolean of whether the action was successful or not
#returns a string that contains an error message or the response from the server
def addUser(request_payload, client):
    
    keyError = "Sorry, could not get username or password from payload, please try again"
    username_exception = "The user you are trying to create already exists!"
    unexpected_error = "an error occurred"
    success_string = "successfully registered user"
    
    clientId = os.environ.get("CLIENT_ID")
    
    try:
        username = request_payload["username"]
        password = request_payload["password"]
        email = request_payload["email"]
        phone_number = request_payload["phoneNumber"]
        
        #check for insecure passwords
        if len(password) < 5:
            return False, "the password **" + password +  "** is too short, should be at least 5 characters long"
        
        #register a user with the given username, password, email and phone number
        response = client.sign_up(
            ClientId = clientId,
            SecretHash = createSecretHash(username),
            Username = username,
            Password = password,
            UserAttributes=[
                {
                    'Name': 'email',
                    'Value': email
                },
                {
                    'Name': 'phone_number',
                    'Value': phone_number
                },
            ]
        )
        
    except KeyError:
        return False, keyError
    except botocore.exceptions.ClientError as e:
        if e.response['Error']['Code'] == 'UsernameExistsException':
            return False, username_exception
        else:
            return False, str(e)
        
    
    return True, response



def lambda_handler(event, context):
    
    client = boto3.client('cognito-idp')
    
    try:
        request_payload = json.loads(event["body"])
    except KeyError:
        return {
            "statusCode": 400,
            "headers": HEADERS,
            "body": json.dumps({"message": "No Request payload"}),
        }
    
    response = addUser(request_payload, client)
    
    signUp_successful = response[0]
    function_response = response[1]
    
    if signUp_successful:
        
        return{
            "statusCode": 200,
            "headers": HEADERS,
            "body": json.dumps({"message": function_response}),
        }
        
    else:    
        
        return {
            "statusCode": 400,
            "headers": HEADERS,
            "body": json.dumps({"message": function_response}),
        }


