import React, {useState, useEffect} from 'react';
import Board from './Board';

import './gameStyles.css'

export default function Game() {

  const [squares, setSquares] = useState([]);
  const [gameId, setGameId] = useState( JSON.parse(localStorage.getItem('gameId')) || '');
  const [user1, setUser1] = useState('dude');
  //const [user2, setUser2] = useState('');
  //const [lastMoveBy, setLastMoveBy] = useState('');

  const handleClick = (i) => {
      putMove(i, user1, gameId);
  }

  const createGame = async(user1, user2, lastMoveBy) => {
    var body = await fetch('https://7w5za22zsb.execute-api.us-east-1.amazonaws.com/prod/creategame', {
      headers: {'content-type': 'application/json'},
      method: 'POST',
      body: JSON.stringify({user1, user2, lastMoveBy})
    }).then(response => {return response})
    .catch(error => {console.log("error: " + error)})

    var response_body = await body.json();

    setGameId(response_body['gameId']);

    localStorage.setItem('gameId', JSON.stringify(response_body['gameId']));
  }

  const getGame = async(gameId) => {
    var body = await fetch('https://7w5za22zsb.execute-api.us-east-1.amazonaws.com/prod/' + gameId + '/fetchgame', {
      headers: {'content-type': 'application/json'},
    }).then(response => {
      return response
    }).catch(error => {
      console.log('error: ' + error)
    });

    var response_body = await body.json();

    setSquares(response_body['Item'][0]['board']);

    setGameId(response_body['Item'][0]['gameId']);

    console.log(response_body);

  }

  const putMove = async(playerAction, currentPlayer, gameId) => {
    await fetch('https://7w5za22zsb.execute-api.us-east-1.amazonaws.com/prod/' + gameId + '/performmove', {
      headers: {'content-type': 'application/json'},
      method: 'PUT',
      body: JSON.stringify({playerAction, currentPlayer})
    }).then(response => {console.log(response); return response})
    .catch(error => {console.log("error: " + error)})
  }


  const status = 'next player is X'
  const moves = (
    <li>
      <button onClick={() => {createGame('dude', 'dude2', 'dude2')}}>Start the game</button>
    </li>
  );

  useEffect(() => {
    getGame(gameId); 
  }, [gameId]);


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
