# nectarflower-js

JavaScript utilities for working with the `nectarflower` account's `json_metadata` on the Hive blockchain — primarily for keeping a [dhive](https://github.com/hiveio/dhive) client up to date with a curated list of Hive nodes.

## Modules

### node-updater.js

Fetches the node list published in the `nectarflower` account's JSON metadata and reinitializes a dhive client with it. Automatically filters out any nodes marked as failing.

**Exports:**

- `getNodesFromAccount(accountName)` — fetches and returns `{ nodes, failing_nodes }` from the account metadata
- `reinitializeDhive(nodeData)` — creates a new dhive client from a node list, skipping failing/invalid URLs
- `updateNodesFromAccount(accountName)` — convenience wrapper that does both and returns the updated client

```javascript
const { updateNodesFromAccount } = require("./node-updater");

updateNodesFromAccount("nectarflower")
  .then((client) => client.database.getDynamicGlobalProperties())
  .then((props) => console.log("Head block:", props.head_block_number))
  .catch(console.error);
```

### example-usage.js

Walks through each step individually — initializing a default client, fetching node data, reinitializing with the updated list, and running a test query. Good reference for understanding how the pieces fit together.

```bash
node example-usage.js
```

## Web Example

`web_example/` is a browser-based dashboard that fetches and displays the `nectarflower` account's full JSON metadata in a readable, syntax-highlighted format. Open `index.html` directly in a browser — no build step needed.

## Installation

```bash
npm install
```

## Shoutouts

- [dhive](https://github.com/hiveio/dhive) for the Hive JS library
- [nectarflower](https://peakd.com/@nectarflower) for maintaining the curated node list
