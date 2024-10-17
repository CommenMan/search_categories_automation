

//--------------3rd script------------------------
const fs = require('fs');
const puppeteer = require('puppeteer');

// Read the category names from the JSON file
const categories = JSON.parse(fs.readFileSync('categories_name.json', 'utf8'));

// Check if a progress file already exists and load the data
let urls = {};
if (fs.existsSync('urls_by_category.json')) {
  urls = JSON.parse(fs.readFileSync('urls_by_category.json', 'utf8'));
} else {
  categories.forEach(category => {
    urls[category] = [];  // Initialize empty arrays for each category
  });
}

// Function to save URLs after processing each category
function saveProgress() {
  fs.writeFileSync('urls_by_category.json', JSON.stringify(urls, null, 2));
  console.log('Progress saved to urls_by_category.json');
}

// Global browser variable
let browser;

async function initializeBrowser() {
  browser = await puppeteer.launch({
    headless: false,  // Set to true for headless mode
  });
}

async function processCategories() {
  const page = await browser.newPage();
  await page.goto('https://www.craiyon.com/');
  await page.setViewport({ width: 1080, height: 1024 });

  // Loop through the categories and resume from where it left off
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];

    // Skip categories that are already processed
    if (urls[category].length > 0) {
      console.log(`Skipping category: ${category} (Already processed)`);
      continue;
    }

    console.log(`Processing category: ${category}`);
    await page.locator(`#prompt`).fill(category);
    await page.waitForSelector(`img[alt='Cropped input']`);

    // Loop to extract URLs for the current category
    for (let j = 1; j <= 10; j++) {
      try {
        const anchorHandle = await page.$(`a:nth-child(${j}) > div:nth-child(2) > img`);
        if (anchorHandle) {
          const href = await page.evaluate(anchor => anchor.getAttribute('src'), anchorHandle);
          console.log(`${category}: ${href}`);
          urls[category].push(href);
        }
      } catch (err) {
        console.error(`Error processing image ${j} for category ${category}:`, err);
      }
    }

    // Save after processing each category
    saveProgress();

    // Clear the input field
    const textArea = await page.$('#prompt');
    await textArea.click({ clickCount: 3 });
    await textArea.type(String.fromCharCode(8));  // Backspace
    await textArea.type(String.fromCharCode(127));  // Delete
  }

  await page.close();
}

(async () => {
  let retry = true;

  while (retry) {
    try {
      // Initialize the browser
      await initializeBrowser();
      
      // Process all categories
      await processCategories();
      
      // Exit loop if no error occurs
      retry = false;

    } catch (err) {
      console.error('Error occurred:', err);

      // Save progress before reinitializing
      saveProgress();

      // Close the browser in case of an error
      if (browser) {
        await browser.close();
      }

      // Retry by reinitializing the browser
      console.log('Reinitializing browser and retrying...');
    }
  }

  console.log('Process completed. All URLs saved to urls_by_category.json');
})();
