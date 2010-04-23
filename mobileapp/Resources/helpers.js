/* Helper functions for app.js */

function format_mysqldate (mysqldate) {
	// example mysql date: 2008-01-27 20:41:25
	// we need to replace the dashes with slashes
	var date = String(mysqldate).replace(/\-/g, '/');
	return format_date(date);
}
function format_date (date) {
	// date can be in msec or in a format recognized by Date.parse()
	var d = new Date(date);

	var days_of_week = Array('Sun','Mon','Tue','Wed','Thu','Fri','Sat');
	var day_of_week = days_of_week[d.getDay()];

	var year = d.getFullYear();
	var months = Array('Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec');
	var month = months[d.getMonth()];
	var day = d.getDate();

	var hour = d.getHours();
	var minute = d.getMinutes();
	var am_pm = 'am';

	if(hour == 0) {
		hour = 12;
	} else if (hour == 12) {
		am_pm = 'pm';
	} else if (hour > 12) {
		hour -= 12;
		am_pm = 'pm';
	}
	if(minute < 10) { minute = '0'+minute; }

	var date_formatted = month+' '+day+', '+year;
	return date_formatted;
}


function isoDateStringToDate (datestr) {
  if (! this.re) {
    // The date in YYYY-MM-DD or YYYYMMDD format
    var datere = "(\\d{4})-?(\\d{2})-?(\\d{2})";
    // The time in HH:MM:SS[.uuuu] or HHMMSS[.uuuu] format
    var timere = "(\\d{2}):?(\\d{2}):?(\\d{2}(?:\\.\\d+)?)";
    // The timezone as Z or in +HH[:MM] or -HH[:MM] format
    var tzre = "(Z|(?:\\+|-)\\d{2}(?:\\:\\d{2})?)?";
    this.re = new RegExp("^" + datere + "[ T]" + timere + tzre + "$");
  }

  var matches = this.re.exec(datestr);
  if (! matches)
    return null;

  var year = matches[1];
  var month = matches[2] - 1;
  var day = matches[3];
  var hour = matches[4];
  var minute = matches[5];
  var second = Math.floor(matches[6]);
  var ms = matches[6] - second;
  var tz = matches[7];
  var ms = 0;
  var offset = 0;

  if (tz && tz != "Z") {
    var tzmatches = tz.match(/^(\+|-)(\d{2})(\:(\d{2}))$/);
    if (tzmatches) {
      offset = Number(tzmatches[2]) * 60 + Number(tzmatches[4]);
      if (tzmatches[1] == "-")
        offset = -offset;
    }
  }

  offset *= 60 * 1000;
  var dateval = Date.UTC(year, month, day, hour, minute, second, ms) - offset;

  return new Date(dateval);
}