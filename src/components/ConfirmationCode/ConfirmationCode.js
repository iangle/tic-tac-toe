import React, { useState} from 'react'

import './ConfirmationCode.css';

export default function ConfirmationCode({confirmCode, resendCode}) {
    
    const [confirmationCode, setConfirmationCode] = useState("");


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
                    <input type="button" onClick={() => confirmCode(confirmationCode)} value="Submit" />
                </div>
            <button onClick={() => {resendCode()}} type="button" className='linkButton' > Resend Confirmation Code </button>
        </form>
    </div> 
    )
}
