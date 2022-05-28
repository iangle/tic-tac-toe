import React from 'react'
import Square from './Square'

export default function Board(props) {

    function updateSquares(index){
        if(props.squares[index] !== 'N'){
            return props.squares[index];
        }else{
            props.squares[index] = null;
            return props.squares[index];
        }
    }


  return (
    <div className='board'>
        <div>
            <Square 
                value = {updateSquares(0)} 
                onClick={() => {props.onClick(0)}}
             />
            <Square 
                value = {updateSquares(1)} 
                onClick={() => {props.onClick(1)}}
             />
            <Square 
                value = {updateSquares(2)} 
                onClick={() => {props.onClick(2)}}
             />
        </div>
        <div>
            <Square 
                value = {updateSquares(3)} 
                onClick={() => {props.onClick(3)}}
             />
            <Square 
                value = {updateSquares(4)} 
                onClick={() => {props.onClick(4)}}
             />
            <Square 
                value = {updateSquares(5)} 
                onClick={() => {props.onClick(5)}}
             />
        </div>
        <div>
            <Square 
                value = {updateSquares(6)} 
                onClick={() => {props.onClick(6)}}
             />
            <Square 
                value = {updateSquares(7)} 
                onClick={() => {props.onClick(7)}}
             />
            <Square 
                value = {updateSquares(8)} 
                onClick={() => {props.onClick(8)}}
             />
        </div>
    </div>
  );
}
