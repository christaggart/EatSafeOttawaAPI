//
//  app.js
//  EatSafe Ottawa
//
//  Created by Chris Taggart & Aaron Sadhankar on March, 2010.
//  Licensed under the MIT license. If you use parts of this for something though, we'd love to know.
//

// Include JSON parser & helpers
Titanium.include('json2.js');
Titanium.include('helpers.js');

//Include app header
//Titanium.include('header.js');

//Construct main content views
//Titanium.include('json2.js'); // Creates a 'chooser' view we manipulate in the main app

// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');
Titanium.UI.setBackgroundImage('default_bg.png');

var isLoaded = 0;
var lat = 0;
var lon = 0;
var results = [];
var tableView;
var data = [];

// TODO fix this
function startup() {
    getLocation();
};

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
		modal:true});


	// black view
	//var indHideyView = Titanium.UI.createView({
	//	backgroundColor:'#fff',
	//	opacity:0
	//});


	// black view
	var indView = Titanium.UI.createView({
		height:150,
		width:150,
		backgroundColor:'#000',
		borderRadius:10,
		opacity:0.8
	});

	//indWin.add(indHideyView);
	indWin.add(indView);
	//TODO fix this too.
	// loading indicator
	actInd = Titanium.UI.createActivityIndicator({
		style:Titanium.UI.iPhone.ActivityIndicatorStyle.BIG,
		height:30,
		width:30,
        message:"loading",
        color:'white'
        //font:{fontSize:20,fontWeight:'bold'}
	});
    actInd.show();
	indWin.add(actInd);

	// message
    /*
	var message = Titanium.UI.createLabel({
		text:'loading',
		color:'#fff',
		width:'auto',
		height:'auto',
		font:{fontSize:20,fontWeight:'bold'}
		//bottom:20
	});
    */
	//indWin.add(message);
    //indHideyWin.open();
	indWin.open();

	// TODO change text after a long wait
	//var msgArray = ['loading','still loading','really shouldn\'t take this long', 'wow, i\'m really sorry.'];
	//Ti.API.debug(Math.floor(Math.random()*msgArray.length+1)); //
	//setTimeout ( "var dex = Math.floor(Math.random()*msgArray.length+1; message.text = msgArray[dex];", 1000 );
	//message.text = 'still waiting, eh?';

	Ti.API.debug(indWin.modal);
	indView.show();
	indWin.show();
	//actInd.show();
	Ti.API.debug(indWin.opacity);
	Ti.API.debug(indView.visible);
	Ti.API.debug(indView.opacity);

	//actInd.show();

};

function hideIndicator()
{
	Ti.API.debug("Calling hide indicator");
    actInd.hide();
	indWin.close({opacity:0,duration:1000});
};


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

			var detailId = info[i].id;

            var title = Ti.UI.createLabel({
                       color:'#333',
                       font:{fontSize:13,fontWeight:'bold', fontFamily:'Helvetica'}, left:10,top:5,  height:20, width:270,text:info[i].name
            });
            /*title.addEventListener('singletap', function(e)
            {
               var rowNum = e.source.rowNum;
            });
            */

           row.filter = title.text;
           title.rowNum = i+1;

           row.add(title);

           var address = Ti.UI.createLabel({
               color:'#222',
                       font:{fontSize:12,fontWeight:'normal', fontFamily:'Helvetica'},
                       left:10,
                       top:24,
                       height:20,
                       width:270,
                       text:info[i].street_number + " " + info[i].street_name + ' (' + (Math.round(info[i].distance*100)/100) + ' km)'
               });
           /*address.addEventListener('singletap', function(e)
           {
               var rowNum = e.source.rowNum;
           });
           */
           row.add(address);



           // create table view row event listener
           row.addEventListener('singletap', function(e)
           {
                    showIndicator();
					 try {
				            var xhr = Titanium.Network.createHTTPClient();
					        detailsUrl = 'http://eatsafe-api.heroku.com/facility/' + info[e.index].id,
					        xhr.open('GET',detailsUrl);
					        Titanium.API.debug("getting results - " + detailsUrl);

					        xhr.onload = function() {
					            Ti.API.debug('got results....');
					            results = JSON.parse(this.responseText);
					            Ti.API.debug(results);
					            var detail = Titanium.UI.createWindow({
									//backgroundColor:'#fff',
									barColor:'#000',
									translucent:false,
                                    backgroundColor:'#E0E0E0'
								});

                                var nameLabel = Ti.UI.createLabel({
                                    color: '#333',
                                    //backgroundColor: '#000',
                                    text:results.name,
                                    font:{fontSize:18,fontWeight:'bold', fontFamily:'Helvetica'},
                                    height:'auto',
                                    width:'auto',
                                    left:10,
                                    top:5
                                });
                                detail.add(nameLabel);
                                
                                var topPos = 25*(Math.floor(results.name.length/25) + 1);
                                Ti.API.debug('topPos: ' + topPos);

                                var addressLabel = Ti.UI.createLabel({
                                    color:'#222',
                                    font:{fontSize:14,fontWeight:'normal', fontFamily:'Helvetica'},
                                    text:results.street_number + ' ' + results.street_name,
                                    height:'auto',
                                    width:'auto',
                                    left:10,
                                    top:topPos
                                });
                                detail.add(addressLabel);

						        // create table view data object
						        var dedata = [];
                                 //Ti.API.debug(results);

                                //Ti.API.debug(results[0].inspections.length);
						        for (var c=0;c<results.inspections.length;c++)
						        {

                                    dedata[c] = Ti.UI.createTableViewSection();

                                    var label = Ti.UI.createLabel({
										className: 'label'+c,
                                        color: '#fff',
                                        backgroundColor: '#000',
                                        touchEnabled:false,
                                        selectionStyle:Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE,
                                    	font:{fontSize:16,fontWeight:'normal', fontFamily:'Helvetica'},
                                        text:' Inspection                          ' + format_mysqldate(results.inspections[c].inspection_date),
                                        height:'auto',
                                        width:'auto',
                                        left:10
                                    });

                                    var row = Ti.UI.createTableViewRow({height:'auto',
										backgroundColor:'#000',
										className: 'row'+c,
										color:'#FFF'});
                                    row.add(label);
                                    dedata[c].add(row);

                                    Ti.API.debug("loop " + c);
                                    if (results.inspections[c].questions != null && results.inspections[c].questions != 0) {
                                        Ti.API.debug("questions:  " + results.inspections[c].questions.length);
										var lastCategory = "";
                                        for (var x=0;x<results.inspections[c].questions.length;x++)
                                        {
											if (lastCategory != results.inspections[c].questions[x].category) {

												// Only show category label if not already showing that category
												var categoryLabel = Ti.UI.createLabel({
	                                                color: '#fff',
													className:'catLabel'+x,
	                                                backgroundColor: '#0066CC',
	                                    			font:{fontSize:11,fontWeight:'bold', fontFamily:'Helvetica'},
	                                                text:results.inspections[c].questions[x].category,
	                                                height:15,
	                                                width:280,

	                                                left:14
	                                            });
	                                            var row = Ti.UI.createTableViewRow({
	                                                backgroundColor:'#0066CC',
													className:'catRow'+x,
	                                                height:'auto',
	                                                color:'#FFF',
	                                                touchEnabled:false,
	                                                selectionStyle:Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE
	                                            });
	                                            row.add(categoryLabel);
	                                            dedata[c].add(row);
												lastCategory = results.inspections[c].questions[x].category;
											}


                                            var questionLabel = Ti.UI.createLabel({
                                                color: '#000',
												className:'qLabel'+x,
                                                backgroundColor: 'transparent',
                                    			font:{fontSize:12,fontWeight:'bold', fontFamily:'Helvetica'},
                                                text:results.inspections[c].questions[x].description,
                                                height:'auto',
												top:10,
												bottom:10,
                                                width:240,
                                                left:10
                                            });
                                            var row = Ti.UI.createTableViewRow({height:'auto',
												className:'qRow'+x,
                                                backgroundColor:'#fff',
                                                touchEnabled:false,
                                                //selectionStyle:Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE,
                                                layout:'vertical',
                                                height:'auto',
                                                color:'#FFF'
                                            });

                                            row.add(questionLabel);
                                            complianceImage = Titanium.UI.createImageView({url:'notincompliance.png', left:234,top:5,right:0});
										    row.add(complianceImage);
                                            //dedata[c].add(row);
                                            row.addEventListener('singletap', function(e)
                                            {
                                                Ti.API.debug("row: " + e.row);
                                                Ti.API.debug("index: " + e.index);
                                                Ti.API.debug("dedata: " + dedata[0]);
                                                createCommentWindow(dedata);
                                            });
                                            Ti.API.debug('row height: ' + questionLabel.height);
                                            // Comment rows
                                            for(var i = 0; results.inspections[c].questions[x].comments != null &&
                                                i<results.inspections[c].questions[x].comments.length; i++) {
                                                var commentLabel = Ti.UI.createLabel({
                                                    color: '#000',
                                                    className:'cLabel'+i,
                                                    backgroundColor: 'transparent',
                                                    font:{fontSize:12, fontStyle:'italic', fontFamily:'Helvetica'},
                                                    text:results.inspections[c].questions[x].comments[i].text_en,
                                                    height:'auto',
                                                    top:10,//35*(i+1),
                                                    bottom:10,
                                                    width:235,
                                                    left:25
                                                });
                                                /*
                                                var row = Ti.UI.createTableViewRow({height:'auto',
                                                    className:'cRow'+i,
                                                    backgroundColor:'#fff',
                                                    touchEnabled:false,
                                                    selectionStyle:Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE,
                                                    //layout:'vertical',
                                                    height:'auto',
                                                    color:'#FFF'
                                                });
                                                */

                                                row.add(commentLabel);
                                                //dedata[c].add(row);
                                            }
                                            dedata[c].add(row);



                                        }
                                    }
                                    else {
                                        var questionLabel = Ti.UI.createLabel({
                                        color: '#000',
                                        backgroundColor: 'transparent',
                               			font:{fontSize:12,fontWeight:'normal', fontFamily:'Helvetica'},
                                        text:'This premise was found to be in compliance with the Ontario Food Premises Regulation.',
                                        height:'45',
                                        width:250,
                                        left:10
                                        });
                                        var row = Ti.UI.createTableViewRow({
                                            className:'NoCRow'+c,
                                            height:'auto',
                                            backgroundColor:'#fff',
                                            color:'#FFF'});

                                        row.add(questionLabel);
										// Add compliance image
                                        complianceImage = Titanium.UI.createImageView({url:'incompliance.png', left:234,top:5,right:0});
									    row.add(complianceImage);
                                        dedata[c].add(row);

                                        row.addEventListener('singletap', function(e)
                                        {
                                            Ti.API.debug("row: " + e.row);
                                            Ti.API.debug("index: " + e.index);
                                            Ti.API.debug("dedata: " + dedata[0]);
                                            createCommentWindow(dedata);
                                        });
                                    }

                                }

									    Ti.API.debug("done loop ");
                                        // create table view

								        var detailview = Titanium.UI.createTableView({
								            data:dedata,
								            style: Titanium.UI.iPhone.TableViewStyle.GROUPED,
								            //rowHeight:80,
								            minRowHeight:30,
                                            top:30+topPos,
                                            backgroundColor:'#E0E0E0'
								            //maxRowHeight:500,
								        });

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
               filterAttribute:'name'
       });

       tableView.addEventListener('singletap', function(e)
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


function getResults(term) {  // term = "search term"
    Ti.API.debug("call to getResults");
    if (!Titanium.Network.online) {
        var a = Titanium.UI.createAlertDialog({
            title:'Network Connection Required',
            message: 'EatSafeOttawa requires an internet connection to, you know, get stuff from the internet.          Check your network connection and try again.'
        });
        a.show();
    }
    else {
        showIndicator();
        try {
            if (!xhr) {
                var xhr = Titanium.Network.createHTTPClient();
            }
            if (term) {
                nearbyUrl = 'http://eatsafe-api.heroku.com/facilities/search?q=' + term;
            }
            else {
                nearbyUrl = 'http://eatsafe-api.heroku.com/facilities/nearby?lat='+lat+"&lon="+lon;
            }
            xhr.open('GET',nearbyUrl);
            Titanium.API.debug("getting results - " + nearbyUrl);

            xhr.onload = function() {
                results = JSON.parse(this.responseText);
  				Titanium.API.debug(results);
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
   getResults(e.value);
   search.blur();
});
search.addEventListener('cancel', function(e)
{
   search.blur();
});

var currentRow = null;
var currentRowIndex = null;
var i=0;


//
// create table view (
//
tableView = Titanium.UI.createTableView({
	data:data,
	search:search,
	filterAttribute:'name',
    moving:false,
	visible:false
});



tableView.addEventListener('singletap', function(e)
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


win1.setRightNavButton(refresh);


function disableTouch(exceptObject) {
    Titanium.API.debug("exceptObject: " + exceptObject);
        win1.touchEnable=false;
        Titanium.API.debug("win 1 touch disabled");

        win2.touchEnable=false;
        Titanium.API.debug("win 2 touch disabled");

        //tabgroup.touchEnable=false;
        //Titanium.API.debug("tabgroup touch disabled");

        //detail.touchEnable=false;
        //Titanium.API.debug("detail touch disabled");

        //exceptOjbect.touchEnable=true;
        Titanium.API.debug("exiting disableTouch");
}

function createCommentWindow() {
    var t = Titanium.UI.create2DMatrix();
    t = t.scale(0);

    var w = Titanium.UI.createWindow({
        //backgroundColor:'#336699',
        backgroundColor:'black',
        borderWidth:8,
        borderColor:'#999',
        //height:400,
        //width:300,
        borderRadius:10,
        //opacity:0.80,
        modal:true,
        transform:t
    });


    //disableTouch(w);

    // create first transform to go beyond normal size
    var t1 = Titanium.UI.create2DMatrix();
    t1 = t1.scale(1.1);
    var a = Titanium.UI.createAnimation();
    a.transform = t1;
    a.duration = 200;

    // when this animation completes, scale to normal size
    a.addEventListener('complete', function()
    {
        Titanium.API.info('here in complete');
        var t2 = Titanium.UI.create2DMatrix();
        t2 = t2.scale(1.0);
        w.animate({transform:t2, duration:200});

    });

    // create a button to close window
    var b = Titanium.UI.createButton({
        title:'Close',
        height:30,
        width:200,
        bottom:15
    });
    w.add(b);
    b.addEventListener('click', function()
    {
        var t3 = Titanium.UI.create2DMatrix();
        t3 = t3.scale(0);
        w.close({transform:t3,duration:300});
    });

    /*
    var commentWinLabel1 = Titanium.UI.createLabel({

    });
    */

    //Titanium.API.debug("data:" + dedata[c]);
    var commentData = [];

    var commentWinTable = Titanium.UI.createTableView({
        data:commentData,
        style: Titanium.UI.iPhone.TableViewStyle.GROUPED,
        //rowHeight:80,
        minRowHeight:30,
        top:50,
        backgroundColor:'#E0E0E0'
        //maxRowHeight:500,
    });
    //w.add(commentWinTable);
    Titanium.API.debug('opening comment window');


    w.open(a);

}

//
// create controls tab and root window
//
var win2 = Titanium.UI.createWindow({
    title:'About',
    barColor: '#000',
    backgroundColor:'#000'
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

//
//  add tabs
//
tabGroup.addTab(tab1);
tabGroup.addTab(tab2);


// open tab group
tabGroup.open({transition:Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT});


// Tabs and Thunderbirds are go.
startup();