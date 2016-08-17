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

function getSavedCarmakes(){
	database.transaction(function( transaction ){
		transaction.executeSql('SELECT DISTINCT makeName FROM Cars', [], function(transaction, results){
            console.log(results.rows);
            displayNavList(results);
            
		}, function(transaction, error){
			console.log(error);
		});
	});
}