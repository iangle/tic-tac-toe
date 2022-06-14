# Background
I created this project for my final project in CSCD 467, which is a cloud computing class. The frontend is made in React and the backend was created and hosted in the AWS cloud. The entire app is made with a serverless architecture. I used the following AWS services to create the backend:

<ul>
  <li>API Gateway</li>
  <li>Lambda (with Python 3.9)</li>
  <li>Cognito</li>
  <li>SNS (for sending text messages)</li>
  <li>DynamoDB</li>
</ul> 

# Architecture
Below is a diagram of the architecure that I used for this project
![](/images/architecture_diagram.jpg)
I have included a list of steps that detail how a user will interact with this diagram as they play a game of Tic Tac Toe.
1. A user will connect to the app via the React web app
2. The user will then sign in or create a user
3. The user will now get a confirmation code and be asked to enter it into the app
3. The user will now be able to create or join a game
4. If the user creates a game they need to enter the username of their opponent.
5. If the user chooses to join a game they need to enter the game id that was sent to them as a text message from someone who created a game
6. Now the user can play a game
7. The user needs to refresh the page everytime the opposing player makes a move
8. The player who loses will recieve a text telling them that their opponent has won
# Build the App
## To build the frontend
1. open a terminal window in the frontend folder
2. type in "npm start"
3. the server will be available at localhost:3000/

## The backend
The backend cannot be run currently unless the enviroment is pushed to an aws enviroment and then setup from there. I plan on adding that ability to build this project from any computer in the future.

## Play the game
If you want to check out the app go to the following URL: https://tictactoeaws.herokuapp.com/

Thank you for checking out my project, feel free to use any of the code in the repository for your own projects.
