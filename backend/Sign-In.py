import json
import os
import boto3
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
    
    

#this function gets a response from the cognito servers using the username
#and password that is given. The function returns the response or an error message and a boolean
#that allows the program to distinuish between the two.
def get_user_jwt_token(client, request_payload):
    
    key_error_string = 'could not retrieve username or password from the body'
    generic_error_message = 'an error occured when trying to get the authentication for the given username and password'
    
    try:
        username = request_payload['username']
        password = request_payload['password']
    except KeyError:
        return key_error_string, False
        
    try:
        response = client.initiate_auth(
            ClientId = os.environ.get("CLIENT_ID"),
            AuthFlow = 'USER_PASSWORD_AUTH',
           AuthParameters = {
                'USERNAME': username,
                'PASSWORD': password,
                'SECRET_HASH': createSecretHash(username)
            }
        )
        
    except Exception as e:
        return str(e), False
        
        
    return response, True


def lambda_handler(event, context):
    
    client = boto3.client('cognito-idp')
    
    #check for errors when getting the data from the body
    try:
        request_payload = json.loads(event["body"])
    except KeyError:
        return {
            "statusCode": 400,
            "headers": HEADERS,
            "body": json.dumps({"message": "No Request payload"}),
        }
    

    response = get_user_jwt_token(client, request_payload)
    
    function_response = response[0]
    received_token = response[1]
    
    #check for an error occuring in the function
    if not received_token:
        return {
            'statusCode': 400,
            'headers': HEADERS,
            'body': json.dumps({'error': function_response}),
    }
    
    #get the token from the response
    challenge = function_response["ChallengeName"]
    session = function_response["Session"]
    
    #return all relevant data
    return {
        'statusCode': 200,
        'headers': HEADERS,
        'body': json.dumps({'challenge': challenge, 'session': session}),
    }
