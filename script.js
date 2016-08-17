//Utility FUnction
function getFromDb(){
	getSavedCarmakes();
}

function displayNavList(results){
	var html = "";
	if(results.rows.length == 0){
        html += '<li><a href="#">No Cars Available</a></li>';
    	$("#theListFromDB").html(html);
    } else {
    	html += '<li><a href="#" onclick="displayPanelsFor()">All Cars</a></li>';
    	for(var i=0;i<results.rows.length;i++){
    		html += '<li><a href="#" onclick="displayPanelsFor(\''+results.rows[i].makeName+'\')">'+results.rows[i].makeName+'</a></li>';
    	}
    	$("#theListFromDB").html(html);
    }
}

function deleteThisItem(uid){
	database.transaction(function( transaction ){
        transaction.executeSql("DELETE FROM Cars WHERE uId = "+uid+";");
	});
	getFromDb();
	displayPanelsFor();
}


function displayPanelsFor(carMake){
	var panelHtml = '';


	database.transaction(function( transaction ){
		var sqlQuery = "SELECT * FROM Cars ORDER BY uId DESC";
		if(carMake !== undefined){
			sqlQuery = "SELECT * FROM Cars WHERE makeName = '"+carMake+"' ORDER BY uId DESC";
		}


		transaction.executeSql(sqlQuery, [], function(transaction, results){

			if(results.rows.length == 0){
            	panelHtml += '<div class="panel panel-default">';
  				panelHtml += '<div class="panel-heading"><h3 class="panel-title">No Cars Available</h3></div>';
  				panelHtml += '<div class="panel-body">Use the button on navigation to enter some items</div>';
  				panelHtml += '</div>';
  				$("#carsDetail").html(panelHtml);

  			} else {
  				for(var i = 0;i<results.rows.length;i++){
  					console.log(results.rows[i].makeName);
  					panelHtml += '<div class="panel panel-default">';
  					panelHtml += '<div class="panel-heading clearfix"><div class="btn-group pull-right"><a href="#" onclick="deleteThisItem(\''+results.rows[i].uId+'\')" class="btn btn-danger btn-sm">x</a></div><h3 class="panel-title">'+results.rows[i].carYear+' '+results.rows[i].makeName+' '+results.rows[i].modelName+'</h3> </div>';
  					panelHtml += '<div class="panel-body">'+results.rows[i].blog+'</div>';
  					panelHtml += '</div>';
  					$("#carsDetail").html(panelHtml);
  				}
  			}

		}, function(transaction, error){
			console.log(error);
		});
	});

}

getFromDb();
displayPanelsFor();

$("#newButton").hide();
$("#nwBtn").hide();

$("#nwBtn").click(function(){
	$("#myModal").modal();
});

$.get( "http://www.vivianaranha.com/makes.json", function( data ) {

  var html = '<form role="form"><div class="form-group">';

  html +='<label for="make">Select Make</label>'
  				+'<select class="form-control" id="make">';
  html += '<option value="0">Pick One</option>';
  for(var i = 0;i<data.makes.length;i++){
  	var num = i+1;
  	html += '<option value ="'+num+'">'+data.makes[i].name+'</option>';
  }
  html +='</select></div>';

  html += '<div class="form-group" id="model">';
  html += '</div>';

  html += '<div class="form-group" id="year">';
  html += '</div>';

  html += '<div class="form-group" id="theText">';
  html += '</div>';

  html += '</form>'


  $("#modal-body").html(html);

  $("#make" ).change(function() {
  	$("#model").html("");
  	$("#year").html("");
  	$("#theText").html("");
  	var makeNum = Number(this.value) -1;
  	var modelhtml ='<label for="modelSel">Select Model</label>'
  				+'<select class="form-control" id="modelSel">';
  	modelhtml += '<option value="0">Pick One</option>';

  	var modelSel = data.makes[makeNum];
	for(var i = 0;i<modelSel.models.length;i++){
  		var num = i+1;
  		modelhtml += '<option value ="'+num+'">'+modelSel.models[i].name+'</option>';
  	}
  	modelhtml +='</select></div>';

  	$("#model").html(modelhtml);

  	$("#modelSel" ).change(function() {
	  	$("#year").html("");
  		$("#theText").html("");
	  	var modelsNum = Number(this.value) -1;
	  	var yearhtml ='<label for="yearSel">Select Year</label>'
	  				+'<select class="form-control" id="yearSel">';
	  	yearhtml += '<option value="0">Pick One</option>';

	  	var yearSel = data.makes[makeNum].models[modelsNum];
		for(var i = 0;i<yearSel.years.length;i++){
	  		var num = i+1;
	  		yearhtml += '<option value ="'+num+'">'+yearSel.years[i].year+'</option>';
	 	}
	  	yearhtml +='</select></div>';

	 	$("#year").html(yearhtml);


	 	$("#yearSel" ).change(function() {
	 		var texthtml = '<label for="comment">Comment:</label>'+
  						'<textarea class="form-control" rows="5" id="theBlog"></textarea>';
  			$("#theText").html(texthtml);	

	 	});
	  });
  });

  $("#newButton").show();
  $("#nwBtn").show();
        
});

$("#saveArticle").click(function() {
	var make = Number($("#make").val())-1;
	var model = Number($("#modelSel").val())-1;
	var year = Number($("#yearSel").val())-1;
	console.log(make +"-"+model+"-"+year);
	if(isNaN(make) || make == -1){
		alert("Select a Make");
	} else if(isNaN(model) || model == -1) {
		alert("Select a Model");
	} else if(isNaN(year) || year == -1) {
		alert("Select a Year");
	} else {
		var theYearName = $("#yearSel option:selected").text()
		var theMakeName = $("#make option:selected").text();
		var theModelName = $("#modelSel option:selected").text();
		var theBlogText = $("#theBlog").val();

		database.transaction(function( transaction ){
        	transaction.executeSql("INSERT INTO Cars (makeName, modelName, carYear, blog) VALUES ('"+theMakeName+"','"+theModelName+"','"+theYearName+"','"+theBlogText+"')");
		});
		$("#myModal").modal("hide");
		getFromDb();
		displayPanelsFor();

		$("#make").val(0);
		$("#model").html("");
  		$("#year").html("");
  		$("#theText").html("");
	}
});
