import requests
from bs4 import BeautifulSoup
from selenium import webdriver
import sys

count = 0


def main():
    try:
        name = sys.argv[1]
        url = f"https://www.apollopharmacy.in/search-medicines/{name}"

        options = webdriver.ChromeOptions()
        options.add_argument('--ignore-certificate-errors')
        options.add_argument('--incognito')
        options.add_argument('--headless')
        driver = webdriver.Chrome("./util/chromedriver", options=options)

        driver.get(url)
        page = driver.page_source
        soup = BeautifulSoup(page, 'lxml')
        driver.quit()

        parent = soup.find_all('div', class_='jss6')[0]
        lvl1 = parent.find('div', class_='jss7')
        lvl2 = lvl1.find('div', class_='jss11')
        lvl3 = lvl2.find('div', class_='jss178')
        lvl4 = lvl3.find('div', class_='jss173')
        lvl5 = lvl4.find('div', class_='jss155')
        lvl6 = lvl5.find('div', class_='jss172')
        med = lvl6.find('div', class_='jss158')
        price = med.getText()
        price = price[4:]
        print(price)

    except:
        global count
        count += 1
        if count < 4:
            main()
        else:
            print("-01.00")


main()
