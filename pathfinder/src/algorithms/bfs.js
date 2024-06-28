export function bfs(grid, startNode, finishNode) {
  const queue = [startNode];
  const visitedNodesInOrder = [];
  startNode.isVisited = true;

  while (queue.length) {
    const currentNode = queue.shift();
    visitedNodesInOrder.push(currentNode);

    if (currentNode === finishNode) return visitedNodesInOrder;

    const neighbors = getUnvisitedNeighbors(currentNode, grid);
    for (const neighbor of neighbors) {
      neighbor.isVisited = true;
      neighbor.previousNode = currentNode;
      queue.push(neighbor);
    }
  }

  return visitedNodesInOrder;
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;

  // Define the directions of movement (up, down, left, right)
  const directions = [
    { row: -1, col: 0 }, // up
    { row: 1, col: 0 },  // down
    { row: 0, col: -1 }, // left
    { row: 0, col: 1 }   // right
  ];

  for (const direction of directions) {
    const newRow = row + direction.row;
    const newCol = col + direction.col;

    if (isValidNeighbor(newRow, newCol, grid)) {
      const neighbor = grid[newRow][newCol];
      if (!neighbor.isVisited && !neighbor.isWall) {
        neighbors.push(neighbor);
      }
    }
  }

  return neighbors;
}

function isValidNeighbor(row, col, grid) {
  return row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;
}
