import { BLANK_SQUARE } from '../../constants.js';
import _ from 'lodash';

//replaces the content of a square with the desired piece or BLANK_SQUARE
export function replaceSquare(board, position, piece){
  let newBoard = board.slice();
  newBoard[position[0]][position[1]] = piece;
  return newBoard;
}

export function pieceMoveFinal(board, initialPosition, finalPosition, auxBoardState){

  if (_.isEqual(board[initialPosition[0]][initialPosition[1]], [0,10]) &&
        _.isEqual(initialPosition, [7,4]) &&
        _.isEqual(finalPosition, [7,6])){return whiteCastlesKingside(board)}

  else if (_.isEqual(board[initialPosition[0]][initialPosition[1]], [0,10]) &&
        _.isEqual(initialPosition, [7,4]) &&
        _.isEqual(finalPosition, [7,2])){return whiteCastlesQueenside(board)}

  else if (_.isEqual(board[initialPosition[0]][initialPosition[1]], [1,10]) &&
        _.isEqual(initialPosition, [0,4]) &&
        _.isEqual(finalPosition, [0,6])){return blackCastlesKingside(board)}

  else if (_.isEqual(board[initialPosition[0]][initialPosition[1]], [1,10]) &&
        _.isEqual(initialPosition, [0,4]) &&
        _.isEqual(finalPosition, [0,2])){return blackCastlesQueenside(board)}

  else if(_.isEqual(auxBoardState[3], [initialPosition[0],initialPosition[1]+1]) &&
        _.isEqual(board[initialPosition[0]][initialPosition[1]], [0,1])){
          return whiteTakesEnPassant(board, initialPosition, finalPosition);
        }
  else if(_.isEqual(auxBoardState[3], [initialPosition[0],initialPosition[1]-1]) &&
        _.isEqual(board[initialPosition[0]][initialPosition[1]], [0,1])){
          return whiteTakesEnPassant(board, initialPosition, finalPosition);
        }
  else if(_.isEqual(auxBoardState[3], [initialPosition[0],initialPosition[1]+1]) &&
        _.isEqual(board[initialPosition[0]][initialPosition[1]], [1,1])){
          return blackTakesEnPassant(board, initialPosition, finalPosition);
        }
  else if(_.isEqual(auxBoardState[3], [initialPosition[0],initialPosition[1]-1]) &&
        _.isEqual(board[initialPosition[0]][initialPosition[1]], [1,1])){
          return blackTakesEnPassant(board, initialPosition, finalPosition);
        }

  return normalPieceMove(board, initialPosition, finalPosition);
}

export function normalPieceMove(board, initialPosition, finalPosition){
  let newItem = board[initialPosition[0]][initialPosition[1]].slice();
  let result = replaceSquare(
    replaceSquare(board, finalPosition, newItem),
    initialPosition,
    BLANK_SQUARE);
  return result;
}

export function whiteCastlesKingside(board){
  let board1 = replaceSquare(board, [7,4], BLANK_SQUARE);
  let board2 = replaceSquare(board1, [7,5], [0,5]);
  let board3 = replaceSquare(board2, [7,6], [0,10]);
  let result = replaceSquare(board3, [7,7], BLANK_SQUARE);
  return result;
}
export function whiteCastlesQueenside(board){
  let board1 = replaceSquare(board, [7,0], BLANK_SQUARE);
  let board2 = replaceSquare(board1, [7,2], [0,10]);
  let board3 = replaceSquare(board2, [7,3], [0,5]);
  let result = replaceSquare(board3, [7,4], BLANK_SQUARE);
  return result;
}

export function blackCastlesKingside(board){
  let board1 = replaceSquare(board, [0,4], BLANK_SQUARE);
  let board2 = replaceSquare(board1, [0,5], [1,5]);
  let board3 = replaceSquare(board2, [0,6], [1,10]);
  let result = replaceSquare(board3, [0,7], BLANK_SQUARE);
  return result;
}
export function blackCastlesQueenside(board){
  let board1 = replaceSquare(board, [0,0], BLANK_SQUARE);
  let board2 = replaceSquare(board1, [0,2], [1,10]);
  let board3 = replaceSquare(board2, [0,3], [1,5]);
  let result = replaceSquare(board3, [0,4], BLANK_SQUARE);
  return result;
}

export function whiteTakesEnPassant(board, initialPosition, finalPosition) {
  let board1 = replaceSquare(board, initialPosition, BLANK_SQUARE);
  let board2 = replaceSquare(board1, [3,finalPosition[1]],BLANK_SQUARE);
  let board3 = replaceSquare(board2, finalPosition, [0,1]);
  return board3;
}

export function blackTakesEnPassant(board, initialPosition, finalPosition) {
  let board1 = replaceSquare(board, initialPosition, BLANK_SQUARE);
  let board2 = replaceSquare(board1, [4,finalPosition[1]],BLANK_SQUARE);
  let board3 = replaceSquare(board2, finalPosition, [1,1]);
  return board3;
}

export function boardStateChange (board, initialPosition, finalPosition, auxBoardState, castling){
  let boardClone = _.cloneDeep(board);
  let auxBoardStateClone = _.cloneDeep(auxBoardState);
  let castlingClone = _.cloneDeep(castling);

  let newBoardClone = pieceMoveFinal(board, initialPosition, finalPosition, auxBoardState);
  let newAuxBoardStateClone = auxBoardStateClone;
  let newCastlingClone = castlingClone;

  if (
    boardClone[initialPosition[0]][initialPosition[1]] === 1 &&
    Math.abs(initialPosition[0]-finalPosition[0])===2
  ){
    newAuxBoardStateClone[3] = _.cloneDeep(finalPosition);
  }else {
    newAuxBoardStateClone[3] = null;
  }
  if (_.isEqual(boardClone[initialPosition[0]][initialPosition[1]], [0,10])){
    newAuxBoardStateClone[0] = false;
  } else if (_.isEqual(boardClone[initialPosition[0]][initialPosition[1]], [1,10])){
    newAuxBoardStateClone[1] = false;
  } else if (_.isEqual(initialPosition, [7,0])){
    newCastlingClone[1] = false;
  } else if (_.isEqual(initialPosition, [7,7])){
    newCastlingClone[0] = false;
  } else if (_.isEqual(initialPosition, [0,0])){
    newCastlingClone[4] = false;
  } else if (_.isEqual(initialPosition, [0,7])){
    newCastlingClone[3] = false;
  }

  if (!newAuxBoardStateClone[0]){
    newCastlingClone[0] = false;
    newCastlingClone[1] = false;
  }

  if (!newAuxBoardStateClone[1]){
    newCastlingClone[3] = false;
    newCastlingClone[4] = false;
  }
  if (!newCastlingClone[0] && !newCastlingClone[1]){
    newAuxBoardStateClone[0] = false;
  }
  if (!newCastlingClone[2] && !newCastlingClone[3]){
    newAuxBoardStateClone[1] = false;
  }

  newAuxBoardStateClone[2] = (auxBoardStateClone[2]+1) % 2;
  return [newBoardClone, newAuxBoardStateClone, newCastlingClone];
}
