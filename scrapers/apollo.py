import requests
from bs4 import BeautifulSoup
from selenium import webdriver

name = "combiflam"
url = f"https://www.apollopharmacy.in/tsearch?q={name}"

options = webdriver.ChromeOptions()
options.add_argument('--ignore-certificate-errors')
options.add_argument('--incognito')
options.add_argument('--headless')
driver = webdriver.Chrome("../util/chromedriver", options=options)

driver.get(url)
page = driver.page_source
soup = BeautifulSoup(page, 'lxml')
driver.quit()

med = soup.find_all('a', class_='product-link')[0]
price = med.find_all('span', class_='product-sale-price')[0].getText()
price = price[1:]
print(price)