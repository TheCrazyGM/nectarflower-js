/**
 * Example Usage of Node Updater
 * This script demonstrates how to use the node-updater.js module
 */

// Import the node updater module
const nodeUpdater = require("./node-updater");

// Import dhive directly for comparison purposes
const dhive = require("@hiveio/dhive");

// Account to fetch nodes from
const accountName = "nectarflower";

// Function to demonstrate the node updater usage
async function demonstrateNodeUpdater() {
  console.log("Starting node updater demonstration...");
  console.log("----------------------------------------");

  // Step 1: Show the default client setup
  const defaultClient = new dhive.Client(["https://api.hive.blog"]);
  console.log("Default dhive client initialized with:", defaultClient.address);

  // Step 2: Get account metadata and extract nodes
  console.log("\nFetching nodes from account metadata...");
  try {
    const nodeData = await nodeUpdater.getNodesFromAccount(accountName);
    console.log("Extracted nodes:", nodeData.nodes);
    if (Object.keys(nodeData.failing_nodes).length > 0) {
      console.log("Failing nodes:", nodeData.failing_nodes);
    }

    // Step 3: Reinitialize dhive with the updated node list
    console.log("\nReinitializing dhive with updated node list...");
    const updatedClient = nodeUpdater.reinitializeDhive(nodeData);
    console.log(
      "Updated dhive client initialized with:",
      updatedClient.address,
    );

    // Step 4: Test the updated client with a simple query
    console.log("\nTesting updated client with a query...");
    const props = await updatedClient.database.getDynamicGlobalProperties();
    console.log(
      "Query successful! Current block number:",
      props.head_block_number,
    );

    // Step 5: Use the all-in-one function
    console.log(
      "\nDemonstrating the all-in-one updateNodesFromAccount function...",
    );
    const oneStepClient = await nodeUpdater.updateNodesFromAccount(accountName);
    console.log(
      "One-step update complete. Client initialized with:",
      oneStepClient.address,
    );

    console.log("\nDemonstration completed successfully!");
  } catch (error) {
    console.error("Error during demonstration:", error.message);
  }
}

// Run the demonstration
demonstrateNodeUpdater();
