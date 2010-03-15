import urllib2
from BeautifulSoup import BeautifulStoneSoup
from xml.dom import minidom
import MySQLdb
import math
import time

XML_URL = "http://ottawa.ca/cgi-bin/search/inspections/q.pl?ss=details_en&sq_fs_fdid="
DB_USER = "fsi"
DB_PASSWORD = "fsi"
DB_DATABASE = "fsi"
DB_HOST = "localhost"


def parseFacilityPage(page):
	inspections = []
	compliance_categories = []
	compliance_results = []
	compliance_descriptions = []
	questions = []
	question = []

	for node in page.getElementsByTagName('doc'):
		for child in node.getElementsByTagName('arr'):
			if child.getAttribute('name')=="fs_insp_en": #id
				print "ENGLISH INSPECTIONS"
				for child in node.getElementsByTagName('inspection'):
					if child.getAttribute('inspectionid') !="": #id
						print "Found Inspection ID" + child.getAttribute('inspectionid')
						inspection_id = child.getAttribute('inspectionid')
						facilitydetailid = child.getAttribute('facilitydetailid')
						inspection_date = child.getAttribute('inspectiondate')
						in_compliance = child.getAttribute('isincompliance')
						closure_date = child.getAttribute('closuredate')
						report_number = child.getAttribute('reportnumber')
						for child in node.getElementsByTagName('question'):
							question = []
							sort = child.getAttribute('sort')
							complianceresultcode = child.getAttribute('complianceresultcode')
							complianceresulttext = child.getAttribute('complianceresulttext')
							risklevel = child.getAttribute('risklevel')
							compliancecategorycode = child.getAttribute('compliancecategorycode')
							compliancecategorytext = child.getAttribute('compliancecategorytext')
							compliancedescriptioncode = child.getAttribute('compliancedescriptioncode')

							# Add to questions stack
							question.append((inspection_id, sort, complianceresultcode, risklevel, compliancecategorycode, compliancedescriptioncode))

							# add to category code stack
							compliance_categories.append((compliancecategorycode, compliancecategorytext))

							# add to results code stack
							compliance_results.append((complianceresultcode, complianceresulttext))

							# add to description stack #todo
							#compliance_descriptions.append(compliancedescriptioncode,compliancedescriptiontext)
						questions.append(question)
						inspections.append((inspection_id,facilitydetailid,inspection_date, in_compliance, closure_date, report_number))
			if child.getAttribute('name')=="fs_insp_fr": #id
				print "FRENCH INSPECTIONS"
				#print child.firstChild.data
#				if child.getAttribute('name')=="fs_fdid": #id
#					inspection_id = child.firstChild.data
#        reports.append((f_id,f_name,f_area_en,f_area_fr,f_sticker,f_prov_en,f_prov_fr,f_pcode,f_city,f_street_num,f_street_name, f_phone, f_last_date, f_compliant))
            #inspections.append((inspection_id))
	#print inspections
	#print questions
	#print compliance_categories
	#print compliance_results

	db = MySQLdb.connect(host=DB_HOST, user=DB_USER, passwd=DB_PASSWORD,db=DB_DATABASE)
	cursor = db.cursor()
	# clean out db
	#cursor.execute("TRUNCATE locations")
	# dynamically generate SQL statements from  list
	#cursor.executemany("INSERT INTO locations (fsi_id, name, area_en, area_fr, sticker, province_en, province_fr, postal_code, city, street_number, street_name, phone, last_date, is_compliant) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)", reports)
	print "Inserting Inspections for " + facilitydetailid
	for item in inspections:
		#print item
		cursor.execute("INSERT INTO api_inspection (id, facilitydetailid, inspectiondate, isincompliance,closuredate, reportnumber) VALUES (%s,%s,%s,%s,%s,%s) ON DUPLICATE KEY UPDATE id = VALUES(id)", item)

	print "Inserting Questions for " + facilitydetailid
	for question in questions:
		for item in question:
			cursor.execute("INSERT INTO api_question (inspection_id_id, sort, complianceresultcode, risklevelid,compliancecategorycode, compliancedescriptioncode) VALUES (%s,%s,%s,%s,%s,%s) ON DUPLICATE KEY UPDATE id = VALUES(id)", item)
	cursor.close




def scrape_facility(fsid):
	print "### FETCHING PAGE: " + fsid
	opener = urllib2.build_opener()
	opener.addheaders = [('User-agent', 'OpenOttawa.org EatSafe XML-Eater/1.0')]
	xml_url = XML_URL+fsid
	contents = opener.open(xml_url).read()
	page = minidom.parseString(contents)
	facility = parseFacilityPage(page)







print
start = time.time()
db = MySQLdb.connect(host="localhost", user=DB_USER, passwd=DB_PASSWORD,db=DB_DATABASE)
db.query("SELECT detailid FROM api_facility")
r = db.store_result()
for row in r.fetch_row(1):
	scrape_facility(row[0])
	time.sleep(3)


end = time.time()
print 'Fetch completed in '+ str((end - start)/60) + " minutes."


#scrape_facility("07978096-FAB2-4CBF-A694-411A908A6F3A")

#f = open('firstpage.xml', 'r')
#fcontents = f.read()
#f.close()


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


#numPages = getTotalPages()
#fetchPages()



#soup = BeautifulStoneSoup(page)

#numResults = soup.xml.head.title
#print soup.prettify()
#for incident in soup('td', width="90%"):
 #   where, linebreak, what = incident.contents[:3]
  #  print where.strip()
   # print what.strip()
    #print
