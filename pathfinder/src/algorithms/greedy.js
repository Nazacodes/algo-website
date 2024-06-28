export function greedy(grid, startNode, finishNode) {
    const openSet = [];
    startNode.heuristic = heuristic(startNode, finishNode);
    openSet.push(startNode);
  
    const visitedNodesInOrder = [];
  
    while (openSet.length > 0) {
      sortNodesByHeuristic(openSet);
      const currentNode = openSet.shift();
  
      if (currentNode.isWall) continue;
      if (currentNode.isVisited) continue;
  
      currentNode.isVisited = true;
      visitedNodesInOrder.push(currentNode);
  
      if (currentNode === finishNode) return visitedNodesInOrder;
  
      const neighbors = getUnvisitedNeighbors(currentNode, grid);
      for (const neighbor of neighbors) {
        if (!neighbor.isVisited) {
          neighbor.heuristic = heuristic(neighbor, finishNode);
          neighbor.previousNode = currentNode;
          openSet.push(neighbor);
        }
      }
    }
  
    return visitedNodesInOrder;
  }
  
  function heuristic(node, finishNode) {
    return Math.abs(node.row - finishNode.row) + Math.abs(node.col - finishNode.col);
  }
  
  function sortNodesByHeuristic(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.heuristic - nodeB.heuristic);
  }
  
  function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const { col, row } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
  }
  