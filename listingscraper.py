from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.common.exceptions import TimeoutException
import time
from bs4 import BeautifulSoup
import csv

# Your scrape_amenities function here



def scrape_amenities(soup):
    categories = {
        "Primary Schools": [],
        "Secondary Schools": [],
        "Shopping Malls": [],
        "Groceries & Supermarts": []
    }

    category_map = {
        "Primary Schools": "listing-amenities-school",      
        "Secondary Schools": "listing-amenities-school",
        "Shopping Malls": "listing-amenities-other",
        "Groceries & Supermarts": "listing-amenities-shopping"
    }

    for category, class_name in category_map.items():
        for amenity_wrapper in soup.find_all("div", class_="listing-amenities-wrapper"):
            # Use 'string=' instead of 'text='
            category_div = amenity_wrapper.find("div", class_=class_name, string=category)
            if category_div:
                amenities = amenity_wrapper.find_all("div", class_="listing-amenity")
                for amenity in amenities:
                    name = amenity.find("div", class_="listing-amenity-name").text.strip()
                    distance = amenity.find("span", class_="listing-amenity-distance").text.strip()
                    categories[category].append({name: distance})
    
    return categories
def main():
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service)
    
    # CSV file setup
    csv_file = open('scraped_data.csv', 'a', newline='', encoding='utf-8')
    fieldnames = ['Address', 'Property Name', 'Property Type', 'Bedrooms', 'Bathrooms', 'Asking Price', 'Size', 'PSF', 'Age', 'Tenure', 'No. of Units', 'District', 'Amenities', 'Link']
    writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
    writer.writeheader()

    # Open the file with URLs
    with open('listing_urls_2_unique.txt', 'r') as file:
        urls = file.readlines()
    error_file = open('error_urls.txt', 'a') 
    # Process only the first 10 URLs for simulation
    for url_index, url in enumerate(urls[4540:]):
        url = url.strip()  # Remove any leading/trailing whitespace characters
        if url:  # Check if the URL is not empty
            # Open the URL with Selenium
            try:
                driver.get(url)

                # Wait for the page to load
                time.sleep(1)

                # Parse the page with BeautifulSoup
                soup = BeautifulSoup(driver.page_source, 'html.parser')

                # Extracting the property details as per your existing logic
                # Make sure to adjust the data extraction part to match your fields
                # Example:
                bathroom_element = soup.find("div", id="bathroom")
                bathrooms = bathroom_element.get_text(strip=True) if bathroom_element else 'Not Available'
                data = {
    "Address": soup.find("div", itemprop="value").get_text(strip=True) if soup.find("div", itemprop="value") else 'Not Available',
    "Property Name": soup.find("a", itemprop="value").get_text(strip=True) if soup.find("a", itemprop="value") else 'Not Available',
    "Property Type": soup.find("div", id="property-type").get_text(strip=True) if soup.find("div", id="property-type") else 'Not Available',
    "Bedrooms": soup.find("div", id="bedroom").get_text(strip=True) if soup.find("div", id="bedroom") else 'Not Available',
    "Bathrooms": bathrooms,  # Use the variable from the example above
    "Asking Price": soup.find("div", string="Asking").find_next("div").text.strip() if soup.find("div", string="Asking") else 'Not Available',
    "Size": soup.find("span", itemprop="value", string=lambda x: x and "sqft" in x).get_text(strip=True) if soup.find("span", itemprop="value", string=lambda x: x and "sqft" in x) else 'Not Available',
    "PSF": soup.find("span", itemprop="value", string=lambda x: x and "psf" in x).get_text(strip=True) if soup.find("span", itemprop="value", string=lambda x: x and "psf" in x) else 'Not Available',
    "Age": str(2024 - int(soup.find("div", id="built-year").text.strip())) if soup.find("div", id="built-year") else 'Not Available',
    "Tenure": soup.find("div", string="Tenure").find_next_sibling("div").get_text(strip=True) if soup.find("div", string="Tenure") else 'Not Available',
    "No. of Units": soup.find(string="No. of Units").find_next().text.strip() if soup.find(string="No. of Units") else 'Not Available',
    "District": soup.find(string="District").find_next("a").text.strip() if soup.find(string="District") else 'Not Available',
}
                amenities = scrape_amenities(soup)
                data['Amenities'] = amenities
                data['Link'] = url

                        # Write the extracted data to the CSV file
                writer.writerow(data)
            except TimeoutException as e:
                print(f"Timeout encountered for URL: {url}. Skipping...")
                error_file.write(f"{url}\n")
                error_file.write(str(e) + '\n')
                continue  # Skip the current URL and continue with the next one
            except Exception as e:
                error_file.write(f"{url}\n")
                error_file.write(e)
    
    # Close the CSV file and Selenium driver after all URLs are processed
    csv_file.close()
    driver.quit()

if __name__ == "__main__":
    main()
