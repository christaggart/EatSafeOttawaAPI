import urllib2
from BeautifulSoup import BeautifulStoneSoup
from xml.dom import minidom
import math
import time
import MySQLdb

APP_ID = "QY43DcDV34G0dGJTmg5GSDo534JlQpp_.q0vHDVDw51GXZF1X2yRXp8QW_mXC_.fYgM"
GEO_URL = "http://local.yahooapis.com/MapsService/V1/geocode?appid="+ APP_ID #"&street=701+First+Ave&city=Sunnyvale&state=CA"

DB_USER = "fsi"
DB_PASSWORD = "fsi"
DB_DATABASE = "fsi"
DB_HOST = "localhost"


def getText(nodelist):
    rc = ""
    for node in nodelist:
        if node.nodeType == node.TEXT_NODE:
            rc = rc + node.data
    return rc

def geocodeAddress(row):
	item = []
	location_id = row[0]
	what = "street="+urllib2.quote(row[2]+""+row[3])+"&city="+urllib2.quote(row[4])+"&state=ON"
	get_url = GEO_URL + "&"+what
	print get_url

	try:
		c = urllib2.urlopen(get_url)
	except IOError, e:
		if hasattr(e, 'reason'):
			print 'We failed to reach a server.'
			print 'Reason: ', e.reason
		elif hasattr(e, 'code'):
			print 'The server couldn\'t fulfill the request.'
			print 'Error code: ', e.code
	else:
		# everything is fine
		xml = minidom.parseString(c.read())
		for node in xml.getElementsByTagName('ResultSet'):
			for child in node.getElementsByTagName('Result'):
					lat = child.getElementsByTagName('Latitude')[0].firstChild.data
					lon = child.getElementsByTagName('Longitude')[0].firstChild.data
		print row[0] + " - " + row[1] + " is located at " + lat + ", " + lon

		item.append((location_id, lat, lon))
		cursor = db.cursor()
		cursor.execute("INSERT INTO api_coords (location_id, lat, lon) VALUES (%s,%s,%s) ON DUPLICATE KEY UPDATE lat = VALUES(lat), lon = VALUES(lon)", item[0])
		cursor.close
		return "success"


db = MySQLdb.connect(host=DB_HOST, user=DB_USER, passwd=DB_PASSWORD,db=DB_DATABASE)
db.query("SELECT detailid, name, street_number, street_name, city FROM api_facility WHERE detailid NOT IN (SELECT location_id FROM api_coords)")
r = db.store_result()

start = time.time()
for row in r.fetch_row(5000):

	geocodeAddress(row)
	time.sleep(0.5)

end = time.time()
print 'Fetch completed in '+ str((end - start)/60) + " minutes."

