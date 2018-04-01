import * as firebase from 'firebase';
import { config } from '../../firebaseConfig.js';
import React, { Component } from "react";
import { createGrid } from "../utils/gridUtils.js";


/**
 * This is the default gif component that comes with base react
 */
class GridProvider extends Component {
  constructor(props) {
    super(props);
    firebase.initializeApp(config);
    this.state = {
      isGameListLoaded: false,
      serializedBoard: null,
      allGames: null
    };
  }

  componentDidMount() {
    this.subscribeToGamesList();
  }

  unsubscribeFromBoard(boardId) {
    firebase.database().ref(`boards/${this.props.boardId}`).off('value');
  }

  subscribeToGamesList() {
    firebase.database().ref(`allGames`).on('value', (snapshot) => {
      this.setState({ isGameListLoaded: true, allGames: snapshot.val() });
    });
  }

  subscribeToBoard(boardId) {
    this.setState({ serializedBoard: null });
    firebase.database().ref(`boards/${boardId}`).on('value', (snapshot) => {
      this.setState({ serializedBoard: snapshot.val() });
    });
  }

  componentWillReceiveProps(nextProps) {
    // unsubscribe from old board if we don't need it any more
    if (nextProps.boardId !== this.props.boardId) {
      this.unsubscribeFromBoard(this.props.boardId);
      this.subscribeToBoard(nextProps.boardId);
    }
  }

  pushNewBoard(serializedBoard) {
    firebase.database().ref(`boards/${this.props.boardId}`).set(serializedBoard);
  }

  endGame(winLoss) {
    firebase.database().ref(`allGames/${this.props.boardId}`).set({
      completed: true,
      winLoss
    });
  }

  createNewBoard() {
    const newBoardRef = firebase.database().ref(`boards`).push();
    const newBoardKey = newBoardRef.key;

    return newBoardRef.set(JSON.stringify(createGrid(10, 10, 9))).then(() => {
      return firebase.database().ref(`allGames/${newBoardKey}`).set({
        completed: false,
        winLoss: 'not completed'
      });
    })
      .then(() => {
        return newBoardKey;
      })
      .catch(err => console.error(err));
  }

  render() {
    const updateBoard = (newSerializedBoard) => {
      this.pushNewBoard(newSerializedBoard);
    }
    return this.props.render(this.state.isGameListLoaded, this.state.allGames, this.state.serializedBoard, updateBoard, this.createNewBoard, this.endGame.bind(this));
  }
}
export default GridProvider;
