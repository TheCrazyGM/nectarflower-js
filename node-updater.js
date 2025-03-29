/**
 * Node Updater for Hive
 * This script fetches account JSON metadata, extracts the node dictionary,
 * and reinitializes dhive with the updated nodelist.
 */

// Import dhive library
const dhive = require("@hiveio/dhive");

// Initial client with a default node
let client = new dhive.Client(["https://api.hive.blog"]);

/**
 * Fetches account JSON metadata and extracts node information
 * @param {string} accountName - The Hive account to fetch metadata from
 * @returns {Promise<Object>} - Object containing nodes and failing_nodes
 */
async function getNodesFromAccount(accountName) {
  try {
    console.log(`Fetching account metadata for ${accountName}...`);

    // Get account information
    const accounts = await client.database.getAccounts([accountName]);

    if (accounts.length === 0) {
      throw new Error(`Account '${accountName}' not found`);
    }

    const account = accounts[0];
    const jsonMetadata = account.json_metadata;

    // Parse JSON metadata
    let metadataObj;
    try {
      metadataObj = JSON.parse(jsonMetadata);
      console.log("Successfully parsed account JSON metadata");
    } catch (parseError) {
      throw new Error(`Failed to parse JSON metadata: ${parseError.message}`);
    }

    // Extract nodes from metadata in the format from results.json
    if (!metadataObj.nodes || !Array.isArray(metadataObj.nodes)) {
      throw new Error("No nodes array found in account metadata");
    }

    // Create a result object similar to results.json format
    const result = {
      nodes: metadataObj.nodes,
      failing_nodes: metadataObj.failing_nodes || {},
    };

    console.log(`Found ${result.nodes.length} nodes in account metadata`);
    if (Object.keys(result.failing_nodes).length > 0) {
      console.log(
        `Found ${Object.keys(result.failing_nodes).length} failing nodes in account metadata`,
      );
    }

    return result;
  } catch (error) {
    console.error(`Error fetching nodes: ${error.message}`);
    throw error;
  }
}

/**
 * Reinitializes dhive client with updated node list
 * @param {Object} nodeData - Object containing nodes and failing_nodes
 * @returns {dhive.Client} - New dhive client instance
 */
function reinitializeDhive(nodeData) {
  if (!nodeData || !nodeData.nodes || nodeData.nodes.length === 0) {
    console.warn("No valid nodes provided, using default node");
    return client; // Return existing client with default node
  }

  // Filter out invalid URLs and remove any nodes that are in the failing_nodes list
  const failingNodeUrls = nodeData.failing_nodes
    ? Object.keys(nodeData.failing_nodes)
    : [];

  const validNodes = nodeData.nodes.filter((node) => {
    // Skip if node is in failing_nodes list
    if (failingNodeUrls.includes(node)) {
      console.warn(
        `Skipping failing node: ${node} - Reason: ${nodeData.failing_nodes[node]}`,
      );
      return false;
    }

    // Validate URL format
    try {
      new URL(node);
      return true;
    } catch (_) {
      console.warn(`Invalid node URL: ${node}`);
      return false;
    }
  });

  if (validNodes.length === 0) {
    console.warn("No valid nodes found, using default node");
    return client; // Return existing client with default node
  }

  console.log(`Reinitializing dhive with ${validNodes.length} nodes`);
  // Create new client with updated node list
  client = new dhive.Client(validNodes);
  return client;
}

/**
 * Main function to update nodes and reinitialize dhive
 * @param {string} accountName - The Hive account to fetch metadata from
 * @returns {Promise<dhive.Client>} - Updated dhive client
 */
async function updateNodesFromAccount(accountName = "nectarflower") {
  try {
    const nodeData = await getNodesFromAccount(accountName);
    const updatedClient = reinitializeDhive(nodeData);
    console.log("Successfully updated dhive client with new nodes");
    return updatedClient;
  } catch (error) {
    console.error(`Failed to update nodes: ${error.message}`);
    // Return existing client if update fails
    return client;
  }
}

// Export functions for use in other files
module.exports = {
  getNodesFromAccount,
  reinitializeDhive,
  updateNodesFromAccount,
};

// Example usage (uncomment to run directly)
/*
updateNodesFromAccount('nectarflower')
  .then(updatedClient => {
    console.log('Node update complete');
    // Use the updated client for further operations
    return updatedClient.database.getDynamicGlobalProperties();
  })
  .then(result => {
    console.log('Test query with updated client successful:', result.head_block_number);
  })
  .catch(error => {
    console.error('Error:', error);
  });
*/
