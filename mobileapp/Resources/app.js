// Include JSON parser
Titanium.include('json2.js');

//Include app header
//Titanium.include('header.js');

//Construct main content views
//Titanium.include('json2.js'); // Creates a 'chooser' view we manipulate in the main app

// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');


var actInd = Titanium.UI.createActivityIndicator({
	top:10,
	height:50,
	width:10,
	color:'#000000',
	style:Titanium.UI.iPhone.ActivityIndicatorStyle.DARK
});


function displayResults(result) {

}

function getResults(term, nearby) {
	actInd.show();
	try {
		var xhr = Titanium.Network.createHTTPClient();

		if (nearby == true) {
			Titanium.API.debug("GETTING NEARBY");

			Titanium.Geolocation.getCurrentPosition(
			  function(pos) {
			    // what to do if getCurrentPosition was successful
			    // `pos` will be the object shown above in "Returns"
				nearbyUrl = 'http://openottawa.org/api/fsi/nearby.php?lat='+pos.coords.latitude+"&lon="+pos.coords.longitude;
				Titanium.API.debug(nearbyUrl);
				xhr.open('GET', nearbyUrl);
				xhr.send();
				Titanium.API.debug("Got coords - " + pos.coords.latitude + ", " + pos.coords.longitude);
			  },
			  function() {
			    // what to do if getCurrentPosition failed
				alert("Couldn't get location - do plain search instead");
			  }
			);

		} else {
			xhr.open('GET','http://openottawa.org/api/fsi/nearby.php');
			Titanium.API.debug("getting ALL");
		}

		xhr.onload = function() {
	        //do work on "this.responseXML"
			Titanium.API.debug("Success - got "+ this.responseText);

			// parse data back into magic
			//responseData = JSON.parse(text, function (key, value) {
			//   var type;
			//    if (value && typeof value === 'object') {
			//        type = value.type;
			//        if (typeof type === 'string' && typeof window[type] === 'function') {
			//            return new (window[type])(value);
			//        }
			//    }
			//    return value;
			//});
			actInd.hide();
	    };

	}
	catch(err) {
	    Titanium.UI.createAlertDialog({
	        title: "Error",
	        message: String(err),
	        buttonNames: ['OK']
	    }).show();
		actInd.message = null;
		actInd.hide();
	}
}

// create tab group
var tabGroup = Titanium.UI.createTabGroup();

//
// create base UI tab and root window
//
var win1 = Titanium.UI.createWindow({
    title:'Eat Safe Ottawa',
    backgroundColor:'#fff'
});
var tab1 = Titanium.UI.createTab({
    icon:'KS_nav_views.png',
    title:'Places',
    window:win1
});

var refresh = Titanium.UI.createButton({
	systemButton:Titanium.UI.iPhone.SystemButton.REFRESH
});



win1.barColor = '#0071ce';

//
// CREATE SEARCH BAR
//
var search = Titanium.UI.createSearchBar({
	barColor:'#0071ce',
	showCancel:false
});

refresh.addEventListener('click', function()
{
	getResults('pizza', true);
	Titanium.API.debug("refresh location + nearby");
});

search.addEventListener('change', function(e)
{
   e.value // search string as user types
});

search.addEventListener('return', function(e)
{
   getResults(e.value, false);
   search.blur();
});
search.addEventListener('cancel', function(e)
{
   search.blur();
});

var tableView;
var data = [
	{title:'1 FOR 1 PIZZA', hasDetail:true, id:'123', address:'1415 Bank St.', city:'Ottawa',phone:'613-555-1212'},
	{title:'Royal Thai', hasDetail:true, id:'456', address:'1415 Bank St.', city:'Ottawa',phone:'613-555-1212'},
	{title:'Sante Restaurant', hasDetail:true, id:'789', address:'1415 Bank St.', city:'Ottawa',phone:'613-555-1212'},
	{title:'Royal Oak', hasDetail:true, id:'101112', address:'1415 Bank St.', city:'Ottawa',phone:'613-555-1212'}
];





/*
// create the rest of the rows
for (var c=1;c<50;c++)
{
	var row = Ti.UI.createTableViewRow();
	row.selectedBackgroundColor = '#fff';
	row.height = 50;
	row.className = 'datarow';


	var user = Ti.UI.createLabel({
		color:'#000',
		font:{fontSize:16,fontWeight:'bold', fontFamily:'Helvetica Neue'},
		left:10,
		top:5,
		height:20,
		width:200,
		text:'1 FOR '+c+' PIZZA '
	});

	row.addEventListener('click', function(e)
	{
		// use rowNum property on object to get row number
		var rowNum = e.source.rowNum;
		updateRowText.text = 'You clicked on the user';
		// TODO: FIX UPDATE ROW
		//tableView.updateRow(rowNum,updateRow,{animationStyle:Titanium.UI.iPhone.RowAnimationStyle.LEFT});
	});

	row.filter = user.text;

	user.rowNum = c;
	row.add(user);

	var address = Ti.UI.createLabel({
		color:'#222',
		font:{fontSize:14,fontWeight:'normal', fontFamily:'Arial'},
		left:10,
		top:22,
		height:20,
		width:200,
		text:'1234 Bank St.'
	});

	address.addEventListener('click', function(e)
	{
		// use rowNum property on object to get row number
		var rowNum = e.source.rowNum;
		updateRowText.text = 'You clicked on the comment';

		// TODO: FIX UPDATE ROW
		//tableView.updateRow(rowNum,updateRow,{animationStyle:Titanium.UI.iPhone.RowAnimationStyle.LEFT});
	});

	address.rowNum = c;
	row.add(address);
    data.push(row);
}

*/
//
// create table view (
//
tableView = Titanium.UI.createTableView({
	data:data,
	search:search,
	filterAttribute:'title'
});



// create table view event listener
tableView.addEventListener('click', function(e)
{
	// event data
	var index = e.index;
	var section = e.section;
	var row = e.row;
	var rowdata = e.rowData;

	// custom property
	var id = e.rowData.id;
	var address = e.rowData.address;
	var city = e.rowData.city;
	var phone = e.rowData.phone;

	//
		// create window with right nav button
		//
		var detail = Titanium.UI.createWindow({
			backgroundColor:'#0071ce',
			barColor:'#0071ce',
			translucent:true
		});

		var detailview = Titanium.UI.createView({backgroundColor:'#000'});

		// Restaurant Label
		var detailTitle = Titanium.UI.createLabel({
		color:'#fff',
		font:{fontSize:16,fontWeight:'bold', fontFamily:'Helvetica'},
		left:10,
		top:50,
		height:20,
		width:200,
		text:e.rowData.title
		});

		//Details
		var detailAddress = Titanium.UI.createLabel({
			color:'#fff',
			font:{fontSize:12,fontWeight:'normal', fontFamily:'Helvetica'},
			left:10,
			top:70,
			height:30,
			width:200,
			text:address + "\n" + phone
		});

		var curWin = Titanium.UI.currentWindow;

		detail.add(detailview);


		//actInd.show();
		tab1.open(detail,{animated:true});
		detail.add(detailTitle);
		detail.add(detailAddress);
		//actInd.hide();

	//Titanium.UI.createAlertDialog({title:'Table View',message:'custom value ' + id}).show();
});


//init();
win1.add(actInd);
win1.add(tableView);
win1.setRightNavButton(refresh);


//
// create controls tab and root window
//
var win2 = Titanium.UI.createWindow({
    title:'About',
    backgroundColor:'#fff'
});
var tab2 = Titanium.UI.createTab({
    icon:'KS_nav_ui.png',
    title:'About',
    window:win2
});

var label2 = Titanium.UI.createLabel({
	color:'#999',
	text:'I am Window 2',
	font:{fontSize:20,fontFamily:'Helvetica Neue'}
});

win2.add(label2);



//
//  add tabs
//
tabGroup.addTab(tab1);
tabGroup.addTab(tab2);


// open tab group
tabGroup.open();

if (!Titanium.Network.online) {
  var a = Titanium.UI.createAlertDialog({
    title:'Network Connection Required',
    message: 'EatSafeOttawa requires an internet connection to, you know, get stuff from the internet.  Check your network connection and try again.'
  });
	a.show();
}
// Fetch initial results
getResults('pizza',true);

