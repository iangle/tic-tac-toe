import React, { useState } from 'react'

import './Signup.css';

export default function Signup() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    return (
      <div className='rootDiv'>
          <form className='signUpForm'>
              <div>
                <label className='labels'> Username:
                    <input 
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="input"
                    />
                </label>
              </div>
              <div>
                <label className='labels'> Password:
                    <input 
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input"
                    />
                </label>
              </div>
              <div>
                <label className='labels'> Email:
                    <input 
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input"
                    />
                </label>
              </div>
              <div>
                <label className='labels'> Phone Number:
                    <input 
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="input"
                    />
                </label>
              </div>
          </form>
      </div>
    )
}

