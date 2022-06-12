import {Routes, Route, useNavigate} from 'react-router-dom';
import ConfirmationCode from './components/ConfirmationCode/ConfirmationCode';
import CreateGame from './components/CreateGame/CreateGame';
import JoinGame from './components/JoinGame/JoinGame';
import Game from './components/Game/Game';
import SignIn from './components/Login/Signin';
import SignUp from './components/Register/Signup';
import UserChoice from './components/UserChoice/UserChoice';

function App() {

  const navigate = useNavigate();

  const goToGamePage = () => {
    navigate('/game');
  }

  const goToConfirmationPage = () => {
    navigate('/confirm');
}

const goToUserChoicePage = () => {
  navigate('/userchoice');
}

  const registerUser = async(username, password, email, phoneNumber) => {
    const response = await fetch('https://8yhohsoyql.execute-api.us-east-1.amazonaws.com/prod/register', {
      headers: {'Content-Type': 'application/json'},
      method: 'POST',
      body: JSON.stringify({username, password, email, phoneNumber})
    }).then(response => {

      console.log(response);

      if(response.status !== 200){
        console.log("an error occured")
        alert('sorry, that user already exists!')
      }else{
        console.log("successfully retrieved payload");
        alert('Thank you for registering: ' + username);
        signIn(username, password);
        goToConfirmationPage();
      }

      return response;
    }).catch(error => {console.log('error: ' + error)})

    const body = await response.json();

    console.log(body);
  }

  const signIn = async(username, password) => {
    const response = await fetch('https://8yhohsoyql.execute-api.us-east-1.amazonaws.com/prod/signin', {
      headers: {'Content-Type': 'application/json'},
      method: 'POST',
      body: JSON.stringify({username, password})
    }).then(response => {

      console.log(response);

      if(response.status !== 200){
        console.log("an error occured")
        alert('sorry, an error occured when trying to sign you in, please try again')
      }else{
        console.log("successfully retrieved payload");
        alert('Please check your phone for a confirmation code');
        localStorage.setItem("username", JSON.stringify(username));
        goToConfirmationPage();
      }

      return response;
    }).catch(error => {console.log('error: ' + error)})

    const body = await response.json();

    const session = body["session"];
    const challengeName = body["challenge"];

    localStorage.setItem("session", JSON.stringify(session));
    localStorage.setItem("challengeName", JSON.stringify(challengeName));

    console.log(body);
  }
  
  const confirmCode = async(username, confirmationCode, session, challengeName) => {
    const response = await fetch('https://8yhohsoyql.execute-api.us-east-1.amazonaws.com/prod/confirm-phone-number', {
      headers: {'Content-Type': 'application/json'},
      method: 'POST',
      body: JSON.stringify({username, confirmationCode, session, challengeName})
    }).then(response => {

      console.log(response);

      if(response.status !== 200){
        console.log("an error occured")
        alert('sorry, an error occured when trying to sign you in, please try again')
      }else{
        console.log("successfully retrieved payload");
        alert('Thank you for confirming!');
        goToUserChoicePage();
      }

      return response;
    }).catch(error => {console.log('error: ' + error)})

    const body = await response.json();

    console.log(body['message']['AuthenticationResult']['IdToken']);

    localStorage.setItem("idToken", JSON.stringify(body['message']['AuthenticationResult']['IdToken']));
  }

  // ********** needs to be fixed!!!! ****************
  const resendCode = async(username) => {
    const response = await fetch('https://8yhohsoyql.execute-api.us-east-1.amazonaws.com/prod/resend-confirmation-code', {
      headers: {'Content-Type': 'application/json'},
      method: 'POST',
      body: JSON.stringify({username})
    }).then(response => {

      console.log(response);

      if(response.status !== 200){
        console.log("an error occured")
        alert('sorry, an error occured when trying to sign you in, please try again')
      }else{
        console.log("successfully retrieved payload");
        alert('resent confirmation code');
      }

      return response;
    }).catch(error => {console.log('error: ' + error)})

    const body = await response.json();

    console.log(body);
  }

  const create_game = async(user1, user2, lastMoveBy, idToken) => {
    var body = await fetch('https://7w5za22zsb.execute-api.us-east-1.amazonaws.com/prod/creategame', {
      headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + idToken},
      method: 'POST',
      body: JSON.stringify({user1, user2, lastMoveBy})
    }).then(response => {

      console.log(response);

      if(response.status !== 200){
        console.log("an error occured")
        alert('sorry, an error occured when trying to create the game, please try again')
      }else{
        console.log("successfully retrieved payload");
        alert('successfully create game');
      }

      return response;
    }).catch(error => {console.log('error: ' + error)})

    var response_body = await body.json();

    localStorage.setItem('gameId', JSON.stringify(response_body['gameId']));
    localStorage.setItem('opponentUsername', JSON.stringify(user2));

    goToGamePage();
  }

  return (
    <Routes>
      <Route path="/signup" element={ <SignUp registerUser={registerUser} /> } />
      <Route path="/game" element={ <Game /> } />
      <Route path="/" element={ <SignIn signIn = {signIn}/> } />
      <Route path="/confirm" element={ <ConfirmationCode confirmCode={confirmCode} resendCode={resendCode} /> } />
      <Route path="/userchoice" element={ <UserChoice /> } />
      <Route path="creategame" element={ <CreateGame create_game={create_game} /> } />
      <Route path="joingame" element={ <JoinGame /> } />
    </Routes>
  );
}

export default App;
