
var databaseOptions = {
	fileName: "cars_database",
	version: "1.0",
	displayName: "Car Database",
	maxSize: 1024
};

var database = openDatabase(
	databaseOptions.fileName,
	databaseOptions.version,
	databaseOptions.displayName,
	databaseOptions.maxSize
);

database.transaction(function( transaction ){
	transaction.executeSql("CREATE TABLE IF NOT EXISTS Cars (uId INTEGER PRIMARY KEY AUTOINCREMENT, makeName TEXT NOT NULL,modelName TEXT NOT NULL,carYear TEXT NOT NULL, blog TEXT NOT NULL);");
});

$.get( "http://www.vivianaranha.com/makes.json", function( data ) {
  console.log(data);

  var html = '<form role="form"><div class="form-group"><label for="makes">Select Make</label>'
  				+'<select class="form-control" id="make">';
  html += '<option value="0">Pick One</option>';
  for(var i = 0;i<data.makes.length;i++){
  	var num = i+1;
  	html += '<option value ="make-'+num+'">'+data.makes[i].name+'</option>';
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

  });

        
});

