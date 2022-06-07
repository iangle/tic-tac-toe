import {Routes, Route} from 'react-router-dom';
import Game from './components/Game';
import Home from './components/Home';
import SignIn from './components/Signin';
import SignUp from './components/Signup';

function App() {
  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/game" element={<Game />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;
