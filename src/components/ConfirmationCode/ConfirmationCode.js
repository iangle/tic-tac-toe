import React, { useState} from 'react'

import './ConfirmationCode.css';

export default function ConfirmationCode({confirmCode, resendCode}) {
    
    const [confirmationCode, setConfirmationCode] = useState("");

    const tempUsername = localStorage.getItem("username");
    const username = JSON.parse(tempUsername);

    const tempSession = localStorage.getItem("session");
    const session = JSON.parse(tempSession);

    const tempChallengeName = localStorage.getItem("challengeName");
    const challengeName = JSON.parse(tempChallengeName);

    return (
        <div className="container">
            <form>
                <div className="row">
                    <div className="col-25">
                        <label htmlFor="fname">confirmation Code:</label>
                    </div>
                    <div className="col-75">
                        <input type="text" value={confirmationCode} placeholder="code here" onChange={(e) => setConfirmationCode(e.target.value)} />
                    </div>
                </div>
                <div className="row">
                    <input type="button" onClick={() => confirmCode(username, confirmationCode, session, challengeName)} value="Submit" />
                </div>
            <button onClick={() => {resendCode(username)}} type="button" className='linkButton' > Resend Confirmation Code </button>
        </form>
    </div> 
    )
}
