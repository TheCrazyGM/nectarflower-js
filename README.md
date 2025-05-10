# flowerengine-js

A JavaScript library for retrieving Hive-Engine node information from the FlowerEngine account's JSON metadata.

## Features

- Fetch Hive-Engine node list from the FlowerEngine account metadata
- Get both active and failing nodes with detailed information
- Simple API for integrating with your Hive-Engine applications

## node-updater.js

Core module that fetches the list of Hive-Engine nodes from the FlowerEngine account.

```javascript
// Example usage
updateNodesFromAccount("flowerengine")
  .then(({ nodes, failing_nodes }) => {
    console.log("Node update complete. Nodes:");
    nodes.forEach((node, idx) => console.log(`${idx + 1}. ${node}`));
    
    if (Object.keys(failing_nodes).length > 0) {
      console.log("Failing nodes:");
      Object.entries(failing_nodes).forEach(([node, reason]) => {
        console.log(`- ${node}: ${reason}`);
      });
    }
  })
  .catch(error => {
    console.error("Error:", error);
  });
```

## example-usage.js

A practical example showing how to:

1. Fetch the list of Hive-Engine nodes from the FlowerEngine account
2. Use one of the nodes to query token information from the Hive-Engine blockchain

```javascript
// Fetch nodes and query token information
async function demonstrateNodeUpdater() {
  try {
    // Get nodes from FlowerEngine account
    const { nodes } = await nodeUpdater.updateNodesFromAccount();
    
    // Use a node to query token information
    const nodeUrl = nodes[0];
    const apiUrl = `${nodeUrl}/contracts`;
    
    // Query SWAP.HIVE token information
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "find",
        params: {
          contract: "tokens",
          table: "tokens",
          query: { symbol: "SWAP.HIVE" },
          limit: 1
        }
      })
    });
    
    const data = await response.json();
    console.log("Token info:", data.result);
  } catch (error) {
    console.error("Error:", error.message);
  }
}
```

## web_example

A web interface for viewing the account JSON metadata from FlowerEngine in a readable format.

## Installation

```bash
npm install @hiveio/dhive
```

## Shoutouts

- [dhive](https://github.com/hiveio/dhive) for the JavaScript library that makes Hive blockchain interaction possible
- [FlowerEngine](https://peakd.com/@flowerengine) for maintaining the list of Hive-Engine nodes
