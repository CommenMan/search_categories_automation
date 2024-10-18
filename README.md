
# Project Name

This project consists of three Node.js scripts that perform specific tasks:

1. `retrive_from_csv.js`: This script retrieves data from a CSV file and processes it.
2. `retriveImageURL.js`: This script extracts image URLs from the data processed by the first script.
3. `download.js`: This script downloads the images using the URLs extracted in the second step.

## Scripts in `package.json`

```json
"scripts": {
   "run-all": "node retrive_from_csv.js && node retriveImageURL.js && node download.js",
   "createJSON": "node retrive_from_csv.js",
   "retrieveURL": "node retriveImageURL.js",
   "download": "node download.js"
}
```

### How to Run

You can run all the commands at once or run each script separately.

#### To run all commands at once:

```bash
npm run run-all
```

This will execute all three scripts in sequence: 
1. `retrive_from_csv.js`
2. `retriveImageURL.js`
3. `download.js`

#### To run each script separately:

1. Run the first script:
   ```bash
   npm run createJSON
   ```
2. Then, run the second script:
   ```bash
   npm run retrieveURL
   ```
3. Finally, run the third script:
   ```bash
   npm run download
   ```

### Prerequisites

Make sure you have Node.js installed and the required dependencies before running the scripts.

