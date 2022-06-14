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
    
#resends the confirmation code to the username given
#the user must be from the same client as the CLIENT_ID
def resendConfirmationCode(username, client):
    response = client.resend_confirmation_code(
        ClientId = os.environ.get("CLIENT_ID"),
        SecretHash = createSecretHash(username),
        Username = username
    )
    
    return response


def lambda_handler(event, context):
    
    client = boto3.client('cognito-idp')
    
    #check for errors when getting the data from the body
    try:
        request_payload = json.loads(event["body"])
        username = request_payload["username"]
    except KeyError:
        return {
            "statusCode": 400,
            "headers": HEADERS,
            "body": json.dumps({"message": "No Request payload or username is incorrect"}),
        }

        
    #try to resend the confirmation code    
    try:
        response = resendConfirmationCode(username, client)
        status_code = response['ResponseMetadata']['HTTPStatusCode']

        #check for an error occuring when trying to resend confirmation code
        if not status_code == 200:
            return {
                "statusCode": status_code,
                "headers": HEADERS,
                "body": json.dumps({"message": "there was an error when trying to resend the message to the user"}),
            }
            
    except Exception as e:
        return {
            "statusCode": 400,
            "headers": HEADERS,
            "body": json.dumps({"message": str(e)}),
        }
        

    #return a success message if we made it this far
    return {
        'statusCode': 200,
        'headers': HEADERS,
        'body': json.dumps({'message': 'successfully resent confirmation code'}),
    }
