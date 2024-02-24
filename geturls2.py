from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time

# Setup WebDriver with headless option
options = Options()
options.headless = True
service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service, options=options)

base_url = "https://www.srx.com.sg/singapore-property-listings/condo-for-sale"
page_num = 1  # Start from the first page

# Open file to write urls
with open("listing_urls_2.txt", "w") as file:
    while page_num <= 1600:  # Ensure the loop does not exceed 1600 pages
        try:
            # Construct URL for current page
            url = f"{base_url}?page={page_num}" if page_num > 1 else base_url
            driver.get(url)

            # Use WebDriverWait to wait for the listings to load
            listings = WebDriverWait(driver, 10).until(
                EC.presence_of_all_elements_located((By.CSS_SELECTOR, ".listingDetailsDiv a.listingDetailTitle"))
            )

            # If no listings are found, end scrape
            if not listings:
                print("No more listings found. Ending scrape.")
                break

            # Write each listing URL to the file
            for listing in listings:
                file.write(listing.get_attribute('href') + '\n')

            # Print page number once every 50 pages with progress marker
            if page_num % 50 == 0 or page_num == 1:
                print(f"Page {page_num} done")
        except Exception as e:
            print(f"An error occurred on page {page_num}: {e}")
            # Optionally, break or continue depending on your error handling preference

        page_num += 1

# Cleanup
driver.quit()
print("Scraping complete, URLs saved to listing_urls_2.txt.")
