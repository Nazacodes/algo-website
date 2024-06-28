/* global loading */

import React, { Component } from 'react';
import Node from './Node/node';
import './PathfindingVisualizer.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import VideoEmbed from './VideoEmbed/VideoEmbed';


// Import pathfinding algorithms
import { dijkstra, getNodesInShortestPathOrder as dijkstraGetNodesInShortestPathOrder } from '../algorithms/dijkstra';
import { astar, getNodesInShortestPathOrder as astarGetNodesInShortestPathOrder } from '../algorithms/Astar';
import { bfs, getNodesInShortestPathOrder as bfsGetNodesInShortestPathOrder } from '../algorithms/bfs';
import { dfs, getNodesInShortestPathOrder as dfsGetNodesInShortestPathOrder } from '../algorithms/dfs';
import { greedy, getNodesInShortestPathOrder as greedyGetNodesInShortestPathOrder } from '../algorithms/greedy';
// Preloader component
const Preloader = () => (
  <div className="preloader">
    <div className="spinner"></div>
  </div>
);

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      algorithm: 'dijkstra',
      startNodeRow: 10,
      startNodeCol: 15,
      finishNodeRow: 10,
      finishNodeCol: 35,
      loading: true, // Initialize loading state
      visitedNodesInOrder: [],
      nodesInShortestPathOrder: [],
    };
  }

  componentDidMount() {
    const grid = this.getInitialGrid();
    this.setState({ grid });
    setTimeout(() => {
      this.setState({ loading: false });
    }, 2000); // 5000 milliseconds (5 seconds)
  }

  getInitialGrid() {
    const grid = [];
    for (let row = 0; row < 20; row++) {
      const currentRow = [];
      for (let col = 0; col < 50; col++) {
        currentRow.push(this.createNode(row, col));
      }
      grid.push(currentRow);
    }
    return grid;
  }
  generateRecursiveDivisionMaze = () => {
    const { grid, startNodeRow, startNodeCol, finishNodeRow, finishNodeCol } = this.state;
    const startNode = grid[startNodeRow][startNodeCol];
    const finishNode = grid[finishNodeRow][finishNodeCol];
  
    const numRows = grid.length;
    const numCols = grid[0].length;
    const newGrid = grid.slice().map(row => row.slice());
  
    this.recursiveDivisionMaze(newGrid, 0, numRows - 1, 0, numCols - 1);
  
    // Ensure start and finish nodes are not walls
    startNode.isWall = false;
    finishNode.isWall = false;
  
    this.setState({ grid: newGrid });
  };
    
  recursiveDivisionMaze = (grid, startRow, endRow, startCol, endCol) => {
    if (endRow < startRow || endCol < startCol) return;

    const divideHorizontally = Math.random() < 0.5;

    if (divideHorizontally) {
      const divideRow = Math.floor(Math.random() * (endRow - startRow + 1)) + startRow;
      const passageCol = Math.floor(Math.random() * (endCol - startCol + 1)) + startCol;

      for (let col = startCol; col <= endCol; col++) {
        if (col !== passageCol) {
          grid[divideRow][col].isWall = false; // Add wall
        }
      }

      this.recursiveDivisionMaze(grid, startRow, divideRow - 1, startCol, endCol); // Top section
      this.recursiveDivisionMaze(grid, divideRow + 1, endRow, startCol, endCol); // Bottom section
    } else {
      const divideCol = Math.floor(Math.random() * (endCol - startCol + 1)) + startCol;
      const passageRow = Math.floor(Math.random() * (endRow - startRow + 1)) + startRow;

      for (let row = startRow; row <= endRow; row++) {
        if (row !== passageRow) {
          grid[row][divideCol].isWall = true; // Add wall
        }
      }

      this.recursiveDivisionMaze(grid, startRow, endRow, startCol, divideCol - 1); // Left section
      this.recursiveDivisionMaze(grid, startRow, endRow, divideCol + 1, endCol); // Right section
    }
  };


  createNode(row, col) {
    const { startNodeRow, startNodeCol, finishNodeRow, finishNodeCol } = this.state;
    return {
      row,
      col,
      isStart: row === startNodeRow && col === startNodeCol,
      isFinish: row === finishNodeRow && col === finishNodeCol,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
      heuristic: 0,
    };
  }

  handleMouseDown(row, col) {
    const { grid, placingStart, placingFinish } = this.state;
    const newGrid = grid.slice();

    if (placingStart) {
      // Remove previous start node if placing new start node
      for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
          if (grid[r][c].isStart) {
            newGrid[r][c] = {
              ...newGrid[r][c],
              isStart: false,
            };
            break;
          }
        }
      }
      // Set new start node
      newGrid[row][col] = {
        ...newGrid[row][col],
        isStart: true,
      };
      this.setState({ grid: newGrid, startNodeRow: row, startNodeCol: col, placingStart: false });
    } else if (placingFinish) {
      // Remove previous finish node if placing new finish node
      for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
          if (grid[r][c].isFinish) {
            newGrid[r][c] = {
              ...newGrid[r][c],
              isFinish: false,
            };
            break;
          }
        }
      }
      // Set new finish node
      newGrid[row][col] = {
        ...newGrid[row][col],
        isFinish: true,
      };
      this.setState({ grid: newGrid, finishNodeRow: row, finishNodeCol: col, placingFinish: false });
    } else {
      // Toggle wall
      const node = newGrid[row][col];
      const newNode = {
        ...node,
        isWall: !node.isWall,
      };
      newGrid[row][col] = newNode;
      this.setState({ grid: newGrid, mouseIsPressed: true });
    }
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const { grid, placingStart, placingFinish } = this.state;
    const newGrid = grid.slice();

    // Place walls while dragging
    if (!placingStart && !placingFinish) {
      const node = newGrid[row][col];
      const newNode = {
        ...node,
        isWall: !node.isWall,
      };
      newGrid[row][col] = newNode;
      this.setState({ grid: newGrid });
    }
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  getNewGridWithWallToggled(grid, row, col) {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  }

  animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if (!node.isStart && !node.isFinish) {
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
        }
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        if (!node.isStart && !node.isFinish) {
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path';
        }
      }, 50 * i);
    }
  }

  setPlacingStart() {
    this.setState({ placingStart: true, placingFinish: false });
  }

  setPlacingFinish() {
    this.setState({ placingStart: false, placingFinish: true });
  }

  visualizeAlgorithm() {
    const { grid, algorithm, startNodeRow, startNodeCol, finishNodeRow, finishNodeCol } = this.state;


    // Clear previous shortest path and visited nodes visualization
    this.resetAlgorithm();

    const startNode = grid[startNodeRow][startNodeCol];
    const finishNode = grid[finishNodeRow][finishNodeCol];
    startNode.isWall = false;
    finishNode.isWall = false;
    let visitedNodesInOrder;

    switch (algorithm) {
      case 'astar':
        visitedNodesInOrder = astar(grid, startNode, finishNode);
        break;
      case 'bfs':
        visitedNodesInOrder = bfs(grid, startNode, finishNode);
        break;
      case 'dfs':
        visitedNodesInOrder = dfs(grid, startNode, finishNode);
        break;
      case 'greedy':
        visitedNodesInOrder = greedy(grid, startNode, finishNode);
        break;
      default:
        visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        break;
    }

    const nodesInShortestPathOrder = this.getNodesInShortestPathOrder(finishNode);
    this.setState({ visitedNodesInOrder, nodesInShortestPathOrder }, () => {
      this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
    });
  }

  getNodesInShortestPathOrder(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
  }

  setAlgorithm(algorithm) {
    this.setState({ algorithm });
  }

  resetGrid() {
    const { grid } = this.state;
    const newGrid = this.getInitialGrid();
    this.setState({
      grid: newGrid,
      startNodeRow: 10,
      startNodeCol: 15,
      finishNodeRow: 10,
      finishNodeCol: 35,
      visitedNodesInOrder: [],
      nodesInShortestPathOrder: [],
      mouseIsPressed: false,
      placingStart: false,
      placingFinish: false,
    });
  }

  resetAlgorithm() {
    const { grid } = this.state;
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        const node = grid[row][col];
        node.distance = Infinity;
        node.isVisited = false;
        node.previousNode = null;
        node.heuristic = 0;
        const nodeElement = document.getElementById(`node-${node.row}-${node.col}`);
        if (nodeElement) {
          if (!node.isStart && !node.isFinish && !node.isWall) {
            nodeElement.className = 'node';
          }
        }
      }
    }
    this.setState({ visitedNodesInOrder: [], nodesInShortestPathOrder: [] });
  }

  clearVisuals() {
    const { grid } = this.state;
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        const node = grid[row][col];
        const nodeElement = document.getElementById(`node-${node.row}-${node.col}`);
        if (nodeElement) {
          if (node.isWall) {
            nodeElement.className = 'node node-wall';
          } else {
            nodeElement.className = 'node';
          }
        }
      }
    }
  }

  render() {
    const { grid, mouseIsPressed ,loading } = this.state;
    const algorithmOptions = [
      { value: 'dijkstra', label: 'Dijkstra' },
      { value: 'astar', label: 'A*' },
      { value: 'bfs', label: 'BFS' },
      { value: 'dfs', label: 'DFS' },
      { value: 'greedy', label: 'Greedy' }
    ];
  
    return (
      <div>
        {loading && <Preloader />} {/* Render Preloader conditionally based on loading state */}
        <div className="menu-bar">
          <span className="title">Naza's MTU Pathfinding Helper</span>
          <div className="menu-buttons">
            <button onClick={() => this.generateRecursiveDivisionMaze()}>Generate Maze</button>
            <button onClick={() => this.setPlacingStart()}>Place Start Node</button>
            <button onClick={() => this.setPlacingFinish()}>Place Finish Node</button>
            <button onClick={() => this.visualizeAlgorithm()}>Visualize</button>
            <button onClick={() => this.resetGrid()}>Reset Everything</button>
            <button onClick={() => this.resetAlgorithm()}>Reset visited</button>
          </div>
        </div>
        <div className="algorithm-dropdown">
          <span className="dropdown-label">Select Algorithm:</span>
          <select onChange={(e) => this.setAlgorithm(e.target.value)}>
            {algorithmOptions.map((option, index) => (  
              <option key={index} value={option.value}>{option.label}</option>
            ))}
          </select>
          <button className="visualize-button" onClick={() => this.visualizeAlgorithm()}>Visualize Algorithm</button>
        </div>
        <div className="grid">
          {grid.map((row, rowIdx) => (
            <div key={rowIdx}>
              {row.map((node, nodeIdx) => {
                const { row, col, isFinish, isStart, isWall } = node;
                return (
                  <Node
                    key={nodeIdx}
                    col={col}
                    isFinish={isFinish}
                    isStart={isStart}
                    isWall={isWall}
                    mouseIsPressed={mouseIsPressed}
                    onMouseDown={() => this.handleMouseDown(row, col)}
                    onMouseEnter={() => this.handleMouseEnter(row, col)}
                    onMouseUp={() => this.handleMouseUp()}
                    row={row}
                  />
                );
              })}
            </div>
          ))}
        </div>
        <VideoEmbed algorithm={this.state.algorithm} /> {/* Embedding Video component */}
      </div>
    );

  }
}
