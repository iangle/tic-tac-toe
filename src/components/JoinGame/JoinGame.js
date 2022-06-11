import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

import './JoinGame.css';

export default function JoinGame(){

    const navigate = useNavigate();

    const [gameId, setGameCode] = useState('');

    const saveGameId = () => {
        localStorage.setItem("gameId", JSON.parse(gameId));
        navigate("/game");
    }

    return (
        <div className="container">
            <form>
                <div className="row">
                    <div className="col-25">
                        <label htmlFor="fname">game code:</label>
                    </div>
                    <div className="col-75">
                        <input type="text" value={gameId} placeholder="code here.." onChange={(e) => setGameCode(e.target.value)} />
                    </div>
                </div>
                <div className="row">
                    <input type="button" onClick={() => saveGameId()} value="Submit" />
                </div>
            </form>
        </div> 
    )
}
