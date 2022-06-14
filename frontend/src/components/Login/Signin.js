import React, {useState} from 'react';
import './Signin.css';
import { useNavigate} from 'react-router-dom';


export default function Signin({signIn}) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const goToSignUpPage = () => {
        navigate('/signup');
    }

    return (
            <div className="container">
                <form>
                    <div className="row">
                        <div className="col-25">
                            <label htmlFor="fname">Username:</label>
                        </div>
                        <div className="col-75">
                            <input type="text" value={username} placeholder="username.." onChange={(e) => setUsername(e.target.value)} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-25">
                            <label htmlFor="lname">Password:</label>
                        </div>
                        <div className="col-75">
                            <input type="password" value={password} placeholder="password.." onChange={(e) => setPassword(e.target.value)} />
                        </div>
                    </div>
                    <div className="row">
                        <input type="button" onClick={() => signIn(username, password)} value="Sign In" />
                    </div>
                    <button onClick={() => {goToSignUpPage()}} type="button" className='linkButton' > New? Register Here </button>
                </form>
            </div> 
    )
}
