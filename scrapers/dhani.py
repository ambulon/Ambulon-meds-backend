import requests
import bs4

name = "combiflam"
url = f"https://pharmacy.dhani.com/searchproduct/search_product"

payload = {
    "category": "all",
    "search": "paracip"
}

result = requests.post(url, json=payload)
result.raise_for_status()
soup = bs4.BeautifulSoup(result.content, "lxml")

print(soup)

# hit_list = soup.find('div', class_='style__grid-container___3OfcL')
# parent_div = hit_list.find('div')
# price = parent_div.find('div').getText()
# index = price.index('₹')
# price = price[index:]
# price = price[:-3]
# print(price)