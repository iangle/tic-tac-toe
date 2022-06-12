import React, {useState, useEffect} from 'react';
import Board from './Board/Board';

import './gameStyles.css'

export default function Game() {

  const gameId = JSON.parse(localStorage.getItem('gameId'));
  const user1 = JSON.parse(localStorage.getItem('username'));
  const [squares, setSquares] = useState([]);
  const idToken = JSON.parse(localStorage.getItem('idToken'));

  const handleClick = (i) => {
      putMove(i, user1, gameId, idToken);
  }

  const refreshPage = () => {
    window.location.reload(false);
  }

  const putMove = async(playerAction, currentPlayer, gameId, idToken) => {
    await fetch('https://7w5za22zsb.execute-api.us-east-1.amazonaws.com/prod/' + gameId + '/performmove', {
      headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + idToken},
      method: 'PUT',
      body: JSON.stringify({playerAction, currentPlayer})
    }).then(response => {console.log(response); return response})
    .catch(error => {console.log("error: " + error)})

    getGame(gameId, idToken);
  }

  const getGame = async(gameId, idToken) => {
    var body = await fetch('https://7w5za22zsb.execute-api.us-east-1.amazonaws.com/prod/' + gameId + '/fetchgame', {
      headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + idToken},
    }).then(response => {
      return response
    }).catch(error => {
      console.log('error: ' + error)
    });

    var response_body = await body.json();

    setSquares(response_body['Item'][0]['board']);

    console.log(response_body);

  }


  const moves = (
    <li>
      <button onClick={() => refreshPage()}>Refresh</button>
    </li>
  );

  useEffect(() => {
    getGame(gameId, idToken); 
  }, [gameId, idToken]);


  return (
    <div className='game'>
      <div className='game-board'>
        <Board onClick={handleClick} squares={squares}></Board>
      </div>
      <div className='game-info'>
        <div>{moves}</div>
      </div>
    </div>
  )
}
