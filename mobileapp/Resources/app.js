

// Include JSON parser
Titanium.include('json2.js');

//Include app header
//Titanium.include('header.js');

//Construct main content views
//Titanium.include('json2.js'); // Creates a 'chooser' view we manipulate in the main app

// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#eee');
var isLoaded = 0;
var lat = 0;
var lon = 0;
var results = [];
var tableView;
var data = [];

var info = [
       {id:'B789A388-ED35-490D-A68F-518EA3893A88', title:'1 FOR 1 PIZZA', hasDetail:true, id:'123', address:'1415 Bank St.', city:'Ottawa',phone:'613-555-1212'},
       {id:'B789A388-ED35-490D-A68F-518EA3893A88', title:'Royal Thai', hasDetail:true, id:'456', address:'1415 Bank St.', city:'Ottawa',phone:'613-555-1212'},
       {id:'B789A388-ED35-490D-A68F-518EA3893A88', title:'Sante Restaurant', hasDetail:true, id:'789', address:'1415 Bank St.', city:'Ottawa',phone:'613-555-1212'},
       {id:'B789A388-ED35-490D-A68F-518EA3893A88', title:'Royal Oak', hasDetail:true, id:'101112', address:'1415 Bank St.', city:'Ottawa',phone:'613-555-1212'}
];



//
//  CREATE CUSTOM LOADING INDICATOR
//
var indWin = null;
var actInd = null;

function showIndicator()
{
	Ti.API.debug("calling show indicator");
	// window container


	indWin = Titanium.UI.createWindow({
		modal:true,
		height:150,
		width:150
	});

	// black view
	var indView = Titanium.UI.createView({
		height:150,
		width:150,
		backgroundColor:'#000',
		borderRadius:10,
		opacity:0.8
	});
	indWin.add(indView);

	// loading indicator
	actInd = Titanium.UI.createActivityIndicator({
		style:Titanium.UI.iPhone.ActivityIndicatorStyle.BIG,
		height:30,
		width:30
	});
	indWin.add(actInd);

	// message
	var message = Titanium.UI.createLabel({
		text:'loading',
		color:'#fff',
		width:'auto',
		height:'auto',
		font:{fontSize:20,fontWeight:'bold'},
		bottom:20
	});
	indWin.add(message);



	indWin.open();
	Ti.API.debug(indWin.modal);
	indView.show();
	indWin.show();
	actInd.show();
	Ti.API.debug(indWin.opacity);
	Ti.API.debug(indView.visible);
	Ti.API.debug(indView.opacity);
	//if (tableView) {
    // 	tableView.opacity = 0.5;
    //	tableView.touchEnable = false;
    //	tableView.hide();
	//}
	actInd.show();

};

function hideIndicator()
{
	Ti.API.debug("calling hide INdicator");
	//if (tableView) {
	//	tableView.opacity = 1.0;
    //	tableView.touchEnable = true;
    //	tableView.show();
	//}
    actInd.hide();
	indWin.close({opacity:0,duration:500});
};

function getDetailView(id) {

}


function populateTable(info) {
       // This loads items into the list, dataset is the API JSON result.
       data = []; // default list value

       var currentRow = null;
       var currentRowIndex = null;
       var i=0;

       for (i=0;i<info.length;i++)
       {
           var row = Ti.UI.createTableViewRow({hasDetail:true});
               row.height = 48;
               row.className = 'datarow';

               var title = Ti.UI.createLabel({
                       color:'#000',font:{fontSize:18,fontWeight:'bold', fontFamily:'Helvetica Neue'}, left:10,top:5,  height:20,      width:200,text:info[i].name
                       });
           title.addEventListener('click', function(e)
           {
               var rowNum = e.source.rowNum;
           });

           row.filter = title.text;
           title.rowNum = i+1;

           row.add(title);

           var address = Ti.UI.createLabel({
               color:'#222',
                       font:{fontSize:14,fontWeight:'normal', fontFamily:'Arial'},
                       left:10,
                       top:24,
                       height:20,
                       width:200,
                       text:info[i].street_number + " " + info[i].street_name
               });
           address.addEventListener('click', function(e)
           {
               var rowNum = e.source.rowNum;
           });
           row.add(address);



           // create table view row event listener
           row.addEventListener('click', function(e)
           {
			   	    showIndicator();
					 try {
					        if (!xhr) {
					            var xhr = Titanium.Network.createHTTPClient();
					        }
					        detailsUrl = 'http://openottawa.org/api/fsi/details.php';
					        xhr.open('GET',nearbyUrl);
					        Titanium.API.debug("getting results - " + detailsUrl);

					        xhr.onload = function() {
					            results = JSON.parse(this.responseText);
					            var detail = Titanium.UI.createWindow({
									backgroundColor:'#0071ce',
									barColor:'#000',
									translucent:false
								});

						        // create table view data object
						        var dedata = [];


						        for (var c=0;c<1;c++)
						        {

						            dedata[c] = Ti.UI.createTableViewSection({headerTitle:details[0].title + ", " + details[0].address});

						            for (var x=0;x<details.length;x++)
						            {
						                var label = Ti.UI.createLabel({
						                    text:'Date: ' + details[x].date + "\n" + details[x].report,
						                    height:'auto',
						                    width:'auto',
						                    left:10
						                });

						                var row = Ti.UI.createTableViewRow({height:'auto'});
						                row.add(label);
						                dedata[c].add(row);

						                row.addEventListener('click',function(e)
						                {
						                    Ti.API.info("row click on row. index = "+e.index+", row = "+e.row+", section = "+e.section+", source="+e.source);
						                });
						            }

						            dedata[c].addEventListener('click',function(e)
						            {
						                Ti.API.info("row click on section. index = "+e.index+", row = "+e.row+", section = "+e.section+", source="+e.source);
						            });
						        }

						        // create table view
						        var detailview = Titanium.UI.createTableView({
						            data:dedata,
						            style: Titanium.UI.iPhone.TableViewStyle.GROUPED,
						            //rowHeight:80,
						            minRowHeight:80
						            //maxRowHeight:500,
						        });

						        // create table view event listener
						        detailview.addEventListener('click', function(e)
						        {
						            // event data
						            var index = e.index;
						            var section = e.section;
						            var row = e.row;
						            var rowdata = e.rowData;
						            Titanium.UI.createAlertDialog({title:'Table View',message:'row ' + row + ' index ' + index + ' section ' + section  + ' row data ' + rowdata}).show();
						        });


						        // add table view to the window
						        //Titanium.UI.currentWindow.add(tableview);

						        //var curWin = Titanium.UI.currentWindow;

						        detail.add(detailview);


						        //actInd.show();
						        tab1.open(detail,{animated:true});
					            hideIndicator();
					        };
					        xhr.send();
					    }

					    catch(err) {
					        Titanium.UI.createAlertDialog({
					            title: "Error",
					            message: String(err),
					            buttonNames: ['OK']
					        }).show();
					    hideIndicator();
					    }
                       Titanium.API.debug("getting details for " + info[i].id);
                       //getDetailView(e.rowData.id);
           });

           data.push(row);

       }

       tableView = Titanium.UI.createTableView({
               data:data,
               search:search,
               visible:false,
               filterAttribute:'filter'
       });

       tableView.addEventListener('click', function(e)
       {
               if (currentRow != null && e.row.isUpdateRow == false)
               {
                       //TODO: FIX UPDATE ROW
               //tableView.updateRow(currentRowIndex, currentRow,
           // {animationStyle:Titanium.UI.iPhone.RowAnimationStyle.RIGHT});
               }
               currentRow = e.row;
               currentRowIndex = e.index;

       });

       win1.add(tableView);
	hideIndicator();
	win1.show();
	tableView.show();
}


function getLocation() {

       Titanium.Geolocation.getCurrentPosition(
         function(pos) {
           // what to do if getCurrentPosition was successful
           // `pos` will be the object shown above in "Returns"
               lat = pos.coords.latitude;
               lon = pos.coords.longitude;
               Titanium.API.debug("Got coords - " + pos.coords.latitude + ", " + pos.coords.longitude);
               getResults('');

               //alert("Got location: "+lat +", "+lon)
         },
         function() {
           // what to do if getCurrentPosition failed
               alert("Couldn't get location - do plain search instead?");
         }
       );

}


/*
var actInd = Titanium.UI.createActivityIndicator({
	//color:'#000000',
	style:Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN,
    font:{fontFamily:'Helvetica Neue', fontSize:15,fontWeight:'bold'},
	color:'red',
	message:'Loading...'

});
*/

function getResults(term) {  // term = "search term"
    Ti.API.debug("call to getResults");
 	showIndicator();
    try {
        if (!xhr) {
            var xhr = Titanium.Network.createHTTPClient();
        }
        nearbyUrl = 'http://openottawa.org/api/fsi/nearby.php?q='+term+'&lat='+lat+"&lon="+lon;
        xhr.open('GET',nearbyUrl);
        Titanium.API.debug("getting results - " + nearbyUrl);

        xhr.onload = function() {
            results = JSON.parse(this.responseText);
            populateTable(results);
        };
        xhr.send();
    }

    catch(err) {
        Titanium.UI.createAlertDialog({
            title: "Error",
            message: String(err),
            buttonNames: ['OK']
        }).show();
    hideIndicator();
    }

}

// create tab group
var tabGroup = Titanium.UI.createTabGroup();

//
// create base UI tab and root window
//
var win1 = Titanium.UI.createWindow({
    title:'Eat Safe Ottawa',
    backgroundColor:'#fff',
	visible:false,
    barColor:'#000'
});


// current window
var curWin = Titanium.UI.currentWindow;
//Titanium.UI.createAlertDialog({title:'TEST',message:win1.name}).show();

var tab1 = Titanium.UI.createTab({
    icon:'KS_nav_views.png',
    title:'Places',
    window:win1
});

tab1.addEventListener('touchstart', function(e)
{
    //tableView.animate();
    Titanium.UI.createAlertDialog({title:'TEST',message:'tab1 touchstart eventlistener.'}).show();
});

var refresh = Titanium.UI.createButton({
	systemButton:Titanium.UI.iPhone.SystemButton.REFRESH
});



//win1.barColor = '#0071ce';

//
// CREATE SEARCH BAR
//
var search = Titanium.UI.createSearchBar({
	barColor:'#000',
	showCancel:false
});

refresh.addEventListener('click', function()
{
	Titanium.API.debug("refresh location + nearby");
	tableView.hide();
    tableView.setData([]);
    setTimeout(function()
    {
        getResults();
    },100);
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


/*
var info = [
	{title:'1 FOR 1 PIZZA', hasDetail:true, id:'123', address:'1415 Bank St.', city:'Ottawa',phone:'613-555-1212'},
	{title:'Royal Thai', hasDetail:true, id:'456', address:'1415 Bank St.', city:'Ottawa',phone:'613-555-1212'},
	{title:'Sante Restaurant', hasDetail:true, id:'789', address:'1415 Bank St.', city:'Ottawa',phone:'613-555-1212'},
	{title:'Royal Oak', hasDetail:true, id:'101112', address:'1415 Bank St.', city:'Ottawa',phone:'613-555-1212'}
];
*/
var details = [
    {title:'1 FOR 1 PIZZA', address:'1415 Bank St. ', compliance:"NO", date:'2010-01-01', report:'This is a report detail.'},
    {title:'1 FOR 1 PIZZA', address:'1415 Bank St. ', compliance:"YES", date:'2010-02-15', report:'This is another report detail.'}
];



var currentRow = null;
var currentRowIndex = null;
var i=0;

/*
for (i=0;i<info.length;i++)
{
    //Titanium.UI.createAlertDialog({title:'TEST',message:'Test Message.'}).show();
    var row = Ti.UI.createTableViewRow({hasDetail:true});
    //row.selectedBackgroundColor = '#fff';
	row.height = 48;
	row.className = 'datarow';

	var title = Ti.UI.createLabel({
		color:'#000',
		font:{fontSize:22,fontWeight:'bold', fontFamily:'Helvetica Neue'},
		left:10,
		top:5,
		height:20,
		width:200,
		text:info[i].title
	});
    title.addEventListener('click', function(e)
    {
        var rowNum = e.source.rowNum;
    });

    row.filter = title.text;
    title.rowNum = i+1;

    row.add(title);

    var address = Ti.UI.createLabel({
        color:'#222',
		font:{fontSize:14,fontWeight:'normal', fontFamily:'Arial'},
		left:10,
		top:24,
		height:20,
		width:200,
		text:info[i].address
	});
    address.addEventListener('click', function(e)
    {
        var rowNum = e.source.rowNum;
    });
    row.add(address);

    row.addEventListener('touchstart', function(e)
    {
        //tableView.animate();
        Titanium.UI.createAlertDialog({title:'TEST',message:'row touchstart eventlistener.'}).show();
    });

    row.addEventListener('touchstart', function(e)
    {
        Titanium.UI.createAlertDialog({title:'TEST',message:'row touchstart eventlistener.'}).show();
    });

    // create table view row event listener
    row.addEventListener('click', function(e)
    {

		var detail = Titanium.UI.createWindow({
			backgroundColor:'#0071ce',
			barColor:'#000',
			translucent:false
		});

        // create table view data object
        var dedata = [];


        for (var c=0;c<1;c++)
        {

            dedata[c] = Ti.UI.createTableViewSection({headerTitle:details[0].title + ", " + details[0].address});

            for (var x=0;x<details.length;x++)
            {
                var label = Ti.UI.createLabel({
                    text:'Date: ' + details[x].date + "\n" + details[x].report,
                    height:'auto',
                    width:'auto',
                    left:10
                });

                var row = Ti.UI.createTableViewRow({height:'auto'});
                row.add(label);
                dedata[c].add(row);

                row.addEventListener('click',function(e)
                {
                    Ti.API.info("row click on row. index = "+e.index+", row = "+e.row+", section = "+e.section+", source="+e.source);
                });
            }

            dedata[c].addEventListener('click',function(e)
            {
                Ti.API.info("row click on section. index = "+e.index+", row = "+e.row+", section = "+e.section+", source="+e.source);
            });
        }

        // create table view
        var detailview = Titanium.UI.createTableView({
            data:dedata,
            style: Titanium.UI.iPhone.TableViewStyle.GROUPED,
            //rowHeight:80,
            minRowHeight:80
            //maxRowHeight:500,
        });

        // create table view event listener
        detailview.addEventListener('click', function(e)
        {
            // event data
            var index = e.index;
            var section = e.section;
            var row = e.row;
            var rowdata = e.rowData;
            Titanium.UI.createAlertDialog({title:'Table View',message:'row ' + row + ' index ' + index + ' section ' + section  + ' row data ' + rowdata}).show();
        });


        // add table view to the window
        //Titanium.UI.currentWindow.add(tableview);

        //var curWin = Titanium.UI.currentWindow;

        detail.add(detailview);


        //actInd.show();
        tab1.open(detail,{animated:true});


//
    });

    data.push(row);

}
*/


//
// create table view (
//
tableView = Titanium.UI.createTableView({
	data:data,
	search:search,
	filterAttribute:'filter',
    moving:false,
	visible:false
});



tableView.addEventListener('click', function(e)
{
	if (currentRow != null && e.row.isUpdateRow == false)
	{
		//TODO: FIX UPDATE ROW
	//tableView.updateRow(currentRowIndex, currentRow,
    // {animationStyle:Titanium.UI.iPhone.RowAnimationStyle.RIGHT});
	}
	currentRow = e.row;
	currentRowIndex = e.index;

});


//init();
//win1.add(actInd);
//tableView.add(actInd);
//win1.add(tableView);

win1.setRightNavButton(refresh);

win1.addEventListener('touchstart', function(e)
{
    Titanium.UI.createAlertDialog({title:'TEST',message:'win1 touchstart eventlistener.'}).show();
});

tableView.addEventListener('touchstart', function(e)
{
    Titanium.UI.createAlertDialog({title:'TEST',message:'tableview touchstart eventlistener.'}).show();
});


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

win2.addEventListener('touchstart', function(e)
{
    Titanium.UI.createAlertDialog({title:'TEST',message:'win2 touchstart eventlistener.'}).show();
});

/*
win2.addEventListener('touchmove', function(e)
{
    Titanium.UI.createAlertDialog({title:'TEST',message:'win2 touchmove eventlistener.'}).show();
});

win2.addEventListener('touchend', function(e)
{
    Titanium.UI.createAlertDialog({title:'TEST',message:'win2 touchend eventlistener.'}).show();
});
win2.addEventListener('singletap', function(e)
{
    Titanium.UI.createAlertDialog({title:'TEST',message:'win2 singletap eventlistener.'}).show();
});*/

/*curView.addEventListener('touchstart', function(e)
{
    //tableView.animate();
    Titanium.UI.createAlertDialog({title:'TEST',message:'win touchstart eventlistener.'}).show();
});*/

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
//setTimeout(getResults('pizza',true), 100);

    //win1.setToolbar([actInd],{animated:true});
    //actInd.show();
    //setTimeout(getResults(''),1000);
//showIndicator();
getResults('');


// response
/*
var response = JSON.parse(this.responseText);
                       for(var x=0; x < response.length; x++) {
                               alert(response[x].name);
                       }
*/
