var allowInfinite = true;
var scroll_page=2;
var isOnline = 'onLine' in navigator && navigator.onLine;
/* Page Actions Start */
/*$(document).on('page:beforein', function (page) {
	var page_name=(page.target.dataset.name);
	console.log('page before in',page_name);
	if(page_name!='')
	{
		if(isOnline) {
			switch(page_name)
			{
				case 'home':				
					 loadHomePage();
				break;
			}
		}
	}
});*/

$(document).on('page:afterin', function (page) {
	var page_name=(page.target.dataset.name);
	//console.log('page after in',page_name);
	//console.log('Page after IN');
	$('.e-fab-icons').show();
	if(page_name!='')
	{
		if(isOnline) {
			switch(page_name)
			{
				case 'home':
					var preTab = localStorage.getItem('tabActive');
					//if(preTab != null && preTab != 0){
						closeBuffer();
						loadHomePage();
					//}
				break;
				case 'profile':
					getUserProfile();
				break;
				case 'saved':
					$('.savedBackLink').show();
					getOfflineStory();
				break;
				case 'bookmarks':
					getSavedStories();
				break;
				case 'terms':
					getStaticContentPage(page_name);
				break;
				case 'comments':
					//var obj = page.originalEvent.detail.route.params;
					var aid = getUrlParameter('aid');
					getCommentList({aid:aid});
				break;
				case 'settings':
					getSettings();
				break;
				case 'albums':
					getAlbums(0);
				break;
				case 'font-settings':
					setFontSize();
				break;
				case 'change-password':
					showEyeInChangePassword();
				break;
				case 'notifications':
					getAllNotifications();
				break;
				case 'kamadenu':
					getKamaDenu();
				break;
				case 'kamadenu-detail':
					var obj = page.originalEvent.detail.route.params;
					getKamaDenuDetails(obj);
				break;
				case 'sub-menu-news':
					var sid = getUrlParameter('sid');
					var cid = getUrlParameter('cid');
					getOtherNewsDetails(cid,sid);
				break;
				case 'notify-settings':
					notificationSettings();
				break;	
				case 'notify-details':
					APPMODE='FOREGROUND';
					var aid = getUrlParameter('aid');
					getNotificationDetails({mid:1,aid:aid});
				break;
				case 'reply':
					var comment_id = getUrlParameter('comment_id');
					getReply(comment_id);
				break;
				case 'news-detail':
					closeBuffer();
					APPMODE='FOREGROUND';
					var aid = getUrlParameter('aid');
					var back = getUrlParameter('back');
					getNewsDetails({mid:1,aid:aid,back:back});
					setAdPlacement('news-detail');
		            initiateTextSize();
		            var swiper = new Swiper(".detail-swiper", {
	                  navigation: {
	                    nextEl: ".swiper-button-next",
	                    prevEl: ".swiper-button-prev",
	                  },
	              });
				break;
				case 'kamadenu-interior':
					var aid = getUrlParameter('aid');
					getKamadenuInteriorDetail(aid);
				break;
				case 'e-subscription':
					$('.e-fab-icons').hide();
					var date = new Date();
					var day = date.getDate();
					var month = date.getMonth()+1;
					var year = date.getFullYear();
					date = day+'-'+month+'-'+year;
					getPurchasedBookCount();
					getEpaperList(date);
				break;
				case 'book-viewer':
					$('.e-fab-icons').hide();
					var url = getUrlParameter('url');
					var password = getUrlParameter('password');
					var heading = getUrlParameter('heading');
					pdfReader({url:url,password:password,heading:heading});
				break;
				case 'elibrary-book-viewer':
					$('.e-fab-icons').hide();
					var file_name = getUrlParameter('url');
					var password = getUrlParameter('password');
					var heading = getUrlParameter('heading');
					fileReaderPDF({file_name:file_name,password:password},function(fileURL){
						pdfReader({url:fileURL,password:password,heading:heading});
						hideOfflineButton();
						fileEncrption({file_name:file_name,password:password});
					});
				break;
				case 'elibrary-epub-viewer':
					$('.e-fab-icons').hide();
					var file_name = getUrlParameter('url');
					var password = getUrlParameter('password');
					var heading = getUrlParameter('heading');
					fileReaderePub({file_name:file_name,password:password},function(fileURL){
						epubReader({url:fileURL,heading:heading});
						hideOfflineButton();
						fileEncrption({file_name:file_name,password:password});
					});
				break;
				case 'e-library':
					$('.eLibraryBackLink').show();
					$('.e-fab-icons').hide();
					getElibrary('paper');
				break;
				case 'wow-book':
					console.log('wow-book page afterin');
					var url = getUrlParameter('url');
					var heading = getUrlParameter('heading');
					$('.e-fab-icons').hide();
					last_page_cfi=typeof(localStorage[heading])!='undefined'?localStorage[heading]:'';
					$('.epub-toolbar .last_page_cfi').attr('href',last_page_cfi);
					epubReader({url:url,heading:heading});
				break;
				case 'search-result':
					var title = getUrlParameter('title');
					var author = getUrlParameter('author');
					var category = getUrlParameter('category');
					$('.e-fab-icons').hide();
					eBookSearch({title:title,author:author,category:category});
				break;
				case 'in-app-purchase':
					inAppPurchaseIOS('e-paper');
				break;
			}
		} else {
			switch(page_name)
			{
				case 'home':
					closeBuffer();
				break;
				case 'saved':
					$('.savedBackLink').hide();
					getOfflineStory();
				break;
				case 'news-detail':
					closeBuffer();
					$('.e-fab-icons').hide();
					APPMODE='FOREGROUND';
					var aid = getUrlParameter('aid');
					var back = getUrlParameter('back');
					getNewsDetails({mid:1,aid:aid,back:back});
		            initiateTextSize();
				break;
				case 'e-library':
					$('.e-fab-icons').hide();
					getElibrary('paper');
				break;
				case 'elibrary-book-viewer':
					$('.e-fab-icons').hide();
					var file_name = getUrlParameter('url');
					var password = getUrlParameter('password');
					var heading = getUrlParameter('heading');
					fileReaderPDF({file_name:file_name,password:password},function(fileURL){
						pdfReader({url:fileURL,password:password,heading:heading});
						hideOfflineButton();
						//fileEncrption({file_name:file_name,password:password});
					});
				break;
				case 'elibrary-epub-viewer':
					$('.e-fab-icons').hide();
					var file_name = getUrlParameter('url');
					var password = getUrlParameter('password');
					var heading = getUrlParameter('heading');
					fileReaderePub({file_name:file_name,password:password},function(fileURL){
						epubReader({url:fileURL,heading:heading});
						hideOfflineButton();
					//	fileEncrption({file_name:file_name,password:password});
					});
				break;
			}
		}
	}
});

app.on('pageInit', function (page) {

	var page_name=page.name;
	if(page_name!='')
	{
		switch(page_name)
		{
			
			case 'wow-book':
				console.log('wow-book page init');
				var url = getUrlParameter('url');
				var heading = getUrlParameter('heading');
				last_page_cfi=typeof(localStorage[heading])!='undefined'?localStorage[heading]:'';
				$('.epub-toolbar .last_page_cfi').attr('href',last_page_cfi);
			break;
			case 'news-detail':
				closeBuffer();
				// $('.pull-to-refresh-layer').hide();	
				//var obj = page.route.params;
				/*var mid = getUrlParameter('mid');
				var aid = getUrlParameter('aid');
				console.log(mid);
				console.log(aid);*/
				
	            // interstitialAd();
	            // getRelatedArticle();
			break;	
			case 'videos':
				/*getYoutubeVideos("UCJ36XbT02JNAlBEBgZtW7GQ");
				getDailyMotionVideos();*/
				scrollPageNo = 1;
				allowInfinite = true;
				getVideos('all');
				getVideoCategory('all');
			break;
			case 'feedback':
				getUserDetails();
			break;
			case 'search':
				getSearchValue();
			break;
		}
	}
});

var getUrlParameter = function (sParam) {
	
    var pageURL=location.href;
	//console.log('pageURL',pageURL);
    	sPageURL = (pageURL.split('?'))[1];
        sURLVariables = sPageURL.split('&');
        sParameterName = null;
        i = 0;
		//console.log('sParameterName',sParameterName);
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
		//console.log('sParameterName1',sParameterName);
        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
	
};