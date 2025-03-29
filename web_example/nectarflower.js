// nectarflower.js

// Initialize dhive client
document.addEventListener("DOMContentLoaded", function () {
  const client = new dhive.Client(["https://api.hive.blog"]);
  const accountName = "nectarflower";

  // Set account name in the header
  document.getElementById("account-name").textContent = accountName;

  // Add refresh button functionality
  document.getElementById("refresh-btn").addEventListener("click", function () {
    fetchAccountMetadata(accountName);
  });

  // Initial fetch
  fetchAccountMetadata(accountName);

  async function fetchAccountMetadata(accountName) {
    // Show loading spinner
    document.getElementById("loading").classList.remove("d-none");
    document.getElementById("dashboard").classList.add("d-none");

    try {
      const accounts = await client.database.getAccounts([accountName]);

      if (accounts.length > 0) {
        const account = accounts[0];
        const jsonMetadata = account.json_metadata;

        // Try to parse the JSON metadata
        try {
          const metadataObj = JSON.parse(jsonMetadata);
          displayMetadata(metadataObj);
        } catch (parseError) {
          // If parsing fails, display as raw text
          displayRawMetadata(jsonMetadata);
        }
      } else {
        displayError("Account not found");
      }
    } catch (error) {
      console.error("Error fetching account metadata:", error);
      displayError("Error fetching metadata: " + error.message);
    }

    // Hide loading spinner and show dashboard
    document.getElementById("loading").classList.add("d-none");
    document.getElementById("dashboard").classList.remove("d-none");
  }

  function displayMetadata(metadataObj) {
    const container = document.getElementById("metadata-container");

    // Clear previous content
    container.innerHTML = "";

    // Create sections for each top-level property
    Object.entries(metadataObj).forEach(([key, value]) => {
      const section = document.createElement("div");
      section.className = "mb-4";

      const sectionTitle = document.createElement("h4");
      sectionTitle.className = "mb-3";
      sectionTitle.innerHTML = `<i class="bi bi-tag me-2"></i>${key}`;
      section.appendChild(sectionTitle);

      const sectionContent = document.createElement("div");
      sectionContent.className = "card";

      const cardBody = document.createElement("div");
      cardBody.className = "card-body";

      // Format the value based on its type
      if (typeof value === "object" && value !== null) {
        const formattedJson = document.createElement("pre");
        formattedJson.className = "mb-0";
        formattedJson.innerHTML = syntaxHighlight(
          JSON.stringify(value, null, 2),
        );
        cardBody.appendChild(formattedJson);
      } else if (typeof value === "string" && isValidUrl(value)) {
        // If it's a URL, make it clickable
        const link = document.createElement("a");
        link.href = value;
        link.target = "_blank";
        link.textContent = value;
        cardBody.appendChild(link);
      } else {
        // For simple values
        cardBody.textContent = value;
      }

      sectionContent.appendChild(cardBody);
      section.appendChild(sectionContent);
      container.appendChild(section);
    });
  }

  function displayRawMetadata(rawJson) {
    const container = document.getElementById("metadata-container");
    container.innerHTML = `
    <div class="alert alert-warning mb-3">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      Unable to parse JSON metadata. Displaying raw content.
    </div>
    <pre>${rawJson}</pre>
  `;
  }

  function displayError(message) {
    const container = document.getElementById("metadata-container");
    container.innerHTML = `
    <div class="alert alert-danger">
      <i class="bi bi-exclamation-circle-fill me-2"></i>
      ${message}
    </div>
  `;
  }

  function syntaxHighlight(json) {
    // Add syntax highlighting to JSON
    return json
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(
        /"(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
        function (match) {
          let cls = "json-number";
          if (/^"/.test(match)) {
            if (/:$/.test(match)) {
              cls = "json-key";
            } else {
              cls = "json-string";
            }
          } else if (/true|false/.test(match)) {
            cls = "json-boolean";
          } else if (/null/.test(match)) {
            cls = "json-null";
          }
          return '<span class="' + cls + '">' + match + "</span>";
        },
      );
  }

  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }
});
