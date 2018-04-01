import React, { Component } from "react";
import Cell from "./Cell.js";
import { createGrid, iterateSurroundingCells } from "../utils/gridUtils.js";
//import '../style/Grid.css';

/**
 * [Grid description]
 * @extends Component
 *
 */
class Grid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isGameOver: false,
      openedCells: 0
    };
  }
  componentWillReceiveProps(nextProps) {
    console.log("THIS IS WORKING");
  }

  openSurrounding(x, y) {
    const grid = this.props.grid;
    let cell = grid[x][y];
    let fcn = (newX, newY) => {
      let nextCell = grid[newX][newY];
      if (nextCell.count === 0 || nextCell.hasMine === false) {
        this.openCell(newX, newY);
      }
    };
    iterateSurroundingCells(grid, x, y, fcn);
  }
  openCell(i, j) {
    const grid = this.props.grid.slice();
    if (!grid[i][j].isOpened && !grid[i][j].isFlagged) {
      if (grid[i][j].hasMine) {
        this.props.endGame("L");
      } else {
        grid[i][j].isOpened = true;
        let newOpenedCells = this.state.openedCells + 1;
        if (grid[i][j].count === 0) {
          this.openSurrounding(i, j);
        }
        this.props.updateGrid(grid);
        this.setState({
          openedCells: newOpenedCells
        });
        const didWin =
          newOpenedCells ===
          this.props.rows * this.props.columns - this.props.mines;
        if (didWin) {
          this.props.endGame("W");
        }
      }
    }
  }
  toggleFlag(i, j) {
    const grid = this.props.grid.slice();
    if (!grid[i][j].isOpened) {
      grid[i][j].isFlagged = !grid[i][j].isFlagged;
    }
    this.props.updateGrid(grid);
  }
  renderCell(i, j) {
    let gridCell = this.props.grid[i][j];
    return (
      <Cell
        key={`${i}:${j}`}
        count={gridCell.count}
        isOpened={gridCell.isOpened}
        hasMine={gridCell.hasMine}
        isFlagged={gridCell.isFlagged}
        onClick={() => this.openCell(i, j)}
        onContextMenu={e => {
          e.preventDefault();
          this.toggleFlag(i, j);
        }}
      />
    );
  }
  render() {
    var grid = this.props.grid.map((row, i) => {
      let rows = row.map((column, j) => {
        return this.renderCell(i, j);
      });
      return <tr key={i}>{rows}</tr>;
    });
    return (
      <table className="grid">
        <tbody>{grid}</tbody>
      </table>
    );
  }
}

export default Grid;
