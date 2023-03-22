var get_results;
var myDB = null;

var db_name = 'hindu_tamil_app';
var db_desc = 'HINDU TAMIL APP';

var tb_article_detail = 'article_detail';

// myDB = window.openDatabase('hindu_tamil_app',"1.0",'auto', 1024 * 1024 * 100);
// myDB = sqlitePlugin.openDatabase('hindu_tamil_app',"1.0",'auto', 1024 * 1024 * 100);
// myDB = window.openDatabase("hindu_tamil_app", "1.0", "auto", 1024 * 1024 * 100);
//$.browser.chrome = /chrom(e|ium)/.test(navigator.userAgent.toLowerCase()); 
if(typeof(cordova)!='undefined')
{
	if(cordova.platformId == 'ios') {
		myDB = sqlitePlugin.openDatabase('hindu_tamil_app',"1.0",'auto', 1024 * 1024 * 100);
	} else {
		myDB = window.openDatabase("hindu_tamil_app", "1.0", "auto", 1024 * 1024 * 100);
	}
}

var html_result='';

function SQL_Toast_Message(message)
{
	app.toast.create({
	  text: message,
	  position: 'bottom',
	  closeTimeout: 5000,
	}).open();
}

function onSQLDeviceReady(){	
	tb_article_detail = 'article_detail';
	createTable();
}

function createTable() {
	
	/*if(typeof(cordova)!='undefined')
		dropTable('e_library');*/
	//var tables = ['CREATE TABLE IF NOT EXISTS '+tb_article_detail+' (id integer PRIMARY KEY AUTOINCREMENT,aid varchar,cid varchar, category text,web_url text,title text,description text,image text,created varchar,author varchar)',
		//'CREATE TABLE IF NOT EXISTS notifications(id integer PRIMARY KEY AUTOINCREMENT,subtitle varchar,title_ta text,aid varchar,cid varchar,img text,tap varchar,cate varchar,title text,cate_ta varchar,created varchar,web_url text,desc_ta text,created_date date)'];
		
	var tables = ['CREATE TABLE IF NOT EXISTS '+tb_article_detail+' (id integer PRIMARY KEY AUTOINCREMENT,aid varchar,cid varchar, category text,web_url text,title text,description text,image text,created varchar,author varchar)',
		'CREATE TABLE IF NOT EXISTS notifications(id integer PRIMARY KEY AUTOINCREMENT,subtitle varchar,title_ta text,aid varchar,cid varchar,img text,tap varchar,cate varchar,title text,cate_ta varchar,created varchar,web_url text,desc_ta text,created_date date)','CREATE TABLE IF NOT EXISTS e_library(id integer PRIMARY KEY AUTOINCREMENT,file_name text,image text,file_password varchar,file_path varchar,file_extention varchar,file_id varchar,type varchar,created_date text,title text,file_date varchar,password varchar,user_id varchar)','CREATE TABLE IF NOT EXISTS products(id integer PRIMARY KEY AUTOINCREMENT,product_id varchar,title text,author varchar,category varchar,image varchar,description text)','ALTER TABLE '+tb_article_detail+' ADD COLUMN content_type text'];
	// myDB = window.openDatabase(db_name,"1.0",db_desc,1000000);
	// title,message,image,aid,web_url
	// myDB = window.openDatabase('hindu_tamil_app',"1.0",'auto', 1024 * 1024 * 100);
	// myDB = window.openDatabase('hindu_tamil_app',"1.0",'HINDU TAMIL APP', 1000000);
	// myDB = sqlitePlugin.openDatabase('hindu_tamil_app',"1.0",'auto', 1024 * 1024 * 100);
	// myDB = sqlitePlugin.openDatabase('hindu_tamil_app',"1.0",'auto', 1024 * 1024 * 100);
	
	
	if(typeof(cordova)!='undefined')
	{
		if(cordova.platformId == 'ios') {
			myDB = sqlitePlugin.openDatabase('hindu_tamil_app',"1.0",'auto', 1024 * 1024 * 100);
		} else {
			myDB = window.openDatabase("hindu_tamil_app", "1.0", "auto", 1024 * 1024 * 100);
		}
		//myDB.execSQL("ALTER TABLE "+ tb_article_detail +" ADD COLUMN content_type text");
		myDB.transaction(function (tx) {
			
			$.each(tables, function(key, value) {
				
				tx.executeSql(value, [], function (tx, result) {
			
					// alert(JSON.stringify(result));
				}, function (error,er) {
					
					// alert(error);
				});
				
			});
		});
	}
	

}

function addslashes(str) {
    str = str.replace(/\\/g, '\\\\');
    str = str.replace(/\'/g, '\\\'');
    str = str.replace(/\"/g, '\\"');
    str = str.replace(/\0/g, '\\0');
    return str;
}

function stripslashes(str) {
    str = str.replace(/\\'/g, '\'');
    str = str.replace(/\\"/g, '"');
    str = str.replace(/\\0/g, '\0');
    str = str.replace(/\\\\/g, '\\');
    return str;
}
function replaceDoubleQuotes(mystring)
{
	return newTemp = mystring.replace(/"/g, '\'');
}
function insertArticleDetails(data) {
	onSQLDeviceReady();
	// createTable();
	var image = '';
	
	// alert(JSON.stringify(data));
	// alert(JSON.stringify(data.aid));
	fetchArticleDetails(data.aid,function(response) {
		
		// alert(response);
		// alert(response.length);
		if(response.length == 0) {
			toDataURL(data.image, function (image) {
			  var query = 'INSERT INTO '+tb_article_detail+'(aid,cid,category,web_url,title,description,image,created,author,content_type) VALUES("'+data.aid+'","'+data.cid+'","'+data.category+'","'+data.web_url+'","'+addslashes(data.title)+'","'+replaceDoubleQuotes(data.description)+'","'+image+'","'+data.created+'","'+data.author+'","'+data.content_type+'")';
			  
			  	// myDB = window.openDatabase('hindu_tamil_app',"1.0",'auto',1000000);
			  	// myDB = window.openDatabase('hindu_tamil_app',"1.0",'auto', 1024 * 1024 * 100);
			  	// myDB = window.openDatabase('hindu_tamil_app',"1.0",'HINDU TAMIL APP', 1000000);
			  	// myDB = sqlitePlugin.openDatabase('hindu_tamil_app',"1.0",'auto', 1024 * 1024 * 100);
			  	//myDB = window.openDatabase("hindu_tamil_app", "1.0", "auto", 1024 * 1024 * 100);
			  	// myDB = sqlitePlugin.openDatabase('hindu_tamil_app',"1.0",'auto', 1024 * 1024 * 100);
			  	// alert(query);
			  	/*if(cordova.platformId == 'ios') {
					myDB = sqlitePlugin.openDatabase('hindu_tamil_app',"1.0",'auto', 1024 * 1024 * 100);
				} else {
					myDB = window.openDatabase("hindu_tamil_app", "1.0", "auto", 1024 * 1024 * 100);
				}*/
				if(typeof(cordova)!='undefined')
				{
					if(cordova.platformId == 'ios') {
						myDB = sqlitePlugin.openDatabase('hindu_tamil_app',"1.0",'auto', 1024 * 1024 * 100);
					} else {
						myDB = window.openDatabase("hindu_tamil_app", "1.0", "auto", 1024 * 1024 * 100);
					}
				}
				
				
				myDB.transaction(function(transaction) {
					transaction.executeSql(query, []
					,function(tx, result) {
						
						 SQL_Toast_Message('Offline story added successfully');
					},
					function(error,er){
						
						//SQL_Toast_Message(JSON.stringify(error)); 
						
					});
				});
			});
		} else {
			SQL_Toast_Message('Already Saved');
		}
	});
}

function toDataURL(url, callback) {
  let xhRequest = new XMLHttpRequest();
  xhRequest.onload = function () {
    let reader = new FileReader();
    reader.onloadend = function () {
      callback(reader.result);
    }
    reader.readAsDataURL(xhRequest.response);
  };
  xhRequest.open('GET', url);
  xhRequest.responseType = 'blob';
  xhRequest.send();
}

function fetchArticleDetails(id,callback) {
	var where = ' WHERE 1=1 ';
	var order = '';
	if(typeof(id) != 'undefined') {
		where += ' AND aid = "'+id+'"';
		
	} else {
		order = ' ORDER BY id DESC';
	}
	var query = 'SELECT * FROM '+tb_article_detail+where+order;
	
	// alert(query);
	// myDB = window.openDatabase('hindu_tamil_app',"1.0",'auto', 1024 * 1024 * 100);
	// myDB = window.openDatabase('hindu_tamil_app',"1.0",'auto', 1024 * 1024 * 100);
	// myDB = window.openDatabase('hindu_tamil_app',"1.0",'HINDU TAMIL APP', 1000000);
	// myDB = sqlitePlugin.openDatabase('hindu_tamil_app',"1.0",'auto', 1024 * 1024 * 100);
	// myDB = window.openDatabase("hindu_tamil_app", "1.0", "auto", 1024 * 1024 * 100);
	/*if(cordova.platformId == 'ios') {
		myDB = sqlitePlugin.openDatabase('hindu_tamil_app',"1.0",'auto', 1024 * 1024 * 100);
	} else {
		myDB = window.openDatabase("hindu_tamil_app", "1.0", "auto", 1024 * 1024 * 100);
	}*/
	if(typeof(cordova)!='undefined')
	{
		if(cordova.platformId == 'ios') {
			myDB = sqlitePlugin.openDatabase('hindu_tamil_app',"1.0",'auto', 1024 * 1024 * 100);
		} else {
			myDB = window.openDatabase("hindu_tamil_app", "1.0", "auto", 1024 * 1024 * 100);
		}
	}
	
	// myDB = window.sqlitePlugin.openDatabase({name:db_name,location:1});
	// myDB = window.openDatabase(db_name, '1.0', db_desc, 1024 * 1024 * 100); // browser

	myDB.transaction(function(transaction) {
		
		transaction.executeSql(query, []
		,function(tx, result) {
			
			// alert('success');
			if(typeof(cordova)!='undefined' && cordova.platformId == 'ios') {
				callback(result.rows._array);
			} else {
				callback(result.rows);
			   // SQL_Toast_Message('Inserted successfully');
			}
		},
		function(error,er){
			
			 alert('error');
			callback([]);
			SQL_Toast_Message(JSON.stringify(error)); 
			
		});
	});
}

function deleteArticle(data,callback) {
	var query = 'DELETE FROM '+tb_article_detail+' WHERE id = '+data.id+' AND aid = '+data.aid;
	
	// myDB = window.openDatabase('hindu_tamil_app',"1.0",db_desc,1000000);
	// myDB = window.openDatabase('hindu_tamil_app',"1.0",'auto', 1024 * 1024 * 100);
	// myDB = sqlitePlugin.openDatabase('hindu_tamil_app',"1.0",'auto', 1024 * 1024 * 100);
	// myDB = window.openDatabase("hindu_tamil_app", "1.0", "auto", 1024 * 1024 * 100);
	if(typeof(cordova)!='undefined')
	{
		if(cordova.platformId == 'ios') {
			myDB = sqlitePlugin.openDatabase('hindu_tamil_app',"1.0",'auto', 1024 * 1024 * 100);
		} else {
			myDB = window.openDatabase("hindu_tamil_app", "1.0", "auto", 1024 * 1024 * 100);
		}
	}
	myDB.transaction(function(transaction) {
		transaction.executeSql(query, []
		,function(tx, result) {
			var res = {status:true};
			
			callback(res);
			 // SQL_Toast_Message('Inserted successfully');
		},
		function(error,er){
			var res = {status:false};
			SQL_Toast_Message(JSON.stringify(error)); 
			
			callback(res);
		});
	});
}

function dropTable(table) {
	// myDB = window.openDatabase('hindu_tamil_app',"1.0",db_desc,1000000);
	// myDB = window.openDatabase('hindu_tamil_app',"1.0",'auto', 1024 * 1024 * 100);
	// myDB = sqlitePlugin.openDatabase('hindu_tamil_app',"1.0",'auto', 1024 * 1024 * 100);
	// myDB = window.openDatabase("hindu_tamil_app", "1.0", "auto", 1024 * 1024 * 100);
	if(typeof(cordova)!='undefined')
	{
		if(cordova.platformId == 'ios') {
			myDB = sqlitePlugin.openDatabase('hindu_tamil_app',"1.0",'auto', 1024 * 1024 * 100);
		} else {
			myDB = window.openDatabase("hindu_tamil_app", "1.0", "auto", 1024 * 1024 * 100);
		}
	}
	myDB.transaction(function(transaction) {
	transaction.executeSql('DROP TABLE IF EXISTS '+table+';', [],
		function(tx, result) {
			
			//alert("Table ("+table+") dropped successfully");
		}, 
		function(error,er) {
			
			  //alert("Error occurred while creating the table.");
		});
	});
}

function insertNotification(data) {
	onSQLDeviceReady();
	
	
	var image = '';
	// 'CREATE TABLE IF NOT EXISTS notifications(id integer PRIMARY KEY AUTOINCREMENT,title text,image text,aid varchar,web_url text)'];
	// toDataURL(data.bigPicture, function (image) {
		
		var query = 'INSERT INTO notifications(subtitle,title_ta,aid,cid,img,tap,cate,title,cate_ta,created,web_url,desc_ta,created_date) VALUES("'+data.subtitle+'","'+data.title_ta+'","'+data.aid+'","'+data.cid+'","'+data.img+'","'+data.tap+'","'+data.cate+'","'+data.title+'","'+data.cate_ta+'","'+data.created+'","'+data.web_url+'","'+data.desc_ta+'","CURDATE()")';
		
		// myDB = window.openDatabase('hindu_tamil_app',"1.0",'auto', 1024 * 1024 * 100);
		// myDB = sqlitePlugin.openDatabase('hindu_tamil_app',"1.0",'auto', 1024 * 1024 * 100);
		
		if(typeof(cordova)!='undefined')
		{
			if(cordova.platformId == 'ios') {
				myDB = sqlitePlugin.openDatabase('hindu_tamil_app',"1.0",'auto', 1024 * 1024 * 100);
			} else {
				myDB = window.openDatabase("hindu_tamil_app", "1.0", "auto", 1024 * 1024 * 100);
			}
		}
		myDB.transaction(function(transaction) {
			transaction.executeSql(query, []
			,function(tx, result) {
				
				 //SQL_Toast_Message('Inserted Successfully');
			},
			function(error,er){
				//SQL_Toast_Message(JSON.stringify(error)); 
				
			});
		});
	// });
}

function showNotifications(callback) {
	onSQLDeviceReady();
	var query = 'SELECT * FROM notifications ORDER BY id DESC';
	
	// myDB = window.openDatabase('hindu_tamil_app',"1.0",'auto', 1024 * 1024 * 100);
	// myDB = window.openDatabase('hindu_tamil_app',"1.0",'HINDU TAMIL APP', 1000000);
	// myDB = window.openDatabase("mgm", "1.0", "MGM Hospitality", 1000000);
	// myDB = sqlitePlugin.openDatabase('hindu_tamil_app',"1.0",'auto', 1024 * 1024 * 100);
	// myDB = window.openDatabase("hindu_tamil_app", "1.0", "auto", 1024 * 1024 * 100);
	if(typeof(cordova)!='undefined')
	{
		if(typeof(cordova)!='undefined')
		{
			if(cordova.platformId == 'ios') {
				myDB = sqlitePlugin.openDatabase('hindu_tamil_app',"1.0",'auto', 1024 * 1024 * 100);
			} else {
				myDB = window.openDatabase("hindu_tamil_app", "1.0", "auto", 1024 * 1024 * 100);
			}
		}
		// myDB = window.sqlitePlugin.openDatabase({name:db_name,location:1});
		// myDB = window.openDatabase(db_name, '1.0', db_desc, 1024 * 1024 * 100); // browser

		myDB.transaction(function(transaction) {
			
			transaction.executeSql(query, []
			,function(tx, result) {
				
				// alert(JSON.stringify(result));
				// callback(result.rows);
				if(cordova.platformId == 'ios') {
					callback(result.rows._array);
				} else {
					callback(result.rows);
				 // SQL_Toast_Message('Inserted successfully');
				}
				 // SQL_Toast_Message('Inserted successfully');
			},
			function(error,er){
				callback([]);
				//SQL_Toast_Message(JSON.stringify(error)); 
				
			});
		});
	}
	
}

function deleteNotification(data,callback) {
	var query = 'DELETE FROM notifications WHERE id = '+data.id;
	
	// myDB = window.openDatabase('hindu_tamil_app',"1.0",db_desc,1000000);
	// myDB = window.openDatabase('hindu_tamil_app',"1.0",'auto', 1024 * 1024 * 100);
	// myDB = sqlitePlugin.openDatabase('hindu_tamil_app',"1.0",'auto', 1024 * 1024 * 100);
	// myDB = window.openDatabase("hindu_tamil_app", "1.0", "auto", 1024 * 1024 * 100);
	if(typeof(cordova)!='undefined')
	{
		if(cordova.platformId == 'ios') {
			myDB = sqlitePlugin.openDatabase('hindu_tamil_app',"1.0",'auto', 1024 * 1024 * 100);
		} else {
			myDB = window.openDatabase("hindu_tamil_app", "1.0", "auto", 1024 * 1024 * 100);
		}
	}
	myDB.transaction(function(transaction) {
		transaction.executeSql(query, []
		,function(tx, result) {
			var res = {status:true};
			
			callback(res);
			 // SQL_Toast_Message('Inserted successfully');
		},
		function(error,er){
			var res = {status:false};
			SQL_Toast_Message(JSON.stringify(error)); 
			
			callback(res);
		});
	});
}

function removePreviousData() {
	var query = 'DELETE FROM notifications WHERE created_date < NOW() - INTERVAL 7 DAY';
	
	// myDB = window.openDatabase('hindu_tamil_app',"1.0",db_desc,1000000);
	// myDB = window.openDatabase('hindu_tamil_app',"1.0",'auto', 1024 * 1024 * 100);
	// myDB = sqlitePlugin.openDatabase('hindu_tamil_app',"1.0",'auto', 1024 * 1024 * 100);
	// myDB = window.openDatabase("hindu_tamil_app", "1.0", "auto", 1024 * 1024 * 100);
	if(typeof(cordova)!='undefined')
	{
		if(cordova.platformId == 'ios') {
			myDB = sqlitePlugin.openDatabase('hindu_tamil_app',"1.0",'auto', 1024 * 1024 * 100);
		} else {
			myDB = window.openDatabase("hindu_tamil_app", "1.0", "auto", 1024 * 1024 * 100);
		}
		
		myDB.transaction(function(transaction) {
			transaction.executeSql(query, []
			,function(tx, result) {
				var res = {status:true};
				
				//callback(res);
				 // SQL_Toast_Message('Inserted successfully');
			},
			function(error,er){
				var res = {status:false};
				// SQL_Toast_Message(JSON.stringify(error)); 
							
				//callback(res);
			});
		});
	}
	
}

function saveElibrary(data,callback) {
	console.log('data.type',data);
	console.log('data.type',data.type);
	checkFileExists({id:data.file_id},function(response) {
		if(response.length == 0) {
			if(data.type == 'paper') {
				downloadEpaperImage(data, function (image) {
					if(image.status == true) {
						data.image = image.file_name;
						saveEproducts(data,callback);	
					}
				});	
			} else {
				toDataURL(data.image, function (image) {
					data.image = image;
					saveEproducts(data,callback);
				});
			}
		} else {
			SQL_Toast_Message('Already Saved');
		}
	});
}

function saveEproducts(data,callback) {
	var date = new Date();
	var day = date.getDate();
	var month = date.getMonth()+1;
	var year = date.getFullYear();
	date = year+'-'+month+'-'+day;
	//CREATE TABLE IF NOT EXISTS e_library(id integer PRIMARY KEY AUTOINCREMENT,file_name varchar,image text,file_password varchar,file_path varchar,file_extention varchar,file_id varchar,type varchar,created_date varchar,title text)
	var file_date = '';
	var obj = JSON.parse(localStorage.getItem('pdfViewer'));
	console.log('pdfViewer');
	console.log(obj);
	if(obj != null) {
		file_date = obj.date;
	}
	var query = 'INSERT INTO e_library(file_name,image,file_password,file_path,file_extention,file_id,type,created_date,title,file_date,password,user_id) VALUES("'+data.file_name+'","'+data.image+'","'+data.file_password+'","'+data.file_path+'","'+data.file_extention+'","'+data.file_id+'","'+data.type+'","'+date+'","'+data.title+'","'+file_date+'","'+data.password+'","'+data.user_id+'")';
	console.log(query);
	if(typeof(cordova)!='undefined') {
		if(cordova.platformId == 'ios') {
			myDB = sqlitePlugin.openDatabase('hindu_tamil_app',"1.0",'auto', 1024 * 1024 * 100);
		} else {
			myDB = window.openDatabase("hindu_tamil_app", "1.0", "auto", 1024 * 1024 * 100);
		}
		myDB.transaction(function(transaction) {
			transaction.executeSql(query, []
			,function(tx, result) {
				console.log('result');
				console.log(result);
				var res = {status:true};
				callback(res);
			},
			function(error,er){
				console.log('error');
				console.log(er);
				var res = {status:false};
				callback(res);
			});
		});
	}
}

function checkFileExists(obj,callback) {
	var where = ' WHERE 1=1 ';
	var order = ' ORDER BY id DESC';
	var userDetails   = JSON.parse(localStorage.getItem('userDetails'));
	var user_id = (userDetails != null) ? userDetails.user_id : '';
	if(typeof(obj.id) != 'undefined') {
		where += ' AND file_id = "'+obj.id+'" ';
	} else if(typeof(obj.type) != 'undefined') {
		where += ' AND type = "'+obj.type+'" ';	
	} /*else if(user_id != '') {
		where += ' AND user_id = '+user_id;
	}*/ 
	var query = 'SELECT * FROM e_library '+where+order;
	
	if(typeof(cordova)!='undefined') {
		if(cordova.platformId == 'ios') {
			myDB = sqlitePlugin.openDatabase('hindu_tamil_app',"1.0",'auto', 1024 * 1024 * 100);
		} else {
			myDB = window.openDatabase("hindu_tamil_app", "1.0", "auto", 1024 * 1024 * 100);
		}
	}
	myDB.transaction(function(transaction) {
		transaction.executeSql(query, []
		,function(tx, result) {
			if(typeof(cordova)!='undefined' && cordova.platformId == 'ios') {
				callback(result.rows._array);
			} else {
				callback(result.rows);
			}
		},
		function(error,er){
			
			callback([]);
		});
	});
}

function deleteFileById(data,callback) {
	
	var query = 'DELETE FROM e_library WHERE id = '+data.id;
	// myDB = window.openDatabase('hindu_tamil_app',"1.0",db_desc,1000000);
	// myDB = window.openDatabase('hindu_tamil_app',"1.0",'auto', 1024 * 1024 * 100);
	// myDB = sqlitePlugin.openDatabase('hindu_tamil_app',"1.0",'auto', 1024 * 1024 * 100);
	// myDB = window.openDatabase("hindu_tamil_app", "1.0", "auto", 1024 * 1024 * 100);
	if(typeof(cordova)!='undefined')
	{
		if(cordova.platformId == 'ios') {
			myDB = sqlitePlugin.openDatabase('hindu_tamil_app',"1.0",'auto', 1024 * 1024 * 100);
		} else {
			myDB = window.openDatabase("hindu_tamil_app", "1.0", "auto", 1024 * 1024 * 100);
		}
	}
	myDB.transaction(function(transaction) {
		transaction.executeSql(query, []
		,function(tx, result) {
			var res = {status:true};
			
			callback(res);
			 // SQL_Toast_Message('Inserted successfully');
		},
		function(error,er){
			var res = {status:false};
			SQL_Toast_Message(JSON.stringify(error)); 
			
			callback(res);
		});
	});
}

function storeProducts(data) {
	searchProducts(data.prod_id,function(resp) {
		if(resp.length == 0) {
			var query = ' INSERT INTO products(product_id,title,author,category,image,description) VALUES("'+data.prod_id+'","'+data.title+'","'+data.author+'","'+data.cate_name+'","'+data.img+'","'+data.desc+'")';
			console.log(query);
			if(typeof(cordova)!='undefined')
			{
				if(cordova.platformId == 'ios') {
					myDB = sqlitePlugin.openDatabase('hindu_tamil_app',"1.0",'auto', 1024 * 1024 * 100);
				} else {
					myDB = window.openDatabase("hindu_tamil_app", "1.0", "auto", 1024 * 1024 * 100);
				}
			}
			myDB.transaction(function(transaction) {
				transaction.executeSql(query, []
				,function(tx, result) {
					var res = {status:true};
					
					//callback(res);
					 // SQL_Toast_Message('Inserted successfully');
				},
				function(error,er){
					var res = {status:false};
					SQL_Toast_Message(JSON.stringify(error)); 
					
					//callback(res);
				});
			});
		}
	});
}

function searchProducts(option,callback) {
	var where = ' WHERE 1=1 ';
	if((typeof(option.title) != 'undefined') && (option.title != '')) {
		where += ' AND title LIKE "%'+option.title+'%" ';
	}
	if((typeof(option.author) != 'undefined') && (option.author != '')) {
		where += ' AND description LIKE "%'+option.author+'%" ';
	}
	if((typeof(option.product_id) != 'undefined') && (option.product_id != '')) {
		where += ' AND product_id = "'+option.product_id+'" ';
	}
	if((typeof(option.category) != 'undefined') && (option.category != '')) {
		where += ' AND category = "'+option.category+'" ';
	}
	var query = 'SELECT * FROM products '+where;
	console.log('query',query);
	if(typeof(cordova)!='undefined')
	{
		if(cordova.platformId == 'ios') {
			myDB = sqlitePlugin.openDatabase('hindu_tamil_app',"1.0",'auto', 1024 * 1024 * 100);
		} else {
			myDB = window.openDatabase("hindu_tamil_app", "1.0", "auto", 1024 * 1024 * 100);
		}
	}
	
	myDB.transaction(function(transaction) {
		transaction.executeSql(query, []
		,function(tx, result) {
			if(typeof(cordova)!='undefined' && cordova.platformId == 'ios') {
				callback(result.rows._array);
			} else {
				callback(result.rows);
			}
		},
		function(error,er){
			
			callback([]);			
		});
	});
}

function downloadEpaperImage(options,callback) {
	console.log('downloadEpaperIma',options);
	var fileTransfer = new FileTransfer();
	var path = '';
	console.log(cordova.file);
	//cordova.plugins.diagnostic.requestExternalStorageAuthorization(function(success) {
	path = cordova.file.dataDirectory;
	//var file_name = generateKeyWord(6);
	var file_name = '';
	file_name = options.image.split('/')[9];
	console.log(path);
	console.log(options.image);
	console.log(path+'/'+file_name+'.ara');
	fileTransfer.download(
		(options.image),
		path+'/'+file_name,
		function(entry) {
			console.log('downloadEpaperIma entry');
			console.log(entry);
			// app.preloader.hide();
			callback({status:true,file_name:file_name});
		},
		function(error) {
			console.log('downloadEpaperIma file handle error');
			console.log(error);
			callback({status:false});
			//alert('File downloaded failed');
			toaster('downloadEpaperIma Download failed');
		}
	);
}