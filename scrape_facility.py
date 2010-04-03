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

question_id = 0 # Global comment xref to tie it to a specific question

def parseFacilityPage(page):
	inspections = []
	compliance_categories = []
	compliance_results = []
	compliance_descriptions = []
	questions = []
	question = []
	comments = []
	compliancedescriptiontext = ""
	global question_id

	for node in page.getElementsByTagName('doc'):
		for child in node.getElementsByTagName('arr'):
			if child.getAttribute('name')=="fs_insp_en": #id
				print "\tENGLISH INSPECTIONS"
				for child in child.getElementsByTagName('inspection'):
					if child.getAttribute('inspectionid') !="": #id
						facilitydetailid = ""
						print "\t\tFound Inspection ID" + child.getAttribute('inspectionid')
						inspection_id = child.getAttribute('inspectionid')
						facilitydetailid = child.getAttribute('facilitydetailid')
						inspection_date = child.getAttribute('inspectiondate')
						in_compliance = child.getAttribute('isincompliance')
						if (in_compliance == ''):
							in_compliance = 0
						closure_date = child.getAttribute('closuredate')
						report_number = child.getAttribute('reportnumber')

						# Loop through each question and get the details for each inspection question
						for child in child.getElementsByTagName('question'):
							question = []
							sort = child.getAttribute('sort')
							complianceresultcode = child.getAttribute('complianceresultcode')
							complianceresulttext = child.getAttribute('complianceresulttext')
							risklevel = child.getAttribute('risklevel``')
							compliancecategorycode = child.getAttribute('compliancecategorycode')
							compliancecategorytext = child.getAttribute('compliancecategorytext')
							compliancedescriptioncode = child.getAttribute('compliancedecriptioncode')
							question_id = question_id + 1  # unique identifier for this question used to link comments to a given question

							## Fetch Question text contained in qtext element
							el = child.getElementsByTagName('qtext')
							for element in el:
								compliancedescriptiontext = element.firstChild.data

							## Fetch comment text within <comment> element - there can be more than 1 comment per question
							comment = child.getElementsByTagName('comment')
							for element in comment:
								comments.append((question_id, element.firstChild.data))
							#print "\t\t\tComments"
							#print comments
						#	for child in node.getElementsByTagName('qtext')
					#			 = child.firstChild.data
					#		for child in node.getElementsByTagName('comment')
					#			compliancedescriptiontext = child.firstChild.data

							# Add to questions stack
							question.append((question_id, inspection_id, sort, complianceresultcode, risklevel, compliancecategorycode, compliancedescriptioncode))
							#print "\t\t\tQuestion"
							#print question
							# add to category code stack
							compliance_categories.append((compliancecategorycode, compliancecategorytext))

							# add to results code stack
							compliance_results.append((complianceresultcode, complianceresulttext))

							compliance_descriptions.append((compliancedescriptioncode, compliancedescriptiontext))

							# add to description stack #todo
							#compliance_descriptions.append(compliancedescriptioncode,compliancedescriptiontext)
						questions.append(question)
						inspections.append((inspection_id,facilitydetailid,inspection_date, in_compliance, closure_date, report_number))

			if child.getAttribute('name')=="fs_insp_fr": #id
				print "\tFRENCH INSPECTIONS"
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
	print "\t\tInserting Inspections for " + facilitydetailid
	for item in inspections:
		print item
		cursor.execute("INSERT INTO api_inspection (id, facilitydetailid, inspectiondate, isincompliance,closuredate, reportnumber) VALUES (%s,%s,%s,%s,%s,%s) ON DUPLICATE KEY UPDATE id = VALUES(id)", item)

	print "\t\tInserting Questions for " + facilitydetailid
	for question in questions:
		for item in question:
			#print "blah"
			cursor.execute("INSERT INTO api_question (id, inspection_id_id, sort, complianceresultcode, risklevelid,compliancecategorycode, compliancedescriptioncode) VALUES (%s,%s,%s,%s,%s,%s,%s) ON DUPLICATE KEY UPDATE id = VALUES(id)", item)

	print "\t\tInserting Comments for " + facilitydetailid
	for comment in comments:
		#print comment
		cursor.execute("INSERT INTO api_comments (question_id, comment_en) VALUES (%s,%s)", comment)


	print "\t\tInserting Descriptions for " + facilitydetailid
	for desc in compliance_descriptions:
		cursor.execute("INSERT INTO api_compliancedescription (id, text_en) VALUES (%s,%s) ON DUPLICATE KEY UPDATE id = VALUES(id)", desc)

	cursor.close

	# print each description
	#for description in compliance_descriptions:
	#	print description



def scrape_facility(fsid):
	print "### FETCHING PAGE: " + fsid
	opener = urllib2.build_opener()
	opener.addheaders = [('User-agent', 'OpenOttawa.org EatSafe XML-Eater/1.0')]
	xml_url = XML_URL+fsid
	contents = opener.open(xml_url).read()
	page = minidom.parseString(contents)
	facility = parseFacilityPage(page)


start = time.time() # start timer
db = MySQLdb.connect(host="localhost", user=DB_USER, passwd=DB_PASSWORD,db=DB_DATABASE)

cursor = db.cursor()
cursor.execute("TRUNCATE api_question") # clear out existing questions
cursor.execute("TRUNCATE api_comments") # clear out existing questions
cursor.execute("TRUNCATE api_inspection") # clear out existing inspections
cursor.close()

# Fetch result set to loop through to get details for
#db.query("SELECT detailid FROM api_facility WHERE detailid = 'B789A388-ED35-490D-A68F-518EA3893A88' OR detailid = 'F1583008-A6C6-4070-9F3E-D4CB0D97AE20'")#
db.query("SELECT detailid FROM api_facility")#
r = db.store_result()
for row in r.fetch_row(6000):
	scrape_facility(row[0]) # row [0] is the detail id
	time.sleep(3) # wait three seconds


end = time.time()
print 'Fetch completed in '+ str((end - start)/60) + " minutes."

