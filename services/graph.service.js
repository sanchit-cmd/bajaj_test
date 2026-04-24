const isValidEdge = (str) => {
  if (typeof str !== "string") return false;
  if (!/^[A-Z]->[A-Z]$/.test(str)) return false;
  const [p, c] = str.split("->");
  if (p === c) return false;
  return true;
};

const processEdges = (data) => {
  const invalid_entries = [];
  const duplicate_edges = [];
  const seenEdges = new Set();
  const edges = [];

  if (!Array.isArray(data)) {
    return {
      hierarchies: [],
      invalid_entries: [],
      duplicate_edges: [],
      summary: { total_trees: 0, total_cycles: 0, largest_tree_root: "" }
    };
  }

  for (let raw of data) {
    if (!isValidEdge(raw)) {
      invalid_entries.push(raw);
      continue;
    }
    
    if (seenEdges.has(raw)) {
      duplicate_edges.push(raw);
      continue;
    }
    seenEdges.add(raw);
    edges.push(raw);
  }

  const children = {};
  const parent = {};
  const nodes = new Set();

  for (let e of edges) {
    const [p, c] = e.split("->");
    nodes.add(p);
    nodes.add(c);
    if (parent[c]) continue;
    parent[c] = p;
    if (!children[p]) children[p] = [];
    children[p].push(c);
  }

  const visited = new Set();
  const hierarchies = [];

  const dfsCycle = (node, visiting, visitedLocal) => {
    if (visiting.has(node)) return true;
    if (visitedLocal.has(node)) return false;
    visiting.add(node);
    visitedLocal.add(node);
    for (let child of children[node] || []) {
      if (dfsCycle(child, visiting, visitedLocal)) return true;
    }
    visiting.delete(node);
    return false;
  };

  const buildTree = (node) => {
    let obj = {};
    for (let child of children[node] || []) {
      obj[child] = buildTree(child);
    }
    return obj;
  };

  const getDepth = (node) => {
    if (!children[node] || children[node].length === 0) return 1;
    return 1 + Math.max(...children[node].map(getDepth));
  };

  const sortedNodes = [...nodes].sort();

  for (let node of sortedNodes) {
    if (visited.has(node)) continue;
    
    let stack = [node];
    let component = new Set();
    while (stack.length) {
      let curr = stack.pop();
      if (component.has(curr)) continue;
      component.add(curr);
      visited.add(curr);
      for (let c of children[curr] || []) stack.push(c);
      if (parent[curr]) stack.push(parent[curr]);
    }

    let root = [...component].sort().find((n) => !parent[n]);
    if (!root) {
      root = [...component].sort()[0];
    }

    const hasCycle = dfsCycle(root, new Set(), new Set());
    if (hasCycle) {
      hierarchies.push({ root, tree: {}, has_cycle: true });
    } else {
      const tree = {};
      tree[root] = buildTree(root);
      hierarchies.push({ root, tree, depth: getDepth(root) });
    }
  }

  let total_trees = 0;
  let total_cycles = 0;
  let maxDepth = 0;
  let largest_tree_root = "";

  for (let h of hierarchies) {
    if (h.has_cycle) {
      total_cycles++;
    } else {
      total_trees++;
      if (
        largest_tree_root === "" ||
        h.depth > maxDepth ||
        (h.depth === maxDepth && h.root < largest_tree_root)
      ) {
        maxDepth = h.depth;
        largest_tree_root = h.root;
      }
    }
  }

  return {
    hierarchies,
    invalid_entries,
    duplicate_edges,
    summary: {
      total_trees,
      total_cycles,
      largest_tree_root,
    },
  };
};

module.exports = { processEdges };
