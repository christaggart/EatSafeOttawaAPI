import urllib2
from BeautifulSoup import BeautifulStoneSoup
from xml.dom import minidom
import math
import time

XML_URL = "http://ottawa.ca/cgi-bin/search/inspections/q.pl?ss=results_en&sq_app_id=fsi&sort=fs_fnm%20asc"
DB_USER = "fsi"
DB_DATABASE = "fsi"
DB_HOST = "localhost"
DB_PASSWORD = "fsi"
RESULTS_PER_PAGE = 10

# saved to a file for use in testing so we don't have to fetch the page each time
c = urllib2.urlopen(XML_URL)
contents = c.read()
f = open('firstpage.xml', 'w')
f.write(contents)
f.close()

f = open('firstpage.xml', 'r')
fcontents = f.read()
f.close()


def getTotalPages():
	page = minidom.parse('firstpage.xml')
	numRows = page.getElementsByTagName('totalRows')[0].firstChild.data
	numPages = int(numRows) / 10
	if (numPages*RESULTS_PER_PAGE) < numRows:
		numPages += 1
	return int(numPages)


def fetchPages():
   start = time.time()
   for i in range(numPages):
      fetch_url = XML_URL + ';start=' + str((i)*10)
      print 'Fetching - '+ fetch_url
      c = urllib2.urlopen(fetch_url)
      contents = c.read()
      f = open('fsi/in/fsi_'+str((i)*10)+'.xml', 'w')
      f.write(contents)
      f.close()
      time.sleep(3)
   end = time.time()
   print 'Fetch completed in '+ str((end - start)/60) + " minutes."


numPages = getTotalPages()
fetchPages()