import urllib2, time, os, glob
from BeautifulSoup import BeautifulStoneSoup
from xml.dom import minidom
import MySQLdb
import settings

#XML_URL = "http://ottawa.ca/cgi-bin/search/inspections/q.pl?ss=results_en&sq_app_id=fsi&sort=fs_fnm%20asc"
#c = urllib2.urlopen(XML_URL)
#contents = c.read()
#f = open('firstpage.xml', 'w')
#f.write(contents)
#f.close()

#f = open('firstpage.xml', 'r')
#fcontents = f.read()
#f.close()


reports = []

def compileResults(xmlPage):
   for node in page.getElementsByTagName('doc'):
        for child in node.getElementsByTagName('str'):
              if child.getAttribute('name')=="fs_fdid": #id
                 f_id = child.firstChild.data
              if child.getAttribute('name')=="fs_fnm": # name
                 f_name =child.firstChild.data
              if child.getAttribute('name')=="fs_fa_en": #area_en
                 f_area_en =child.firstChild.data
              if child.getAttribute('name')=="fs_fa_fr": #area_fr
                 f_area_fr =child.firstChild.data
              if child.getAttribute('name')=="fs_fstic": #sticker?
                 f_sticker =child.firstChild.data
              if child.getAttribute('name')=="fs_fsp_en": #prov en
                 f_prov_en =child.firstChild.data
              if child.getAttribute('name')=="fs_fsp_fr": #prov fr
                 f_prov_fr =child.firstChild.data
              if child.getAttribute('name')=="fs_fspc": #postal code
                 if (child.firstChild):
                    f_pcode = child.firstChild.data
                 else:
                    f_pcode = ""
              if child.getAttribute('name')=="fs_fsc": #city
                 if (child.firstChild):
                    f_city =child.firstChild.data
                 else:
                    f_city = ""
              if child.getAttribute('name')=="fs_fsf": #street number
                 if (child.firstChild):
                    f_street_num =child.firstChild.data
                 else:
                    f_street_num = ""
              if child.getAttribute('name')=="fs_fss": # street address
                 if (child.firstChild):
                    f_street_name =child.firstChild.data
                 else:
                    f_street_name = ""
              if child.getAttribute('name')=="fs_fsph": # phone
                 if (child.firstChild):
                    f_phone=child.firstChild.data
                 else:
                    f_phone = ''
              if child.getAttribute('name')=="fs_fcr_date": # last inspection date
                 if (child.firstChild):
                    f_last_date = child.firstChild.data
                 else:
                    f_last_date = ''
              if child.getAttribute('name')=="fs_fcr": # in compliance?
                 if (child.firstChild):
                    f_compliant =child.firstChild.data
                 else:
                    f_compliant = ''

#        reports.append((f_id,f_name,f_area_en,f_area_fr,f_sticker,f_prov_en,f_prov_fr,f_pcode,f_city,f_street_num,f_street_name, f_phone, f_last_date, f_compliant))
        reports.append((f_id,f_name,f_area_en,f_area_fr,f_pcode,f_city,f_street_num,f_street_name, f_phone))
   return reports



# loop through folder and get each file
path = 'fsi/in_old/'
for infile in glob.glob( os.path.join(path, '*.xml') ):
  print "reading :" + infile
  page = minidom.parse(infile)
  compileResults(page)

#print reports
# connect
db = MySQLdb.connect(host=DB_HOST, user=DB_USER, passwd=DB_PASSWORD,db=DB_DATABASE)

# create a cursor
cursor = db.cursor()

# clean out db
#cursor.execute("TRUNCATE locations")

# dynamically generate SQL statements from  list
#cursor.executemany("INSERT INTO locations (fsi_id, name, area_en, area_fr, sticker, province_en, province_fr, postal_code, city, street_number, street_name, phone, last_date, is_compliant) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)", reports)
for item in reports:
	cursor.execute("INSERT INTO api_facility (detailid, name, area_en, area_fr, postal_code, city, street_number, street_name, phone) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s) ON DUPLICATE KEY UPDATE name = VALUES(name)", item)
cursor.close

#soup = BeautifulStoneSoup(page)

#numResults = soup.xml.head.title
#print soup.prettify()
#for incident in soup('td', width="90%"):
 #   where, linebreak, what = incident.contents[:3]
  #  print where.strip()
   # print what.strip()
    #print
