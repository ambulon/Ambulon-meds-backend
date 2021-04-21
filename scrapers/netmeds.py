import requests
from bs4 import BeautifulSoup
from selenium import webdriver

name = "paracip"
url = f"https://www.netmeds.com/catalogsearch/result?q={name}"

options = webdriver.ChromeOptions()
options.add_argument('--ignore-certificate-errors')
options.add_argument('--incognito')
options.add_argument('--headless')
driver = webdriver.Chrome("../util/chromedriver", options=options)

driver.get(url)
page = driver.page_source
soup = BeautifulSoup(page, 'lxml')
driver.quit()

med = soup.select('.ais-InfiniteHits-item')[0]
price = med.find_all('span', class_='final-price')[0].getText()
price = price[2:]
print(price)