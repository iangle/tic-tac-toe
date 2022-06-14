import json
import boto3
import os
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


#confirm the phone number of the user with the given username
#needs a confirmation code from the phone and a client
def confirmSignUp(username, confirmation_code, challenge_name, session, client):
    
    try:
        response = client.respond_to_auth_challenge(
            ClientId = os.environ.get("CLIENT_ID"),
            ChallengeName = challenge_name,
            ChallengeResponses = 
                {
                    "SECRET_HASH": createSecretHash(username),
                    "SMS_MFA_CODE": confirmation_code,
                    "USERNAME": username
                },
            Session = session
        )
    except Exception as e:
        return str(e), False
        
    
    print (response)
    
    return response, True
    
    
def lambda_handler(event, context):
    
    client = boto3.client('cognito-idp')
    
    #check for errors when getting the data from the body
    try:
        request_payload = json.loads(event["body"])
        username = request_payload["username"]
        confirmation_code = request_payload["confirmationCode"]
        challenge_name = request_payload["challengeName"]
        session = request_payload["session"]
    except KeyError:
        return {
            "statusCode": 400,
            "headers": HEADERS,
            "body": json.dumps({"message": "No Request payload or username is incorrect"}),
        }
        
    
    #get the response from the function
    function_response = confirmSignUp(username, confirmation_code, challenge_name, session, client)
    
    response = function_response[0]
    confirmedPhoneNumber = function_response[1]
    
    #if there is an error return it along with a 400 status code
    if not confirmedPhoneNumber:
        return {
            'statusCode': 400,
            'headers': HEADERS,
            'body': json.dumps({'message': response})
        }
    
    else:
        return {
            'statusCode': 200,
            'headers': HEADERS,
            'body': json.dumps({'message': response})
        }
