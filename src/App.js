import {Routes, Route, useNavigate} from 'react-router-dom';
import Game from './components/Game';
import SignIn from './components/Signin';
import SignUp from './components/Signup';

function App() {

  const navigate = useNavigate();

  const goToGamePage = () => {
    navigate('/game');
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
        goToGamePage();
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
      <Route path="/" element={ <SignIn /> } />
    </Routes>
  );
}

export default App;
