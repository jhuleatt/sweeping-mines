import React, { Component } from "react";
import Grid from "./components/Grid.js";
import GameList from "./components/GameList.js";
import GridProvider from './components/GridProvider.js';
import "../style/App.css";

/**
 * This is the default gif component that comes with base react
 */
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: 10,
      columns: 10,
      mines: 9,
      endGame: this.endGame,
      currentGameId: '',
    };
  }

  restartGame() {
    this.setState({
      rows: 10,
      columns: 10,
      mines: 9,
      endGame: this.endGame
    });
  }

  render() {
    return (
      <div>
        <h1>{`Game ID: ${this.state.currentGameId}`}</h1>
        <GridProvider boardId={this.state.currentGameId} render={
          (isGameListLoaded, allGames, serializedBoard, updateBoard, createNewGame, endGame) => {
            if (!isGameListLoaded) {
              return <h1>... LOADING ...</h1>
            }

            let boardComponent = <h2>Choose a game to play</h2>
            if (serializedBoard) {
              const board = JSON.parse(serializedBoard);
              boardComponent = (<Grid
                grid={board}
                updateGrid={(grid) => updateBoard(JSON.stringify(grid))}
                endGame={endGame}
              />);
            }

            return (
              <div>
                {boardComponent}
                <h2>Available games (click one to join)</h2>
                <GameList games={allGames} onClick={(gameId) => () => this.setState({ currentGameId: gameId })} />
                <button onClick={() => createNewGame().then(newBoardId => this.setState({ currentGameId: newBoardId }))}>CREATE NEW GAME</button>
              </div>);
          }
        } />
      </div >
    );
  }
}

export default App;
