// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');


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

refresh.addEventListener('click', function()
{
	Titanium.UI.createAlertDialog({title:'Blah', message:'REFRESH'}).show();
	Titanium.API.debug("refresh location + nearby");
});

win1.barColor = '#385292';

//
// CREATE SEARCH BAR
//
var search = Titanium.UI.createSearchBar({
	barColor:'#385292',
	showCancel:false
});
search.addEventListener('change', function(e)
{
   e.value // search string as user types
});

search.addEventListener('return', function(e)
{
   search.blur();
});
search.addEventListener('cancel', function(e)
{
   search.blur();
});

var tableView;
var data = [];

// create first row
var row = Ti.UI.createTableViewRow();
row.backgroundColor = '#979797';
row.selectedBackgroundColor = '#385292';
row.height = 40;
var clickLabel = Titanium.UI.createLabel({
	text:'Nearby',
	color:'#fff',
	textAlign:'left',
	font:{fontSize:14},
	width:'auto',
	height:'auto'
});
row.className = 'header';
row.add(clickLabel);
data.push(row);

// when you click the header, scroll to the bottom


// create update row (used when the user clicks on the row)
var updateRow = Ti.UI.createTableViewRow();
updateRow.backgroundColor = '#13386c';
updateRow.selectedBackgroundColor = '#13386c';

// add custom property to identify this row
updateRow.isUpdateRow = true;
var updateRowText = Ti.UI.createLabel({
	color:'#fff',
	font:{fontSize:20, fontWeight:'bold'},
	text:'You clicked on...',
	width:'auto',
	height:'auto'
});
updateRow.add(updateRowText);

// create a var to track the active row
var currentRow = null;
var currentRowIndex = null;

// create the rest of the rows
for (var c=1;c<50;c++)
{
	var row = Ti.UI.createTableViewRow();
	row.selectedBackgroundColor = '#fff';
	row.height  =100;
	row.className = 'datarow';


	var photo = Ti.UI.createView({
		backgroundImage:'../images/custom_tableview/user.png',
		top:5,
		left:10,
		width:50,
		height:50
	});
	photo.addEventListener('click', function(e)
	{
		Ti.API.info('photo click ' + e.source.rowNum + ' new row ' + updateRow);

		// use rowNum property on object to get row number
		var rowNum = e.source.rowNum;
		updateRowText.text = 'You clicked on the photo';
		//TODO: FIX UPDATE ROW
		//tableView.updateRow(rowNum,updateRow,{animationStyle:Titanium.UI.iPhone.RowAnimationStyle.LEFT});

	});
	photo.rowNum = c;
	row.add(photo);


	var user = Ti.UI.createLabel({
		color:'#576996',
		font:{fontSize:16,fontWeight:'bold', fontFamily:'Arial'},
		left:70,
		top:2,
		height:30,
		width:200,
		text:'1 FOR '+c+' PIZZA '
	});
	user.addEventListener('click', function(e)
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

	var comment = Ti.UI.createLabel({
		color:'#222',
		font:{fontSize:16,fontWeight:'normal', fontFamily:'Arial'},
		left:70,
		top:21,
		height:50,
		width:200,
		text:'1234 Bank St.'
	});
	comment.addEventListener('click', function(e)
	{
		// use rowNum property on object to get row number
		var rowNum = e.source.rowNum;
		updateRowText.text = 'You clicked on the comment';

		// TODO: FIX UPDATE ROW
		//tableView.updateRow(rowNum,updateRow,{animationStyle:Titanium.UI.iPhone.RowAnimationStyle.LEFT});
	});

	comment.rowNum = c;
	row.add(comment);

	var calendar = Ti.UI.createView({
		backgroundImage:'../images/custom_tableview/eventsButton.png',
		bottom:2,
		left:70,
		width:32,
		height:32
	});
	calendar.addEventListener('click', function(e)
	{
		// use rowNum property on object to get row number
		var rowNum = e.source.rowNum;
		updateRowText.text = 'You clicked on the calendar';

		// TODO: FIX UPDATE ROW
		//tableView.updateRow(rowNum,updateRow,{animationStyle:Titanium.UI.iPhone.RowAnimationStyle.LEFT});
	});

	calendar.rowNum = c;
	row.add(calendar);

	var button = Ti.UI.createView({
		backgroundImage:'../images/custom_tableview/commentButton.png',
		top:35,
		right:5,
		width:36,
		height:34
	});
	button.addEventListener('click', function(e)
	{
		// use rowNum property on object to get row number
		var rowNum = e.source.rowNum;
		updateRowText.text = 'You clicked on the comment button';

		// TODO: FIX UPDATE ROW
		//tableView.updateRow(rowNum,updateRow,{animationStyle:Titanium.UI.iPhone.RowAnimationStyle.LEFT});
	});

	button.rowNum = c;
	row.add(button);


    data.push(row);
}


//
// create table view (
//
tableView = Titanium.UI.createTableView({
	data:data,
	search:search,
	filterAttribute:'filter'
});

tableView.addEventListener('click', function(e)
{
	if (currentRow != null && e.row.isUpdateRow == false)
	{
		//TODO: FIX UPDATE ROW
		//tableView.updateRow(currentRowIndex, currentRow, {animationStyle:Titanium.UI.iPhone.RowAnimationStyle.RIGHT});
	}
	currentRow = e.row;
	currentRowIndex = e.index;

})

//init();
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


Titanium.Geolocation.getCurrentPosition(
  function(pos) {
    // what to do if getCurrentPosition was successful
    // `pos` will be the object shown above in "Returns"

	Titanium.API.debug(pos.coords.latitude + ", " + pos.coords.longitude);
  },
  function() {
    // what to do if getCurrentPosition failed
	Titanium.API.debug("Couldn't get location");
  }
);

 // Make Network Request
try {
	Titanium.API.debug("Trying to open network connection");
	var xhr = Titanium.Network.createHTTPClient();
	xhr.open('GET','http://openottawa.org/api/fsi/nearby.php');

	xhr.onload = function() {
        //do work on "this.responseXML"
		Titanium.API.debug("Success - got "+ this.responseText);
	 	alert(this.responseText);

    };
}
catch(err) {
    Titanium.UI.createAlertDialog({
        title: "Error",
        message: String(err),
        buttonNames: ['OK']
    }).show();
}




// open tab group
tabGroup.open();