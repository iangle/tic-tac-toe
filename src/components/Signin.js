import React from 'react';

import './Signin.css';
import { useNavigate} from 'react-router-dom';


export default function Signin() {

    const navigate = useNavigate();

    const goToSignUpPage = () => {
        navigate('/signup');
    }

    const goToGamePage = () => {
        navigate('/game');
    }

    return (
            <div className="container">
                <form>
                    <div className="row">
                        <div className="col-25">
                            <label htmlFor="fname">Username:</label>
                        </div>
                        <div className="col-75">
                            <input type="text" id="username" name="firstname" placeholder="username.." />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-25">
                            <label htmlFor="lname">Password:</label>
                        </div>
                        <div className="col-75">
                            <input type="password" id="password" name="lastname" placeholder="password.." />
                        </div>
                    </div>
                    <div className="row">
                        <input type="submit" onClick={() => {goToGamePage()}} value="Sign In" />
                    </div>
                    <button onClick={() => {goToSignUpPage()}} type="button" className='linkButton' > New? Register Here </button>
                </form>
            </div> 
    )
}
