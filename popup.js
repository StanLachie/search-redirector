document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.getElementById("search-engines");
  const form = document.getElementById("add-redirect-form");
  const importButton = document.getElementById("import-button");
  const importFile = document.getElementById("import-file");
  const exportButton = document.getElementById("export-button");
  const importError = document.getElementById("import-error");

  function populateTable(searchEngines) {
    tbody.innerHTML = "";
    searchEngines.forEach((engine, index) => {
      const row = document.createElement("tr");

      const nameCell = document.createElement("td");
      nameCell.textContent = engine.name;
      row.appendChild(nameCell);

      const suffixesCell = document.createElement("td");
      suffixesCell.textContent = engine.suffixes.join(", ");
      row.appendChild(suffixesCell);

      const urlCell = document.createElement("td");
      urlCell.textContent = engine.url;
      row.appendChild(urlCell);

      const actionCell = document.createElement("td");
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => {
        deleteSearchEngine(index);
      });
      actionCell.appendChild(deleteButton);
      row.appendChild(actionCell);

      tbody.appendChild(row);
    });
  }

  function loadSearchEngines() {
    chrome.storage.local.get("searchEngines", (data) => {
      const searchEngines = data.searchEngines || [];
      populateTable(searchEngines);
    });
  }

  function saveSearchEngines(searchEngines, callback) {
    chrome.storage.local.set({ searchEngines }, callback);
  }

  function deleteSearchEngine(index) {
    chrome.storage.local.get("searchEngines", (data) => {
      const searchEngines = data.searchEngines || [];
      searchEngines.splice(index, 1);
      saveSearchEngines(searchEngines, loadSearchEngines);
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const suffixes = document
      .getElementById("suffixes")
      .value.split(",")
      .map((s) => s.trim());
    const url = document.getElementById("url").value;

    chrome.storage.local.get("searchEngines", (data) => {
      const searchEngines = data.searchEngines || [];
      searchEngines.push({ name, suffixes, url });
      saveSearchEngines(searchEngines, () => {
        loadSearchEngines();
        form.reset();
      });
    });
  });

  importButton.addEventListener("click", () => {
    const file = importFile.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedEngines = JSON.parse(e.target.result);

        if (
          !Array.isArray(importedEngines) ||
          importedEngines.some(
            (engine) =>
              !engine.name || !Array.isArray(engine.suffixes) || !engine.url
          )
        ) {
          throw new Error("Invalid JSON format");
        }

        chrome.storage.local.get("searchEngines", (data) => {
          const searchEngines = data.searchEngines || [];

          importedEngines.forEach((importedEngine) => {
            const existingEngine = searchEngines.find(
              (engine) => engine.url === importedEngine.url
            );

            if (existingEngine) {
              importedEngine.suffixes.forEach((suffix) => {
                if (!existingEngine.suffixes.includes(suffix)) {
                  existingEngine.suffixes.push(suffix);
                }
              });
            } else {
              searchEngines.push(importedEngine);
            }
          });

          saveSearchEngines(searchEngines, () => {
            loadSearchEngines();
          });
        });

        importError.style.display = "none";
      } catch (error) {
        importError.textContent = "Invalid JSON format";
        importError.style.display = "block";
      }
    };

    reader.readAsText(file);
  });

  exportButton.addEventListener("click", () => {
    chrome.storage.local.get("searchEngines", (data) => {
      const searchEngines = data.searchEngines || [];
      const blob = new Blob([JSON.stringify(searchEngines, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "searchEngines.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  });

  loadSearchEngines();
});
