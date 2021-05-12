import requests
from bs4 import BeautifulSoup
from selenium import webdriver
import sys
import os

try:
    name = sys.argv[1]
    url = f"https://www.netmeds.com/catalogsearch/result?q={name}"

    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument('--ignore-certificate-errors')
    chrome_options.add_argument('--incognito')
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    driver = webdriver.Chrome(
        "./util/chromedriver.exe", chrome_options=chrome_options)

    driver.get(url)
    page = driver.page_source
    soup = BeautifulSoup(page, 'lxml')
    driver.quit()

    med = soup.select('.ais-InfiniteHits-item')[0]
    price = med.find_all('span', class_='final-price')[0].getText()
    price = price[2:]
    print(price)

except:
    print("-01.00")
