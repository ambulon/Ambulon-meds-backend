import requests
import bs4

name = "combiflam"
url = f"https://www.1mg.com/search/all?name={name}"
s = requests.Session()
s.headers = {'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:87.0) Gecko/20100101 Firefox/87.0'}	

result = s.get(url)
result.raise_for_status()
soup = bs4.BeautifulSoup(result.content, "lxml")

hit_list = soup.find('div', class_='style__grid-container___3OfcL')
parent_div = hit_list.find('div')
price = parent_div.find('div').getText()
index = price.index('₹')
price = price[index:]
price = price[:-3]
print(price)