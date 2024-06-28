export function dfs(grid, startNode, finishNode) {
  const stack = [startNode];
  const visitedNodesInOrder = [];
  const visited = new Set(); // Track visited nodes using a set for O(1) lookup
  
  while (stack.length > 0) {
    const currentNode = stack.pop();

    if (visited.has(`${currentNode.row},${currentNode.col}`)) continue; // Skip already visited nodes
    visited.add(`${currentNode.row},${currentNode.col}`); // Mark node as visited

    visitedNodesInOrder.push(currentNode);

    if (currentNode === finishNode) return visitedNodesInOrder;

    const neighbors = getNeighbors(currentNode, grid);
    for (const neighbor of neighbors) {
      if (!visited.has(`${neighbor.row},${neighbor.col}`) && !neighbor.isWall) {
        neighbor.previousNode = currentNode;
        stack.push(neighbor);
      }
    }
  }

  return visitedNodesInOrder;
}

function getNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;

  // Check top neighbor
  if (row > 0) neighbors.push(grid[row - 1][col]);
  
  // Check bottom neighbor
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  
  // Check left neighbor
  if (col > 0) neighbors.push(grid[row][col - 1]);
  
  // Check right neighbor
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  
  return neighbors;
}
