# Read URLs from file and add them to a set for uniqueness
unique_urls = set()
with open('listing_urls_2.txt', 'r') as file:
    for url in file:
        unique_urls.add(url.strip())

# Write the unique URLs back to a file
with open('listing_urls_2_unique.txt', 'w') as file:
    for url in unique_urls:
        file.write(url + '\n')
