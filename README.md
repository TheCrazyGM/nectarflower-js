# nectarflower-js

Example Uses of the NectarFlower `account_json_metatdata` in js

## node-updater.js

Module to reinstate dhive with the nodelist from nectarflower

```javascript
// Example usage
updateNodesFromAccount("nectarflower")
  .then((updatedClient) => {
    console.log("Node update complete");
    // Use the updated client for further operations
    return updatedClient.database.getDynamicGlobalProperties();
  })
  .then((result) => {
    console.log(
      "Test query with updated client successful:",
      result.head_block_number,
    );
  })
  .catch((error) => {
    console.error("Error:", error);
  });
```

## example-usage.js

Pretty exhaustive usage of the node-updater.js module for testing and example

## web_example

Output of the `account_json_metatdata` from nectarflower in fairly readable format

## Shoutouts

- [dhive](https://github.com/hiveio/dhive) for the js library, I'm still learning how to use javascript and I couldn't play on hive without it.
