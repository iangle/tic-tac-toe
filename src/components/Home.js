import React from 'react';
import { useNavigate } from 'react-router-dom';

import './Home.css';

export default function Home() {

    const navigate = useNavigate();

    const navigateToSignIn = () => {
        navigate('/signin');
    }

    const navigateToSignUp = () => {
        navigate('/signup');
    }

    return (
        <div className='container'>
            <div className='firstButton'>
                <button className='homeButton' onClick={() => navigateToSignUp()}>Sign up</button>
            </div>
            <div>
                <button className='homeButton' onClick={() => navigateToSignIn()}>Sign in</button>
            </div>
        </div>
    )
}
