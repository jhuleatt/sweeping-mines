import React, { Component } from "react";

class GameListing extends Component {
  render() {
    return (<li>
      <button
        onClick={this.props.onClick}>
        {this.props.gameId}
      </button>
      {` completed: ${this.props.gameStatus.completed}`}
    </li>);
  }
}

class GameList extends Component {
  render() {
    const games = this.props.games;
    return (
      <ul>
        {Object.keys(games).map(key => <GameListing key={key} gameId={key} gameStatus={games[key]} onClick={(this.props.onClick(key))} />)}
      </ul>
    );
  }
}

export default GameList;
