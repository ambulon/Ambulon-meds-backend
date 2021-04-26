import requests
from bs4 import BeautifulSoup
from selenium import webdriver
import sys

name = sys.argv[1]
url = f"https://www.1mg.com/search/all?name={name}"

options = webdriver.ChromeOptions()
options.add_argument('--ignore-certificate-errors')
options.add_argument('--incognito')
options.add_argument('--headless')
driver = webdriver.Chrome("./util/chromedriver", options=options)

driver.get(url)
page = driver.page_source
soup = BeautifulSoup(page, 'lxml')
driver.quit()

hit_list = soup.find('div', class_='style__grid-container___3OfcL')
parent_div = hit_list.find('div')
price = parent_div.find('div').getText()
index = price.index('₹')
price = price[index+1:]
price = price[:-3]
print(price)
