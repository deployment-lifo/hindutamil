/*access key*/
var accessToken = "GsWbpZpD21Hsd";
/*api url*/
var apiUrl = "https://api.hindutamil.in/app/index.php";

function getInAppPurchaseProducts(type,callBack) {
	var object = {key:accessToken,type:'ios_inapp'};
	/*ajax call*/
	$.ajax({
		url:apiUrl,
		method:'GET',
		dataType:'json',
		data:object,
		success:function(res) {
            app.preloader.hide();
            var data = res.data.hinduepaper;
            var userDetails = JSON.parse(localStorage.getItem('userDetails'));
            if(userDetails != null && userDetails.user_access.epaper == 1) {
            	data = [];
            }

			if(typeof(res.data.subs) != 'undefined' && type == 'e-paper') {
				var subs = res.data.subs;
				data = [...data, ...subs];	
			}

			if(typeof(res.data.ebook) != 'undefined' && type == 'e-book') {
				data = res.data.ebook;
			}
			
			var refIds = [];
			for (var i = 0; i < data.length; i++) {
				refIds.push({product_id:data[i].ref_id,img:data[i].img,prod_id:data[i].prod_id});
			}
			console.log(refIds);
			callBack(refIds);
		},error:function(err) {
			app.preloader.hide();
			toaster('You are in Offline');
		}
	});
}

$(document).on('click','.getInAppPurchase',function() {
	inAppPurchaseIOS($(this).attr('data-type')); 	
});

function connectItunes(type,res) {
	var className = '';
	var content = '';
	var id = [];
	if(type == 'e-paper') {
		className = 'in-app-e-paper';
	} else if(type == 'e-book') {
		className = 'in-app-e-book';
		// content += '<div class="list no-hairlines-md showInappProductSearch" style="display:none;"><ul><li class="item-content item-input"><div class="item-inner"><div class="item-title item-label">Title</div><div class="item-input-wrap"><input type="text" placeholder="Enter title" id="inAppPurchaseTitle" class="inAppPurchaseTitle"/><span class="input-clear-button"></span></div></div></li></ul><div class="row mb-20"><a href="javascript:;" class="col button button-fill color-gray inAppPurSearchClear">Clear</a><a href="javascript:;" class="col button button-fill inAppPurSearchResult">Submit</a></div></div>';	
	}
	
	for(var i = 0;i < res.length;i++) {
    	length = length + 1;
		id.push(res[i].product_id);
    }
    /*products = res;
    content += '<div class="block block-sm mt-0">';
	content += '<div class="row row-style-2">';
    if(products.length > 0) {
		for(var i = 0;i < products.length;i++) {
			content += '<div class="col-50 medium-25"><div class="econtent"><a href="javascript:;" class="epaper"><div class="econtent-image"><img src="'+products[i].img+'" onerror="this.src=\'assets/images/no-img.jpg\'" class="" alt=""/></div></a><label class="ename">title - 500</label><button data-id="'+products[i].productId+'" class="button button-fill button-small button-block color-blue buy-product"><i class="fa fa-shopping-cart"></i> Buy Now</button></div></div>';
		}	
		content += '</div></div>';
	} else {
		content += '<div class="no-record">No record found</div>';
	}*/

    if(typeof(inAppPurchase) != 'undefined') {
    	if(id.length > 0) {
    		inAppPurchase.getProducts(id).then(function (products) {
    			var ebookProduct = [];
    			if(type == 'e-book') {
					content += '<div class="list no-hairlines-md mt-0 showInappProductSearch" style="display:none;"><ul><li class="item-content item-input"><div class="item-inner"><div class="item-title item-label">Title</div><div class="item-input-wrap"><input type="text" placeholder="Enter title" id="inAppPurchaseTitle" class="inAppPurchaseTitle"/><span class="input-clear-button"></span></div></div></li></ul><div class="row mb-20"><a href="javascript:;" class="col button button-fill color-gray inAppPurSearchClear">Clear</a><a href="javascript:;" class="col button button-fill inAppPurSearchResult">Submit</a></div></div>';
					content += '<div class="block block-sm mt-0">';
					content += '<div class="row row-style-2">';
				}
				if(products.length > 0) {
					for(var i = 0;i < products.length;i++) {
		                var img = res.find(s => s.product_id == products[i].productId);
		                if(type == 'e-book') {
		                	/*content += '<div class="col-50 medium-25"><div class="econtent"><a href="javascript:;" class="epaper viewElibrary"><img src="'+img.img.replace('thumb','large')+'" onerror="this.src=\'assets/images/no-img.jpg\'" class="" alt=""/></a><label class="ename">'+products[i].title+'-'+products[i].price+'</label><button data-id="'+products[i].productId+'" class="button button-fill button-small button-block color-blue buy-product"><i class="fa fa-shopping-cart"></i> Buy Now</button></div></div>';*/
		                	content += '<div class="col-50 medium-25"><div class="econtent"><a href="javascript:;" class="epaper"><div class="econtent-image"><img src="'+img.img.replace('thumb','large')+'" onerror="this.src=\'assets/images/no-img.jpg\'" class="" alt=""/></div></a><label class="ename">'+products[i].title+' - '+products[i].price+'</label><button data-id="'+products[i].productId+'" class="button button-fill button-small button-block color-blue buy-product"><i class="fa fa-shopping-cart"></i> Buy Now</button></div></div>';
		                } else {
		                	content += '<div class="col-100 medium-50"><div class="card news news_lg"><a href="javascript:;" class="card-header cover-img align-items-flex-end"><img src="'+img.img.replace('thumb','large')+'"></a><div class="card-content card-content-padding"><a href="javascript:;" class="news-title">'+products[i].title+'</a><p class="news-desc">'+products[i].description+'</p><div class="row"><div class="col-50"><h4 class="prdprices">'+products[i].price+'</h4></div><div class="col-50 text-right"><a data-id="'+products[i].productId+'" href="javascript:;" class="button button-fill button-large buy-product"><i class="fa fa-shopping-cart"></i> Buy Now</a></div></div></div></div></div>';
		                }
						ebookProduct.push({productId:products[i].productId,img:img.img.replace('thumb','large'),title:products[i].title,description:products[i].description,price:products[i].price});
					}
					if(type == 'e-book') {
						content += '</div></div>';
	        			localStorage.setItem('in_app_purchase_search',JSON.stringify(ebookProduct));
					}
				} else {
					content += '<div class="no-record">No record found</div>';
					localStorage.removeItem('in_app_purchase_search');
				}
				$('.'+className).html(content);
			  }).catch(function (err) {
			  	toaster(err.errorMessage);
			  });
    	} else {
    		content += '<div class="no-record">No records found</div>';
    	}
    	$('.'+className).html(content);	
    }
    console.log(content);
    $('.'+className).html(content);
}

function showPreLoader(container,isShow) {
	
	var content = '';
	if(isShow) {
		content += '<div class="loading-wrapper"><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div></div>';
	}
	container.html(content);
}

function inAppPurchaseIOS(type) {
	var className = '';

	if(type == 'e-paper') {
		className = 'in-app-e-paper';
	} else if(type == 'e-book') {
		className = 'in-app-e-book';
	}
	showPreLoader($('.'+className),1);
	var content = '';

	getInAppPurchaseProducts(type,function(res) {
		var id = [];
		var length = 0;
		var userDetails = JSON.parse(localStorage.getItem('userDetails'));
		if(userDetails != null && type == 'e-book') {
			getMyOrderList({},function(orderDetails) {
				orderDetails = orderDetails.ebooks;
				var test = orderDetails.length;
				for (var i = 0; i < test; i++) {
					var val = res.filter(s => s.prod_id != orderDetails[i].issue_id);
					res = val;
				}
		        /*for(var i = 0;i < res.length;i++) {
		        	length = length + 1;
					id.push(res[i].product_id)
		        }*/
		        connectItunes(type,res);
			});	
		} else {
			/*for(var i = 0;i < res.length;i++) {
				length = length + 1;
	            id.push(res[i].product_id)
	        }*/
	        connectItunes(type,res);
		}
	});
	  
}

function appendInAppData(products) {

	var content = '';
	content += '<div class="list no-hairlines-md mt-0 showInappProductSearch" style="display:none;"><ul><li class="item-content item-input"><div class="item-inner"><div class="item-title item-label">Title</div><div class="item-input-wrap"><input type="text" placeholder="Enter title" id="inAppPurchaseTitle" class="inAppPurchaseTitle"/><span class="input-clear-button"></span></div></div></li></ul><div class="row mb-20"><a href="javascript:;" class="col button button-fill color-gray inAppPurSearchClear">Clear</a><a href="javascript:;" class="col button button-fill inAppPurSearchResult">Submit</a></div></div>';
	content += '<div class="block block-sm mt-0">';
	content += '<div class="row row-style-2">';
	
	if(products.length > 0) {
		for(var i = 0;i < products.length;i++) {
			content += '<div class="col-50 medium-25"><div class="econtent"><a href="javascript:;" class="epaper"><div class="econtent-image"><img src="'+products[i].img+'" onerror="this.src=\'assets/images/no-img.jpg\'" class="" alt=""/></div></a><label class="ename">'+products[i].title+' - '+products[i].price+'</label><button data-id="'+products[i].productId+'" class="button button-fill button-small button-block color-blue buy-product"><i class="fa fa-shopping-cart"></i> Buy Now</button></div></div>';
	        //content += '<div class="col-50 medium-25"><div class="econtent"><a href="javascript:;" class="epaper viewElibrary"><img src="'+products[i].img+'" onerror="this.src=\'assets/images/no-img.jpg\'" class="" alt=""/></a><label class="ename">'+products[i].title+'-'+products[i].price+'</label><button data-id="'+products[i].productId+'" class="button button-fill button-small button-block color-blue buy-product"><i class="fa fa-shopping-cart"></i> Buy Now</button></div></div>';
		}	
		content += '</div></div>';
	} else {
		content += '<div class="no-record">No record found</div>';
	}
	$('.in-app-e-book').html(content);
}

function getMyOrderList(option,callBack) {
	var userDetails = JSON.parse(localStorage.getItem('userDetails'));
	var data = {key:accessToken,type:'orders',user_id:userDetails.user_id};
	$.ajax({
		url:apiUrl,
		method:'GET',
		dataType:'json',
		data:data,
		success:function(res) {
			if(res.msg == "success") {
				var ebookData = res.data;
				callBack(ebookData);
			}
		},error:function(err) {
			toaster('You are in Offline');
		}
	});
}

function addLogin() {
    var userDetails = JSON.parse(localStorage.getItem('userDetails'));
    var data = {key:accessToken,type:'login',email:userDetails.user_email,password:'welcome',social:1};
    $.ajax({
		url:apiUrl,
		method:'GET',
		dataType:'json',
		data:data,
		success:function(res) {
            if(res.msg == "success") {
				localStorage.setItem('userDetails',JSON.stringify(res.data));
				var active = $('.in-app-purchase-tab').closest('div').find('.tab-link-active').attr('data-type');
				if(typeof(active) != 'undefined') {
					app.preloader.hide();
					inAppPurchaseIOS(active);
				}
			} else {
				toaster(res.msg);
				app.preloader.hide();
			}
		},error:function(err) {
			toaster('You are in Offline');
		}
	});
}

$(document).on('click','.buy-product',function() {
	var userDetails = JSON.parse(localStorage.getItem('userDetails'));
	if(userDetails == null) {
		$('#usercallback').val(false);
		app.popup.open('.login-screen');return false;
	} else {
        app.preloader.show();
		var productId = $(this).attr('data-id');
		
		var userId = userDetails.user_id;
		var prodId = productId;
		var status = 'success';
		inAppPurchase.buy(productId).then(function (data) {
            app.preloader.hide();
		    var object = {key:'GsWbpZpD21Hsd',type:'ios_sales',user_id:userId,prod_id:prodId,transaction_id:data.transactionId,status:status};
			/*ajax call*/
			$.ajax({
				url: apiUrl+"?key=GsWbpZpD21Hsd&type=ios_sales&user_id="+userId+"&prod_id="+prodId+"&transaction_id="+data.transactionId+"&status="+status,
				method:'POST',
				dataType:'json',
				data:object,
				success:function(res) {
                    app.preloader.hide();
                    if(res.msg == 'success') {
                        toaster('Purchased successfully');
                        addLogin();
                    } else {
                        toaster(res.msg);
                    }					
				},error:function(err) {
					app.preloader.hide();
					toaster('You are in Offline');
				}
			});
		  }).catch(function (err) {
            app.preloader.hide();
		    toaster(err.errorMessage);
		  });	
	}
});

function validateReceipt(data) {
    alert('validateReceipt');
    var datas = {
        'password': '08426236d89d49c79ae320545136a4ec', // the shared secret key for your in app purchase https://stackoverflow.com/questions/5022296/generate-shared-secret-key-in-itunes-connect-for-in-app-purchase
        'receipt-data': data
      }
    $.ajax({
        //url:"https://buy.itunes.apple.com/verifyReceipt",
        url:"https://sandbox.itunes.apple.com/verifyReceipt",
        method:'POST',
        dataType: 'jsonp',
          cors: true ,
          crossDomain:true,
          contentType:'application/json',
          secure: true,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          },
          beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Basic " + btoa(""));
          },
        data:datas,
        success:function(res) {
            alert(1);
            alert(JSON.stringify(res));
        },error:function(err) {
            alert(0);
            alert(JSON.stringify(err));
            toaster('You are in Offlines');
        }
    });
}

$(document).on('click','.inAppPurSearchClear',function() {
	$('#inAppPurchaseTitle').val('');
	// app.sheet.close();
	$('.showInappProductSearch').hide();
	var product = JSON.parse(localStorage.getItem('in_app_purchase_search'));
	// appendInAppData(product);
	inAppPurchaseIOS('e-book');
});

$(document).on('click','.showInAppPurchaseSearch',function() {
	$('#inAppPurchaseTitle').val('');
	// app.sheet.open('.search-sheet');
	$('.showInappProductSearch').slideToggle('slow');
});

$(document).on('click','.inAppPurSearchResult',function() {
	var data = JSON.parse(localStorage.getItem('in_app_purchase_search'));
	var value = $('#inAppPurchaseTitle').val();
	$('.showInappProductSearch').hide();
	if(data != null) {
		if(typeof(value) != 'undefined' && value != '') {
			products = searchInAppPurchase(data,'title',value)
			appendInAppData(products);
		}
	}
});

function searchInAppPurchase(obj,searchField,searchVal) {
	var results = [];
	var searchField = searchField;
	var searchVal = searchVal.toLowerCase();
	for (var i=0 ; i < obj.length ; i++) {
		var str = (obj[i][searchField]);
		if (typeof(str) != 'undefined' && (str.toLowerCase()).indexOf(searchVal) !== -1) {
	        results.push(obj[i]);
	    }
	}
	return results;
}