# Search Redirector Extension

This Chrome extension allows you to redirect searches based on keywords. You can add custom search engines with suffixes to quickly navigate to your favorite sites. You can also import a JSON file to bulk add search engines.

## Features

- Redirect searches based on suffixes.
- Add, delete, and import search engines.
- Minimal dark-themed UI.

## Getting Started

### Prerequisites

- Google Chrome browser

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/StanLachie/search-redirector.git
   cd search-redirector
   ```

2. **Open Chrome and navigate to the Extensions page:**

   ```text
   chrome://extensions/
   ```

3. **Enable Developer Mode:**

   Toggle the switch for Developer Mode in the top right corner.

4. **Load the extension:**

   Click on `Load unpacked` and select the cloned repository directory.

### Usage

1. **Open the extension:**

   Click on the extension icon in the Chrome toolbar.

2. **Add a new redirect:**

   - Fill in the `Name`, `Suffixes`, and `URL` fields.
   - Click `Add Redirect`.

3. **Import redirects:**

   - Click on the `Import JSON` button.
   - Select a JSON file in the following format:

     ```json
     [
       {
         "name": "duckduckgo",
         "suffixes": ["ddg", "duck", "dgo"],
         "url": "https://duckduckgo.com/?q="
       }
     ]
     ```

   - If a URL already exists, the different suffixes will be added without deleting the existing ones.

4. **Delete a redirect:**

   Click the `Delete` button next to the search engine you want to remove.

### Suggested Engines

A file named `suggestedEngines.json` is included in the repository. This file contains some suggested search engines to help you get started. You can import this file using the import functionality mentioned above.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.
