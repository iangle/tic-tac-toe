import React, { useState } from 'react'

import './Signup.css';

export default function Signup({ registerUser }) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    return (
        <div className="container">
            <form>
                <div className="row">
                    <div className="col-25">
                        <label htmlFor="fname">Username:</label>
                    </div>
                    <div className="col-75">
                        <input type="text"  name="username" value={username} placeholder="username.." onChange={(e) => setUsername(e.target.value)} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-25">
                        <label htmlFor="lname">Password:</label>
                    </div>
                    <div className="col-75">
                        <input type="text"  name="password" value={password} placeholder="password.." onChange={(e) => setPassword(e.target.value)} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-25">
                        <label htmlFor="lname">Email:</label>
                    </div>
                    <div className="col-75">
                        <input type="text"  name="email" value={email} placeholder="email.." onChange={(e) => setEmail(e.target.value)} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-25">
                        <label htmlFor="lname">Phone Number:</label>
                    </div>
                    <div className="col-75">
                        <input type="text"  name="phoneNumber" value={phoneNumber} placeholder="no spaces: +15095552323" onChange={(e) => setPhoneNumber(e.target.value)} />
                    </div>
                </div>
                <div className="row">
                    <input onClick={() => registerUser(username, password, email, phoneNumber)} type="button" value="Sign Up" />
                </div>
            </form>
        </div> 
    )
}

