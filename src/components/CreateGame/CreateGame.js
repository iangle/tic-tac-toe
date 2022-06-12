import React, {useState} from 'react';

import './CreateGame.css';

export default function CreateGame({create_game}){

    const [opponentsUsername, setOpponentsUsername] = useState('');
    const current_user = JSON.parse(localStorage.getItem('username'));
    const idToken = JSON.parse(localStorage.getItem('idToken'));

    return (
        <div className="container">
            <form>
                <div className="row">
                    <div className="col-25">
                        <label htmlFor="fname">Opponents Username:</label>
                    </div>
                    <div className="col-75">
                        <input type="text" value={opponentsUsername} placeholder="opponent's username here.." onChange={(e) => setOpponentsUsername(e.target.value)} />
                    </div>
                </div>
                <div className="row">
                    <input type="button" onClick={() => create_game(current_user, opponentsUsername, opponentsUsername, idToken)} value="Submit" />
                </div>
            </form>
        </div> 
    )
}
