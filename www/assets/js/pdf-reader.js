function pdfReader(options) {
	var url = options.url;
	var password = options.password;
	var heading  = options.heading;

	if(typeof(AdMob) != 'undefined') {
		AdMob.hideBanner();
	}

	var password = typeof(password) == 'undefined' ? '' : password;
	var obj = JSON.parse(localStorage.getItem('pdfViewer'));
	console.log(obj);
	//$('.pdf-toolbar').hide();
	if(typeof(cordova) != 'undefined' && cordova.platformId == 'android') {
		$('.pdf-toolbar').slideUp();
	} else {
		$('.pdf-toolbar').slideDown();
	}
	setTimeout(function() {
		if((obj.show_button == true) || (obj.show_button == 'true')) {
			$('.showDownLoadButton').show();
		}
		
		var isOnline = 'onLine' in navigator && navigator.onLine;
		if(!isOnline) {
			//toast toast-bottom modal-out
			$(".toast-bottom").css("display", "none");
			$('.showDownLoadButton').hide();
		}
		if(typeof(cordova) != 'undefined' && isOnline) {
			if(obj.type == "paper")	 {
				firebaseObject = {page:'E-paper detail page',property:{content_type: "E-paper detail page"},item_id:{type:'E-paper detail page'}};
			} else if(obj.type == 'pdf') {
				firebaseObject = {page:'E-magazine detail page',property:{content_type: "E-magazine detail page"},item_id:{type:'E-paper magazine page'}};
			}
			setfirebaseAnalytics(firebaseObject);
		}
	},150);
	
	$("#book-reader").pdf({
		source: url,
		password:password,
		redrawOnWindowResize:true
	});
}

function epubReader(obj) {
	console.log(obj);
	if(typeof(AdMob) != 'undefined') {
		AdMob.hideBanner();
	}
	
	var heading  = obj.heading;
	$('.bookTitle').html(heading);	
	
	var object = JSON.parse(localStorage.getItem('pdfViewer'));
	console.log(object);
	setTimeout(function() {
		if((object.show_button == true) || (object.show_button == 'true')) {
			$('.showDownLoadButton').show();
		}
		
		var isOnline = 'onLine' in navigator && navigator.onLine;
		if(!isOnline) {
			$(".toast-bottom").css("display", "none");
			$('.showDownLoadButton').hide();
		}

		if(typeof(cordova) != 'undefined' && isOnline) {		
			setfirebaseAnalytics({page:'E-book detail page',property:{content_type: "E-book detail page", item_id:{type:'E-book detail page'}}});
		}

	},150);
	
	/*var el = document.querySelector('#viewer');
	var pinchZoomObj=new PinchZoom.default(el, {minZoom: 1});
	console.log(pinchZoomObj);*/

	window.reader = ePubReader(obj.url, {
		restore: true,
		manager: "continuous",
		storage:'indexeddb',
		flow: "paginated",
		width: window.innerHeight,
		height: window.innerWidth,
		replacements:'blobUrl',
		bookKey:obj.heading,
		previousLocationCfi:(typeof(localStorage[obj.heading+'previousLocationCfi'])!='undefined'?(localStorage[obj.heading+'previousLocationCfi']):''),
		snap: true
	});
	
}
