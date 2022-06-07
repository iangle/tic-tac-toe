import {Routes, Route, useNavigate} from 'react-router-dom';
import ConfirmationCode from './components/ConfirmationCode/ConfirmationCode';
import Game from './components/Game/Game';
import SignIn from './components/Login/Signin';
import SignUp from './components/Register/Signup';

function App() {

  const navigate = useNavigate();

  const goToGamePage = () => {
    navigate('/game');
  }

  const goToConfirmationPage = () => {
    navigate('/confirm');
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
        goToConfirmationPage();
      }

      return response;
    }).catch(error => {console.log('error: ' + error)})

    const body = await response.json();

    console.log(body);
  }
  
  const confirmCode = async(username, confirmationCode) => {
    const response = await fetch('https://8yhohsoyql.execute-api.us-east-1.amazonaws.com/prod/signin', {
      headers: {'Content-Type': 'application/json'},
      method: 'POST',
      body: JSON.stringify({username, confirmationCode})
    }).then(response => {

      console.log(response);

      if(response.status !== 200){
        console.log("an error occured")
        alert('sorry, an error occured when trying to sign you in, please try again')
      }else{
        console.log("successfully retrieved payload");
        alert('Thank you for confirming!');
        goToGamePage();
      }

      return response;
    }).catch(error => {console.log('error: ' + error)})

    const body = await response.json();

    console.log(body);
  }

  const resendCode = async(username) => {
    const response = await fetch('https://8yhohsoyql.execute-api.us-east-1.amazonaws.com/prod/signin', {
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

  return (
    <Routes>
      <Route path="/signup" element={ <SignUp registerUser={registerUser} /> } />
      <Route path="/game" element={ <Game /> } />
      <Route path="/" element={ <SignIn signIn = {signIn}/> } />
      <Route path="/confirm" element={ <ConfirmationCode confirmCode={confirmCode} resendCode={resendCode} /> } />
    </Routes>
  );
}

export default App;
