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
    "Access-Control-Allow-Methods": "OPTIONS,PUT",
    "Access-Control-Allow-Credentials": True,
}

#this function defines whether or not a player has won yet
def userWon(board, player1, player2):
    
    #the token placments that constitute a win in tic tac toe
    win_conditions = ["0,4,8","2,4,6","0,1,2","3,4,5","6,7,8","0,3,6","1,4,7","2,5,8"]
    
    #walk through each set of conditions
    for condition in win_conditions:
        
        #split the conditions into 3 different numbers and instantiate out point values
        condition = condition.split(",")
        player1_points = 0
        player2_points = 0
        
        #for each number in the condition we split, see which user has tokens on the board
        for number in condition:
            
            if board[int(number)] == 'O':
                player1_points = player1_points + 1
            
            if board[int(number)] == 'X':
                player2_points = player2_points + 1
                
            if player1_points == 3:
                return player1, True
            
            if player2_points == 3:
                return player2, True
    
    #return false if there is no winner
    return "no winner yet", False;
        

#this function writes the given parameters to the TicTacToeBoards database
def writeToDatabase(gameId, board, user1, user2, lastMoveBy, userWon):
    
    #put all the information into the table
    try:
        table.put_item(
            Item = {
                'gameId': gameId,
                'user1': user1,
                'user2': user2,
                'board': board,
                'lastMoveBy': lastMoveBy,
                'userWon': userWon
            }
        )
    except Exception as e:
        return str(e), False
        
    #return true if we successfully wrote the items to the database    
    return "successful", True    
        

#updates the board in the database with the players move we are given
#calls the writeToDatabase function to write the results back to the database
def update_board(request_payload, gameId):
    
    #get the players intended move and the name of the player making the move
    try:
        player_move = int(request_payload['playerAction'])
        current_player = request_payload['currentPlayer']
    except Exception as e:
        return str(e), False
    
    
    #get the table from the database the corresponds with the current game
    try:
        response = table.query(KeyConditionExpression=Key('gameId').eq(gameId))
    except Exception as e:
        return str(e), False
        
        
    #get all of the relevant items from the table we received
    item = response.get('Items')
    board = item[0]['board']
    player1 = item[0]['user1']
    player2 = item[0]['user2']
    lastMoveBy = item[0]['lastMoveBy']
    userWonBoolean = item[0]['userWon']
    
    #if the current player also made the last move then we return false
    if lastMoveBy == current_player:
        return "You have already made your move, please wait for the opposing player", False
    
    #change the value of the board to show the updated move
    try:
        #check for an invalid move
        if board[player_move] == 'N':
        
            if current_player == player1:
                    board[player_move] = 'O'

            if current_player == player2:
                board[player_move] = 'X'
            
            if current_player != player1 and current_player != player2:
                return "The given user is not a part of the game!", False
                
        else:
            return "that is not a valid move!", False
            
    except Exception as e:    
        return str(e), False
        
        
    if current_player == player2:
        playerToMessage = player1
    else:
        playerToMessage = player2
        
    try:
        client = boto3.client('cognito-idp')
        user_description = client.list_users(
            UserPoolId = os.environ.get('USER_POOL_ID'),
            AttributesToGet = [
                "phone_number"
            ],
            Filter = "username = \"{}\"".format(playerToMessage)
        )
    except Exception as e:
        return str(e), False
        
    
    user_won = userWon(board, player1, player2)
    
    player_who_won = user_won[0]
    winner_declared = user_won[1]
        
        
    #get the opponents phone number    
    phone_number = user_description['Users'][0]['Attributes'][0]['Value']
        
    #update who made the last move
    lastMoveBy = current_player
    
    if userWonBoolean == 'True':
        return 'a user already won the game!', False
        
    #get the response from writing to the database
    if winner_declared:
        function_response = writeToDatabase(gameId, board, player1, player2, lastMoveBy, 'True')
    else:
        function_response = writeToDatabase(gameId, board, player1, player2, lastMoveBy, 'False')
        

        
    
    response = function_response[0]
    successfullyWroteToDatabase = function_response[1]
    
    #send the opponent a message telling them to join the game
    try:
        sns_client = boto3.client('sns')
        sns_client.publish(
            PhoneNumber = phone_number,
            Message = "{} just made his move in your game! Make sure to refresh the game and then make your move!".format(current_player)
        )
    except Exception as e:
        return str(e), False
    
    
    if winner_declared:
        #send the opponent a message telling them to join the game
        try:
            sns_client = boto3.client('sns')
            sns_client.publish(
                PhoneNumber = phone_number,
                Message = "{} just won the game! Thank you for playing!".format(current_player)
            )
        except Exception as e:
            return str(e), False
            
        return player_who_won + " won the game!", True
    
    #if we successfully wrote to the database return true
    if successfullyWroteToDatabase:
        return response, True
    else:
        return response, False
        
    
    
def lambda_handler(event, context):
    
    #get the payload from the request
    try:
        request_payload = json.loads(event['body'])
    except KeyError:
        return {
            'statusCode': 400,
            'headers': HEADERS,
            'body': json.dumps({'message': 'No Request payload'}),
        }
        
    #get the gameId of the game we are fetching
    try:
        gameId = event["pathParameters"]["gameId"]
    except Exception as e:
        return{
            'statusCode': 400,
            'headers': HEADERS,
            'body': json.dumps({'message': str(e)})
        }
    
    #get the functions response, the error message and whether or not it was successful
    function_response = update_board(request_payload, gameId)
    
    response = function_response[0]
    successfullyUpdatedBoard = function_response[1]
    
    #if successful return 200 code, if an error occured return the error and 400 code
    if not successfullyUpdatedBoard:
        return {
            'statusCode': 400,
            'headers': HEADERS,
            'body': json.dumps({'message': response}),
        }
        
    else:    
        return {
            'statusCode': 200,
            'headers': HEADERS,
            'body': json.dumps({'message': response})
        }
