import json
import boto3
import os
from boto3.dynamodb.conditions import Key


dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["TABLE_NAME"])

#headers for the return function
HEADERS = {
    "Access-Control-Allow-Origin": os.environ.get("ALLOWED_ORIGIN"),
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "OPTIONS,GET",
    "Access-Control-Allow-Credentials": True,
}

#get the current game from the database with the given game Id
def get_current_game(gameId):
    
    try:
        response = table.query(KeyConditionExpression=Key('gameId').eq(gameId))
    except Exception as e:
        return str(e), False
        
    return response.get("Items"), True
    
    
def lambda_handler(event, context):
    
    #get the gameId of the game we are fetching
    try:
        gameId = event["pathParameters"]["gameId"]
    except Exception as e:
        return{
            'statusCode': 400,
            'headers': HEADERS,
            'body': json.dumps({'message': str(e)})
        }
        
        
    function_response = get_current_game(gameId)
    
    response = function_response[0]
    successfullyRetrievedItem = function_response[1]
    
    #check to see if the game was successfully received
    if not successfullyRetrievedItem:
        return{
            'statusCode': 400,
            'headers': HEADERS,
            'body': json.dumps({'message': response})
        }
    else:
        return {
            'statusCode': 200,
            'headers': HEADERS,
            'body': json.dumps({'Item': response})
        }
