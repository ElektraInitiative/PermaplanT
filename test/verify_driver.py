from seleniumbase import get_driver
driver = get_driver("chrome", headless=True)
driver.get("https://www.google.com/chrome")
driver.quit()
exit()
