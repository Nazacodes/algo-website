// Astar.js

export function astar(grid, startNode, finishNode) {
    // Define heuristic function
    function heuristic(node, finishNode) {
      return Math.abs(node.row - finishNode.row) + Math.abs(node.col - finishNode.col);
    }
  
    // Define sorting function for nodes by heuristic
    function sortNodesByHeuristic(unvisitedNodes) {
      unvisitedNodes.sort((nodeA, nodeB) => (nodeA.distance + nodeA.heuristic) - (nodeB.distance + nodeB.heuristic));
    }
  
    // Define function to get unvisited neighbors of a node
    function getUnvisitedNeighbors(node, grid) {
      const neighbors = [];
      const { col, row } = node;
      if (row > 0) neighbors.push(grid[row - 1][col]);
      if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
      if (col > 0) neighbors.push(grid[row][col - 1]);
      if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
      return neighbors.filter(neighbor => !neighbor.isVisited);
    }
  
    const openSet = [];
    startNode.distance = 0;
    startNode.heuristic = heuristic(startNode, finishNode);
    openSet.push(startNode);
  
    const visitedNodesInOrder = [];
  
    while (openSet.length > 0) {
      sortNodesByHeuristic(openSet);
      const currentNode = openSet.shift();
  
      if (currentNode.isWall) continue;
      if (currentNode.distance === Infinity) return visitedNodesInOrder;
  
      currentNode.isVisited = true;
      visitedNodesInOrder.push(currentNode);
  
      if (currentNode === finishNode) return visitedNodesInOrder;
  
      const neighbors = getUnvisitedNeighbors(currentNode, grid);
      for (const neighbor of neighbors) {
        const tentativeGScore = currentNode.distance + 1;
        if (tentativeGScore < neighbor.distance) {
          neighbor.distance = tentativeGScore;
          neighbor.heuristic = heuristic(neighbor, finishNode);
          neighbor.previousNode = currentNode;
          openSet.push(neighbor);
        }
      }
    }
  
    return visitedNodesInOrder;
  }
  