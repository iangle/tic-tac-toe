import json
import boto3
import os
import random

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["TABLE_NAME"])

HEADERS = {
    "Access-Control-Allow-Origin": os.environ.get("ALLOWED_ORIGIN"),
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "OPTIONS,POST",
    "Access-Control-Allow-Credentials": True,
}


#creates a blank board that is composed of all N's
def createNewBoard():
    board_list = ["N","N","N",
                  "N","N","N",
                  "N","N","N"]
    
    return board_list
    
    
#creates a new game and stores it into the database
#the parameter is the body of the payload from the user
def createGame(request_payload):
    
    #messages sent back to the user
    keyErrorMessage = 'could not retrieve either user1 or user 2'
    genericError = 'an error occured when trying to create the item in the database'
    
    #the gameId, it is a hash code
    randomNumber = random.randrange(100000, 100000000)
    randomNumberString = str(randomNumber)
    
    
    #get the users and who made the last move
    try:
        user1 = request_payload['user1']
        user2 = request_payload['user2']
        last_move_by = request_payload['lastMoveBy']
    except KeyError:
        return keyErrorMessage, False

    #put all the information into the table
    try:
        table.put_item(
            Item = {
                'gameId': randomNumberString,
                'user1': user1,
                'user2': user2,
                'board': createNewBoard(),
                'lastMoveBy': last_move_by,
                'userWon': 'False'
            }
        )
    except Exception as e:
        return str(e), False
        
    
    try:
        client = boto3.client('cognito-idp')
        user_description = client.list_users(
            UserPoolId = os.environ.get('USER_POOL_ID'),
            AttributesToGet = [
                "phone_number"
            ],
            Filter = "username = \"{}\"".format(user2)
        )
    except Exception as e:
        return str(e), False
        
    #get the opponents phone number    
    phone_number = user_description['Users'][0]['Attributes'][0]['Value']
        
    #send the opponent a message telling them to join the game
    try:
        sns_client = boto3.client('sns')
        sns_client.publish(
            PhoneNumber = phone_number,
            Message = "{} has invited you to join a game! to join the game go to the following website: https://tictactoeaws.herokuapp.com/ sign up or login and enter the following code when you are prompted to. Code: {}".format(user1, randomNumber)
        )
    except Exception as e:
        return str(e), False
        
    
    #return the gameId and true if we created the database item    
    return randomNumberString, True
    
    
def lambda_handler(event, context):
    
    #get the payload
    try:
        request_payload = json.loads(event["body"])
    except KeyError:
        return {
            "statusCode": 400,
            "headers": HEADERS,
            "body": json.dumps({"message": "No Request payload"}),
        }
        
    #recieve the functions response    
    function_response = createGame(request_payload)
    
    #retrieve the message response and whether or not the game was successfully created
    response = function_response[0]
    succussfullyCreatedGame = function_response[1]
    
    #check for a successful creation of a game in the database
    if not succussfullyCreatedGame:
        return {
            'statusCode': 400,
            'headers': HEADERS,
            'body': json.dumps({'message': response})
        }
        
    else:
        return {
            'statusCode': 200,
            'headers': HEADERS,
            'body': json.dumps({'gameId': response})
        }
