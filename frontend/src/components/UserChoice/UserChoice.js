import React from 'react'
import './UserChoice.css';
import { useNavigate} from 'react-router-dom';

export default function UserChoice(){

  const navigate = useNavigate();

  const goToCreateGame = () => {
    navigate('/creategame')
  }

  const goToJoinGame = () => {
    navigate('/joingame')
  }

    return (
      <div>
        <div>
          <button onClick={() => {goToCreateGame()}} className='button'>
            Create Game
          </button>
        </div>
        <div className='btnDiv'>
          <button onClick={() => {goToJoinGame()}} className='button'>
            Join Game
          </button>
        </div>
      </div>
    )
}

