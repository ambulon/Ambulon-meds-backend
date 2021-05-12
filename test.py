import requests
from bs4 import BeautifulSoup
from selenium import webdriver
import sys
import os

count = 0
name = sys.argv[1]

chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument('--ignore-certificate-errors')
chrome_options.add_argument('--incognito')
chrome_options.add_argument('--headless')
chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument('--disable-dev-shm-usage')
driver = webdriver.Chrome(
    "./util/chromedriver.exe", options=chrome_options)


def main():
    func1()
    func2()
    func3()
    driver.quit()


def func1():
    try:
        # netmeds
        url = f"https://www.netmeds.com/catalogsearch/result?q={name}"

        driver.get(url)
        page = driver.page_source
        soup = BeautifulSoup(page, 'lxml')

        med = soup.select('.ais-InfiniteHits-item')[0]
        price = med.find_all('span', class_='final-price')[0].getText()
        price = price[2:]
        print(price)
    except:
        print("-01.00")


def func2():
    try:
        # 1mg
        url = f"https://www.1mg.com/search/all?name={name}"

        driver.get(url)
        page = driver.page_source
        soup = BeautifulSoup(page, 'lxml')

        hit_list = soup.find('div', class_='style__grid-container___3OfcL')
        parent_div = hit_list.find('div')
        price = parent_div.find('div').getText()
        index = price.index('₹')
        price = price[index+1:]
        price = price[:-3]
        print(price)
    except:
        print("-01.00")


def func3():
    try:
        # apollo
        url = f"https://www.apollopharmacy.in/search-medicines/{name}"

        driver.get(url)
        page = driver.page_source
        soup = BeautifulSoup(page, 'lxml')

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
            func3()
        else:
            print("-01.00")


main()
