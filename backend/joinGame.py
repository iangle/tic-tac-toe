import json
import os
import boto3

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["TABLE_NAME"])

HEADERS = {
    "Access-Control-Allow-Origin": os.environ.get("ALLOWED_ORIGIN"),
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,POST",
    "Access-Control-Allow-Credentials": True,
}

def joinGame(gameId):
    
    try:
        table.


def lambda_handler(event, context):
    
    #get the payload
    try:
        request_payload = json.loads(event["body"])
        gameId = request_payload['gameId']
    except KeyError:
        return {
            "statusCode": 400,
            "headers": HEADERS,
            "body": json.dumps({"message": "No GameId found in the request"}),
        }
    
    
    
    
    return {
        'statusCode': 200,
        'headers': HEADERS,
        'body': json.dumps({'message': 'hello!'})
    }
