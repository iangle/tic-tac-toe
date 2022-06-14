import json
import boto3
import os
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


#complete the SMS_MFA challenge with the given parameters
def completeChallenge(username, session, sms_code, client):
    
    try:
        response = client.respond_to_auth_challenge(
            ClientId = os.environ.get("CLIENT_ID"),
            ChallengeName = "SMS_MFA",
            Session = session,
            ChallengeResponses = {
                "USERNAME": username,
                "SECRET_HASH": createSecretHash(username),
                "SMS_MFA_CODE": sms_code
            }
        )
    except Exception as e:
        return str(e), False
        
    
    return response, True
    

def lambda_handler(event, context):
    
    client = boto3.client('cognito-idp')
    
    try:
        request_payload = json.loads(event["body"])
        username = request_payload["username"]
        session = request_payload["session"]
        sms_code = request_payload["smsCode"]
    except KeyError:
        return {
            "statusCode": 400,
            "headers": HEADERS,
            "body": json.dumps({"message": "No Request payload"}),
        }
        
    
    function_response = completeChallenge(username, session, sms_code, client)
    
    
    response = function_response[0]
    completedChallenge = function_response[1]
    
    if not completedChallenge:
        return {
            'statusCode': 400,
            'headers': HEADERS,
            'body': json.dumps({'error': response})
        }
        
    else:    
        return {
            'statusCode': 200,
            'headers': HEADERS,
            'body': json.dumps({'response': response})
        }
