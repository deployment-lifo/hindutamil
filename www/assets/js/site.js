var OnlineStoreInappBrowser='';
/*user details*/
var userDetails = JSON.parse(localStorage.getItem('userDetails'));
/*module id*/
var modId = 1;
/*youtube channel id*/
var hinTamChannelId = "UCJ36XbT02JNAlBEBgZtW7GQ";
var selChannelId = "UCFwhrXOTW6wj-j5qUYWbbOQ";
/*Google api key*/
var gogApiKey = "AIzaSyCTtRE0ojpV5sopH7m1ifXdp6rxp-K0Myk";
/*youtube url*/ 
var youtubeUrl = "https://www.googleapis.com/youtube/v3/search";
/*Daily Motion url*/
var dailyMotionUrl = "https://api.dailymotion.com/user/HinduTamil/videos/";


var ptrTabs='';

var scrollPageNo = 1;
var allowInfinite = true;

document.addEventListener("offline", offLineOperation, false);
document.addEventListener("online", onLineOperation, false);

function offLineOperation() {
	//app.dialog.alert('Offline no network');
	localStorage.setItem('network','offLine');
	app.popup.open('.no-internet');
}


function onLineOperation() {
	//app.dialog.alert('Back to online');
	app.popup.close('.no-internet');
	var network = localStorage.getItem('network');
	console.log('network',network);
	if(network == 'offLine') {
		//onLoad();
		var currentPage = app.views.main.router.url;
		console.log(app.views.main.router);
		console.log('currentPage',currentPage);
		localStorage.setItem('network','onLine');
		mainView.router.load({url:'index.html'});

		// setTimeout(function(){ googleDFPTag(); loadHomePage(); },1500);
	}
}

/*login user via google*/
$(document).on('click','.loginViaGoogle',function() {
	googleLogin();
});

/*load home page*/
loadHomePage();

/*document ready function*/
$(document).ready(function() {
	//pdfReader({url:"https://static.hindutamil.in/hindu/uploads/mag/2021/01/30/mjayms/mzkx.pdf"});
	$('.loginEye').html('<i class="fa fa-eye-slash"></i>');
	$('.registerEye').html('<i class="fa fa-eye-slash"></i>');
	$('.registercEye').html('<i class="fa fa-eye-slash"></i>');

	/*show user name with and without login*/
	$('.showUserName').html('<h5 class="user-name ">WELCOME <br><span>Guest</span></h5><a href="#" data-login-screen=".my-login-screen" class="mt-16 button button-small button-block button-round button-outline color-white panel-close login-screen-open">LOGIN OR REGISTER</a>');
	if((userDetails != null)) {
		$('.showUserName').html('<h5 class="user-name ">WELCOME <br><span>'+userDetails.user_name+'</span></h5>');
	}
});


function onLoad() {
	scrollPageNo = 1;
	allowInfinite = true;
	//inAppPurchaseIOS();
	/*device ready call*/
	document.addEventListener('deviceready', onDeviceReady, false);
	localStorage.removeItem('tabActive');
	if(typeof(cordova) != 'undefined') {
		if(cordova.platformId == 'ios') {
			loadNewsDetailMenus();
			
		}
		onSQLDeviceReady();
	}
	
	localStorage.removeItem('detailPageBackData');
	googleHomeDfpAd();
}

function fileEncrptionSuccess(encryptedFile) {
	console.log(encryptedFile);
}

function fileEncrptionError() {
	console.log('File encrption error');
}

/*function to call when device is ready*/
function onDeviceReady() {
	//console.log(TTS);
	//console.log(TTS.getVoices());
	localStorage.setItem('storageLocation',1);

	if(cordova.platformId == 'android') {
		setTimeout(function(){
			console.log('cordova.plugins.diagnostic',cordova.plugins.diagnostic);
			// cordova.plugins.diagnostic.requestExternalStorageAuthorization(function(res) {
			var permissions = cordova.plugins.permissions;
			console.log('permissions',permissions);
			permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE,function(res){
				console.log('res');
				console.log(res);

				cordova.plugins.diagnostic.getExternalSdCardDetails(function(details){
					console.log('details',details);
					details.forEach(function(detail){
						console.log('detail',detail);
						console.log(cordova.file);
						cordova.file.externalSdCardDirectory = detail.filePath;
					});
				}, function(error){
					console.error('error');
					console.error(error);
				});

			},function(err) {
				console.log('err');
				console.log(err);

				cordova.plugins.diagnostic.getExternalSdCardDetails(function(details){
					console.log('details err',details);
				details.forEach(function(detail){
					console.log('detail',detail);

					cordova.file.externalSdCardDirectory = detail.filePath;
				});
			}, function(error){
				console.error('error');
				console.error(error);
			});

			});
			cordova.plugins.diagnostic.getExternalSdCardDetails(function(details){
					console.log('device',device);
					console.log('details',details);
				details.forEach(function(detail){
					console.log('detail',detail);

					cordova.file.externalSdCardDirectory = detail.filePath;
				});
			}, function(error){
				console.error('error');
				console.error(error);
			}); 
		},5000);
	}	
  
	localStorage.setItem('deviceDetails',JSON.stringify(device));
	getFbToken();
	backButtonFunctionality();	
	deepLink();
	
	createGoogleAds();
	
	
	
	if(typeof(cordova) != 'undefined') {
		if(cordova.platformId == 'ios') {
			loadTabView();
			$('.showApplelogin').show();
		}
	}
	
	
	checkVersion();
	
	if(typeof(window.plugins.preventscreenshot)!='undefined')
		window.plugins.preventscreenshot.disable(successCallback, errorCallback);


	getAllCategory(1);
}

function successCallback(result) {
	//console.log(result); // true - enabled, false - disabled
}
 
function errorCallback(error) {
  console.log(error);
}

/*social sharing*/
$(document).on('click','.shareLink',function() {
	var url = (typeof($(this).attr('data-url')) != 'undefined') ? $(this).attr('data-url') : $('#web_url').val();
	var msg = (typeof($(this).attr('data-msg')) != 'undefined') ? $(this).attr('data-msg') : $('#msg').val();
	if(typeof(url) != 'undefined') {
		shareSocial(url,msg);
	}
});



/*function for success sharing*/
var onSocialSharingSuccess = function(result) {
  //app.dialog.alert('Shared to '+result.app+' successfully','Great!');
}

/*function for error sharing*/
var onSocialSharingError = function(msg) {
  app.dialog.alert('Failed to share via this application','Alert!');
}

/*Login via facebook*/
$(document).on('click','.loginViaFacebook',function() {
	facebookLogin();
});

/*Used to user login*/
$(document).on('click','.userLogin',function() {
	/*login validation*/
	if(!checkEmpty('#user_name')) {
		toaster('Enter email address');
	} else if(!isEmail($('#user_name').val())) {
		toaster('Enter valid email');
	} else if(!checkEmpty('#password')) {
		toaster('Enter password');
	} else {
		/*calling function to login*/
		userLogin($('#user_name').val(),$('#password').val(),0,'',magazineLoginHandler);	
	}
});

/*function for loader*/
function loader($option,$msg){
  /*if($option==1) {
  		app.preloader.show("","Please wait...");
      //app.progressbar.show('multi');
  } else {
  	app.preloader.hide();
    //app.progressbar.hide();
  }*/
}

/*used for user regitration*/
$(document).on('click','.userRegister',function() {
	// app.popup.open('.activation');
	/*validation*/
	if(!checkEmpty('#userName')) {
		toaster('Enter username');
	} else if(!checkEmpty('#email')) {
		toaster('Enter email');
	} else if(!isEmail($('#email').val())) {
		toaster('Enter valid email');
	} else if(!checkEmpty('#reg_password')) {
		toaster('Enter password');
	} else if($('#reg_password').val().length < 6 || $('#reg_password').val().length > 25) {
		toaster('Password between 6 to 25 charcters');
	} else if(!checkEmpty('#cpassword')) {
		toaster('Enter confirm password');
	} else if($('#cpassword').val().length < 6 || $('#cpassword').val().length > 25) {
		toaster('Confirm password between 6 to 25 charcters');
	} else if($('#reg_password').val() != $('#cpassword').val()) {
		toaster('Password not match with confirm password');
	} else {
		/*calling function to user register*/
		userRegister($('#userName').val(),$('#email').val(),$('#reg_password').val(),0);
	}
});

/*resend otp*/
$(document).on('click','.resendOtp',function() {
	resendOtp();
});

/*user account activation*/
$(document).on('click','.activateAccount',function() {
	if(!checkEmpty('#activationCode')) {
		toaster('Please enter activation code');	
	} else {
		app.preloader.show();
		var data = {key:accessToken,type:'acc_activate'};
		var otp = localStorage.getItem('userOTP');
		var acctActivation = $('#activationCode').val();
		if(acctActivation == otp) {
			var user = JSON.parse(localStorage.getItem('userLogin'));
			var data = {key:accessToken,type:'login',email:user.user_email,password:user.password,social:1,verified:1}
			/*ajax call for home page*/
			acctivateAccount(data);
			/*toaster('OTP verified successfully');
			app.popup.close('.popup.register');
			app.popup.close('.popup.activation');
			localStorage.removeItem('userOTP');
			var data = JSON.parse(localStorage.getItem('userRegDetails'));
			localStorage.setItem('userDetails',JSON.stringify(data));
			localStorage.removeItem('userRegDetails');*/
		} else {
			toaster('Invalid Code');
			app.preloader.hide();	
		}
	}
});

/*change password*/
$(document).on('click','.changePassword',function() {
	/*validation*/
	if(!checkEmpty('#current_password')) {
		toaster('Enter current password');
	} else if(!checkEmpty('#new_password')) {
		toaster('Enter new password');
	} else if($('#new_password').val().length < 6 || $('#new_password').val().length > 25) {
		toaster('Password between 6 to 25 charcters');
	} else if(!checkEmpty('#confirm_password')) {
		toaster('Enter confirm password');
	} else if($('#confirm_password').val().length < 6 || $('#confirm_password').val().length > 25) {
		toaster('Confirm password between 6 to 25 charcters');
	} else if($('#new_password').val() != $('#confirm_password').val()) {
		toaster('New password not match with confirm password');
	} else if($('#current_password').val() == $('#new_password').val()) {
		toaster("Current password and new password can't be same");
	} else {
		/*calling function for change password*/
		changePassword($('#current_password').val(),$('#new_password').val());
	}
});

var pageNo = 1;
$(document).on('tab:show','.homeTabs .tab',function(){
	setTimeout(function(){
		var mId = $('#swipeableTab .swiper-slide-active').attr('data-mid');
		var cId = $('#swipeableTab .swiper-slide-active').attr('data-cid');
		var sId = $('#swipeableTab .swiper-slide-active').attr('data-sid');
		var id = $('#swipeableTab .swiper-slide-active').attr('data-id');
		
		var adPlacement1=$('.showOtherPageDetails_'+id+' ').find('#div-gpt-ad-1605624284210-2').attr('id');
		var adPlacement2=$('.showOtherPageDetails_'+id+' ').find('#div-gpt-ad-1605624284210-3').attr('id');
		if(typeof(adPlacement1)=='undefined')
		{
			$('.showOtherPageDetails_'+id+' .tab-add-placement1').html("<div id='div-gpt-ad-1605624284210-2' class='text-center' ></div>");
			$('.showOtherPageDetails_'+id+' .tab-add-placement2').html("<div id='div-gpt-ad-1605624284210-3' class='text-center' ></div>");
			setTimeout(function(){refreshAds('category_page_ad_1'); refreshAds("category_page_ad_2")},500);
		}
		if(typeof(id)!='undefined'){ 
			getOtherPageDetails(id,mId,cId,sId);
		}
		else {
			getHomePageDetails(1);
		}
	},500);
});

$(document).on('tab:hide','.homeTabs .tab',function(){
	var mId = $('#swipeableTab .swiper-slide-active').attr('data-mid');
	var cId = $('#swipeableTab .swiper-slide-active').attr('data-cid');
	var sId = $('#swipeableTab .swiper-slide-active').attr('data-sid');
	var id = $('#swipeableTab .swiper-slide-active').attr('data-id');
	if(typeof(id)!='undefined')
	{
		$('.showOtherPageDetails_'+id+' #div-gpt-ad-1605624284210-2').remove();
		$('.showOtherPageDetails_'+id+' #div-gpt-ad-1605624284210-3').remove();
	}
});

/*get home page details*/
$(document).on('click','#getHomePage',function() {
	
	/*get home page details*/
	$('.categoryMenu .tab-link').removeClass('tab-link-active');
	$(this).addClass('tab-link-active');
	localStorage.setItem('tabActive',0);
	//$(".categoryMenu").animate({scrollLeft: $('.categoryMenu .tab-link-active').position().left}, 0);
	getHomePageDetails(1);
});

/*used to get other pages*/
$(document).on('click touchend','#getOtherPages',function() {
	//$('.showHomePageDetails').html('');
	var mId = $(this).attr('data-mid');
	var cId = $(this).attr('data-cid');
	var id = $(this).attr('data-id');
	var sid = $(this).attr('data-sid');

	localStorage.setItem('tabActive',cId);
	
	/*get other pages*/
	getOtherPageDetails(id,mId,cId,sid);
});



// infinite.on('infinite', function() {   
	// var cid = $('.categoryMenu').find('a.tab-link-active').attr('data-cid');
	// var id = $('.categoryMenu').find('a.tab-link-active').attr('data-id');
	// var sid = $('.categoryMenu').find('a.tab-link-active').attr('data-sid');

 //    if(typeof(cid) != 'undefined' && typeof(id) != 'undefined' && typeof(sid) != 'undefined'){
 //    	setTimeout(function() {
 //    		loadMoreOtherNews(cid,id,sid);
 //    	},2000);
 //    }
 // console.log('allowInfinite',allowInfinite);
 	/*if(allowInfinite) {
		allowInfinite = false;
		lazyLoadFunctionality();
	}*/
	/*if(typeof(page) != 'undefined' && page == 'home') {
		// if(homePageNo <= 4) {
			triggerHomeDetails(homePageNo);
			homePageNo++;
		// } 
	} else {
		var cid = $('.categoryMenu').find('a.tab-link-active').attr('data-cid');
		var id = $('.categoryMenu').find('a.tab-link-active').attr('data-id');
		var sid = $('.categoryMenu').find('a.tab-link-active').attr('data-sid');
		
	    if(typeof(cid) != 'undefined' && typeof(id) != 'undefined' && typeof(sid) != 'undefined')
	    	loadMoreOtherNews(cid,id,sid);	
	}*/
	
// });

function loadMoreOtherNews(cId,id,sId) {
	app.preloader.show();
	letMeCheck = true;
	var data = {type:'cate_article',key:accessToken,mid:1,cid:cId,page:scrollPageNo,limit:15};
	if(typeof(sId) != 'undefined' && sId != 0) {
		data.sub_cid = sId;
	}
	// console.log(data);
	/*ajax call*/
	$.ajax({
		url:apiUrl,
		method:'GET',
		dataType:'json',
		data:data,
		success:function(res) {
			app.preloader.hide();
			//scrolled=scrolled+300;
			if(res.msg == "success") {
				var button = '';
				var data = res.data;
				if(data != null) {
					if(data.length >= 15) {
						scrollPageNo = scrollPageNo + 1;
						allowInfinite = true;
					}
					var content = '';
					if(data.length > 0) {
							for(var i = 0;i < data.length;i++) {
									content += '<div class="list media-list news-list"><ul><li><a href="/news-detail/1/'+data[i].aid+'" class="item-link item-content"><div class="item-media"><img src="'+data[i].img.replace('thumb','large')+'" width="80" onerror="this.src=\'assets/images/no-img.jpg\'"/></div><div class="item-inner"><div class="item-text">'+data[i].title_ta+'</div></div></a></li></ul></div>';		
							}
							//button = '<a href="#" data-id="'+id+'" data-cid="'+cId+'" class="otherPageLoadMore button button-block button-fill color-grey button-round">Load more</a>';
						}
						content += button;
						$('.showOtherPageDetails_'+id).append(content);
				}
				// return false;
					/*$(".showOtherPageDetails_"+id).animate({
				        scrollTop:  scrolled
				    });*/
					// $('.showOtherPageDetails_'+id).slideDown(1000);
					// $('.showOtherPageDetails_'+id).animate({scrollDown: $('.showOtherPageDetails_'+id).position().down}, 0);
			}
		},error:function(err) {
			app.preloader.hide();
			toaster('You are in Offline');
		}
	});
}

function displayAds(divContainer)
{
	googletag.display(divContainer);
}

$(document).on('click','.otherPageLoadMore',function() {
	var cId = $(this).attr('data-cid');
	var id = $(this).attr('data-id');
	$('.showOtherPageDetails_'+id).find('a.otherPageLoadMore').remove();
	pageNo++;
	var data = {type:'cate_article',key:accessToken,mid:1,cid:cId,page:pageNo,limit:15};
	/*ajax call*/
	$.ajax({
		url:apiUrl,
		method:'GET',
		dataType:'json',
		data:data,
		success:function(res) {
			if(res.msg == "success") {
				var button = '';
				var data = res.data;
				var content = '';
				if(data.length > 0) {
						for(var i = 0;i < data.length;i++) {
								content += '<div class="list media-list news-list"><ul><li><a href="/news-detail/1/'+data[i].aid+'" class="item-link item-content"><div class="item-media"><img src="'+data[i].img.replace('thumb','large')+'" width="80" onerror="this.src=\'assets/images/no-img.jpg\'"/></div><div class="item-inner"><div class="item-text">'+data[i].title_ta+'</div></div></a></li></ul></div>';		
						}
						button = '<a href="#" data-id="'+id+'" data-cid="'+cId+'" class="otherPageLoadMore button button-block button-fill color-grey button-round">Load more</a>';
					}
					content += button;
					$('.showOtherPageDetails_'+id).append(content);
					// $('.showOtherPageDetails_'+id).slideDown(1000);
					// $('.showOtherPageDetails_'+id).animate({scrollDown: $('.showOtherPageDetails_'+id).position().down}, 0);
			}
		},error:function(err) {
			toaster('You are in Offline');
		}
	});
});

$(document).on('click','.addEmotesFromArticlePage',function() {
	
	var login = JSON.parse(localStorage.getItem('userDetails'));		
	var articleType = $(this).attr('data-article-type');
	
	if(articleType=='login_required' && login.user_id=='' ){
		toaster('To like the Premium Article. Please login');
	}else if(articleType=='paid' && (typeof(login)== null || login==null)){
		toaster('To like the Premium Article. Please login');		
		return false;
	}else if(articleType=='paid' && (login!= null && login.user_id!='' &&  login.user_access.web_access!=1 )){
		toaster('Please subscribe to like the premium articles');
	}else{
	
	$('.selectEmoji').find('a').removeClass('voted');
	var emotes = JSON.parse(localStorage.getItem('emote'));
	var login = JSON.parse(localStorage.getItem('userDetails'));
	var input = '<div class="block"><h2>What is your reaction?</h2></div>';
	if(login == null) {
		//input += '<div class="form-group"><input type="text" class="form-control postName" name="" id="" placeholder="Enter Your Name"/></div><div class="form-group"><input type="email" class="form-control postEmail" name="" id="" placeholder="Enter Email"/></div>';
	}
	input += '<div class="form-group"><ul class="emoji"><li class="selectEmoji emoteSubmit"><a href="#" data-value="1" class=""><img src="assets/images/emoji/excited.png" onerror="this.src=\'assets/images/no-img.jpg\'" alt=""> <span>Excited<br>'+emotes.e1+'%</span></a></li><li class="selectEmoji emoteSubmit"><a href="#" data-value="2" class=""><img src="assets/images/emoji/great.png" onerror="this.src=\'assets/images/no-img.jpg\'" alt=""> <span>Great<br>'+emotes.e2+'%</span></a></li><li class="selectEmoji emoteSubmit"><a href="#" data-value="3" class=""><img src="assets/images/emoji/unmoved.png" onerror="this.src=\'assets/images/no-img.jpg\'" alt=""> <span>Unmoved<br>'+emotes.e3+'%</span></a></li><li class="selectEmoji emoteSubmit"><a href="#" data-value="4" class=""><img src="assets/images/emoji/shocked.png" onerror="this.src=\'assets/images/no-img.jpg\'" alt=""> <span>Shocked<br>'+emotes.e4+'%</span></a></li><li class="selectEmoji emoteSubmit" ><a href="#" class="" data-value="5"><img src="assets/images/emoji/sad.png" onerror="this.src=\'assets/images/no-img.jpg\'" alt=""> <span>Sad<br>'+emotes.e5+'%</span></a></li><li class="selectEmoji emoteSubmit"><a href="#" data-value="6" class=""><img src="assets/images/emoji/angry.png" alt="" onerror="this.src=\'assets/images/no-img.jpg\'"> <span>Angry<br>'+emotes.e6+'%</span></a></li></ul></div>';
	
	$('.postCommentWithoutLogin').html(input);
	app.popup.open('.postNewsComment');
	
	}
});

$(document).on('click','.selectEmoji',function() {
	$('.selectEmoji').find('a').removeClass('voted');
	$(this).find('a').addClass('voted');
});

$(document).on('click touchend','.moveToTab',function() {
	var cID=$(this).data('cid');
	var mID=$(this).data('mid');
	var sID=$(this).data('sid');	
	//alert(cID);
	if(typeof($('.categoryMenu .tab-link[data-cid="'+cID+'"]').data('tab'))!='undefined' && cID!='')
	{
		scrollPageNo = 1;
		allowInfinite = true;
		localStorage.setItem('tabActive',cID);
		app.panel.close();
		var tabToShow=$('.categoryMenu .tab-link[data-cid="'+cID+'"]').data('tab');
		
		app.tab.show(tabToShow, true);
	} else if(mID == 1 && cID == 0 && sID == 0) {
		scrollPageNo = 1;
		allowInfinite = true;
		localStorage.setItem('tabActive',0);
		app.panel.close();
		app.tab.show('#tab-1', true);
		//getHomePageDetails(1);
	} else if(cID && mID && sID) {
		
		app.panel.close();
		mainView.router.load({url:'pages/submenu.html?cid='+sID+'&sid='+cID});
	} else {
		toaster("Sorry! No content found");
	}
});

$(document).on('click','.noContent',function() {
	var cID=$(this).data('cid');
	var mID=$(this).data('mid');
	
	if(mID == 2 && cID == 0) {
		app.panel.close();
		mainView.router.load({url:'pages/kamadenu.html'});
	} else {
		toaster("Sorry! No content found");	
	}	
});
/*navigate page from setting*/
$(document).on('click','.navToRespectivePage',function() {
	var page = $(this).attr('data-page');
	var userDetails = JSON.parse(localStorage.getItem('userDetails'));
	if(page == 'rate_this_app') {
		rateTheApp();
	} else if(page == 'logout') {
		localStorage.removeItem('userDetails');
		localStorage.removeItem('epaperCredentials');
		var loginType = localStorage.getItem('loginFrom');
		if(loginType == 'google') {
			googleLogout();
		} else if(loginType == 'facebook') {
			facebookLogout();	
		}
		$('.showUserName').html('<h5 class="user-name ">WELCOME <br><span>Guest</span></h5><a href="#" data-login-screen=".my-login-screen" class="mt-16 button button-small button-block button-round button-outline color-white panel-close login-screen-open">LOGIN OR REGISTER</a>');
		
		mainView.router.load({url:'index.html'});
	} else if(page == 'bookmark') {
		// mainView.router.load({url:'pages/bookmarks.html'});
		var login = checkSession();
		if(login) {
			app.panel.close();
			mainView.router.load({url:'pages/bookmarks.html'});
		}
	}

	// if(userDetails != null) {
		/*if(page == 'profile') {
			mainView.router.load({url:'pages/profile.html'});
		} else if(page == 'change_password') {
			mainView.router.load({url:'pages/change-password.html'});
		} else if(page == 'feedback') {
			mainView.router.load({url:'pages/feedback.html'});
		} else if(page == 'bookmark') {
			mainView.router.load({url:'pages/bookmarks.html'});
		}  else if(page == 'rate_this_app') {
			rateTheApp();
		} else if(page == 'terms_cond') {
			mainView.router.load({url:'pages/terms.html'});
		} else if(page == 'logout') {
			localStorage.removeItem('userDetails');
			var loginType = localStorage.getItem('loginFrom');
			if(loginType == 'google') {
				googleLogout();
			} else if(loginType == 'facebook') {
				facebookLogout();	
			}
			mainView.router.load({url:'index.html'});
		}
	} else {
		if(page == 'rate_this_app') {
			rateTheApp();
		} else if(page == 'terms_cond') {
			mainView.router.load({url:'pages/terms.html'});
		} else if(page == 'notification') {
			mainView.router.load({url:'pages/notifications.html'});
		} else {
			toaster('Please login to your account!');
		} 
	}*/
});

/*update user profile*/
$(document).on('click','#updateProfile',function() {
	if(!checkEmpty('#userame')) {
		toaster('Enter username');
	} else {
		app.preloader.show();
		/*request data for profile update*/
		var data = {key:accessToken,type:'profile_edit'};
		var userDetails = JSON.parse(localStorage.getItem('userDetails'));
		data.user_id = userDetails.user_id;
		if(checkEmpty('#userame')) {
			data.user_name = $('#userame').val();
			userDetails.user_name = $('#userame').val();
		}
		if($('#phoneNumber').val().length > 10 || $('#phoneNumber').val().length < 10) {
			app.preloader.hide();
			toaster('Enter a valid phone number');return false;
		}
		if(checkEmpty('#phoneNumber')) {
			data.phone = $('#phoneNumber').val();
			userDetails.phone = $('#phoneNumber').val();
		} 
		if(checkEmpty('#dob')) {
			data.dob = $('#dob').val();
			userDetails.dob = $('#odb').val();
		}
		if(checkEmpty('#gender')) {
			data.gender = $('#gender').val();
			userDetails.gender = $('#gender').val();
		}
		if(checkEmpty('#maritalStatus')) {
			data.mstatus = $('#maritalStatus').val();
			userDetails.mstatus = $('#maritalStatus').val();
		}
		/*ajax call for profile update*/
		$.ajax({
			url:apiUrl,
			method:'GET',
			dataType:'json',
			data:data,
			success:function(res) {
				if(res.msg == "success") {
					toaster('Profile updated successfully');
					localStorage.setItem('userDetails',JSON.stringify(userDetails));
					mainView.router.load({url:'index.html'});
					app.preloader.hide();
				} else {
					toaster(res.msg);	
					app.preloader.hide();
				}
			},error:function(err) {
				toaster('You are in Offline');	
			}
		});
	}
});

/*save bookmark*/
$(document).on('click','.saveBookMark',function() {
	
	var userDetails = JSON.parse(localStorage.getItem('userDetails'));
	var login = checkSession();
	if(login) {
		app.preloader.show();
		/*if(userDetails == null) {
			toaster('Please login to your account!');
			app.preloader.hide();
			return false;
		}*/
		var mid = $('#mid').val();
		var aid = $('#aid').val();
		/*request data*/
		var data = {key:accessToken,type:'bookmark_save',aid:aid,mid:mid};
		
		if(userDetails != null) 
			data.user_id = userDetails.user_id;
		
		saveBookmark(data);
	}		
});

/*Delete bookmark*/
$(document).on('click','.deleteBookMark',function() {
	var aid = $(this).attr('data-aid');
	var cid = $(this).attr('data-cid');
	/*request data*/
	var data = {key:accessToken,type:'bookmark_del',aid:aid,mid:modId};
	var userDetails = JSON.parse(localStorage.getItem('userDetails'));
	if(userDetails != null) 
		data.user_id = userDetails.user_id;
	app.dialog.confirm('Are you sure want to delete?','Confirmation!',function(){
		deleteBookMark(data);
	});	
});

/*add feedback*/
$(document).on('click','.addFeedBack',function() {
	/*call function for adding feedback*/
	addFeedback();
});

/*open category tab*/
$(document).on('click','.openTab',function() {
	/*var cid = $(this).attr('data-cid');
	if(cid != 0) {
		$('.categoryMenu').find('a').removeClass('tab-link-active');
		$('.listTab').find('div').removeClass('tab-active');
		$('.categoryMenu').find('a.test_'+cid).addClass('tab-link-active');
		$('.listTab').find('div#tab-'+cid).addClass('tab-active');
		if(cid == 1) {
			getHomePageDetails();
		} else {
			getOtherPageDetails(cid,1,cid);
		}
	}	*/
});

/*if (!app.support.touch) {
  console.log('No touch support');
}
else
	console.log('Supports touch');*/

app.on('tabShow',function(){	
	$(document).off("scroll");
	setTimeout(function(){
		var myScrollPos = $('.categoryMenu a.tab-link-active').offset().left + $('.categoryMenu a.tab-link-active').outerWidth(true)/2 + $('.categoryMenu').scrollLeft() - $('.categoryMenu').width()/2;
    	$('.categoryMenu').scrollLeft(myScrollPos);
	},300);
});

/*post comment*/
$(document).on('click','.postComment',function() {
	var reply = 0;
	var userDetails = JSON.parse(localStorage.getItem('userDetails'));	
	if(userDetails != null) {
		if(!checkEmpty('.commentVal')) {
			toaster('Enter your description');
		} else {
			userDetails.reply = reply;
			postComment($('.commentVal').val(),userDetails);
		}	
	} else {
		if(!checkEmpty('.postName')) {
			toaster('Enter your name');
		} else if(!checkEmpty('.postEmail')) {
			toaster('Enter Email');
		} else if(!isEmail($('.postEmail').val())) {
			toaster('Enter valid email id');
		} else if(!checkEmpty('.commentVal')) {
			toaster('Enter your description');
		} else {
			var data = {name:$('.postName').val(),email:$('.postEmail').val(),type:'comments',comment:$('.commentVal').val(),password:'welcome',reply:0};
			userLoginViaComment(data);
			// userRegViaCommentPost(data);
		}
	}
});

$(document).on('click','.replyNewComment',function() {
	
	var reply = (typeof($('.replyNewComment').attr('data-id')) != 'undefined') ? $('.replyNewComment').attr('data-id') : 0;
	
	var userDetails = JSON.parse(localStorage.getItem('userDetails'));	
	if(userDetails != null) {
		if(!checkEmpty('.replyVal')) {
			toaster('Enter your description');
		} else {
			userDetails.reply = reply;
			postComment($('.replyVal').val(),userDetails);
		}	
	} else {
		if(!checkEmpty('.replyName')) {
			toaster('Enter your name');
		} else if(!checkEmpty('.replyEmail')) {
			toaster('Enter Email');
		} else if(!isEmail($('.replyEmail').val())) {
			toaster('Enter valid email id');
		} else if(!checkEmpty('.replyVal')) {
			toaster('Enter your description');
		} else {
			// var data = {name:$('.postName').val(),email:$('.postEmail').val(),type:'comments'};
			var data = {name:$('.replyName').val(),email:$('.replyEmail').val(),type:'comments',comment:$('.replyVal').val(),password:'welcome',reply:reply};
			userLoginViaComment(data);
			// userRegViaCommentPost(data);
		}
	}
});

/*like or dislike for comment*/
$(document).on('click','.likeDisLikeComment',function() {
	
	var comt_id = $(this).attr('data-id');
	var aid = $(this).attr('data-aid');
	var type = $(this).attr('data-type');
	// alert(type);
	
	/*if(userDetails == null){
		toaster('Please login to your account!');return false;
	} else {*/
	// var login = checkSession();
	// if(login) {
	var deviceDetails = JSON.parse(localStorage.getItem('deviceDetails'));
	var userDetails = JSON.parse(localStorage.getItem('userDetails'));
	var userId = deviceDetails.uuid;

	if(userDetails != null) {
		userId = userDetails.user_id;
	}

	app.preloader.show();
	
	/*request data*/
	if(type == 'like') {
		var data = {key:accessToken,type:'comment_like',user_id:userId,user_uid:deviceDetails.uuid,remote_addr:deviceDetails.uuid,comment_id:comt_id,aid:aid};
	} else {
		var data = {key:accessToken,type:'comment_dislike',user_id:userId,user_uid:deviceDetails.uuid,remote_addr:deviceDetails.uuid,comment_id:comt_id,aid:aid};
	}
	/*ajax call for like or dislike for comment*/
	$.ajax({
		url:apiUrl,
		method:'GET',
		dataType:'json',
		data:data,
		success:function(res) {
			app.preloader.hide();
			if(res.msg == "success") {
				//app.popup.close('.comment');
				toaster(type+' successfully');
				getCommentList(data);
			} else {
				toaster(res.msg);
			}
		},error:function(err) {
			toaster('You are in Offline');
		}
	});
	// }
});

/*reply for comment*/
$(document).on('click','.reply',function() {
	var reply = $(this).attr('data-reply-for');
	if(typeof(reply) )
		mainView.router.load({url:'./pages/reply.html?comment_id='+reply});
	/*var userDetails = JSON.parse(localStorage.getItem('userDetails'));
	if(userDetails == null) {
		toaster('Please login to your account!');return false;
	} else {*/
	/*var login = checkSession();
	if(login) {
		app.popup.open('.replyComment');
		$('#comment_id').val('');
		$('#comment').val('');
		$('#comment_id').val(reply);
	}*/
	// }
});

$(document).on('click','.postForReply',function() {
	if($('#comment_id').val() != '') {
		if(!checkEmpty('#replyForComment')) {
			toaster('Enter reply');
		} else {
			var userDetails = JSON.parse(localStorage.getItem('userDetails'));
			userDetails.reply = $('#comment_id').val();
			// $('#replyForComment').val();		
			postComment($('#replyForComment').val(),userDetails);
		}
		
	}
	
});

/*Add new comment*/
$(document).on('click','.addComment',function() {
	/*var userDetails = JSON.parse(localStorage.getItem('userDetails'));
	if(userDetails == null) {
		toaster('Please login to your account!');return false;
	} else {*/
	// var login = checkSession();
	
	// if(login) {
		
	app.popup.open('.postCommentModal');
	$('#comment_id').val('');
	$('#comment').val('');
	$('#comment_id').val(0);	
	// }
});

/*navigate to comment page*/
$(document).on('click','.navToCommentPage',function() {
	app.popover.close();
});
//app.popup.open('.check_app_version');
/*function to load home page*/
function loadHomePage() {
	$('#usercallback').val(false);
	//app.popup.open('.check_app_version');
	localStorage.removeItem('homePageSearchValue');
	
	showPreLoader($('.showHomePageDetails'),1);
	// app.popup.open('.interestial-ad');
	//$('.loading-wrapper').show();
	/*get all category*/
	getAllCategory(1);
	/*get home page details*/
	
	getAppVersion();
	/*get all menus*/
	getAllMenus();
	/*get app setting*/
	// getAppVersion();
	initiateTextSize();
	getNotificationCount();
	
	// getPushTest();
}

$(document).on('keyup paste','.albumPageSearch',function() {
	var val = $(this).val();
	if(typeof(cordova) != 'undefined') {		
		setfirebaseAnalytics({page:'Album search page',property:{content_type: "Album search page", item_id:'Album search page'}});
	}
	
	var data = {type:'search',q:val,module:'album',page:1,rel:2,key:accessToken};
	//https://api.hindutamil.in/app/index.php?q=Photo%20Story&module=album&page=1&rel=2&key=GsWbpZpD21Hsd&type=search
	$.ajax({
		url:apiUrl,
		method:'GET',
		dataType:'json',
		data:data,
		success:function(res) {
			var content = '';
			if(res.msg == "success") {
				var data = res.data.data;
				if(data.length > 0) {
					for(var i = 0;i < data.length;i++) {
						content += '<div class="col-100 medium-50 large-33"><div class="swiper-wrapper albumDetail" data-aid="'+data[i].aid+'" data-cid="'+data[i].cid+'"><div class="swiper-slide" id="pb-standalone-dark"><div class="card album-card"><div class="card-header album-img align-items-flex-end"><img src="'+data[i].img.replace('medium','large')+'" onerror="this.src=\'assets/images/no-img.jpg\'"/></div><div class="card-content card-content-padding"><h3>'+data[i].title_ta+'</h3></div></div></div></div></div>';
					}
				} else {
					content += '<div class="no-record">No record found</div>';
				}				
			} else {
				content += '<div class="no-record">No record found</div>';
			}
			$('.searchAlbumResult').html(content);
		},error:function(err) {
			toaster('You are in Offline');
		}
	});

});

/*open photo gallery*/
$(document).on('click','.openPhotoBrowser',function(){
	var shareUrl = $(this).attr('data-url')+'?cid='+$(this).attr('data-cid');
	
	// var images=$(this).find('.card-header').data('image');
	//console.log($(this).attr('data-aid'));
	//console.log(JSON.parse($('.triggerPhotoBrowser_'+$(this).attr('data-aid')).find('.ablum_data').html()));
	var images = JSON.parse($(this).find('.ablum_data').html());
	
	Array.prototype.insert = function ( index, item ) {
	    this.splice( index, 0, item );
	};
	//images.insert(5, {caption:'<div id="div-gpt-ad-1605632724271-0"><script>refreshAds("album_page_ad_2");</script></div>'});
	
    /*images.insert(5, {html:"<div id='div-gpt-ad-1605624326531-2' class='album_ad' ></div>"});
    images.insert(10, {html:"<div id='div-gpt-ad-1605624326531-3' class='album_ad' ></div>"});*/
    images.insert(5, {html:"<div id='div-gpt-ad-1605624566043-1'></div>"});
    images.insert(10, {html:"<div id='div-gpt-ad-1605624566043-10'></div>"});
	
	/*var img = [];
	for(var i = 0;i < images.length;i++) {
		img.push(images[i].replace('thumb','large'));
	}*/
	//console.log(images);
	/*initiate album*/
	initAlbum(images,shareUrl);
});

var $$ = Dom7;

$(document).on('click','.getAlbumFullCaption',function() {
	
	$('.hideAlbumDescription').hide();
	$('.showAlbumDescription').show();
});
				
$(document).on('click','.selectCategoryVideo',function() {
	var type = $(this).attr('data-type');
	getVideos(type);
});

/*play video*/
$(document).on('click','.playVideo',function() {
	var id = $(this).attr('data-id');
	var cap = $(this).attr('data-cap');
	// var html = '<iframe frameborder="0" width="640" height="360" src="<https://www.dailymotion.com/embed/video/x7tgad0>"; allowfullscreen allow="autoplay"></iframe>';
	// alert(id);
	/*var id = $(this).attr('data-id');
	var videoId = $(this).attr('data-video');
	var videos;
	if(typeof(videoId) != 'undefined') {
		videos = JSON.parse(localStorage.getItem('videos'));
	}
	getVideos(id,videos);*/
	// initAlbum(["https://www.youtube.com/embed/"+id]);
	
	initAlbum([{
        html: '<iframe src="https://www.youtube.com/embed/'+id+'?autoplay=1&rel=0" autoplay="true" allow="autoplay" frameborder="0" allowfullscreen></iframe>',
        caption:cap
    }],1);
	
	/*var myPhotoBrowserDark = app.photoBrowser.create({
	      photos :"https://www.youtube.com/embed/"+id,
	      theme: 'dark'
	  });
	 myPhotoBrowserDark.open();*/
});

$(document).on('click','.shareViaWhatsApp',function() {
	var link = $(this).attr('data-url');
	var msg = $(this).attr('data-msg');
	var type = $(this).attr('data-type');
	var img = $(this).attr('data-img');

	if(type == 'twitter') {
		shareViaTwitter(msg,link,img);
	} else if(type == 'whatsapp') {
		shareViaWhatsApp(msg,link,img);
	} else if(type == 'facebook') {
		shareViaFacebook(msg,link,img);
	}
});

$(document).on('click','.emoteSubmit',function() {
	var userDetails = JSON.parse(localStorage.getItem('userDetails'));
	/*if(userDetails == null && !checkEmpty('.postName') && !checkEmpty('.postEmail')) {
		app.popup.open('.my-login-screen');return false;
	}*/
	$(this).addClass('voted')
	var aId = ($('#aid').val());
	var emojiId = $('.selectEmoji').find('a.voted').data('value');

	if(userDetails != null){
		userId = userDetails.user_id;
	} else {
		var deviceDetail = JSON.parse(localStorage.getItem('deviceDetails'));
		userId = deviceDetail.uuid;
	}
	//$('.emoteSubmit').find('a').addClass('voted');
	emotesSubmit(aId,emojiId,userId);

	/*var aId = ($('#aid').val());
	var userId;
	if(userDetails == null) {
		if(!checkEmpty('.postName')) {
			toaster('Enter your name');return false;
		} else if(!checkEmpty('.postEmail')) {
			toaster('Enter Email');return false;
		} else if(!isEmail($('.postEmail').val())) {
			toaster('Enter valid email id');return false;
		} else if(typeof($('.selectEmoji').find('a.voted').data('value')) == 'undefined') {
			toaster('Please select your emotion');
		} else {
			var emojiId = $('.selectEmoji').find('a.voted').data('value');
			var data = {name:$('.postName').val(),email:$('.postEmail').val(),type:'emotes',aid:aId,emotion:emojiId};
			userRegViaCommentPost(data);
		}
	} else {
		if(typeof($('.selectEmoji').find('a.voted').data('value')) == 'undefined') {
			toaster('Please select your emotion');
		} else {
			var emojiId = $('.selectEmoji').find('a.voted').data('value');
			userId = userDetails.user_id;
			$('.emoteSubmit').find('a').addClass('voted');
			emotesSubmit(aId,emojiId,userId);
		}		
	}*/
	/*if(typeof($('.selectEmoji').find('a.voted').data('value')) == 'undefined') {
		toaster('Please select your emotion');
	} else {
		var emojiId = $('.selectEmoji').find('a.voted').data('value');
		var aId = ($('#aid').val());
		var userId;
		var data = {name:$('.postName').val(),email:$('.postEmail').val(),type:'emotes',aid:aId,emotion:emojiId};
		console.log(userDetails);
		if(userDetails == null) {
			if(!checkEmpty('.postName')) {
				toaster('Enter your name');return false;
			} else if(!checkEmpty('.postEmail')) {
				toaster('Enter Email');return false;
			} else if(!isEmail($('.postEmail').val())) {
				toaster('Enter valid email id');return false;
			} else {
				userRegViaCommentPost(data);
			}
		} else {
			userId = userDetails.user_id;
			$('.emoteSubmit').find('a').addClass('voted');
			emotesSubmit(aId,emojiId,userId);
		}
	}*/
	
});

//backButtonFunctionality();
// document.addEventListener("deviceready", backButtonFunctionality, false);
function backButtonFunctionality()
{
  document.addEventListener("backbutton", function(e){ 
	    
		var activePage=$('.page:nth-child(2)').data('name');
	    //app.dialog.alert(activePage);
		var curPageType = $('.newdetails').attr('data-cur-page');
	    var currentPage = app.views.main.router.url;
		
		if(curPageType=='premium'){ 
			mainView.router.load({url:'./index.html'});
			setTimeout( function() { loadHomePage(); },500);
		}else if(currentPage=='#!./index.html' || currentPage=='appinfo') {
	      mainView.router.load({url:'./index.html'});
	    } else if(currentPage=='/' || currentPage=='./index.html' ||currentPage=='/android_asset/www/index.html' || currentPage=='home') {
	      
	      app.dialog.confirm('Are you sure want to close this app?','Confirmation!',function(){
	        navigator.app.exitApp();
	      });
	    } else {
			var isOnline = 'onLine' in navigator && navigator.onLine;
			//history.go(-1);
			if(isOnline) {
				history.go(-1);
			} else {
				var lastTimeBackPress = 0;
				var timePeriodToExit = 2000;
				toaster('You are in Offline');
				
				if(new Date().getTime() - lastTimeBackPress < timePeriodToExit) {
					app.dialog.confirm('Are you sure want to close this app?','Confirmation!',function(){
						navigator.app.exitApp();
					});
				}
				return false;
			}
			//mainView.router.back();
			// navigator.app.backHistory();
			// mainView.router.back();
	      //navigator.app.backHistory();
	    }
	  e.preventDefault();
	  e.stopPropagation();
	});
 }
 

$(document).on('click','.saveOffLineStory',function() {
		//var data = JSON.parse($('.all_data').html());
		var login = JSON.parse(localStorage.getItem('userDetails'));
		var data = JSON.parse(localStorage.getItem('offlineStory'));
		var articleType = $(this).attr('data-article-type');
		/*console.log(data);
		var login = checkSession();
		if(login) {
			insertArticleDetails(data);
		}*/
		
		if(articleType=='free'){ 
			insertArticleDetails(data);
		}else if(articleType=='login_required' && login.user_id!='' ){
			insertArticleDetails(data);
		}else if(articleType=='login_required' && login.user_id=='' ){
			toaster('For Premium Article. Please login to save article.');
		}else if(articleType=='paid' && (login==null)){
		toaster('For Premium Article. Please login to save article.');
		}else if(articleType=='paid' && login.user_id!='' && login.user_access.web_access==1){
			insertArticleDetails(data);
		}else if(articleType=='paid' && login.user_id!='' && login.user_access.web_access!=1){
			toaster('Please subscribe save article.');
		}else if(articleType=='paid' && (typeof login.user_id === 'undefined' || login.user_id === null)){
			toaster('For Premium Article. Please login to save article.');			
		}
	});

$(document).on('click','.deleteOfflineStory',function() {
	var aid = ($(this).attr('data-aid'));
	var id = ($(this).attr('data-id'));
	app.dialog.confirm('Are you sure want to delete?','Confirmation!',function(){
		var data = {id:id,aid:aid};
		deleteArticle(data,function(res) {
			
			if(res.status) {
				toaster('Deleted successfully');
				getOfflineStory();
			} else {
				toaster('Deletion failed');	
			}
		});
	});
});

$(document).on('click','.clearCache',function() {
	clearCache();
});

$(document).on('keyup paste','.homePageSearch',function(e) {
	// showPreLoader($('.searchResult'),1);
	
	var value = $('.homePageSearch').val();
	console.log('value',value);
	scrollPageNo = 1;
	allowInfinite = true;
	if(typeof(value) != 'undefined' && value != '') {
		var data = {value:value};
		localStorage.setItem('homePageSearchValue',value);
		getNewsSerachResult(value);
	} else {
		$('.searchResult').html('<div class="no-record">No record found</div>');
	}
});

function getSpeech() {
	alert(0);
	
	/*window.plugins.speechRecognition.hasPermission(function (isGranted){
		console.log(isGranted);
	    if(isGranted){
	    	alert(1);
	    	console.log('isGranted');
	    	var settings = {
			    lang: "en-US",
			    showPopup: true
			};

			
	        // Do other things as the initialization here
	    }else{
	        // You need to request the permissions
	        console.log('not isGranted');
	    }
	}, function(err){
	    console.log(err);
	});*/
	window.plugins.speechRecognition.startListening(function(result){
				alert(JSON.stringify(result));
			    // By default just 5 options
			    // ["Hello","Hallou", "Hellou" ...]
			}, function(err){
			    alert(JSON.stringify(err));
			}, settings);
}

$(document).on('click','.closeComment',function() {
	app.sheet.close();
});

$(document).on('change','.fontChange',function() {
	$(this).attr('checked');
	app.popover.close('.font-settings');
	var val = $(this).val();
	localStorage.setItem('text-size',val);
    $('body').removeAttr('class');
    $('body').attr('class','color-theme-blue');
	$('body').addClass(val);
});

function getTimeInterval(date) {
  let seconds = Math.floor((Date.now() - date) / 1000);
  let unit = "second";
  let direction = "ago";
  if (seconds < 0) {
    seconds = -seconds;
    direction = "from now";
  }
  let value = seconds;
  if (seconds >= 31536000) {
    value = Math.floor(seconds / 31536000);
    unit = "year";
  } else if (seconds >= 86400) {
    value = Math.floor(seconds / 86400);
    unit = "day";
  } else if (seconds >= 3600) {
    value = Math.floor(seconds / 3600);
    unit = "hour";
  } else if (seconds >= 60) {
    value = Math.floor(seconds / 60);
    unit = "minute";
  }
  if (value != 1)
    unit = unit + "s";
  return value + " " + unit + " " + direction;
}
$(document).ready(function(){
	// $('.showApplelogin').show();
	console.log("https://static.hindutamil.in/epaper/EpaperTest/2021/03/04/image/CH_i16tnuqa.jpg".split('/')[9])
	$('iframe').contents().find('a').click(function(event) {
		alert("demo only");
	    event.preventDefault();
	}); 
});

$(document).on('click','.inHouseAd',function() {
	var url = $(this).find('a').attr('href');
	if(typeof(device)!='undefined' && device.platform=='Android')
	{
		window.open(url, '_system'); return false;
	}
	else {
		if(moment().unix()>='1622831400') {
			cordova.InAppBrowser.open(url,"_blank");
		}
	}
	//
	//console.log(url);
	//cordova.InAppBrowser.open(url,'_blank');
});

$(document).on('click','.showAlbums',function() {
	var title = $(this).attr('data-type');
	// $('.video-category').find('div.color-blue').attr('data-type');
	getAlbums(title);
});

$(document).on('click','.loginEye',function() {
	var type = $('#password').attr('type');
	if(type == 'password') {
		$('.loginEye').html('<i class="fa fa-eye"></i>');
		$('#password').attr('type','text');	
	} else {
		$('.loginEye').html('<i class="fa fa-eye-slash"></i>');
		$('#password').attr('type','password');
	}	
});

$(document).on('click','.registerEye',function() {
	var type = $('#reg_password').attr('type');
	if(type == 'password') {
		$('.registerEye').html('<i class="fa fa-eye"></i>');
		$('#reg_password').attr('type','text');	
	} else {
		$('.registerEye').html('<i class="fa fa-eye-slash"></i>');
		$('#reg_password').attr('type','password');
	}	
});

$(document).on('click','.registercEye',function() {
	var type = $('#cpassword').attr('type');
	if(type == 'password') {
		$('.registercEye').html('<i class="fa fa-eye"></i>');
		$('#cpassword').attr('type','text');	
	} else {
		$('.registercEye').html('<i class="fa fa-eye-slash"></i>');
		$('#cpassword').attr('type','password');
	}	
});

$(document).on('click','.currentPasEye',function() {
	var type = $('#current_password').attr('type');
	if(type == 'password') {
		$('.currentPasEye').html('<i class="fa fa-eye"></i>');
		$('#current_password').attr('type','text');	
	} else {
		$('.currentPasEye').html('<i class="fa fa-eye-slash"></i>');
		$('#current_password').attr('type','password');
	}	
});

$(document).on('click','.newPasEye',function() {
	var type = $('#new_password').attr('type');
	if(type == 'password') {
		$('.newPasEye').html('<i class="fa fa-eye"></i>');
		$('#new_password').attr('type','text');	
	} else {
		$('.newPasEye').html('<i class="fa fa-eye-slash"></i>');
		$('#new_password').attr('type','password');
	}	
});

$(document).on('click','.confirmPasEye',function() {
	var type = $('#confirm_password').attr('type');
	if(type == 'password') {
		$('.confirm_password').html('<i class="fa fa-eye"></i>');
		$('#confirm_password').attr('type','text');	
	} else {
		$('.registercEye').html('<i class="fa fa-eye-slash"></i>');
		$('#confirm_password').attr('type','password');
	}	
});

function getPushTest() {
	alert(0);
	$.ajax({
		url:"https://admin.hindutamil.in/testPush.php",
		method:'POST',
		dataType:'json',
		data:{aid:"596026",topic:"promo",key:accessToken},
		success:function(res) {
			if(res.msg == "success") {
				localStorage.setItem('userDetails',JSON.stringify(res.data));
				$('.showUserName').html('<h5 class="user-name ">WELCOME <br><span>'+res.data.user_name+'</span></h5>');
				app.popup.close('.login-screen');
				app.preloader.hide();
			} else if(loginType == 1) {
				userRegister(name,userName,'',1);
			} else {
				toaster(res.msg);
				app.preloader.hide();
			}
		},error:function(err) {
			toaster('You are in Offline');
		}
	});
}

function savePushToken() {
	var token = localStorage.getItem('fbToken');
	var device = JSON.parse(localStorage.getItem('deviceDetails'));
	var userDetails = JSON.parse(localStorage.getItem('userDetails'));

	var data = {key:accessToken,type:'fcm_register'};
	data.token = token;
	data.device_id = device.uuid;
	data.topic = 'test';

	if(userDetails != null) {
		data.user_id = userDetails.user_id;
	}

	$.ajax({
		url:apiUrl,
		method:'GET',
		dataType:'json',
		data:data,
		success:function(res) {
			alert(JSON.stringify(res));
			/*if(res.msg == "success") {
				localStorage.setItem('userDetails',JSON.stringify(res.data));
				$('.showUserName').html('<h5 class="user-name ">WELCOME <br><span>'+res.data.user_name+'</span></h5><a href="/settings/" class="setting-icon panel-close"><i class="fa fa-cog"></i></a>');
				app.popup.close('.login-screen');
				app.preloader.hide();
			} else if(loginType == 1) {
				userRegister(name,userName,'',1);
			} else {
				toaster(res.msg);
				app.preloader.hide();
			}*/
		},error:function(err) {
			toaster('You are in Offline');
		}
	});	
}

$(document).on('click','.deleteNotification',function() {
	var id = ($(this).attr('data-id'));
	app.dialog.confirm('Are you sure want to delete?','Confirmation!',function(){
		app.preloader.show();
		var data = {id:id};
		deleteNotification(data,function(res) {
			app.preloader.hide();
			if(res.status) {
				toaster('Notification deleted succesfully');	
				getAllNotifications();
			} else {
				toaster('Deletion failed');	
			}
		});
	});
});



function sendPushNotifications() {
alert(0);
	$.ajax({
		url:'http://admin.hindutamil.in/send_push_notification_app.php',
		method:'POST',
		dataType:'json',
		data:{aid:"596026",topic:"promo",key:accessToken,push_type:'app'},
		success:function(res) {
			alert(JSON.stringify(res));
			/*if(res.msg == "success") {
				localStorage.setItem('userDetails',JSON.stringify(res.data));
				$('.showUserName').html('<h5 class="user-name ">WELCOME <br><span>'+res.data.user_name+'</span></h5><a href="/settings/" class="setting-icon panel-close"><i class="fa fa-cog"></i></a>');
				app.popup.close('.login-screen');
				app.preloader.hide();
			} else if(loginType == 1) {
				userRegister(name,userName,'',1);
			} else {
				toaster(res.msg);
				app.preloader.hide();
			}*/
		},error:function(err) {
			toaster('You are in Offline');
		}
	});	
}

$(document).on('click','.forgotPassword',function() {
	if(!checkEmpty('#f_email')) {
		toaster('Enter email');
	} else if(!isEmail($('#f_email').val())) {
		toaster('Enter valid email id');
	} else {
		forgotPassword($('#f_email').val());
	}
});

$(document).on('click','.getVideoDetails',function() {
	var thiz=$(this);
	$('.page-content').scrollTop(0);
	var scrollLeft = '.video-category'; 
	setTimeout(function() {
		var myScrollPos = $('.video-category div.color-blue').offset().left + $('.video-category div.color-blue').outerWidth(true)/2 + $(scrollLeft).scrollLeft() - $(scrollLeft).width()/2;
		$(scrollLeft).scrollLeft(myScrollPos);
	},500);
	$('.videoSearchOption').val('');
	scrollPageNo = 1;
	allowInfinite = true;
	var type = $(this).attr('data-type');
	console.log(type);
	if(typeof(type) != 'undefined' && type != '') {
		if(type != 0) {
			getVideos(type);
		} else {
			getDailyMotionVideos1('daily-motion',function(data){
				appendDailyMotionVideo(data,'daily-motion');
			});
		}
		getVideoCategory(type);
		/*console.log($(".video-category").width());
		console.log(thiz.width());
		console.log($('.getVideoDetails.color-blue').position());
		$(".video-category").animate({scrollLeft: $('.getVideoDetails.color-blue').position().left-20}, 1000);*/
	}
});

/*play video*/
$(document).on('click','.playYouTubeVideo',function() {
	var id = $(this).attr('data-id');
	var cap = $(this).attr('data-cap');
	// photos.map(i=>i.caption='<div class="share_news"><ul><li><a href="javascript:void(0)" class="shareForAll" data-url="'+i.url+'"><i class="fa fa-share-alt"></i></a></li></ul></div>'+((i.caption != null) ? ('<p class="hideAlbumDescription">'+i.caption.substr(0,25)+'...<a href="javascript:void(0)" class="getAlbumFullCaption">மேலும் படிக்க</a></p><p class="showAlbumDescription" style="display:none;">'+i.caption+'</p>') : ''));
	
	initAlbum([{
        //html: '<iframe src="'+id+'?autoplay=1&enablejsapi=1&mute=1" allow="autoplay" autoplay="1"></iframe>',
        html:'<iframe src="'+id+'?	rel=0&autoplay=1" allow="autoplay;" autoplay="1"></iframe>',
        caption:cap+'<div class="share_news"><ul><li><a href="javascript:void(0)" class="shareForAll" data-msg="'+cap+'" data-url="'+id+'"><i class="fa fa-share-alt"></i></a></li></ul></div>'
    }],1);
});

$(document).on('keyup','.videoSearchOption',function() {
	var val = $('.videoSearchOption').val();
	if(typeof(cordova) != 'undefined') {		
		setfirebaseAnalytics({page:'Video search page',property:{content_type: "Video search page", item_id:'Video search page'}});
	}
	
	// console.log(val);
	var type = $('.video-category').find('.color-blue').attr('data-type');
	if(type == 'all') {
		var data = JSON.parse(localStorage.getItem('dailyMotionVideos'));
		var resp = searchNormal(data,'title',val);
		appendDailyMotionVideo(resp,type);
		var data = JSON.parse(localStorage.getItem('youTubeVideos'));
		var resp = searchYouTubeVideo(data,'title',val);
		var title = '';
		if(type == 'hindu-tamil') {
			title = 'Hindu Tamil Thisai';
		} else {
			title = 'Selfie Review';
		}
		appendYouTubeData(resp,title,type);
	} else {
		if(type == 'daily-motion') {
			var data = JSON.parse(localStorage.getItem('dailyMotionVideos'));
			var resp = searchNormal(data,'title',val);
			appendDailyMotionVideo(resp,type);
		} else {
			var data = JSON.parse(localStorage.getItem('youTubeVideos'));
			var resp = searchYouTubeVideo(data,'title',val);
			var title = '';
			if(type == 'hindu-tamil') {
				title = 'Hindu Tamil Thisai';
			} else {
				title = 'Selfie Review';
			}
			appendYouTubeData(resp,title,type);
		}
	}	
});

var otherPageNo = 1;
function getOtherNewsDetails(cId,sId) {
	// showPreLoader($('.appendOtherNewsDetails'),1);
	app.preloader.show();
	var data = {type:'cate_article',mid:1,cid:cId,sub_cid:sId,key:accessToken,page:otherPageNo,limit:15};
	/*ajax call for login*/
	$.ajax({
		url:apiUrl,
		method:'GET',
		dataType:'json',
		data:data,
		success:function(res) {
			
			if(res.msg == "success") {
				var data = res.data;
				var content = '';
				if(data.length > 0) {
					for(var i = 0;i < data.length;i++) {
						if(i == 0){
							var premiumClass = (data[i].content_type=='paid' || data[i].content_type=='login_required'?'<span class="badge premium gold-premium premium-label">ப்ரீமியம்</span>':'');
							content += '<div class="col-100 medium-60"><div class="card news news_lg"><a data-aid="'+data[i].aid+'" href="javascript:;" class="cover-img card-header align-items-flex-end navToNewsDetailPage">'+premiumClass+'<img src="'+data[i].img.replace('thumb','large')+'" onerror="this.src=\'assets/images/no-img.jpg\'"/></a><div class="card-content card-content-padding"><a href="javascript:;" data-aid="'+data[i].aid+'" class="news-title navToNewsDetailPage">'+data[i].title_ta+'</a><p class="news-desc">'+data[i].desc_ta+'</p></div></div></div>';
							$('.addTitle').html('<span>'+data[i].cate_ta+'</span>');
						} else {
							content +='<div class="col-100 medium-40"><div class="list media-list news-list"><ul><li><a href="javascript:;" data-aid="'+data[i].aid+'" class="item-link item-content navToNewsDetailPage"><div class="item-media">'+premiumClass+'<img src="'+data[i].img.replace('thumb','large')+'" width="80" onerror="this.src=\'assets/images/no-img.jpg\'"/></div><div class="item-inner"><div class="item-text">'+data[i].title_ta+'</div></div></a></li></ul></div></div>';
						}
						premiumClass = '';
					}
					//content += '<a href="#" data-sid="'+sId+'" data-cid="'+cId+'" class="otherNewsLoadMore button button-block button-fill color-grey button-round">Load more</a>';
				} else {
					content += '<div class="no-record">No records found</div>';
				}
				$('.appendOtherNewsDetails').html(content);
				app.preloader.hide();
			} else {
				app.preloader.hide();
				toaster(res.msg);
			}
		},error:function(err) {
			toaster('You are in Offline');
		}
	});
}

$(document).on('click','.otherNewsLoadMore',function() {
	var cId = $(this).data('cid');
	var sId = $(this).data('sid');
	app.preloader.show();
	otherPageNo++;
	var data = {type:'cate_article',mid:1,cid:cId,sub_cid:sId,key:accessToken,page:otherPageNo,limit:15};
	$('.otherNewsLoadMore').remove();
	/*ajax call for login*/
	$.ajax({
		url:apiUrl,
		method:'GET',
		dataType:'json',
		data:data,
		success:function(res) {
			
			if(res.msg == "success") {
				var data = res.data;
				var content = '';
				if(data.length > 0) {
					for(var i = 0;i < data.length;i++) {
						content +='<div class="col-100 medium-40"><div class="list media-list news-list"><ul><li><a href="/news-detail/1/'+cId+'" class="item-link item-content"><div class="item-media"><img src="'+data[i].img.replace('thumb','large')+'" width="80" onerror="this.src=\'assets/images/no-img.jpg\'"/></div><div class="item-inner"><div class="item-text">'+data[i].title_ta+'</div></div></a></li></ul></div></div>';
					}
					content += '<a href="#" data-sid="'+sId+'" data-cid="'+cId+'" class="otherNewsLoadMore button button-block button-fill color-grey button-round">Load more</a>';
				}
				$('.appendOtherNewsDetails').append(content);
			} else {
				toaster(res.msg);
			}
			app.preloader.hide();
		},error:function(err) {
			app.preloader.hide();
			toaster('You are in Offline');
		}
	});
});


//initialize the goodies 
function initAd(){
	/*var setOptions = ({
        publisherId:           "ca-app-pub-9693451887247156/1006192540",  // Required
        interstitialAdId:      "ca-app-pub-9693451887247156/8235562878",  // Optional
        autoShowBanner:false,
        autoShowRInterstitial: true,                                  // Optional
        adSize:admob.AD_SIZE.IAB_BANNER,	//use SMART_BANNER, BANNER, LARGE_BANNER, IAB_MRECT, IAB_BANNER, IAB_LEADERBOARD
        overlap: false,
        // bannerAtTop: true, // set to true, to put banner at top
        // overlap: true, // banner will overlap webview 
        // offsetTopBar: false, // set to true to avoid ios7 status bar overlap
        isTesting: false, // receiving test ad
        autoShow: false, // auto show interstitial ad when loaded
        customHTMLElement:document.querySelector('#my-custom-container')
      });
	console.log(admob);
    console.log(admob.AD_SIZE);
	// Start showing banners (atomatic when autoShowBanner is set to true)
	admob.requestInterstitialAd(setOptions,function(res) {
		alert(JSON.stringify(res));
	},function(err) {
		alert(JSON.stringify(err));
	});
	*/
	
}

$(document).on('click','.popover-open[data-popover=".font-settings"]',function(){
	setTimeout(function(){app.popover.open('.font-settings','.popover-open[data-popover=".popover-links"]');},500);
});

$(document).on('click','.showSubcription',function() {
	loadSubscriptionBrowser();
});

/*$(document).ready(function () {
	$(document).on('click','.categoryMenu a',function(e){
        e.preventDefault();
        $(document).off('scroll');
        $('.categoryMenu a').each(function(){
            $(this).removeClass('tab-link-active');
        });
        $(this).addClass('tab-link-active');
        var myScrollPos = $('a.tab-link-active').offset().left + $('a.tab-link-active').outerWidth(true)/2 + $('.categoryMenu').scrollLeft() - $('.categoryMenu').width()/2;
        $('.categoryMenu').scrollLeft(myScrollPos);
    });
});*/


$(document).on('click','#notificationSubmit',function() {
	if($('input[name="demo-checkbox[]"]:checked').length == 0) {
		toaster('Please select atleast one category');
	} else {
		notificationSubmit();
	}
});

$(document).on('click','.redirectToNotiDetails',function() {
	var aid = $(this).attr('data-aid');
	mainView.router.load({url:'pages/notify-details.html?aid='+aid});
});

$(document).on('keyup paste','.videoPageSearch',function() {
	app.preloader.show();
	var val = $('.videoPageSearch').val();
	var data = {type:'search',q:val,module:'videos',page:1,rel:2,key:accessToken};
	$.ajax({
		url:apiUrl,
		method:'GET',
		dataType:'json',
		data:data,
		success:function(res) {
			app.preloader.hide();
			var content = '';
			if(res.msg == "success") {
				var data = res.data.data;
				if(data != null) {
					if(data.length > 0) {
						for(var i = 0;i < data.length;i++) {
							var title = data[i].title_ta;
							var url = data[i].img;
							var date =  data[i].created.split('T');
							var id = data[i].content;
							content += '<div class="col-100 medium-50 large-33"><div class="card album-card"><div style="background-image:url('+url+')" data-id="https://www.youtube.com/embed/'+id+'" data-cap="'+title+'" class="card-header playYouTubeVideo video-popup align-items-flex-end cover-img"><div class="play-icon"><i class="fa fa-play"></i></div><span class="category">'+data[i].cate_ta+'</span></div><div class="card-content card-content-padding"><h3 class="mn playYouTubeVideo" data-id="https://www.youtube.com/embed/'+id+'" data-cap="'+title+'">'+title+'</h3><p><span>'+convertMonth(date[0])+'</span> <a href="#" data-msg="'+title+'" data-url="https://www.youtube.com/embed/'+id+'" class="pull-right shareLink"><i class="fa fa-share-alt"></i> Share</a></p></div></div></div>';
						}
					} else {
						content += '<div class="no-record">No record found</div>';
					}
				} else {
					content += '<div class="no-record">No record found</div>';
				}
			} /*else {
				content += '<div class="no-record">No record found</div>';
			}*/
			$('.videoSearchResult').html(content);
		},error:function(err) {
			app.preloader.hide();
			toaster('You are in Offline');
		}
	});
});

function getRandomInt() {
    // min = Math.ceil(min);
    min = 1000000;
    // max = Math.floor(max);
    max = 999999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomNumber(limit) {
    limit = (typeof(limit) == 'undefined')?6:limit;
    var minNumber = 1000000;
    var maxNumber = 999999999; // le maximum
    var randNo = Math.floor(Math.random() * (maxNumber + 1) + minNumber * 10238946);
    return randNo.toString().substr(1, limit);
}

$(document).on('click','.shareForAll',function() {
	var url = (typeof($(this).attr('data-url')) != 'undefined') ? $(this).attr('data-url') : '';
	var msg = (typeof($(this).attr('data-msg')) != 'undefined') ? $(this).attr('data-msg') : '';
	if(typeof(url) != 'undefined') {
		shareSocial(url,msg);
	}
});

$(document).on('keyup','.mobileNumber',function(e) {
	var newString= $(this).val().replace(/[^0-9-]/g, '');
	$(this).val(newString);
});

$(document).on('click','.updateVersion',function() {
	if(cordova.platformId == 'android') {
		cordova.plugins.market.open('com.news.hindutamil');
	} else if(cordova.platformId == 'ios') {
		cordova.plugins.market.open('https://apps.apple.com/app/hindutamil/id1496636417');
	}
});

$(document).on('click','.albumDetail',function() {
	var aid = $(this).attr('data-aid');
	var cid = $(this).attr('data-cid');
	getAlbumDetailPage({aid:aid,cid:cid});
});

$(document).on('click','.navToNewsDetailPage',function() {
	var aid = $(this).attr('data-aid');
	$('#div-gpt-ad-1605624284210-1,#div-gpt-ad-1605624597553-0,#div-gpt-ad-1605624566043-100,#div-gpt-ad-1605624566043-2').remove();
	//window.googletag.destroySlots();
	setTimeout(function(){
		mainView.router.load({url:'pages/news-detail.html?back=false&aid='+aid});
	},500);
});

$(document).on('submit','form#pagesearchbar',function(e) {
	e.preventDefault();
	e.stopPropagation();
	return false;
});

$(document).on('submit','form#videoSearch',function(e) {
	e.preventDefault();
	e.stopPropagation();
	return false;
});

$(document).on('submit','form#albumSearch',function(e) {
	e.preventDefault();
	e.stopPropagation();
	return false;
});

$(document).on('click','.navToCommentAddPage',function() {
	var aid = $(this).attr('data-aid');
	var login = JSON.parse(localStorage.getItem('userDetails'));
		
	var articleType = $(this).attr('data-article-type');
	
	
	if(articleType=='free' && typeof(aid) != 'undefined'){
		mainView.router.load({url:'pages/comments.html?aid='+aid});
	}else if(articleType=='login_required' && login.user_id!='' ){
		mainView.router.load({url:'pages/comments.html?aid='+aid});
	}else if(articleType=='login_required' && login.user_id=='' ){
		toaster('To comment the Premium Article. Please login.');
	}else if(articleType=='paid' && (login==null)){
		toaster('To comment the Premium Article. Please login.');
	}else if(articleType=='paid' && (login!=null && login.user_id!='' && login.user_access.web_access==1)){
		mainView.router.load({url:'pages/comments.html?aid='+aid});
	}else if(articleType=='paid'  && (login!= null && login.user_id!='' && login.user_access.web_access!=1)){
		toaster('Please subscribe to comment the premium article.');
	}else if(articleType=='paid' && (login!= null || typeof(login) === 'undefined')){
		toaster('To comment the Premium Article. Please login.');			
	}
	
	//if(typeof(aid) != 'undefined')
	//	mainView.router.load({url:'pages/comments.html?aid='+aid});
});

$(document).on('click','.navIfOffline',function() {
	alert(0);
	mainView.router.load({url:'pages/saved.html'});
});

$(document).on('click','.app_version_update',function() {
	if(typeof(cordova)!='undefined') {
		if(cordova.platformId == 'android') {
			cordova.plugins.market.open('com.news.hindutamil');
		} else if(cordova.platformId == 'ios') {
			cordova.plugins.market.open('https://apps.apple.com/app/hindutamil/id1496636417');
		}
	}
});

/*document.addEventListener("deviceready", function(){
	firebaseAnalytics();
	setInterval(firebaseAnalytics,100000);
}, false);*/

$(document).on('change','.get-all-notification',function() {
	var notificationTopics = ['tamilnadu','india','sports','cinema','world','business','science-technology','crime','supplements','spirituals','videos','album','corona-virus','vetrikodi','opinion','kamadenu','discussion','blogs','breaking-news','promo'];
	localStorage.setItem('notificationToggle',$(this).is(':checked'));

	if($(this).is(':checked')) {
		$('input[name="demo-checkbox[]"]').each(function(index,value){
			$(value).prop('checked',true);
			$(value).prop('disabled',false);
		});
		subscribeTopics(0,notificationTopics,function() {
			localStorage.setItem('notificationSettings',JSON.stringify(notificationTopics));
			toaster('Notification switched ON successfully');
		});
	} else {
		$('input[name="demo-checkbox[]"]:checked').each(function(index,value){
			$(value).prop('checked',false);
			$(value).prop('disabled',true);
		});
		unsubscribeTopics(0,notificationTopics,function(){
			//localStorage.removeItem('notificationSettings');
			toaster('Notification switched OFF successfully');
		});
	}
});

$(document).on('click','.getKamaDenuInterior',function(){
	var aid = $(this).attr('data-aid');
	mainView.router.load({url:'pages/kamadenu-interior.html?aid='+aid});
});

$(document).on('click','.openLoginPopUp',function() {
	$('#usercallback').val(true);
	app.popup.open('.login-screen');return false;
});

$(document).on('click','.showFlipView',function() {
	mainView.router.load({url:'pages/wow-book.html'});
});

/*$(document).on('click','.speakAudio',function() {	
	var data = JSON.parse(localStorage.getItem('articleDetails'));
	TTS.speak({
		text: data.a_title,
		locale: 'en-GB'
	});
});*/

$(document).on('click','.downloadFile',function() {
	mainView.router.load({url:'pages/book-viewer.html?url="file:///android_asset/www/assets/js/mzg5.pdf"&password='});
});

$(document).on('click','.e-papers-tab',function() {
	$('.page-content').scrollTop(0);
	var type = $(this).data('type');
	if(typeof(type) != 'undefined' && type != '') {
		if(type == 'e-paper') {
			var date = new Date();
			var day = date.getDate();
			var month = date.getMonth()+1;
			var year = date.getFullYear();
			date = day+'-'+month+'-'+year;
			getEpaperList(date);
			getPurchasedBookCount();
		} else if(type == 'e-magazine') {
			getPurchasedBookCount();
			getEmagazineList({show:1});
		} else if(type == 'e-book') {
			getEbooksList();
		}
	}
});

$(document).on('click','.ePaperTryNow',function() {
	var issueId = $(this).attr('data-issue-id');
	var mId = $(this).attr('data-mid');
	loadSubscriptionToInAppBrowser({mid:mId,issue_id:issueId});
});

$(document).on('click','.viewArchives',function() {
	$('.viewArchives').hide();
	var field = '#emagazine-tab';
	$('.page-content').scrollTop(0);
	
	var userDetails = JSON.parse(localStorage.getItem('userDetails'));
	if(userDetails != null) {
		field += '>div:nth-child(2)';
	}	
	$(field).prepend('<div class="block block-sm"><div class="row"><div class="col-70"><input type="text" autocomplete="off" id="e-magazine-year" class="form-control yearpicker" placeholder="Select year and month"/></div><div class="col-30"><button class="filterMagazines">Submit</button></div></div></div>');
	//applyMonthPicker();
	applyYearPicker();
});

$(document).on('click','.viewEmagaZine',function() {
	var thiz = $(this);
	var type          = thiz.closest('div').find('.emagazineButton').data('type');
	var userDetails   = JSON.parse(localStorage.getItem('userDetails'));
	var modId         = thiz.data('module-id');
	var issueId       = thiz.data('issue-id');
	var url           = thiz.data('url');
	var password      = thiz.data('password');
	var fileName      = thiz.data('file-name');
	var img           = thiz.data('img');
	var title         = thiz.data('title');
	var heading       = thiz.data('heading');
	
	var button = false;
	if(type == 'read' || type == 'save') {
		button = true;
	}
	
	var attr = ' data-module-id="'+modId+'" data-issue-id="'+issueId+'" data-url="'+url+'" data-password="'+password+'" data-img="'+img+'" data-title="'+title+'" data-file-name="'+fileName+'" data-heading="'+heading+'" ';
	var object = {issue_id:issueId,url:url,file_name:fileName,mid:modId,type:'pdf',image:img,password:password,file_extention:'.pdf',title:title,show_button:button};
	
	localStorage.setItem('pdfViewer',JSON.stringify(object));
	
	if(userDetails != null) {
		if(userDetails.user_access.emagazine == 1) {
			if(type == 'read') {
				trackUserStatus({mid:modId,issue_id:issueId,user_id:userDetails.user_id,do:'books',act:1,password:password,url:url},function(res) {
					if(res.msg == "success") {
						thiz.closest('div').find('.emagazineButton').replaceWith('<button class="button button-fill button-small button-block color-green emagazineButton viewMagzineDetail" '+attr+' data-type="save" data-file-name="'+fileName+'">Save Offline</button>');
						mainView.router.load({url:'pages/book-viewer.html?url='+url+'&password='+password+'&heading='+heading});
					} else {
						toaster('Unable to view file');
					}
				});
			} else {
				mainView.router.load({url:'pages/book-viewer.html?url='+url+'&password='+password+'&heading='+heading});
			}
		} else {
			$('#emagazine-tab').html('<div class="no-subscription"><img src="assets/images/svg/magazine.svg" width="100px" alt=""><p class="mt-0">You are not subscribed to eMagazine</p><a href="javascript:;" data-type="login" class="button button-large button-fill color-green ePaperTryNow" data-mid="4"><i class="fa fa-bell"></i> Try Now</a></div>');
		}
	} else {
		checkSession();
	}
});

$(document).on('click','.viewMagzineDetail',function() {
	// app.preloader.show();
	var thiz = $(this);
	var userDetails   = JSON.parse(localStorage.getItem('userDetails'));
	var modId         = thiz.data('module-id');
	var issueId       = thiz.data('issue-id');
	var type          = thiz.data('type');
	var url           = thiz.data('url');
	var password      = thiz.data('password');
	var fileName      = thiz.data('file-name');
	var img           = thiz.data('img');
	var title         = thiz.data('title');
	var heading       = thiz.data('heading');
	
	var button = false;
	if(type == 'read') {
		button = true;
	}
	
	var attr = ' data-module-id="'+modId+'" data-issue-id="'+issueId+'" data-url="'+url+'" data-password="'+password+'" data-img="'+img+'" data-title="'+title+'" data-file-name="'+fileName+'" data-heading="'+heading+'" ';
	var object = {issue_id:issueId,url:url,file_name:fileName,mid:modId,type:'pdf',image:img,password:password,file_extention:'.pdf',title:title,show_button:button,file_format:'pdf'};
	localStorage.setItem('pdfViewer',JSON.stringify(object));
	if(userDetails != null) {
		if(userDetails.user_access.emagazine == 1) {
			if(type == 'read') {
				trackUserStatus({mid:modId,issue_id:issueId,user_id:userDetails.user_id,do:'books',act:1,password:password,url:url},function(res) {
					if(res.msg == "success") {
						thiz.closest('div').find('.emagazineButton').replaceWith('<button class="button button-fill button-small button-block color-green emagazineButton viewMagzineDetail" '+attr+' data-type="save" data-file-name="'+fileName+'">Save Offline</button>');
						mainView.router.load({url:'pages/book-viewer.html?url='+url+'&password='+password+'&heading='+heading});
					} else {
						toaster('Unable to view file');
					}
				});
			} else if(type == 'save') {
				fileDownload({issue_id:issueId,url:url,file_name:fileName,mid:modId,type:'pdf',image:img,password:password,file_extention:'.pdf',title:title},function(res) {
					if(res.status) {
						thiz.closest('div').find('.emagazineButton').replaceWith('<button class="button button-fill button-small button-block color-red emagazineButton viewMagzineDetail" data-type="stored" '+attr+'>Saved</button>');
						toaster('File downloaded successfully');
					} else {
						toaster('File already exists`');
					}
					mainView.router.load({url:'pages/book-viewer.html?url='+url+'&password='+password+'&heading='+heading});
				});
			} else if(type == 'stored') {
				mainView.router.load({url:'pages/book-viewer.html?url='+url+'&password='+password+'&heading='+heading});
			}
		} else {
			$('#emagazine-tab').html('<div class="no-subscription"><img src="assets/images/svg/magazine.svg" width="100px" alt=""><p class="mt-0">You are not subscribed to eMagazine</p><a href="javascript:;" data-type="login" class="button button-large button-fill color-green ePaperTryNow" data-mid="4"><i class="fa fa-bell"></i> Try Now</a></div>');
		}
	} else {
		checkSession();
	}
});

$(document).on('click','.filterMagazines',function() {
	console.log($('#e-magazine-year').val());
	if(!checkEmpty('#e-magazine-year')) {
		toaster('Select year and month');
	} /*else if(!checkEmpty('#e-magazine-month')) {
		toaster('Pick a month and proceed');
	} */else {
		var monthArr = ['January','February','March','April','May','June','July','August','September','October','November','December'];
		var val = $('#e-magazine-year').val().split('-');
		var month = val[1];		
		var year = val[0];
		var months = monthArr.indexOf(month) + 1;
		
		getEmagazineList({month:months,year:year,show:0});
	}
});

$(document).on('click','.viewEpaperDetail',function() {
	var thiz		= $(this);
	var userDetails = JSON.parse(localStorage.getItem('userDetails'));
	if(userDetails != null) {
		if(userDetails.user_access.epaper == 1) {
			var type 	  = thiz.closest('div').find('.e-paper-track-button').data('type');
			var editionId = thiz.data('edition-id');
			var mId 	  = thiz.data('mid');
			var pdf 	  = thiz.data('pdf');
			var img 	  = thiz.data('img');
			var title 	  = thiz.data('title');
			var heading   = thiz.data('heading');
			var date      = thiz.data('date');
			var fileName  = pdf.split('/')[9];
			
			var button = false;
			if(type == 'read' || type == 'save') {
				button = true;
			}
			
			var object = {issue_id:editionId,url:pdf,file_name:fileName,mid:modId,type:'paper',image:img,password:'',file_extention:'.pdf',title:title,show_button:button,date:date};
			console.log('object');
			console.log(heading);
			localStorage.setItem('pdfViewer',JSON.stringify(object));
			if(type == 'read') {
				trackUserStatus({mid:mId,issue_id:editionId,user_id:userDetails.user_id,do:'books',act:1},function(res) {
					if(res.msg == "success") {
						mainView.router.load({url:'pages/book-viewer.html?url='+pdf+'&password=&heading='+heading});
					} else {
						toaster('Unable to view file');
					}
				});
			} else {
				mainView.router.load({url:'pages/book-viewer.html?url='+pdf+'&password=&heading='+heading});
			}
		} else {
			$('.subscribe-overlay').show();
		}
	} else {
		var login = checkSession();
	}
});

$(document).on('change','.e-paper-city-dropdown',function() {
	var city = JSON.parse(localStorage.getItem('ePaperCity'));
	var val = $(this).val();
	if(val != city) {
		app.dialog.confirm('DO you want to set this as default?','Confirmation!',function(){
			localStorage.setItem('ePaperCity',JSON.stringify(val));
		});	
	}
	/*var date = new Date();
	var day = date.getDate();
	var month = date.getMonth()+1;
	var year = date.getFullYear();
	date = day+'-'+month+'-'+year;*/
	var date = $('.e-paper-date-picker').val();
	getEpaperList(date,val);
});

$(document).on('change','.e-paper-date-picker',function() {
	var val = $('.e-paper-city-dropdown').val();
	getEpaperList($(this).val(),val);
});

$(document).on('click','.viewElibrary',function() {
	var url           = $(this).data('url');
	var password      = $(this).data('password');
	var fileName      = $(this).data('file-name');
	var type      	  = $(this).data('type');
	var issueType     = $(this).data('issue-type');
	var heading 	  = $(this).data('heading');
	
	localStorage.setItem('pdfViewer',JSON.stringify({show_button:false}));
	if(type == 'pdf' && issueType == 'paper') {
		//heading = 'E-paper';
		mainView.router.load({url:'pages/elibrary-book-viewer.html?url='+fileName+'&password='+password+'&heading='+heading});
	} else if(type == 'pdf') {
		//heading = 'E-magazine';
		mainView.router.load({url:'pages/elibrary-book-viewer.html?url='+fileName+'&password='+password+'&heading='+heading});
	} else if(type == 'epub') {
		//heading = 'E-book';
		mainView.router.load({url:'pages/elibrary-epub-viewer.html?url='+fileName+'&password='+password+'&heading='+heading});
	}
});

$(document).on('click','.viewEBookDetail',function() {
	var thiz 		= $(this);
	var type        = thiz.closest('div').find('.ebookbutton').data('type');
	var issueId     = thiz.data('issue-id');
	var url         = thiz.data('url');
	var fileName 	= thiz.data('file-name');
	var img 		= thiz.data('img');
	var title 		= thiz.data('title');
	var heading 	= thiz.data('heading');
	
	var userDetails = JSON.parse(localStorage.getItem('userDetails'));
	var attr = ' data-url="'+url+'" data-issue-id="'+issueId+'" data-title="'+fileName+'" data-heading="'+heading+'" ';
	
	var button = false;
	if(type == 'read' || type == 'save') {
		button = true;
	}
	var object = {issue_id:issueId,url:url,file_name:fileName,mid:10,type:'epub',image:img,password:'',file_extention:'.epub',title:title,show_button:button};
	localStorage.setItem('pdfViewer',JSON.stringify(object));
	
	if(userDetails != null) {
		if(type == 'read') {
			trackUserStatus({mid:10,issue_id:issueId,user_id:userDetails.user_id,do:'books',act:1},function(res) {
				if(res.msg == "success") {
					thiz.closest('div').find('.ebookbutton').replaceWith('<button class="button button-fill button-small button-block color-green ebookbutton viewEpubFile" data-type="save" data-file-name="'+fileName+'.epub" data-img="'+img+'" '+attr+'>Save Offline</button>');
					mainView.router.load({url:'pages/wow-book.html?url='+url+'&heading='+heading});
				} else {
					toaster('Unable to view file');
				}
			});
		} else {
			mainView.router.load({url:'pages/wow-book.html?url='+url+'&heading='+heading});
		}
	} else {
		checkSession();
	}
});

$(document).on('click','.viewEpubFile',function() {
	var thiz 		= $(this);
	var type        = thiz.data('type');
	var issueId     = thiz.data('issue-id');
	var url         = thiz.data('url');
	var fileName 	= thiz.data('file-name');
	var img 		= thiz.data('img');
	var title 		= thiz.data('title');
	var heading 	= thiz.data('heading');
	var userDetails = JSON.parse(localStorage.getItem('userDetails'));
	
	var button = false;
	if(type == 'read') {
		button = true;
	}
	
	var attr = ' data-url="'+url+'" data-issue-id="'+issueId+'" data-title="'+fileName+'" data-heading="'+heading+'" ';
	var object = {issue_id:issueId,url:url,file_name:fileName,mid:10,type:'epub',image:img,password:'',file_extention:'.epub',title:title,show_button:button,file_format:'epub'};
	localStorage.setItem('pdfViewer',JSON.stringify(object));
	if(userDetails != null) {
		if(type == 'read') {
			trackUserStatus({mid:10,issue_id:issueId,user_id:userDetails.user_id,do:'books',act:1},function(res) {
				if(res.msg == "success") {
					thiz.closest('div').find('.ebookbutton').replaceWith('<button class="button button-fill button-small button-block color-green ebookbutton viewEpubFile" data-type="save" data-file-name="'+fileName+'.epub" data-img="'+img+'" '+attr+'>Save Offline</button>');
					mainView.router.load({url:'pages/wow-book.html?url='+url+'&heading='+heading});
				} else {
					toaster('Unable to view file');
				}
			});
		} else if(type == 'stored') {
			mainView.router.load({url:'pages/wow-book.html?url='+url+'&heading='+heading});
		} else if(type == 'save') {
			fileDownload({issue_id:issueId,url:url,file_name:fileName,mid:10,type:'epub',image:img,file_extention:'.epub',title:title},function(res) {
				if(res.status) {
					thiz.closest('div').find('.ebookbutton').replaceWith('<button class="button button-fill button-small button-block color-red ebookbutton viewEpubFile" data-type="stored" '+attr+'>Saved</button>');
					toaster('File downloaded successfully');
				} else {
					toaster('File already exists`');
				}
				mainView.router.load({url:'pages/wow-book.html?url='+url+'&heading='+heading});
			});
		}
	} else {
		checkSession();
	}
});

$(document).on('click','.eLibraryTabChange',function() {
	var type = $(this).data('type');
	
	getElibrary(type);
});

$(document).on('click','.deleteLibraryFile',function() {
	var type 	 = $(this).data('type');
	var fileName = $(this).data('file-name');
	var id		 = $(this).data('id');	
	
	app.dialog.confirm('Are you sure want to delete?','Confirmation!',function(){
		deleteFile({file_name:fileName,type:type,id:id});
	});
});

/*$(document).on('change','.yearpicker',function() {
	var datePickerYear = ($(this).val());
	var year = new Date().getFullYear();
	
	if(year == datePickerYear) {
		console.log('yearpicker');
		$('.monthpicker').datepicker({
			format: "MM",
			viewMode: "months", 
			autoclose:true,
			orientation: 'bottom auto',
			endDate: '+0d',
			minViewMode: "months"
		});
	}
});*/

$(document).on('click','.e-paper-track-button',function() {
	var userDetails   = JSON.parse(localStorage.getItem('userDetails'));
	//var attr = ' data-module-id="'+modId+'" data-issue-id="'+issueId+'" data-url="'+url+'" data-password="'+password+'" data-img="'+img+'" data-title="'+title+'" data-file-name="'+fileName+'"';
	if(userDetails != null) {
		if(userDetails.user_access.epaper == 1) {
			
			var thiz 	  = $(this);
			var type 	  = thiz.data('type');
			var editionId = thiz.data('edition-id');
			var mId 	  = thiz.data('mid');
			var pdf 	  = thiz.data('pdf');
			var img 	  = thiz.data('img');
			var title 	  = thiz.data('title');
			var heading   = thiz.data('heading');
			var date      = thiz.data('date');
			var fileName  = pdf.split('/')[9];
			var password = '';
			var button = false;
			if(type == 'read') {
				button = true;
			}
			
			var attr = ' data-edition-id="'+editionId+'" data-mid="'+mId+'" data-pdf="'+pdf+'" data-img="'+img+'" data-title="'+title+'" ';
			var object = {issue_id:editionId,url:pdf,file_name:fileName,mid:mId,type:'paper',image:img,password:password,file_extention:'.pdf',title:title,show_button:button,date:date};
			
			localStorage.setItem('pdfViewer',JSON.stringify(object));
			
			if(type == 'read') {
				trackUserStatus({mid:mId,issue_id:editionId,user_id:userDetails.user_id,do:'books',act:1},function(res) {
					
					if(res.msg == "success") {
						thiz.closest('div').find('.ePaperButton').replaceWith('<button class="button button-fill button-small button-block color-green e-paper-track-button" data-type="save" '+attr+'>Save Offline</button>');
						mainView.router.load({url:'pages/book-viewer.html?url='+pdf+'&password=&heading='+heading});
					} else {
						toaster('Unable to view file');
					}
				});
			} else if(type == 'save') {
				fileDownload({issue_id:editionId,url:pdf,file_name:fileName,mid:mId,type:'paper',image:img,password:'',file_extention:'.pdf',title:title},function(res) {
					
					if(res.status) {
						thiz.closest('div').find('.ePaperButton').replaceWith('<button class="button button-fill button-small button-block color-red e-paper-track-button" data-type="stored" '+attr+'>Saved</button>');
						toaster('File downloaded successfully');
					} else {
						toaster('File already exists`');
					}
					mainView.router.load({url:'pages/book-viewer.html?url='+pdf+'&password='+password+'&heading='+heading});
				});				
			} else if(type == 'stored') {
				mainView.router.load({url:'pages/book-viewer.html?url='+pdf+'&password='+password+'&heading='+heading});
			}			
		} else {
			$('.subscribe-overlay').show();
		}
	} else {
		checkSession();
	}
});

$(document).on('click','.showProductSearchBuyMore',function() {
	$('.showProductSearch').slideToggle('slow');
});

$(document).on('click','.eBookSearchResult',function() {
	if(!checkEmpty('.eBookTitle') && !checkEmpty('.eBookAuthor') && !checkEmpty('.eBookCategory')) {
		toaster('Please enter book title/author/category');
	} else {
		eBookSearch({title:$('.eBookTitle').val(),author:$('.eBookAuthor').val(),category:$('.eBookCategory').val()});
	}
});

$(document).on('click','.eBookSearchClear',function() {
	$('.eBookTitle,.eBookAuthor,.eBookCategory').val('');
	getBuyMoreBooks();
});

$(document).on('click','.saveFileOffline',function() {
	app.preloader.show();
	var obj = JSON.parse(localStorage.getItem('pdfViewer'));
	var thiz = $('.changeDownLoadButton_'+obj.issue_id).closest('div').find('.replaceDownLoadButton');
	var type = $('.changeDownLoadButton_'+obj.issue_id).closest('div').find('.replaceDownLoadButton').data('type');
	
	var attr = ' data-module-id="'+obj.mid+'" data-issue-id="'+obj.issue_id+'" data-url="'+obj.url+'" data-password="'+obj.password+'" data-img="'+obj.image+'" data-title="'+obj.title+'" data-file-name="'+obj.file_name+'" ';
	
	if(typeof type != 'undefined' && type == 'save') {
		
		if(obj.file_extention == '.pdf') {
			thiz.replaceWith('<button class="button button-fill button-small button-block color-red emagazineButton viewMagzineDetail replaceDownLoadButton" '+attr+' data-type="stored">Saved</button>');
		} else if(obj.file_extention == '.epub') {
			thiz.replaceWith('<button class="button button-fill button-small button-block color-red ebookbutton viewEpubFile replaceDownLoadButton" data-type="stored" '+attr+'>Saved</button>');
		}
	}
	fileDownload(obj,function(resp) {
		if(resp.status) {
			toaster('File downloaded successfully');
			$('.showDownLoadButton').hide();
		} else {
			toaster('File already exists');
		}
	});
});

$(document).on('click','.removeTabLocalStorage',function() {
	localStorage.removeItem('tabActive');
});

$(document).on('click','.clearSearchValues',function() {
	$('.searchResult,.searchAlbumResult,.videoSearchResult').html('<div class="no-record">No record found</div>');
});

$(document).on('popup:open', function() {
	$('#userForgotPassword,#activateForm,#userRegister,#userLogin').trigger("reset");
});

$(document).on('click','.login-screen-open',function() {
	$('#userLogin').trigger("reset");
});

$(document).on('click','.pdf-canvas',function() {
	var css = $('.pdf-toolbar').css('display');
	if(css == 'none') {
		$('.pdf-toolbar').slideDown();
	} else {
		$('.pdf-toolbar').slideUp();
	}
});

$(document).on('click','.moveFileToDir',function() {
	console.log('Move file to sirectory');
	var fileName = $(this).data('file-name');
	var password = $(this).data('password');
	moveFile({file_name:fileName,password:password});
});

$(document).on('click','.showStorageLocation',function() {
	app.popup.open('.file-storage-location');
});