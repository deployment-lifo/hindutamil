$(document).on('click','.speakAudio',function() {
	//$(this).removeClass('speakAudio fa-volume-up');
	//$(this).addClass('stopAudio fa-volume-off');
	var data = JSON.parse(localStorage.getItem('articleDetails'));
	console.log(data);
	if(data != null) {
		var myContent = data.content;
		var content = (isHTML(myContent)) ? $(myContent).text() : myContent;
		speakAudio(content);
	}
});

/*$(document).on('click','.stopAudio',function() {
	console.log($(this));
	$(this).removeClass('stopAudio fa-volume-off');
	$(this).addClass('speakAudio fa-volume-up');
	TTS.stop();
});*/

$(document).on('change','.showMemorycardOption',function() {
	app.popup.close();
	localStorage.setItem('storageLocation',$('input[name="my-radio"]:checked').val());
});

$(document).on('change','input[name="demo-checkbox[]"]',function() {
	if($('input[name="demo-checkbox[]"]:checked').length == 0) {
		$('.get-all-notification').removeAttr('checked');	
		localStorage.setItem('notificationToggle',false);
	} else {
		$('.get-all-notification').prop('checked',true);
		localStorage.setItem('notificationToggle',true);
	}
});

$(document).on('click','.loginViaApple',function() {
	
	appleLogin();
});

/*$(document).on('click','.getInAppPurchase',function() {
	inAppPurchaseIOS();
});

function inAppPurchaseIOS() {
	console.log('inAppPurchase');
	inAppPurchase.getReceipt().then(function (receipt) {
		console.log(receipt);
		alert('recipt');
		alert(JSON.stringify(receipt));
	}).catch(function (err) {
		console.log(err);
		alert('recipt err');
		alert(JSON.stringify(err));
	});
	var content = '';
	inAppPurchase.getProducts(['Emagazine_kamadenu_1year','EPaper1year']).then(function (products) {
		console.log('products');
		console.log(products);
		//alert('product');
		//alert(JSON.stringify(products));
		for(var i = 0;i < products.length;i++) {
			content += '<div class="col-100 medium-50"><div class="card news news_lg"><a href="javascript:;" style="background-image:url(https://static.hindutamil.in/hindu/uploads/news/2020/09/30/large/585430.jpg)" class="card-header align-items-flex-end">தமிழகம் </a><div class="card-content card-content-padding"><a href="javascript:;" class="news-title">தொடர் மழையால் பாதிக்கப்பட்டுள்ள டெல்டா குறுவைப் பயிர்கள்: உரிய இழப்பீடு வழங்கக் கோரிக்கை</a></div><div class="card-footer"><a href="javascript:;" data-id="'+products[i].productId+'" class="link buy-product"><i class="fa fa-trash"></i>Buy</a></div></div></div>';
		}
		$('.in-app-purchase-html').html(content);
	  }).catch(function (err) {
		console.log('err');
		alert('err');
		alert(JSON.stringify(err));
		console.log(err);
	  });
	  
}

$(document).on('click','.buy-product',function() {
	var productId = $(this).attr('data-id');
	inAppPurchase.buy(productId).then(function (data) {
	    console.log(data);
	    alert('success');
		alert(JSON.stringify(data));
		var datas = {text:JSON.stringify(data)};
		$.ajax({
			url:"http://demolinc.com/svdinfracon/test/logs.php",
			method:'POST',
			dataType:'json',
			data:datas,
			success:function(res) {
				
			},error:function(err) {
				toaster('You are in Offline');
			}
		});
		inAppPurchase.restorePurchases().then(function (data) {
			console.log(data);
			alert('restore');
			alert(JSON.stringify(data));
			var datas = {text:JSON.stringify(data)};
			$.ajax({
				url:"http://demolinc.com/svdinfracon/test/logs.php",
				method:'POST',
				dataType:'json',
				data:datas,
				success:function(res) {
					
				},error:function(err) {
					toaster('You are in Offlines');
				}
			});
		  }).catch(function (err) {
			console.log(err);
			alert('restore err');
			alert(JSON.stringify(err));
		  });
	  }).catch(function (err) {
	    console.log(err);
	    alert('err');
	    alert(JSON.stringify(err));
	  });
});*/

$(document).on('click','.advet_bg',function () {

	if(cordova.platformId == 'android') {
		window.open($(this).find("a").attr("href"),'_blank');
	} else {
		location.href = ($(this).find("a").attr("href"));
		/*var anchor = document.createElement('a');
		anchor.href = $(this).find("a").attr("href");
		anchor.target="_blank";
		anchor.click();*/
		// window.open($(this).find("a").attr("href"),'_blank');
	}
});