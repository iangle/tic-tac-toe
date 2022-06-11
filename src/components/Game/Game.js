import React, {useState, useEffect} from 'react';
import Board from './Board/Board';

import './gameStyles.css'

export default function Game() {

  //const [squares, setSquares] = useState([]);
  const gameId = JSON.parse(localStorage.getItem('gameId'));
  const user1 = JSON.parse(localStorage.getItem('username'));
  const [squares, setSquares] = useState([]);
  const accessToken = JSON.parse(localStorage.getItem('accessToken'));

  const handleClick = (i) => {
      putMove(i, user1, gameId);
  }

  const refreshPage = () => {
    window.location.reload(false);
  }

  const putMove = async(playerAction, currentPlayer, gameId) => {
    await fetch('https://7w5za22zsb.execute-api.us-east-1.amazonaws.com/prod/' + gameId + '/performmove', {
      headers: {'content-type': 'application/json', 'Authorization': accessToken},
      method: 'PUT',
      body: JSON.stringify({playerAction, currentPlayer})
    }).then(response => {console.log(response); return response})
    .catch(error => {console.log("error: " + error)})

    getGame(gameId);
  }

  const getGame = async(gameId, accessToken) => {
    var body = await fetch('https://7w5za22zsb.execute-api.us-east-1.amazonaws.com/prod/' + gameId + '/fetchgame', {
      headers: {'content-type': 'application/json', 'Authorization': accessToken},
    }).then(response => {
      return response
    }).catch(error => {
      console.log('error: ' + error)
    });

    var response_body = await body.json();

    setSquares(response_body['Item'][0]['board']);

    console.log(response_body);

  }


  const status = 'next player is X'
  const moves = (
    <li>
      <button onClick={() => refreshPage()}>Refresh</button>
    </li>
  );

  useEffect(() => {
    getGame(gameId, accessToken); 
  }, [gameId, accessToken]);


  return (
    <div className='game'>
      <div className='game-board'>
        <Board onClick={handleClick} squares={squares}></Board>
      </div>
      <div className='game-info'>
        <div>{status}</div>
        <div>{moves}</div>
      </div>
    </div>
  )
}
