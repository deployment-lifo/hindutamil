/*access key*/
var accessToken = "GsWbpZpD21Hsd";
/*api url*/
var apiUrl = "https://api.hindutamil.in/app/index.php";
var uatApiUrl = "https://wa-hindu-tamilthisai.azurewebsites.net/api/app/index.php";
var androidVersion = "2.1.8";
var iosVersion = "2.1.4";
var downLoadApp = " செயலியை பெற  \n https://www.hindutamil.in/DWND";
var APPMODE='background';
var notificationTopics='';

/*function to convert date time format*/
function convertMonth(date) {

	Date.prototype.getMonthNameShort = function(lang) {
	    lang = lang && (lang in Date.locale) ? lang : 'en';
	    return Date.locale[lang].month_names_short[this.getMonth()];
	};

	Date.locale = {
	    en: {
	       month_names: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	       month_names_short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	    }
	};
	var formatDate = date.replace(' ','T');
	
	var dt = date.split('-');
	let mon = new Date(formatDate);
	
  	let shortMonth = mon.toLocaleString('en-us', { month: 'short' });
  	let year = dt[0];
  	let day = typeof(dt[2])!='undefined'?dt[2].split(' '):[];
  	var time = '';
  	if(typeof(day[1]) != 'undefined') {
  		time = day[1].split(':');
	  	var hrs = time[0];
	  	var min = time[1];
	  	var mer = ' AM';
	  	if(time[0] > 12) {
	  		hrs = time[0] - 12;
	  	}
	  	if(time[0] >= 12) {
	  		mer = ' PM';
	  	}
	  	time = hrs+':'+min+' '+mer;
  	}
  	
  	var returnDate = day[0]+' '+mon.getMonthNameShort()+' '+year+' '+time;
  	// alert(returnDate);
  	return returnDate;
}
//setTimeout(function(){checkVersion();},3000);

function versionCompare(v1, v2, options) {
    var lexicographical = options && options.lexicographical,
        zeroExtend = options && options.zeroExtend,
        v1parts = v1.split('.'),
        v2parts = v2.split('.');

    function isValidPart(x) {
        return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
    }

    if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
        return NaN;
    }

    if (zeroExtend) {
        while (v1parts.length < v2parts.length) v1parts.push("0");
        while (v2parts.length < v1parts.length) v2parts.push("0");
    }

    if (!lexicographical) {
        v1parts = v1parts.map(Number);
        v2parts = v2parts.map(Number);
    }

    for (var i = 0; i < v1parts.length; ++i) {
        if (v2parts.length == i) {
            return true;
        }

        if (v1parts[i] == v2parts[i]) {
            continue;
        }
        else if (v1parts[i] > v2parts[i]) {
            return true;
        }
        /*else if (v1parts[i] < v2parts[i]) {
            return true;
        }*/
        else {
            return false;
        }
    }

    if (v1parts.length != v2parts.length) {
        return -1;
    }

    return false;
}

//checkVersion();

/*function to check version*/
function checkVersion() {
	var data = {key:accessToken,type:'settings'};
	/*ajax call*/
	$.ajax({
		url:apiUrl,
		method:'GET',
		dataType:'json',
		data:data,
		success:function(res) {
			if(res.msg == "success") {
				var data = res.data;
				
				if(typeof(cordova)!='undefined')
				{
					if(cordova.platformId == 'android') {
						if(versionCompare(data.version_android,androidVersion)) {
							app.popup.open('.check_app_version');
							/*app.dialog.alert('Update App','Update',function() {
								//alert(cordova.platformId);
								cordova.plugins.market.open('com.news.hindutamil');
							});	*/
						}
						
					} else {
						if(versionCompare(data.version_ios,iosVersion)) {
							app.popup.open('.check_app_version');
							/*app.dialog.alert('Update App','Update',function() {
								//alert(cordova.platformId);
								cordova.plugins.market.open('https://apps.apple.com/app/hindutamil/id1496636417');
							});*/
						}
					}
				}
			}
			// loader(2);
		},error:function(err) {
			toaster('You are in Offline');
		}
	});
}
/*function to share via social*/
function shareSocial(url,message,subject,files,pickTitle) {
	message=typeof(message)!='undefined'?message:'';
	subject=typeof(subject)!='undefined'?subject:'';
	files=typeof(files)!='undefined'?files:'';
	url=typeof(message)!='undefined'?url:'';
	pickTitle=typeof(message)!='undefined'?pickTitle:'Pick an app'; 
	var options = {
	  message: message, // not supported on some apps (Facebook, Instagram)
	  subject: subject, // fi. for email
	  files: files, // an array of filenames either locally or remotely
	  url: url,
	  chooserTitle: pickTitle // Android only, you can override the default share sheet title
	}
	console.log('cordova.platformId',cordova.platformId);
	if(cordova.platformId == 'android') {
		url = url+'\n\n\n'+downLoadApp
	} else {
		url = url;
	}
	console.log('cordova.platformId',url);
	//window.plugins.socialsharing.shareWithOptions(options, onSocialSharingSuccess, onSocialSharingError);
	window.plugins.socialsharing.share(message, null, null,url);
}

/*function used to login user with the help of parameters*/
function userLogin(userName,password,loginType,name,callback) {
	// loader(1);
	app.preloader.show();
	/*api request data*/
	var data = {key:accessToken,type:'login',email:userName,password:password,social:loginType};
	localStorage.setItem('userLogin',JSON.stringify({user_email:userName,password:password}));
	localStorage.setItem('userPassword',JSON.stringify(password));
	/*ajax call for login*/
	$.ajax({
		url:apiUrl,
		method:'GET',
		dataType:'json',
		data:data,
		success:function(res) {
			var callFunction = $('form#userLogin #usercallback').val();
			// alert(callFunction);
			if(callFunction=='true') {
				callback(res);
			}
				
			if(res.msg == "success") {
				var currentPage = app.views.main.router.url
				$('form#userLogin input[type="text"],form#userLogin input[type="password"]').val('');
				localStorage.setItem('userDetails',JSON.stringify(res.data));
				$('.showUserName').html('<h5 class="user-name ">WELCOME <br><span>'+res.data.user_name+'</span></h5>');
				app.popup.close('.login-screen');
				app.preloader.hide();				
				var curPageSplit = currentPage.split('?');
				console.log(curPageSplit);
				if(curPageSplit[0]=='pages/news-detail.html'){
					
					if(res.data.user_access.web_access==1){
						$('.newsDetailDescription').remove('unblur');
						$('.loginMagzineOverlay').remove();
						$('.premiumMagzineOverlay').remove();	
						$('.newsDetailDescription').removeClass('blur-content');
						$('.page-content').removeClass('noscroll');	
						var aid = getUrlParameter('aid');
						var back = getUrlParameter('back');
						getNewsDetails({mid:1,aid:aid,back:back});
					}else{
						$('.premiumLogin').remove();	
						$('.loginMagzineOverlay').append('<a class="button button-block button-fill navToCommentAddPage color-grey button-round premiumProduct">Read more. Please subscribe now</a>');
					}
				}
				// toaster('User Logged in..');
				// savePushToken();
			} else if(res.msg == 'EMAIL_ALREADY_EXISTS') {
				toaster('Email id already exists');	
				app.preloader.hide();
				loader(2);
			} else if(res.msg == 'INVALID_EMAIL_ID') {
				toaster('Email id is invalid');	
				app.preloader.hide();
				loader(2);
			} else if(res.msg == 'ERROR_ACTIVATION') {
				toaster('Error in Activate your email');	
				app.preloader.hide();
				loader(2);
			} else if(res.msg == 'ERROR_UPDATE') {
				toaster('Error in update');	
				app.preloader.hide();
				loader(2);
			} else if(res.msg == 'CHECK_INPUTS') {
				toaster('some parameter is missing.');	
				app.preloader.hide();
				loader(2);
			} else if(res.msg == 'ACTIVATION_NOT_DONE') {
				app.preloader.hide();
				toaster('Activation not yet completed');
				localStorage.setItem('userLogin',JSON.stringify({user_email:userName,password:password,otp:res.data.otp}));
				localStorage.setItem('userOTP',JSON.stringify(res.data.otp));
				app.popup.open('.activation');
			} else if(res.msg == 'ACCOUNT_INACTIVE') {
				toaster('Account is blocked.');	
				app.preloader.hide();
				loader(2);
			} else if(loginType == 1) {
				// alert('loginType',loginType);
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

/*function for email validation*/
function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

/*function to check value empty or not*/
function checkEmpty(value) {
	var val = $(value).val();
	if(typeof(val) == 'undefined' || val == '' || val == 0 || val == null) {
		return false;
	}
	return true;
}

/*function to show toast message*/
function toaster(msg) {
    var toastBottom = app.toast.create({
        text: msg, closeTimeout: 5000, on: {
            close: function () { 
            },
        }
    });
    toastBottom.open(); 
}

/*function to resend otp*/
function resendOtp() {
	app.preloader.show();
	/*get user details*/
	var userDetails = JSON.parse(localStorage.getItem('userRegDetails'));
	if(userDetails == null) {
		userDetails = JSON.parse(localStorage.getItem('userLogin'));
	}
	
	if(userDetails != null) {
		var data = {key:accessToken,type:'otp_resend',email:userDetails.user_email,otp:userDetails.otp};
		/*ajax call for resend otp*/
		$.ajax({
			url:apiUrl,
			method:'GET',
			dataType:'json',
			data:data,
			success:function(res) {
				if(res.msg == "success") {
					toaster('Resend activation code successfully');
				}
				app.preloader.hide();				
			},error:function(err) {
				toaster('You are in Offline');
			}
		});
	}
}

/*function to user registration*/
function userRegister(name,email,password,social) {
	app.preloader.show();
	// alert('userRegister');
	var data = {type:'register',name:name,email:email,password:password,social:social,key:accessToken};
	// alert(JSON.stringify(data));
	var user = (localStorage.setItem('userLogin',JSON.stringify({user_email:email,password:password})));
	/*ajax call for register*/
	$.ajax({
		url:apiUrl,
		method:'GET',
		dataType:'json',
		data:data,
		success:function(res) {
			// alert('res',JSON.stringify(res)); 
			if(res.msg == "success") {
				$('form#userRegister input[type="text"],form#userRegister input[type="password"]').val('');
				localStorage.setItem('userOTP',JSON.stringify(res.data.otp));
				localStorage.setItem('userRegDetails',JSON.stringify(res.data));
				toaster('Activation code send to your email id');	
				app.popup.close('.register');
				app.popup.open('.activation');
				app.preloader.hide();
			} else if(res.msg == 'EMAIL_ALREADY_EXISTS') {
				toaster('Email id already exists');	
				app.preloader.hide();
				loader(2);
			} else if(res.msg == 'INVALID_EMAIL_ID') {
				toaster('Email id is invalid');	
				app.preloader.hide();
				loader(2);
			} else if(res.msg == 'ERROR_ACTIVATION') {
				toaster('Error in Activate your email');	
				app.preloader.hide();
				loader(2);
			} else if(res.msg == 'ERROR_UPDATE') {
				toaster('Error in update');	
				app.preloader.hide();
				loader(2);
			} else if(res.msg == 'CHECK_INPUTS') {
				toaster('some parameter is missing.');	
				app.preloader.hide();
				loader(2);
			} else {
				toaster(res.msg);	
				app.preloader.hide();
				loader(2);
			}
		},error:function(err) {
			toaster('You are in Offline');
		}
	});
}

/*function for change password*/
function changePassword(currPassword,newPassword) {
	app.preloader.show();
	var userDetails = JSON.parse(localStorage.getItem('userDetails'));
	if(userDetails != 'undefined' || userDetails != null) {
		var data = {key:accessToken,type:'change_pass',user_id:userDetails.user_id,cur_pass:currPassword,new_pass:newPassword};
		/*ajax call for change password*/
		$.ajax({
			url:apiUrl,
			method:'GET',
			dataType:'json',
			data:data,
			success:function(res) {
				if(res.msg == "success") {
					mainView.router.load({url:'index.html'});
					toaster('Password changed successfully');
					app.preloader.hide();
					logOut();
				} else if(res.msg == 'current password invalid') {
					toaster('Invalid current password');
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
}

var swiperHome='';
/*function to get all category*/
function getAllCategory(mId) {
	
	if($('.page-previous').data('name')=='home'){
		$('.page-previous').remove();
	}
	loader(1);
	//$('.reiniTabHome').html('');
	//$('.reiniTabHome').html('<div class="tabs-swipeable-wrap" id="swipeableTab"><div id="tabs" class="tabs listTab "></div></div>');

	//$('#homeSwipeableWrap').removeClass('tabs-swipeable-wrap');
	//app.swiper.destroy($('.tabs-swipeable-wrap'));
	// showPreLoader($('.showHomePageDetails'),1);
	// app.pr
	var tabsHTML = [];
	/*request data*/
	var data = {key:accessToken,type:'menu'};
	// var data = {key:accessToken,type:'cate'};
	$.ajax({
		url:apiUrl,
		method:'GET',
		dataType:'json',
		data:data,
		success:function(res) {
			//app.swiper.create($('.tabs-swipeable-wrap'), {});
			homePageNo = 1;
			var content = '<a data-tab="#tab-1" id="getHomePage" data-id="1" class="tab-link tab-link-active" data-val="home">முகப்பு</a>';
			//content += '<a data-tab="#tab-39" data-id="39" data-tab-id="0" data-mid="1" data-cid="PaidStory" data-sid="0" id="getOtherPages" class="tab-link gold-premium">ப்ரீமியம்</a>';
			var premTab = 39;
			//content += '<a data-tab="#tab-'+(premTab)+'" data-id="'+(premTab)+'" data-tab-id="6" data-mid="1" data-cid="PaidStory" data-sid="0" id="getOtherPages" class="tab-link gold-premium">ப்ரீமியம்</a>';
			var cont = '<div id="tab-1" class="page-content tab tab-active swiper-slide showHomePageDetails infinite-scroll-content" data-val="home"></div>';
			tabsHTML.push('<div id="tab-1" class="page-content tab tab-active swiper-slide showHomePageDetails infinite-scroll-content" data-val="home"></div>');
			if(res.msg == "success") {
				var data = res.data;
				
				var tab = 1;
				/*for(var i = 0;i < res.data.length;i++) {
					tab++;
					content += '<a data-tab="#tab-'+(i+2)+'" data-id="'+(i+2)+'" data-tab-id="'+i+'" data-mid="'+mId+'" data-cid="'+data[i].cid+'" id="getOtherPages" class="tab-link">'+data[i].title_ta+'</a>';
					cont += '<div id="tab-'+(i+2)+'" class="page-content tab swiper-slide loadOtherPageDetail showOtherPageDetails_'+(i+2)+' infinite-scroll-content" data-mid="'+mId+'"  data-id="'+(i+2)+'" data-cid="'+data[i].cid+'" data-infinite-distance="100"></div>';
					tabsHTML.push('<div id="tab-'+(i+2)+'" class="page-content tab swiper-slide removeAllContent showOtherPageDetails_'+(i+2)+' infinite-scroll-content loadOtherPageDetail" data-mid="'+mId+'"  data-id="'+(i+2)+'" data-cid="'+data[i].cid+'" data-infinite-distance="100"></div>');
				}*/
				var tab = 1;
				var j;
				for(var i = 0;i < res.data.length;i++) {
					var menu = data[i].sub_menus;
					if(menu.length > 0) {
						for(var j = 0;j < menu.length;j++) {
							tab++;
							var pid = menu[j].pid;
							var sid = (pid == 0) ? 0 : menu[j].pid;
							var cid = menu[j].cid;
							//var premiumClass = (menu[j].cid==481?'gold-premium':'');
							content += '<a data-tab="#tab-'+(tab)+'" data-id="'+(tab)+'" data-tab-id="'+j+'" data-mid="'+mId+'" data-cid="'+cid+'" data-sid="'+sid+'" id="getOtherPages" class="tab-link">'+menu[j].menu_name_tamil+'</a>';
							cont += '<div id="tab-'+(tab)+'" class="page-content tab swiper-slide loadOtherPageDetail showOtherPageDetails_'+(tab)+' infinite-scroll-content" data-mid="'+mId+'"  data-id="'+(tab)+'" data-cid="'+cid+'" data-sid="'+sid+'" data-infinite-distance="100"></div>';
							tabsHTML.push('<div id="tab-'+(tab)+'" class="page-content tab swiper-slide removeAllContent showOtherPageDetails_'+(tab)+' infinite-scroll-content loadOtherPageDetail" data-mid="'+mId+'"  data-id="'+(tab)+'" data-cid="'+cid+'" data-sid="'+sid+'" data-infinite-distance="100"></div>');
						}
					} else {
						tab++;  //console.log(data[i].menu_name_tamil+'-'+data[i].mid);
						if(data[i].mid != 4 && data[i].mid != 5 && data[i].mid != 99 && data[i].mid != 2 && data[i].mid != 7) {
							var premiumClass = (data[i].cid=='PaidStory'?'gold-premium':'');
							if(data[i].cid=='PaidStory'){
								content += '<a data-tab="#tab-'+(tab)+'" data-id="'+(tab)+'" data-tab-id="9" data-mid="'+data[i].mid+'" data-cid="'+data[i].cid+'" id="getOtherPages" class="tab-link '+premiumClass+'" data-sid="0">'+data[i].menu_name_tamil+'</a>';
							}else{
								content += '<a data-tab="#tab-'+(tab)+'" data-id="'+(tab)+'" data-tab-id="'+i+'" data-mid="'+data[i].mid+'" data-cid="'+data[i].cid+'" id="getOtherPages" class="tab-link '+premiumClass+'">'+data[i].menu_name_tamil+'</a>';
							}
							cont += '<div id="tab-'+(tab)+'" class="page-content tab swiper-slide loadOtherPageDetail showOtherPageDetails_'+(tab)+' infinite-scroll-content" data-mid="'+data[i].mid+'"  data-id="'+(tab)+'" data-cid="'+data[i].cid+'" data-infinite-distance="100"></div>';
							tabsHTML.push('<div id="tab-'+(tab)+'" class="page-content tab swiper-slide removeAllContent showOtherPageDetails_'+(tab)+' infinite-scroll-content loadOtherPageDetail" data-mid="'+data[i].mid+'"  data-id="'+(tab)+'" data-cid="'+data[i].cid+'" data-infinite-distance="100"></div>');
						}
					}
						/*var contPremTab = 39;
						cont += '<div id="tab-'+(contPremTab)+'" class="page-content tab swiper-slide loadOtherPageDetail showOtherPageDetails_'+(contPremTab)+' infinite-scroll-content" data-mid="'+data[i].mid+'"  data-id="'+(contPremTab)+'" data-cid="'+data[i].cid+'" data-infinite-distance="100"></div>';*/
				}
				$('.categoryMenu').html(content);
				$('.listTab').html(cont);
				$('.categoryMenu').scrollLeft(0);
				
				//console.log(j);
				if(swiperHome!='')
				{
					app.tab.show($('#swipeableTab'), $('#swipeableTab #tab-1'), true);
        			var resizeEvent = window.document.createEvent('UIEvents'); 
					resizeEvent.initUIEvent('resize', true, false, window, 0); 
					window.dispatchEvent(resizeEvent);
				} else {
					if((typeof($('#swipeableTab.swiper-container')) != 'undefined') && ($('#swipeableTab.swiper-container').length > 0)) {
						swiperHome = document.querySelector('#swipeableTab.swiper-container').swiper;
						swiperHome.appendSlide(tabsHTML);
						swiperHome.update();
					}
				}
				
				
				var preTab = localStorage.getItem('tabActive');
				if(preTab == "PaidStory") {
					var tabToShow=$('.categoryMenu a.tab-link[data-cid="'+preTab+'"]').data('tab');
					app.tab.show('#tab-1', true);
					getHomePageDetails(1);
				}else if(preTab != null && preTab != 0) {
					var id = $('.categoryMenu a.tab-link-active').attr('data-id');
					setTimeout(function() {
						//$('.categoryMenu a.tab-link[data-cid="'+preTab+'"]').click();
						var tabToShow=$('.categoryMenu a.tab-link[data-cid="'+preTab+'"]').data('tab');
						app.tab.show(tabToShow, true);
						getOtherPageDetails(id,1,preTab);
					},10);
				} else if(preTab == "0") {
					var tabToShow=$('.categoryMenu a.tab-link[data-cid="'+preTab+'"]').data('tab');
					app.tab.show('#tab-1', true);
					getHomePageDetails(1);
				} else {
					getHomePageDetails(1);
				}
				
				

				loader(2);
			} else {
				toaster(res.msg);	
				loader(2);
			}
		},error:function(err) {
			toaster('You are in Offline');
		}
	});
}

/*function to get home page details*/
function getHomePageDetails(page) {
	APPMODE='FOREGROUND';
	if(typeof(cordova) != 'undefined') {
		setfirebaseAnalytics({page:$('.categoryMenu a.tab-link-active').text(),property:{content_type: "Home Page", item_id: $('.categoryMenu a.tab-link-active').text()}});
	}
	
	scrollPageNo = 1;
	allowInfinite = true;

	localStorage.removeItem('previousPage');
	if($($('#getHomePage').data('tab')).html()=='')
	{
		if(page == 1)
			showPreLoader($('.showHomePageDetails'),1);

		triggerHomeDetails(page);
	}
}

function appendHomePage(data,val) {
	if(data != null) {
		// $('#div-gpt-ad-1605624284210-0').remove();
		var googletag = googletag || {};
		googletag.cmd = googletag.cmd || [];
		/* window.mapping1 = window.googletag.sizeMapping().
						  addSize([748, 0], [[728,90]]).
						  addSize([0, 0], [[320, 50]]).
						  addSize([0, 0], [[970, 90]]).
						  addSize([0, 0], [[600, 80]]).
						  build(); */
		
		var content = '';
		var deviceDetail = JSON.parse(localStorage.getItem('deviceDetails'));
		var deviceModel = (deviceDetail!=null)?deviceDetail.model:'';
		var strVal = 100;
		if($(window).width()>709)
			deviceModel = 'iPad';
		console.log(val);
		var adPla = (val==1?1:5);
		for (var i = 0; i < data.length; i++) {
			var ads = '';
			if(data[i].type == 'type10') {
				var post = data[i].post;
				if(post.length > 0) {
					if(post[0].type == 'in') {	/*if(typeof($(post[0].tag).closest('div').attr('id')) != 'undefined') {
							console.log('ads',$(post[0].tag).closest('div').attr('id'));
							$('#'+$(post[0].tag).closest('div').attr('id')).remove();
						}*/
						//ads = post[0].tag;
						//ads = "<div id=\"div-gpt-ad-1605624284210-0\" class=\"advet_bg\" style=\"width:100%;text-align: center;\"> \r\n<script>\r\n  window.googletag = window.googletag || {cmd: []};\r\n  googletag.cmd.push(function() {\r\n googletag.destroySlots(['/21697178033/Apps_HT_Digital_Subs_728x320']);   googletag.defineSlot('/21697178033/Apps_HT_Digital_Subs_728x320', [[320, 50], [728, 90]], 'div-gpt-ad-1605624284210-0').defineSizeMapping(mapping1).addService(googletag.pubads());\r\n    googletag.pubads().enableSingleRequest();\r\n    googletag.enableServices();\r\n    googletag.pubads().refresh();\r\n  });\r\n</script>\r\n</div>"
                        //ads = '<div class="ad_placement_1"></div>';
					}
				}
			}
			content += ads;
			var displayNone = (data[i].dontshow==1?'display:none':'');

			if(data[i].type == 'type1') {
				var post = data[i].post;
				content += '<div class="block-title" style="'+displayNone+'"><h2>'+data[i].title_ta+'</h2></div>';
				var cont = '';
				if(adPla<4 && displayNone=='') {
					content += '<div class="ad-content ad_placement_'+(adPla)+'"></div>';
					adPla++;
                    //content +='<div class="ad-content ad_placement_1"></div>';
                }
				if(post.length > 0) {
					cont += '<div class="row">';
					var text = '<div class="col-100 medium-100"><div class="list media-list news-list tablet-view"><ul>';
					var totLen = post.length;
					for(var j = 0;j < totLen;j++) {
						var classs = (j<2)?((totLen == 1)?' medium-100':' medium-50'):'';
						var premiumClass = (post[j].aid=='804647' || post[j].aid=='804618' || post[j].content_type=='paid' || post[j].content_type=='login_required'?'<span class="badge premium gold-premium premium-label">ப்ரீமியம்</span>':'');
						if(j == 0) {
							cont += '<div class="col-100'+classs+'"><div class="card news news_lg"><a data-mid="0" data-aid="'+post[j].aid+'" href="javascript:;" class="card-header cover-img align-items-flex-end navToNewsDetailPage">'+premiumClass+'<img src="'+post[j].img.replace("thumb", "large")+'" onerror="this.src=\'assets/images/no-img.jpg\'"/></a><div class="card-content card-content-padding"><a data-mid="0" data-aid="'+post[j].aid+'" href="javascript:;" class="news-title navToNewsDetailPage">'+post[j].title_ta.substr(0,70)+'...</a><p class="news-desc">'+post[j].desc.substr(0,strVal)+'...</p></div></div></div>';
						} else if(deviceModel.includes('iPad') && j == 1) {
							cont += '<div class="col-100'+classs+'"><div class="card news news_lg"><a data-mid="0" data-aid="'+post[j].aid+'" href="javascript:;" class="card-header cover-img align-items-flex-end navToNewsDetailPage">'+premiumClass+'<img src="'+post[j].img.replace("thumb", "large")+'" onerror="this.src=\'assets/images/no-img.jpg\'"/></a><div class="card-content card-content-padding"><a data-mid="0" data-aid="'+post[j].aid+'" href="javascript:;" class="news-title navToNewsDetailPage">'+post[j].title_ta.substr(0,70)+'...</a><p class="news-desc">'+post[j].desc.substr(0,strVal)+'...</p></div></div></div>';
						} else {
							text += '<li><a data-mid="0" data-aid="'+post[j].aid+'" href="javascript:;" class="item-link item-content navToNewsDetailPage"><div class="item-media ">'+premiumClass+'<img src="'+post[j].img.replace("thumb", "large")+'" width="80" onerror="this.src=\'assets/images/no-img.jpg\'"/></div><div class="item-inner"><div class="item-text">'+post[j].title_ta+'</div></div></a></li>';
						}
						premiumClass = '';
                        if(j>0 && j%5==0 && adPla < 4) {
							/* cont += '<div class="ad-content ad_placement_'+adPla+'"></div>';
							adPla++; */
						}
					}
					text += '</ul></div></div>';
					cont += text+'</div>';
				}
				content += cont;
			}
			if(data[i].type == 'type2') {
				var post = data[i].post;
		        if(post.length > 0) {

		        }
			}
			if(data[i].type == 'type3') {
				content += '<div class="block-title" style="'+displayNone+'"><h2>'+data[i].title_ta+'</h2></div>';
				var post = data[i].post;
				var cont = '';
				if(post.length > 0) {
					cont += '<div class="row">';
					var text = '<div class="col-100 medium-100"><div class="list media-list news-list tablet-view"><ul>';
					for(var j = 0;j < post.length;j++) {
						var classs = (j<2)?((totLen == 1)?' medium-100':' medium-50'):'';
						var premiumClass = (post[j].aid=='804637' || post[j].content_type=='paid' || post[j].content_type=='login_required'?'<span class="badge premium gold-premium premium-label">ப்ரீமியம்</span>':'');
						if(j == 0) {
							cont += '<div class="col-100 '+classs+'"><div class="card news news_lg"><a data-aid="'+post[j].aid+'" href="javascript:;" class="card-header cover-img align-items-flex-end navToNewsDetailPage">'+premiumClass+'<img src="'+post[j].img.replace("thumb", "large")+'" onerror="this.src=\'assets/images/no-img.jpg\'"/></a><div class="card-content card-content-padding"><a data-aid="'+post[j].aid+'" href="javascript:;" class="news-title navToNewsDetailPage">'+post[j].title_ta.substr(0,70)+'...</a><p class="news-desc">'+post[j].desc.substr(0,strVal)+'...</p></div></div></div>';
						} else if(deviceModel.includes('iPad') && j == 1) {
							cont += '<div class="col-100'+classs+'"><div class="card news news_lg"><a data-aid="'+post[j].aid+'" href="javascript:;" class="card-header cover-img align-items-flex-end navToNewsDetailPage">'+premiumClass+'<img src="'+post[j].img.replace("thumb", "large")+'" onerror="this.src=\'assets/images/no-img.jpg\'"/></a><div class="card-content card-content-padding"><a data-aid="'+post[j].aid+'" href="javascript:;" class="news-title navToNewsDetailPage">'+post[j].title_ta.substr(0,70)+'...</a><p class="news-desc">'+post[j].desc.substr(0,strVal)+'...</p></div></div></div>';
						} else {
							text += '<li><a data-mid="0" data-aid="'+post[j].aid+'" href="javascript:;" class="item-link item-content navToNewsDetailPage"><div class="item-media ">'+premiumClass+'<img src="'+post[j].img.replace("thumb", "large")+'" width="80" onerror="this.src=\'assets/images/no-img.jpg\'"/></div><div class="item-inner"><div class="item-text">'+post[j].title_ta+'</div></div></a></li>';
						}
						premiumClass = '';
					}
					text += '</ul></div></div>';
					cont += text+'</div>';
				}
				content += cont;
			}
			if(data[i].type == 'type4') {
				var post = data[i].post;
				content += '<div class="block-title" style="'+displayNone+'"><h2>'+data[i].title_ta+'</h2></div>';
				
				var cont = '';
				if(post.length > 0) {
					cont += '<div class="row">';
					var text = '<div class="col-100 medium-100"><div class="list media-list news-list tablet-view"><ul>';
					var totLen = post.length;
				   
					for(var j = 0;j < totLen;j++) {
						var classs = (j<2)?((totLen == 1)?' medium-100':' medium-50'):'';
						var premiumClass = (post[j].aid=='804647' || post[j].aid=='804618' || post[j].content_type=='paid' || post[j].content_type=='login_required'?'<span class="badge premium gold-premium premium-label">ப்ரீமியம்</span>':'');
					
							text += '<li><a data-mid="0" data-aid="'+post[j].aid+'" href="javascript:;" class="item-link item-content navToNewsDetailPage"><div class="item-media ">'+premiumClass+'<img src="'+post[j].img.replace("thumb", "large")+'" width="80" onerror="this.src=\'assets/images/no-img.jpg\'"/></div><div class="item-inner"><div class="item-text">'+post[j].title_ta+'</div></div></a></li>';
						
						premiumClass = '';
					}
					text += '</ul></div></div>';
					cont += text+'</div>';
				}
				content += cont;
			}
		}
		// console.log(content);
		if(scrollPageNo == 1) {
			content += '<div class="ad-content ad_placement_4"></div>';
			/*if(typeof(window.googletag)!='undefined')
			{
				window.googletag.destroySlots();
				
			}*/
			//window.googletag.pubads().refresh();
			$('.showHomePageDetails').html(content);
		} else {
			$('.showHomePageDetails').append(content);
			//if(typeof(window.googletag) != 'undefined' && typeof(window.googletag.pubads) == 'function')
	    	//window.googletag.pubads().refresh();
		}
		
		lazyLoadFunctionality({page:'home',field:'.showHomePageDetails'});

	    if(data.length >= 6) {
	    	allowInfinite = true;
	    }
	}
    setAdPlacement('home');
}

function homePageAds() {
	refreshAds('home_page_ad_1');
	refreshAds('home_page_ad_2');
	refreshAds('home_page_ad_3');
	refreshAds('home_page_ad_4');
	refreshAds('home_page_ad_5');
}

function appendOtherPage(data,id,cId,sId) {
	allowInfinite = false;
	var content = '';
	if(data != null) {
		
		var path = 'assets/images/no-img.jpg;';
		var premium='';
		//content += "<div id='div-gpt-ad-1605624284210-2' class='text-center' ><script>googletag.cmd.push(function() {  googletag.display('div-gpt-ad-1605624284210-2'); });</script></div>";
		//console.log(data);
		if(data == null) {
			content += '<div class="no-record">No records found</div>';
		} else if(data.length > 0) {
			//content+="<div class='tab-add-placement1'><div id='div-gpt-ad-1605624284210-2' class='text-center' ></div></div>";
			var adPl = (scrollPageNo==1)?2:4;
			for(var i = 0;i < data.length;i++) {
				//console.log(data[i].content_type);
				/*premium = (data[i].content_type=='paid'?'<span class="premium gold-premium"><i class="fa fw fa-star"></i></span>':((data[i].content_type=='login_required' || data[i].aid=='795537')?'<span class="premium blue-star"><i class="fa fw fa-star"></i></span>':''));*/
				premium = ((data[i].content_type=='paid' || data[i].content_type=='login_required')?'<span class="badge premium gold-premium premium-label">ப்ரீமியம்</span>':'');
				pageTitle = (cId=='PaidStory'?'ப்ரீமியம் கட்டுரைகள்':data[0].cate_ta);
				if(i == 0 && scrollPageNo == 1) { 
					content += '<div class="block-title"><h2>'+pageTitle+'</h2></div>';
					content += '<div class="ad-content ad_placement_1"></div>';
					content += '<div class="card news news_lg"><a href="javascript:;" data-aid="'+data[i].aid+'" class="navToNewsDetailPage card-header cover-img align-items-flex-end">'+premium+'<img src="'+data[i].img.replace('thumb','large')+'" onerror="this.src=\'assets/images/no-img.jpg\'"/></a><div class="card-content card-content-padding"><a data-aid="'+data[i].aid+'" href="javascript:;" class="news-title navToNewsDetailPage"> '+data[i].title_ta+' </a><p class="news-desc">'+data[i].desc_ta+'</p></div></div>';
					
				} else {  
					content += '<div class="list media-list news-list"><ul><li><a href="javascript:;" data-aid="'+data[i].aid+'" class="item-link item-content navToNewsDetailPage"><div class="item-media">'+premium+'<img src="'+data[i].img.replace('thumb','large')+'" width="80" onerror="this.src=\'assets/images/no-img.jpg\'"/></div><div class="item-inner"><div class="item-text"> '+data[i].title_ta+' </div></div></a></li></ul></div>';
					if(i%5==0 && adPl<5) {
						content += '<div class="ad-content ad_placement_'+(adPl)+'"></div>';
						adPl++;
					}
				}	
				premium = '';
			}
			// content += '<div class="list media-list news-list"><ul><li><a href="javascript:;" data-aid="791080" class="item-link item-content navToNewsDetailPage"><div class="item-media"><img src="https://static.hindutamil.in/hindu/uploads/news/2022/04/22/large/791080.jpg" width="80" onerror="this.src=\'assets/images/no-img.jpg\'"/></div><div class="item-inner"><div class="item-text"><h4>Premium </h4>அரிதினும் அரிது: 505 நாட்களுக்கு தொற்று... சூப்பர் லாங் கரோனா பாதிப்பு என்றால் என்ன?</div></div></a></li></ul></div>';
			// content += '<div><button class="list-button item-link otherPageLoadMore" data-id="'+id+'" data-cid="'+cId+'">Load more</button></div>';
			//content += '<a href="#" data-id="'+id+'" data-cid="'+cId+'" class="otherPageLoadMore button button-block button-fill color-grey button-round">Load more</a>';
			//content+="<div class='tab-add-placement2'><div id='div-gpt-ad-1605624284210-3' class='text-center' ></div></div>";
			//content += '<div class="ad-content ad_placement_4"></div>';
			//content += "<div id='div-gpt-ad-1605624284210-3' class='text-center' ></div>";
			
			lazyLoadFunctionality({page:'other-page',id:id,cid:cId,sid:sId,field:'.showOtherPageDetails_'+id});
		    /*$('.showOtherPageDetails_'+id).on('scroll',function(){
				var scrollTop = this.scrollTop;
		        if($(this).scrollTop() + $(this).innerHeight() + 500 >= $(this)[0].scrollHeight) {
		        	if(allowInfinite) {
		        		scrollPageNo = scrollPageNo + 1;
		        		triggerOtherPageDetails(id,1,cId,sId);
		        	}
		        }
		    });*/
			setAdPlacement('home',id);
		    if(data.length >= 15) {
		    	allowInfinite = true;
		    }
		} else {
			content += '<div class="no-record">No records found</div>';
		}
		
		if(scrollPageNo == 1) {
			$('.showOtherPageDetails_'+id).html(content);
		} else {
			$('.showOtherPageDetails_'+id).append(content);
		}
		
		setTimeout(function(){
			/*if(ptrTabs!='')
				ptrTabs.destroy();
			ptrTabs=app.ptr.create('.ptr-content');*/

			if(typeof(lazyLoad) != 'undefined' && lazyLoad != '') {
				lazyLoad.destroy();
			}
			lazyLoad = app.infiniteScroll.create('.infinite-scroll-content');
			otherPageAds();
		},1500);
		app.preloader.hide();		
	} else {
		content = '<div class="no-record">No records found</div>';
		$('.showOtherPageDetails_'+id).html(content);
	}
}

function initiateTextSize() {
	var val = localStorage.getItem('text-size');
    if(val == null) {
		localStorage.setItem('text-size','font-medium');
		$('body').addClass('font-medium	');
		$('.fontChange1').attr('checked',true);	
	} else {
		if(val == 'font-small') {
			$('body').addClass('font-small');
			$('.fontChange1').attr('checked',true);	
		} else if(val == 'font-medium') {
			$('body').addClass('font-medium');
			$('.fontChange2').attr('checked',true);
		} else if(val == 'font-large') {
			$('body').addClass('font-large');
			$('.fontChange3').attr('checked',true);
		}
	}
}

function setFontSize() {
	var val = localStorage.getItem('text-size');
	if(val == 'font-small') {
		$('.fontChange1').attr('checked',true);	
	} else if(val == 'font-medium') {
		$('.fontChange2').attr('checked',true);
	} else if(val == 'font-large') {
		$('.fontChange3').attr('checked',true);
	}
}

function rateTheApp() {
	if(cordova.platformId == 'ios') {
		cordova.plugins.market.open('https://apps.apple.com/app/hindutamil/id1496636417');
	} else {
		cordova.plugins.market.open('com.news.hindutamil');
	}
}
document.addEventListener("pause", function(){
	APPMODE='background';
}, false);
document.addEventListener("resume", function(){
	if($('.page-current').data('name')=='notify-details')
		APPMODE='FOREGROUND';
}, false);
localStorage.lastNotificationID='';
function getFbToken() {
	getNotificationCount();
	var notificationTopics = ['tamilnadu','india','sports','cinema','world','business','science-technology','crime','supplements','spirituals','videos','album','corona-virus','vetrikodi','opinion','kamadenu','discussion','blogs','breaking-news','promo'];
	var notiSet = JSON.parse(localStorage.getItem('notificationSettings'));
	console.log('notiSet');
	console.log(notiSet);
	if(notiSet == null) {
		localStorage.setItem('notificationSettings',JSON.stringify(notificationTopics));
		subscribeTopics(0,notificationTopics,function(res) {
			//toaster('Notification settings updated successfully');
		});
		
	}
	//onNotificationOpen
	window.FirebasePlugin.grantPermission();
	window.FirebasePlugin.onNotificationOpen(function(notification) {
		var aid=typeof(notification.aid)!='undefined'?notification.aid:'';
		var cate_ta=typeof(notification.cate_ta)!='undefined'?notification.cate_ta:'';
		var desc_ta=typeof(notification.desc_ta)!='undefined'?notification.desc_ta:'';
		var articleImage=typeof(notification.img)!='undefined'?notification.img:'assets/images/svg/notification.svg';
		$('.notification-sheet-modal .openArticleDetail').attr('data-aid',aid);
		$('.notification-sheet-modal #articleCategory').html(cate_ta);
		$('.notification-sheet-modal #articleDesc').html(desc_ta);
		$('.notification-sheet-modal #articleImage').attr('src',articleImage);
		if(cordova.platformId == 'ios') {
			if(notification.tap)
				mainView.router.load({url:'pages/notify-details.html?aid='+aid});
		}
		else
		{
			if(!notification.tap)
				app.sheet.open('.notification-sheet-modal',true);
			else
				mainView.router.load({url:'pages/notify-details.html?aid='+aid});
			
		}
		if(localStorage.lastNotificationID!=notification.aid)
		{
			sendPushNoti(notification);
			localStorage.lastNotificationID=notification.aid;
		}		
	}, function(error) {
		
	});
}
//setTimeout(function(){app.sheet.open('.notification-sheet-modal',true);},1500);
$(document).on('click','.openArticleDetail',function(){
	var aid=$(this).attr('data-aid');
	app.sheet.close('.notification-sheet-modal',true);
	mainView.router.load({url:'pages/notify-details.html?aid='+aid});
});
function sendPushNoti(data) {
	insertNotification(data);
	showNotifications(function(res) {
		// alert(JSON.stringify(res));
		if(res.length > 0) {
			$('.notificationCount').html('<span class="badge color-red">'+res.length+'</span>');
		} 
	});
}

function acctivateAccount(data) {
	app.preloader.show();
	$.ajax({
		url:apiUrl,
		method:'GET',
		dataType:'json',
		data:data,
		success:function(res) {
			app.preloader.hide();
			if(res.msg == 'success') {
				toaster('OTP verified successfully');
				app.popup.close('.popup.register');
				app.popup.close('.popup.activation');
				localStorage.removeItem('userOTP');
				// var data = JSON.parse(localStorage.getItem('userRegDetails'));
				data = res.data;
				localStorage.setItem('userDetails',JSON.stringify(data));
				localStorage.removeItem('userRegDetails');
			} else {
				toaster(res.msg);
			}				
		},error:function(err) {
			app.preloader.hide();
			toaster('You are in Offline');
		}
	});
}

function triggerHomeDetails(page) {
	// $('.advet_bg').remove();
	console.log($('.advet_bg').length);
	allowInfinite = false;
	var userDetails = JSON.parse(localStorage.getItem('userDetails'));
	$('.showUserName').html('<h5 class="user-name ">WELCOME <br><span>Guest</span></h5><a href="#" data-login-screen=".my-login-screen" class="mt-16 button button-small button-block button-round button-outline color-white panel-close login-screen-open">LOGIN OR REGISTER</a>');
	if((userDetails != null)) {
		$('.showUserName').html('<h5 class="user-name ">WELCOME <br><span>'+userDetails.user_name+'</span></h5>');
	}

	var data = {key:accessToken,type:'home',page:scrollPageNo,v:1.2};
	// var data = {key:accessToken,type:'home'};
	/*ajax call for home page*/
	$.ajax({
		url:apiUrl,
		method:'GET',
		dataType:'json',
		data:data,
		success:function(res) {
			if(res.msg == "success") {
				if(res.data != null) {
				//	var data = res.data.body;
					var data = res.data.body;
					//console.log(data);
					appendHomePage(data,page);
					localStorage.setItem('homePageDetails',JSON.stringify(data));
					/*setTimeout(function(){
						if(typeof(homePageLazyLoad) != 'undefined' && homePageLazyLoad != '') {
							homePageLazyLoad.destroy();
						}
						homePageLazyLoad = app.infiniteScroll.create('.infinite-scroll-content');
					},1500);*/
				}
			} else {
				toaster(res.msg);
				loader(2);
			}
		},error:function(err) {
			console.log('Home page');
			console.log(err);
			toaster('You are in Offline');
		}
	});
}

/*function to get commnet list*/
function getCommentList(data) {
	if(typeof(cordova) != 'undefined') {
		setfirebaseAnalytics({page:'Comment page',property:{content_type: "Comment page", item_id:{aid:data.aid}}});
	}
	
	showPreLoader($('.commentsList'),1);
	var login = JSON.parse(localStorage.getItem('userDetails'));
	var input = '';
	if(login == null) {
		input += '<div class="form-group"><input type="text" class="form-control postName" name="" id="" maxlength="50" placeholder="Enter Your Name"/></div><div class="form-group"><input type="email" class="form-control postEmail" name="" id="" placeholder="Enter Email"/></div>';
	}
	input += '<h3>What is in your mind?</h3><div class="form-group"><textarea class="form-control commentVal" name="" id="" rows="10" placeholder="Max 300 Charaters" maxlength="300"></textarea></div><div class="form-group"><button class="button button-fill button-block postComment" href="#">Post Comment</button><br></div>';
	$('.postCommentInput').html(input);
	
	/*request data*/
	data.mid = 1;
	data.key = accessToken;
	data.type = 'comments_list';
	$('#aid').val(data.aid);
	var login = JSON.parse(localStorage.getItem('userDetails'));

	/*ajax call for comment list*/
	$.ajax({
		url:apiUrl,
		method:'GET',
		dataType:'json',
		data:data,
		success:function(res) {
			var emotes = JSON.parse(localStorage.getItem('emote'));
			/*var input = '';
			if(login == null) {
				input = '<div class="item-inner"><div class="item-input-wrap"><input type="text" class="postName" placeholder="Enter name"><span class="input-clear-button"></span></div></div><div class="item-inner"><div class="item-input-wrap"><input type="text" class="postEmail" placeholder="Enter email address"></div></div>';
			}
			$('.postCommentWithoutLogin').html(input);*/
			//var emoji = '<li class="emoteSubmit" value="1"><a href="#" class=""><img src="assets/images/emoji/excited.png" onerror="this.src=\'assets/images/no-img.jpg\'" alt=""> <span>Excited<br>'+emotes.e1+'%</span></a></li><li class="emoteSubmit" value="2"><a href="#" class=""><img src="assets/images/emoji/great.png" onerror="this.src=\'assets/images/no-img.jpg\'" alt=""> <span>Great<br>'+emotes.e2+'%</span></a></li><li class="emoteSubmit" value="3"><a href="#" class=""><img src="assets/images/emoji/unmoved.png" onerror="this.src=\'assets/images/no-img.jpg\'" alt=""> <span>Unmoved<br>'+emotes.e3+'%</span></a></li><li class="emoteSubmit" value="4"><a href="#" class=""><img src="assets/images/emoji/shocked.png" onerror="this.src=\'assets/images/no-img.jpg\'" alt=""> <span>Shocked<br>'+emotes.e4+'%</span></a></li><li class="emoteSubmit" value="5"><a href="#" class=""><img src="assets/images/emoji/sad.png" onerror="this.src=\'assets/images/no-img.jpg\'" alt=""> <span>Sad<br>'+emotes.e5+'%</span></a></li><li class="emoteSubmit" value="6"><a href="#" class=""><img src="assets/images/emoji/angry.png" alt="" onerror="this.src=\'assets/images/no-img.jpg\'"> <span>Angry<br>'+emotes.e6+'%</span></a></li>';
			// $('.emoji').html(emoji);
			// $('.commentsList').html('');
			if(res.msg == "success") {
				var content = '';
				var data = res.data;
				if(data != null) {
					var commentCount = data.length;
					for(var i = 0;i < data.length;i++) {
						content += '<li><div class="item-content"><div class="item-inner"><div class="item-title-row"><div class="item-title"><strong>'+data[i].user_name+'</strong></div><div class="item-after">'+convertMonth(data[i].approved_date)+'</div></div><div class="item-text">'+data[i].comment+'</div><div class="like-dislike"><a data-type="like" data-aid="'+data[i].aid+'" data-id="'+data[i].comment_id+'" data-aid="'+data[i].aid+'" href="javascript:void(0)" class="likeDisLikeComment"><i class="fa fa-thumbs-up"></i> '+data[i].up_votes+'</a><a href="javascript:void(0)" data-aid="'+data[i].aid+'" data-id="'+data[i].comment_id+'" data-type="dislike" class="likeDisLikeComment"><i class="fa fa-thumbs-down"></i> '+data[i].down_votes+'</a><a href="javascript:void(0)"  data-reply-for="'+data[i].comment_id+'" class="reply  sheet-open"><i class="fa fa-reply"></i> Reply</a></div></div></div></li>';
					}	
					$('.commentsList').html(content);
					var commentButon = "";
										
					commentButon += "<a href='javascript:;' data-aid='"+$('#aid').val()+"' class='button button-block button-fill navToCommentAddPage color-grey button-round'>VIEW COMMENTS</a><br>";
					//commentButon += "<div id='div-gpt-ad-1605624326531-1' class='text-center' ><script>refreshAds('article_page_ad_4');</script></div>";
					commentButon += "<div id='div-gpt-ad-1605624566043-100' class='text-center' ></div>";
					//$('.commentButton').html('<div id=\'div-gpt-ad-1605624566043-0\' class=\'text-center\' ><script>googletag.cmd.push(function() { googletag.display(\'div-gpt-ad-1605624566043-0\'); });</script></div><a href="/comments/'+$('#aid').val()+'" class="button button-block button-fill color-grey button-round">VIEW COMMENTS</a>');
					$('.page-current .commentButton').html(commentButon);
				} else {
					$('.commentsList').html('<div class="no-record">Be the first one to comment</div>');
					var commentButon = '';
					commentButon += "<a href='javascript:;' data-aid='"+$('#aid').val()+"' class='button button-block button-fill color-grey button-round navToCommentAddPage'>Post Comments</a><br>";
					commentButon += "<div id='div-gpt-ad-1605624566043-100' class='text-center' ></div>";
					$('.page-current .commentButton').html(commentButon);
				}
				setTimeout(function(){refreshAds('article_page_ad_3');},500);
			} else {
				toaster(res.msg);
			}
		},error:function(err) {
			toaster('You are in Offline');
		}
	});	
}

/*function to get other pages*/
function getOtherPageDetails(id,mId,cId,sId) {
	
	if(typeof(cordova) != 'undefined') {		
		setfirebaseAnalytics({page:$('.categoryMenu a.tab-link-active').text(),property:{content_type: "Category Page", item_id: $('.categoryMenu a.tab-link-active').text()}});
	}
	
	if($('.page-previous').data('name')=='home'){
		$('.page-previous').remove();
	}
	pageNo = 1;
	scrollPageNo = 1;
	allowInfinite = true; 
	//alert($($('#getOtherPages[data-cid="'+cId+'"]').data('tab')).html());
	if(typeof($($('#getOtherPages[data-cid="'+cId+'"]').data('tab')).html()) == undefined || $($('#getOtherPages[data-cid="'+cId+'"]').data('tab')).html()=='')
	{ 
		showPreLoader($('.showOtherPageDetails_'+id),1);
		triggerOtherPageDetails(id,mId,cId,sId);
	}else if(cId=='PaidStory'){
		showPreLoader($('.showOtherPageDetails_'+id),1);
		triggerOtherPageDetails(id,mId,cId,sId);
	}
}

function triggerOtherPageDetails(id,mId,cId,sId) {
	allowInfinite = false;
	var data = {type:'cate_article',key:accessToken,mid:mId,cid:cId,page:scrollPageNo,limit:15};

	if(typeof(sId) != 'undefined' && sId != 0) {
		data.cid = sId;
		data.sub_cid = cId;
	}
	if(cId == 0) {
		data.cid = sId;
	}
	/*ajax call*/
	$.ajax({
		url:apiUrl,
		method:'GET',
		dataType:'json',
		data:data,
		success:function(res) {
			
			if(res.msg == "success") {
				var data = res.data;
				
				appendOtherPage(data,id,cId,sId);
			}
		},error:function(err) {
			toaster('You are in Offline');
		}
	});
}

var stringToHTML = function (str) {
	var parser = new DOMParser();
		var doc = parser.parseFromString(str, 'text/html');
		return doc.body;
};


/*function to get news details*/
function getNewsDetails(data) { 
	//console.log('data',data);
	
	setTimeout(function() {
		$('.page-current').attr('data-url','pages/news-detail.html');
		$('.page-current').attr('data-aid',data.aid);
		//console.log('setTimeout');
	},1500);
	
	closeBuffer();	
	if(data.back == "false") {
		var back = [];
		var detailPageBackData = JSON.parse(localStorage.getItem('detailPageBackData'));
		if(detailPageBackData != null) {
			back = detailPageBackData;
		}
		back.push(data.aid);
		localStorage.setItem('detailPageBackData',JSON.stringify(back));
	}
	setTimeout(function() {
		/*if(typeof(AdMob) != 'undefined')
			AdMob.showInterstitial();*/
	},5000);
	
	showPreLoader($('.newsDetailDescription'),1);
	$('.addBottomTab').html('<a href="/" class="tab-link removeTabLocalStorage"><i class="icon fa fa-home"></i><span class="tabbar-label">முகப்பு</span></a><a href="javascript:;" data-aid="'+data.aid+'" class="tab-link sheet-open navToCommentAddPage" data-article-type=""><i class="icon fa fa-comments"></i><span class="tabbar-label">கருத்து</span></a><a href="javascript:;" class="tab-link sheet-open comment addEmotesFromArticlePage" data-article-type=""><i class="icon fa fa-thumbs-up"></i><span class="tabbar-label">விருப்பம் </span></a><a class="tab-link share-link shareForAll" href="#"><i class="icon fa fa-share-alt"></i><span class="tabbar-label">பகிர்</span></a>');
	// alert(0);
	
	// $('.page-current').attr('data-aid',data.aid);
	var isOnline = 'onLine' in navigator && navigator.onLine;
	
	if(isOnline) {

		$('#mid').val(data.mid);
		$('#aid').val(data.aid);
		data.key = accessToken;
		data.type = 'article';
		// $('.navToCommentPage').prepend('');
		var login = JSON.parse(localStorage.getItem('userDetails'));
		console.log(login);
		$('.page-current .navToCommentAddPage').attr('data-aid',data.aid);
		//$('.navToCommentPage').html('<li><a href="javascript:;" data-aid="'+data.aid+'" class="list-button item-link navToCommentAddPage" ><i class="fa fa-comments"></i>Comments</a></li><li class="saveBookMark"><a class="list-button item-link" href="#"><i class="fa fa-bookmark"></i>Bookmark</a></li><li class="saveOffLineStory"><a class="list-button item-link" href="#"><i class="fa fa-download"></i>Offline Story</a></li><li class="popover-open" data-popover=".font-settings"><a class="list-button item-link popover-close" href="#"><i class="fa fa-font"></i>Font Settings</a></li>');
		// $('.fontSettingsPopOver').html('<li><label class="item-radio item-radio-icon-end item-content"><input type="radio" name="demo-radio-end" value="Small" checked /><i class="icon icon-radio"></i><div class="item-inner"><div class="item-title">Small</div></div></label></li><li><label class="item-radio item-radio-icon-end item-content"><input type="radio" name="demo-radio-end" value="Medium"/><i class="icon icon-radio"></i><div class="item-inner"><div class="item-title">Medium</div></div></label></li><li><label class="item-radio item-radio-icon-end item-content"><input type="radio" name="demo-radio-end" value="Large"/><i class="icon icon-radio"></i><div class="item-inner"><div class="item-title">Large</div></div></label></li>');
		/*ajax call*/
		if(typeof(login)!= 'undefined' && login!=null){	data.access_key = login.access_key; data.user_id = login.user_id; }
		$.ajax({
			url:apiUrl,
			method:'GET',
			dataType:'json',
			data:data,
			success:function(res) {
				if(res.msg == 'success'){ 
					//console.log(login.user_access.epaper);
					var data = res.data;
					var paid_content = '';
					var firstcontent = '';
					//console.log(data);
					$('.saveOffLineStory, .navToCommentAddPage, .addEmotesFromArticlePage').attr('data-article-type',data.content_type);
					
					premium = ((data.content_type=='paid' || data.content_type=='login_required')?'<span class="badge premium gold-premium premium-label">ப்ரீமியம்</span>':'');
					firstcontent = $(data.content).find("p").addBack().filter("p:first").first().text();
					if((data.content_type=='paid' || data.content_type=='login_required')  && (typeof login === 'undefined' || login === null)){
						paid_content = '<p class="unblur">'+firstcontent+'</p><div class="magazine-overlay loginMagzineOverlay" style="display: block;"><div class="row"> <div class="col-100"><a href="#" data-login-screen=".my-login-screen" class="mt-16 button button-small button-block button-round button-outline panel-close login-screen-open button-fill navToCommentAddPage color-grey button-round premiumLogin">LOGIN OR REGISTER</a></div></div></div>';
						$('.newsDetailDescription').addClass('blur-content');
						$('.page-content').addClass('noscroll');
					}else if(data.content_type=='paid' && login.user_id!='' && login.user_access.web_access!=1 ){
						paid_content = '<p class="unblur">'+firstcontent+'</p><div class="magazine-overlay premiumMagzineOverlay" style="display: block;"><div class="row"> <div class="col-100"><a class="button button-block button-fill navToCommentAddPage color-grey button-round premiumProduct">Read more. Please subscribe now</a></div></div></div>';
						
						
						$('.newsDetailDescription').addClass('blur-content');
						$('.page-content').addClass('noscroll');
					}
					if(data.content_type=='paid'){
						$('.newdetails').attr('data-cur-page','premium');
					}
					
						
					if(data != null) {
						// var attribute = JSON.stringify(data);
						if(typeof(cordova) != 'undefined') {		
							setfirebaseAnalytics({page:'News detail page',property:{content_type: "News detail page", item_id:{aid:data.aid,category:data.cate_ta,title:data.title_ta,description:data.desc_ta}}});
						}
						var attribute = localStorage.setItem('offlineStory',JSON.stringify({aid:data.aid,cid:data.cid,category:data.cate_ta,web_url:data.web_url,title:data.title_ta,description:data.desc_ta+data.content,image:data.img,author:data.author,created:data.created,content_type:data.content_type}));
						var emoteSum = 0;
						
						emoteSum += data.emote.e1;
						emoteSum += data.emote.e2;
						emoteSum += data.emote.e3;
						emoteSum += data.emote.e4;
						emoteSum += data.emote.e5;
						emoteSum += data.emote.e6;
						var emotes = data.emote;

						localStorage.setItem('emote',JSON.stringify(data.emote));
						// $('.emoji').html(emoji);
						$('#web_url').val(data.web_url);
						$('.shareForAll').attr('data-url',data.web_url);
						$('.shareForAll').attr('data-msg',data.title_ta);
						$('.shareLink').attr('data-url',data.web_url);
						getRelatedArticle(data.keywords,data.aid);
						$('#msg').val(data.title_ta);
						$('.shareLink').attr('data-msg',data.title_ta);
						$('.addTitle').html(data.cate_ta);
						var content = '';
						var pass = {aid:data.aid,a_url:data.web_url,a_title:data.title_ta,desc:data.desc_ta,content:data.content};
						getCommentList({aid:data.aid});

						content += "<div id='div-gpt-ad-1605624284210-1' class='text-center' ></div>";
						// content += "<div id='div-gpt-ad-1605624284210-0' class='text-center' ><script>googletag.cmd.push(function() { googletag.display('div-gpt-ad-1605624284210-0'); });</script></div>";

						$('.addBottomTab').append('<div class="news-share" style="display: none;"><ul><li class="fb shareViaWhatsApp" data-type="facebook" data-url="'+data.web_url+'" data-msg="'+data.title_ta+'"><a href="#"><i class="fab fa-facebook"></i></a></li><li class="twt shareViaWhatsApp" data-type="twitter" data-url="'+data.web_url+'" data-msg="'+data.title_ta+'"><a href="#"><i class="fab fa-twitter"></i></a></li><li class="wtsap shareViaWhatsApp" data-type="whatsapp" data-url="'+data.web_url+'" data-msg="'+data.title_ta+'"><a href="#"><i class="fab fa-whatsapp"></i></a></li></ul></div><div class="all_data" style="display:none;">'+attribute+'</div>');

						// content += "<div id='div-gpt-ad-1605624284210-0' class='text-center' ><script>googletag.cmd.push(function() { googletag.display('div-gpt-ad-1605624284210-0'); });</script></div>";
						content += '<div class="card-header"><h4 class="breakWord">'+data.title_ta+'</h4></div><div class="card-content card-content-padding">'+premium+'<img src="'+data.img+'" class="article-image" onerror="this.src=\'assets/images/no-img.jpg\'" /></div><div class="card-footer"><div class="uavatar"><img src="assets/images/admin.jpg" onerror="this.src=\'assets/images/no-img.jpg\'" width="34" height="34"/></div><div class="uname">'+data.author+'</div><div class="udate">'+convertMonth(data.created)+'</div><div class="share_news"><ul><li><a href="javascript:void(0)" class="facebook shareViaWhatsApp" data-type="facebook" data-url="'+data.web_url+'" data-msg="'+data.title_ta+'"><i class="fab fa-facebook"></i></a></li><li><a href="javascript:void(0)" class="whatsapp shareViaWhatsApp" data-type="whatsapp" data-url="'+data.web_url+'" data-msg="'+data.title_ta+'"><i class="fab fa-whatsapp"></i></a></li><li><a href="javascript:void(0)" class="twitter shareViaWhatsApp" data-type="twitter" data-url="'+data.web_url+'" data-msg="'+data.title_ta+'"><i class="fab fa-twitter"></i></a></li></ul></div></div>';
						$('.page-current .addNewsDetailHeader').html(content);
						$('.page-current .newsDetailDescription').html(''+paid_content+'<div id=\'div-gpt-ad-1605624597553-0\' class=\'text-center\' ></div><div style="overflow-x:auto;" class=\'speech-content\'> '+data.content+'</div>');

						setTimeout(function(){refreshAds('article_page_ad_1'); refreshAds("article_page_ad_2");},500);
						//$('.newsDetailDescription').html(data.desc_ta+'<div id=\'div-gpt-ad-1605624597553-0\' class=\'text-center\' ><script>googletag.cmd.push(function() { googletag.display(\'div-gpt-ad-1605624597553-0\'); }); </script></div><div style="overflow-x:auto;">'+data.content+'</div>');

						/*googletag.cmd.push(function() {
        googletag.display('banner-ad');
      });*/
						$('.newsDetailDescription').find('img').removeAttr('width');
						$('.newsDetailDescription').find('img').removeAttr('height');
						$('.newsDetailDescription').find('img').addClass('article-image');
						/*$('.newsDetailDescription').find('img').removeAttr('width');
						$('.newsDetailDescription').find('img').removeAttr('height');
						$('.addNewsDetailHeader').find('img').removeAttr('width');
						$('.addNewsDetailHeader').find('img').removeAttr('height');*/
						
						localStorage.setItem('articleDetails',JSON.stringify(pass));
					} else {
						$('.newsDetailDescription').html('<div class="no-record">No records found</div>');
						$('.right').find('a').hide();
						$('.block-title').find('h2').hide();
					}
					
					loader(2);
					//window.googletag.pubads().refresh();
				} else {
					toaster(res.msg);
					loader(2);
				}
			},error:function(err) {
				toaster('You are in Offline');
			}
		});
	} else {
		$('.toolbar-details').hide();
		fetchArticleDetails(data.aid,function(res) {
			if(res.length > 0) {
				var data = res[0];
				var content = '';
				$('.addTitle').html(data.category);
				//var created = typeof(data.created) != 'undefined' ? convertMonth(data.created) : '';
				content += '<div class="card-header"><h4>'+data.title+'</h4></div><div class="card-content card-content-padding"><img src="'+data.image+'" onerror="this.src=\'assets/images/no-img.jpg\'" width="100%"/></div><div class="card-footer"><div class="uavatar"><img src="assets/images/admin.jpg" onerror="this.src=\'assets/images/no-img.jpg\'" width="34" height="34"/></div><div class="uname">'+data.author+'</div><div class="udate">'+convertMonth(data.created)+'</div><div class="share_news"><ul><li><a href="javascript:void(0)" class="facebook shareViaWhatsApp" data-type="facebook" data-url="'+data.web_url+'" data-msg="'+data.title+'"><i class="fab fa-facebook"></i></a></li><li><a href="javascript:void(0)" class="whatsapp shareViaWhatsApp" data-type="whatsapp" data-url="'+data.web_url+'" data-msg="'+data.title+'"><i class="fab fa-whatsapp"></i></a></li><li><a href="javascript:void(0)" class="twitter shareViaWhatsApp" data-type="twitter" data-url="'+data.web_url+'" data-msg="'+data.title+'"><i class="fab fa-twitter"></i></a></li></ul></div></div>';
				$('.addNewsDetailHeader').html(content);
				$('.right').find('a').remove();
				$('.block-title').remove();
				$('.commentButton').remove();				
				$('.related-list').remove();
				$('.newsDetailDescription').html(data.description+'<div style="overflow-x:auto;"></div>');
			} else {
				toaster('You are in Offline');
			}			
		});
	}
	return false;
}

function forceBack() {	
	var redirectTo = '/';
	/*if(previousPage == 'news-detail') {
		var aid = localStorage.getItem('');
		redirectTo = 'news-detail/1/'+aid;
	}
	console.log(redirectTo);*/
	app.views.main.router.back('/',{
        force: true,
    });
}

/*function to get reated article*/
function getRelatedArticle(key,aid) {
	// app.preloader.show();
	showPreLoader($('.appendRelatedArticle'),1);
	// loader(1);
	var data = {};
	data.keywords = key;
	data.key = accessToken;
	data.type = 'related_article';
	data.aid = aid;
	/*ajax call*/
	$.ajax({
		url:apiUrl,
		method:'GET',
		dataType:'json',
		data:data,
		success:function(res) {
			app.preloader.hide();
			if(res.msg == 'success') {
				var content = '';
				// $('.appendRelatedArticle').html('');
				var data = res.data;
				if(data != null) {
					if(data.length > 0) {
						for (var i = 0; i < data.length; i++) {
							var premiumClass = (data[i].content_type=='paid' || data[i].content_type=='login_required'?'<span class="badge premium gold-premium premium-label">ப்ரீமியம்</span>':'');
							content += '<li><a href="javascript:;" data-aid="'+data[i].aid+'" class="item-link item-content navToNewsDetailPage"><div class="item-media ">'+premiumClass+'<img src="'+data[i].img+'" onerror="this.src=\'assets/images/no-img.jpg\'"  width="80"/></div><div class="item-inner"><div class="item-text">'+data[i].title_ta+'</div></div></a></li>';
							premiumClass = '';
						}
					}
					content += "<div id='div-gpt-ad-1605624482177-100' class='text-center' ><script>refreshAds('article_page_ad_5');</script></div>";
					$('.page-current .appendRelatedArticle').html(content);
				}
				// loader(2);
			} else {
				if(res.msg!='no_type_params')
				toaster(res.msg);
				// loader(2);
			}
		},error:function(err) {
			app.preloader.hide();
			toaster('You are in Offline');	
		}
	});
}

/*function to get all menu list*/
function getAllMenus() {
	loader(1);
	/*request data*/
	var data = {key:accessToken,type:'menu'};
	/*ajax call for get menus*/
	$.ajax({
		url:apiUrl,
		method:'GET',
		dataType:'json',
		data:data,
		success:function(res) {
			if(res.msg == 'success') {
				//$('.appendAllMenus').html('');
				var data = res.data;
				var content = '<ul><li><a href="javascript:;" data-mid="1" data-cid="0" data-sid="0" class="panel-close item-link item-content moveToTab"><div class="item-media"><i class="fa fw fa-home"></i></div><div class="item-inner"><div class="item-title">முகப்பு</div></div></a></li>';
				/*content += '<li><a href="/e-subscription/" class="panel-close item-link item-content"><div class="item-media"><i class="fa fw fa-laptop"></i></div><div class="item-inner"><div class="item-title">இ-பேப்பர்</div></div></a></li>';		*/		
				for(var i = 0;i < data.length;i++) {
					var menu = data[i].sub_menus;
					var subMenu = '';
					var premiumArticleClass = (data[i].cid=='PaidStory'?'gold-color':'');
					if(menu.length > 0) {
						content += '<li class="has-submenu"><a href="javascript:void(0)" data-mid="'+(typeof(data[i].mid)!='undefined'?data[i].mid:'')+'" data-cid="'+(typeof(data[i].cid)!='undefined'?data[i].cid:'')+'" class="item-link item-content menu-links-head "><div class="item-media"><i class="'+data[i].menu_image+'"></i></div><div class="item-inner"><div class="item-title">'+data[i].menu_name_tamil+'</div></div></a>'
						subMenu += '<ul class="submenu">';
						for(var j = 0;j < menu.length;j++) {
							var pid = menu[j].pid;
							var sid = (pid == 0) ? 0 : menu[j].pid;
							var cid = menu[j].cid;							
							subMenu += '<li class="panel-close"><a href="javascript:void(0)" data-sid="'+sid+'" data-mid="'+(typeof(menu[j].mid)!='undefined'?menu[j].mid:'')+'" data-cid="'+(typeof(menu[j].cid)!='undefined' && (menu[j].cid != 0)?menu[j].cid:'')+'" class="moveToTab">'+menu[j].menu_name_tamil+' </a></li>'
						}
						subMenu += '</ul>';
						content += subMenu+'</li>';
					} else {
						var menuLink='javascript:void(0)';
						switch(data[i].mid)
						{
							case 7:
								menuLink='/e-subscription/';
							break;
							case 4:
								menuLink='/albums/';
							break;
							case 5:
								menuLink='/videos/';
							break;	
						}
						if(data[i].mid =='2' && data[i].cid == 0) {
							//content += '<li class="panel-close"><a href="'+menuLink+'" class="item-link item-content '+(menuLink=='javascript:void(0)'?'noContent':'')+'" data-mid="'+(typeof(data[i].mid)!='undefined'?data[i].mid:'')+'" data-cid="'+(typeof(data[i].cid)!='undefined'?data[i].cid:'')+'"><div class="item-media"><i class="'+data[i].menu_image+'"></i></div><div class="item-inner"><div class="item-title">'+data[i].menu_name_tamil+'</div></div></a></li>';
						} else if(data[i].mid == 99) {
							content += '<li class="panel-close" onclick="loadSubscriptionBrowser()" ><a href="javascript:void(0)" class="item-link item-content"><div class="item-media"><i class="'+data[i].menu_image+'"></i></div><div class="item-inner"><div class="item-title">'+data[i].menu_name_tamil+'</div></div></a></li>';	
						} else if((menu.length == 0) && data[i].cid != 0) { 							
									content += '<li class="panel-close"><a href="'+menuLink+'" class="item-link item-content moveToTab" data-mid="'+(typeof(data[i].mid)!='undefined'?data[i].mid:'')+'" data-cid="'+(typeof(data[i].cid)!='undefined'?data[i].cid:'')+'"><div class="item-media"><i class="'+premiumArticleClass+' '+data[i].menu_image+'"></i></div><div class="item-inner"><div class="item-title '+premiumArticleClass+'">'+data[i].menu_name_tamil+'</div></div></a></li>';									
						} else {							
								content += '<li class="panel-close"><a href="'+menuLink+'" class="item-link item-content moveToTab '+(menuLink=='javascript:void(0)'?'noContent':'')+'" data-mid="'+(typeof(data[i].mid)!='undefined'?data[i].mid:'')+'" data-cid="'+(typeof(data[i].cid)!='undefined'?data[i].cid:'')+'"><div class="item-media"><i class="'+data[i].menu_image+'"></i></div><div class="item-inner"><div class="item-title">'+data[i].menu_name_tamil+'</div></div></a></li>';								
						}
					}
				}
				  
				//content += '<li class="panel-close"><a href="/in-app-purchase" class="item-link item-content"><div class="item-media"><i class="fa fa-bell"></i></div><div class="item-inner"><div class="item-title">In app purchase</div></div></a></li>';
				$('.appendAllMenus').html(content+'</ul>');
				loader(2);
			} else {
				toaster(res.msg);	
				loader(2);
			}
		},error:function(err) {
			toaster('You are in Offline');	
		}
	});
}

/*function to get user profile*/
function getUserProfile() {
	// loader(1);
	app.preloader.show();
	var userDetails = JSON.parse(localStorage.getItem('userDetails'));
	/*request data*/
	var data = {key:accessToken,type:'profile_info',user_id:userDetails.user_id};
	/*ajax call for get user profile*/
	$.ajax({
		url:apiUrl,
		method:'GET',
		dataType:'json',
		data:data,
		success:function(res) {
			if(res.msg == 'success') {
				var data = res.data;
				var gender = (data.gender == null) ? 0 : data.gender;
				var mstatus = (data.mstatus == null) ? 0 : data.mstatus;
				$('#userame').val(data.user_name);
				$('#phoneNumber').val(data.phone);
				$('#dob').val(data.dob);
				$('#gender').val(gender);
				$('#maritalStatus').val(mstatus)	;
				// loader(2);
				app.preloader.hide();
			} else {
				toaster(res.msg);
				app.preloader.hide();
				// loader(2);
			}
		},error:function(err) {
			toaster('You are in Offline');	
		}
	});
}

/*function to get saved stories*/
function getSavedStories(id) {
	if(typeof(cordova) != 'undefined') {		
		setfirebaseAnalytics({page:'Bookmark Page',property:{content_type: "Bookmark Page", item_id:'Bookmark Page'}});
	}
	
	localStorage.setItem('previousPage','bookmark');
	showPreLoader($('.appendSavedStory'),1);
	/*request data*/
	var data = {key:accessToken,type:'bookmark_list'};
	var userDetails = JSON.parse(localStorage.getItem('userDetails'));
	if(userDetails != null) 
		data.user_id = userDetails.user_id;
	/*ajax call for getting saved stories*/
	$.ajax({
		url:apiUrl,
		method:'GET',
		dataType:'json',
		data:data,
		success:function(res) {
			// $('.appendSavedStory').html('');
			var content = '';
			if(res.msg == 'success') {
				if(res.data.length > 0) {
					var data = res.data;
					for (var i = 0; i < data.length; i++) {
						var premiumClass = (data[i].content_type=='paid' || data[i].content_type=='login_required'?'<span class="badge premium gold-premium premium-label">ப்ரீமியம்</span>':'');
						content += '<div class="col-100 medium-50"><div class="card news news_lg"><a data-aid="'+data[i].aid+'" href="javascript:;" class="card-header cover-img align-items-flex-end navToNewsDetailPage"><span class="category">'+data[i].cate_ta+'</span> '+premiumClass+'<img src="'+data[i].img+'" onerror="this.src=\'assets/images/no-img.jpg\'"/></a><div class="card-content card-content-padding"><a href="javascript:;" data-aid="'+data[i].aid+'" class="news-title navToNewsDetailPage">'+data[i].title_ta+'</a></div><div class="card-footer"><a href="javascript:void(0)" data-aid="'+data[i].aid+'" data-cid="'+data[i].cid+'" class="link deleteBookMark"><i class="fa fa-trash"></i> Delete</a><a href="javascript:void(0)" data-msg="'+data[i].title_ta+'" data-url="'+data[i].web_url+'" class="link shareLink"><i class="fa fa-share-alt"></i> Share</a></div></div></div>';
						premiumClass = '';
					}
					$('.appendSavedStory').html(content);
					loader(2);
				} else {
					content += '<div class="no-record">No records found!</div>';
					// content += '<div class="page-content display-flex flex-direction-column justify-content-center"><div>No records found!</div></div>'
					$('.appendSavedStory').html(content);
					loader(2);
				}
			} else {
				toaster(res.msg);	
				// loader(2);
			}
		},error:function(err) {
			toaster('You are in Offline');	
		}
	});	
}

function saveBookmark(data) {
	/*ajax call for save bookmark*/
	$.ajax({
		url:apiUrl,
		method:'GET',
		dataType:'json',
		data:data,
		success:function(res) {
			if(res.msg == 'success') {
				app.popover.close();
				app.preloader.hide();
				toaster('Bookmark added successfully');
			} else {
				toaster(res.msg);	
				app.preloader.hide();
			}
		},error:function(err) {
			toaster('You are in Offline');	
		}
	});	
}

function deleteBookMark(data) {
	app.preloader.show();
	/*ajax call for delete bookmark*/
	$.ajax({
		url:apiUrl,
		method:'GET',
		dataType:'json',
		data:data,
		success:function(res) {
			if(res.msg == "success") {
				getSavedStories();
				toaster('Deleted successfully');	
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

/*function to add feedback*/
function addFeedback() {
	/*get user details*/
	// var userDetails = JSON.parse(localStorage.getItem('userDetails'));
	
	if(!checkEmpty('.userName')) {
		toaster('Enter name');
	} else if(!checkEmpty('.feedbackEmail')) {
		toaster('Enter email');
	} else if(!isEmail($('.feedbackEmail').val())) {
		toaster('Enter valid email');
	}  else if(!checkEmpty('#phone')) {
		toaster('Enter mobile number');
	} else if(!checkEmpty('#feedback')) {
		toaster('Enter comment');
	} else {
		if($('#phone').val().length > 10 || $('#phone').val().length < 10) {
			// app.preloader.hide();
			toaster('Enter a valid phone number');return false;
		}
		app.preloader.show();
		var deviceDetails = localStorage.getItem('deviceDetails');

		/*request data*/
		var data = {key:accessToken,type:'feedback',user_name:$('.userName').val(),user_email:$('.feedbackEmail').val(),user_phone:$('#phone').val(),comment:$('#feedback').val(),other_info:deviceDetails};
		/*ajax call for add feedback*/
		$.ajax({
			url:apiUrl,
			method:'GET',
			dataType:'json',
			data:data,
			success:function(res) {
				if(res.msg == "success") {
					toaster('Feedback added successfully');
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
}

/*function to get static page content*/
function getStaticContentPage(page) {
	app.preloader.show();
	/*request data*/
	var data = {key:accessToken,type:'static'};
	if(page == 'terms') {
		data.page = 'terms-conditions';
	}
	/*ajax call for static page content*/
	$.ajax({
		url:apiUrl,
		method:'GET',
		dataType:'json',
		data:data,
		success:function(res) {
			if(res.msg == "success") {
				var data = res.data;
				$('.uploadTitle').html('<span>'+data.title+'</span>');
				$('.uploadContent').html(data.content);
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

function userRegViaCommentPost(data) {
	app.preloader.show();
	var datas = {type:'register',name:data.name,email:data.email,password:'welcome',social:0,key:accessToken};
	/*ajax call for register*/
	$.ajax({
		url:apiUrl,
		method:'GET',
		dataType:'json',
		data:datas,
		success:function(res) {
			if(res.msg == "success") {
				localStorage.setItem('userRegDetails',JSON.stringify(res.data));
				app.preloader.hide();
				if(data.type == 'emotes') {
					$('.emoteSubmit').find('a').addClass('voted');
					emotesSubmit(data.aid,data.emotion,res.data.user_id);	
				} else if(data.type == 'comments') {
					var userDetails = JSON.parse(localStorage.getItem('userRegDetails'));
					postComment(data.comment,userDetails);
				}
			} else if(res.msg == 'EMAIL_ALREADY_EXISTS') {
				toaster('Email id already exists');	
				app.preloader.hide();
				loader(2);
			}else {
				toaster(res.msg);	
				app.preloader.hide();
				loader(2);
			}
		},error:function(err) {
			toaster('You are in Offline');
		}
	});
}

function getOfflineStory() {
	if(typeof(cordova) != 'undefined') {		
		setfirebaseAnalytics({page:'Offline story Page',property:{content_type: "Offline story Page", item_id:'Offline story Page'}});
	}
	var isOnline = 'onLine' in navigator && navigator.onLine;
	console.log('isOnline',isOnline);
	if(!isOnline)
		$('.savedBackLink').hide();
	$('.e-fab-icons').hide();
	app.popup.close();
	/*$('.page-current .left').html('');
	var isOnline = 'onLine' in navigator && navigator.onLine;
	if(isOnline)
		$('.page-current .left').html('<a href="#" class="link icon-only" onclick="forceBack()"><i class="fa fw fa-arrow-left"></i></a>');*/
	var id;
	localStorage.setItem('previousPage','saved');
	fetchArticleDetails(id,function(res) {
		var content = '';
		$('.appendSavedStory').html('');
		if(res.length > 0) {
			for(var i = 0;i < res.length;i++) {
				var premiumClass = (res[i].content_type=='paid' || res[i].content_type=='login_required'?'<span class="badge premium gold-premium premium-label">ப்ரீமியம்</span>':'');
				content += '<div class="col-100 medium-50"><div class="card news news_lg"><a data-aid="'+res[i].aid+'" href="javascript:;" class="card-header cover-img align-items-flex-end navToNewsDetailPage"><span class="category">'+res[i].category+'</span>'+premiumClass+'<img src="'+res[i].image+'" onerror="this.src=\'assets/images/no-img.jpg\'"/> </a><div class="card-content card-content-padding"><a href="javascript:;" data-aid="'+res[i].aid+'" class="news-title navToNewsDetailPage">'+res[i].title+'</a></div><div class="card-footer"><a href="javascript:void(0)" data-aid="'+res[i].aid+'" data-id="'+res[i].id+'" class="link deleteOfflineStory"><i class="fa fa-trash"></i> Delete</a><a href="javascript:void(0)" data-msg="'+res[i].title+'" data-url="'+res[i].web_url+'" class="link shareLink"><i class="fa fa-share-alt"></i> Share</a></div></div></div>';
				premiumClass = '';
			}
			$('.appendSavedStory').html(content);
		} else {
			content += '<div class="no-record"><span>No records found!</span></div>';
			$('.appendSavedStory').html(content);
		}

	});
}

function clearCache() {
	app.dialog.confirm('Are you sure want to clear cache?','Confirmation!',function(){
		dropTable();
		//localStorage.removeItem('userDetails');
		CordovaClearCache.clearExternalCache();
		toaster('Cache cleared successfully');
		mainView.router.load({url:'index.html'});
	});
}

function getNewsSerachResult(value) {
	if(typeof(cordova) != 'undefined') {		
		setfirebaseAnalytics({page:'News page search',property:{content_type: "News page search", item_id:'News page search'}});
	}
	
	localStorage.setItem('previousPage','home-search');
	allowInfinite = false;
	var datas = {q:value,module:'news',page:scrollPageNo,rel:2,key:accessToken,type:'search'};
	$.ajax({
		url:apiUrl,
		method:'GET',
		dataType:'json',
		data:datas,
		success:function(res) {
			var content = '';
			if(res.msg == "success") {
				 var data = res.data.data;
				 if(data != null) {
				 	if(data.length > 0) {
					 	for(var i = 0;i < data.length;i++) {
							var premiumClass = (data[i].content_type=='paid' || data[i].content_type=='login_required'?'<span class="badge premium gold-premium premium-label">ப்ரீமியம்</span>':'');
					 		content += '<div class="col-100 medium-50 large-33 breakWord"><div class="card news news_lg"><a data-aid="'+data[i].aid+'" href="javascript:;" class="card-header cover-img align-items-flex-end navToNewsDetailPage">'+premiumClass+'<img src="'+data[i].img.replace('medium','large')+'" onerror="this.src=\'assets/images/no-img.jpg\'"/></a><div class="card-content card-content-padding"><a href="javascript:;" data-aid="'+data[i].aid+'" class="news-title navToNewsDetailPage">'+data[i].title_ta+'</a><p class="news-desc">'+data[i].desc_ta+'</p></div></div></div>';
							//content += '<div class="col-100 medium-50 large-33"><div class="swiper-wrapper navToNewsDetailPage" data-aid="'+data[i].aid+'"><div class="swiper-slide" id="pb-standalone-dark"><div class="card album-card"><div class="card-header album-img align-items-flex-end"><img src="'+data[i].img.replace('medium','large')+'" onerror="this.src=\'assets/images/no-img.jpg\'"/></div><div class="card-content card-content-padding"><h3>'+data[i].title_ta+'</h3></div></div></div></div></div>';
							premiumClass = '';
					 	}
					 	//content += '<a href="#" class="otherNewsSearchLoadMore button button-block button-fill color-grey button-round">Load more</a>';
					 	if(data.length >= 12) {
					    	allowInfinite = true;
					    }
					 } else if(data.length == 0 && scrollPageNo == 1) {
					 	content += '<div class="no-record">No record found</div>';
					 }
				 }
			}
			if(scrollPageNo == 1) {
				$('.searchResult').html(content);	
			} else {
				$('.searchResult').append(content);
			}

			lazyLoadFunctionality({page:'home-search',field:'#home-page-search',value:value})
			/*$('#home-page-search').on('scroll',function(){
				console.log('scrolling...');
		        var scrollTop = this.scrollTop;
		        // console.log($(this).scrollTop(),$(this).innerHeight(),$(this)[0].scrollHeight);
		        if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
		        	if(allowInfinite) {
		        		scrollPageNo = scrollPageNo + 1;
		        		getNewsSerachResult();
		        	}
		        }
		    });*/
						
		},error:function(err) {
			toaster('You are in Offline');
		}
	});
}

function getSearchDetails(obj,searchField,searchVal) {
	var results = [];
	var searchField = searchField;
	var searchVal = searchVal.toLowerCase();
	for (var i=0 ; i < obj.length ; i++) {
		var post = (obj[i]['post']);
		if(post.length > 0) {
			for (var j=0 ; j < post.length ; j++) {
				var str = (post[j]['title_ta']);
				if (typeof(str) != 'undefined' && (str.toLowerCase()).indexOf(searchVal) !== -1) {
			        results.push(post[j]);
			    }
			}	
		}
	}
	return results;
}

function refreshAds(refresh_slots) { 
	//console.log(window.adTags[refresh_slots]);
	if(typeof([window.adTags[refresh_slots]]) == "undefined") {
       window.googletag.pubads().refresh();
    } else {
		/*window.googletag.cmd.push(function() {
    	// setTimeout(function() {
    		window.googletag.pubads().setTargeting(refresh_slots, [window.adTags[refresh_slots]]);
    		window.googletag.pubads().refresh([window.adTags[refresh_slots]]);
    	});*/
    	// setInterval(function(){window.googletag.pubads().refresh([window.adTags[refresh_slots]]);}, 3000);
    	if(typeof(window.googletag) != 'undefined' && typeof(window.googletag.pubads) == 'function')
    		window.googletag.pubads().refresh([window.adTags[refresh_slots]]);
    	//window.googletag.pubads().refresh([window.adTags[refresh_slots]]);
    	// },1000);
    }
};

function showPreLoader(container,isShow) {
	
	var content = '';
	if(isShow) {
		content += '<div class="loading-wrapper"><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div><div class="title-block"><div class="loading title"></div><div class="loading content"></div><div class="loading content last-row"></div></div></div>';
	}
	container.html(content);
}

function imgTOURL(arrayObj,shareUrl) {
	// caption: item.caption,
	return arrayObj.map(item => {
      return {
        url: (item.img).replace('thumb','large'),
        //caption:'<div class="share_news"><ul><li><a href="javascript:void(0)" class="facebook shareViaWhatsApp" data-type="facebook"><i class="fab fa-facebook"></i></a></li><li><a href="javascript:void(0)" class="whatsapp shareViaWhatsApp" data-type="whatsapp"><i class="fab fa-whatsapp"></i></a></li><li><a href="javascript:void(0)" class="twitter shareViaWhatsApp" data-type="twitter" ><i class="fab fa-twitter"></i></a></li></ul></div>'
        caption:item.caption,
		share:shareUrl
        //'<div class="gvghv"><i class="fab fa-facebook"></i></div>',
      };
    });
}

function logOut() {
	localStorage.removeItem('userDetails');
	var loginType = localStorage.getItem('loginFrom');
	if(loginType == 'google') {
		googleLogout();
	} else if(loginType == 'facebook') {
		facebookLogout();	
	}
	mainView.router.load({url:'index.html'});
}

function saveNotification(data) {
	insertNotification(data.payload);
}

function getAllNotifications() {
	if(typeof(cordova) != 'undefined') {		
		setfirebaseAnalytics({page:'Notification page',property:{content_type: "Notification page", item_id:'Notification page'}});
	}
	
	app.preloader.show();
	removePreviousData();
	showNotifications(function(res) {
		if(res.length > 0) {
			var content = '';
			var data = res;
			for (var i = 0; i < res.length; i++) {
				//content += '<li><a href="/news-detail/" class="item-link item-content"><div class="item-media"><img src="'+data[i].img+'" width="80" onerror="this.src=\'assets/images/no-img.jpg\'"/></div><div class="item-inner"><div class="item-text">'+data[i].title_ta+'</div><div class="item-subtitle">'+convertMonth(data[i].created)+'</div></div></a><a href="#" class="delete-noti deleteNotification" data-id="'+data[i].id+'"><i class="fa fa-trash"></i></a><a href="#" class="share-noti shareViaWhatsApp" data-type="whatsapp" data-url="'+data[i].web_url+'" data-msg="'+data[i].desc_ta+'"><i class="fab fa-whatsapp"></i></a></li>';	
				content += '<li class="swipeout" ><a href="javascript:void(0)" class="item-link item-content redirectToNotiDetails swipeout-content" data-aid="'+data[i].aid+'"><div class="item-media"><img src="'+data[i].img+'" width="80"/></div><div class="item-inner"><div class="item-text">'+data[i].title_ta+'</div><div class="item-subtitle">'+convertMonth(data[i].created)+'</div></div></a><div class="swipeout-actions-right"><a href="javascript:void(0)" class="swipeout-delete deleteNotification" data-id="'+data[i].id+'" data-aid="'+data[i].aid+'"><i class="fa fa-trash"></i></a></div></li>';
			}
			$('.showNotifications').html(content);
			app.preloader.hide();
		} else {
			$('.showNotifications').html('<div class="text-center">No record found</div>');
			app.preloader.hide();
		}
	});
}

function checkSession() {
	var userDetails = JSON.parse(localStorage.getItem('userDetails'));
	if(userDetails == null) {
		$('#usercallback').val(false);
		app.popup.open('.login-screen');return false;
	} else {
		app.popup.close('.login-screen');return true;
	}
}

function getKamaDenu() {
	showPreLoader($('.appendKamadenuContent'),1);
	var data = {type:'mag_issue',mid:2,key:accessToken};
	$.ajax({
		url:apiUrl,
		method:'GET',
		dataType:'json',
		data:data,
		success:function(res) {
			if(res.msg == "success") {
				var data = res.data;
				var content = '<div class="block-title"><h2>காமதேனு <a href="#" class="more pull-right"></a></h2></div>';
				//var cont = '<div class="col-100 medium-40"><div class="list media-list news-list"><ul>';
				if(data.length > 0) {
					if(typeof(cordova) != 'undefined') {		
						setfirebaseAnalytics({page:'Kamadenu page',property:{content_type: "Kamadenu page", item_id:{aid:'Kamadenu'}}});
					}
					
					for (var i = 0; i < data.length; i++) {
						//content += '<div class="row">';
						/*if(i == 0) {
							content += '<div class="col-100 medium-60"><div class="card news news_lg"><a href="/kamadenu-detail/2/'+data[i].issue_id+'" class="card-header cover-img align-items-flex-end"><img src="'+data[i].img.replace('medium','large')+'" onerror="this.src=\'assets/images/no-img.jpg\'"/></a><div class="card-content card-content-padding"><a href="#" class="news-title">'+data[i].name+'</a><p>'+data[i].date+'</p></div></div></div>';
						} else {
							//cont += '<li><a href="/kamadenu-detail/4/'+data[i].issue_id+'" class="item-link item-content"><div class="item-media"><img src="'+data[i].img.replace('medium','large')+'" width="80" onerror="this.src=\'assets/images/no-img.jpg\'"/></div><div class="item-inner"><div class="item-text">'+data[i].name+'</div></div></a><a href="/wow-book" class="news-title">Click Here</a></li>';
							cont += '<li><a href="/kamadenu-detail/2/'+data[i].issue_id+'" class="item-link item-content"><div class="item-media"><img src="'+data[i].img.replace('medium','large')+'" width="80" onerror="this.src=\'assets/images/no-img.jpg\'"/></div><div class="item-inner"><div class="item-text">'+data[i].name+'</div></div></a></li>';
						}*/
						
						if(i == 0) {
							//content += '<div class="block-title"><h2>'+data[i].name+'</h2></div>';
							content += '<div class="card news news_lg"><a href="/kamadenu-detail/2/'+data[i].issue_id+'" class="card-header cover-img align-items-flex-end"><img src="'+data[i].img.replace('medium','large')+'" onerror="this.src=\'assets/images/no-img.jpg\'"/></a><div class="card-content card-content-padding"><a href="/kamadenu-detail/2/'+data[i].issue_id+'" class="news-title">'+data[i].name+'</a></div></div>';
						} else {
							content += '<div class="list media-list news-list kamadenu-list"><ul><li><a href="/kamadenu-detail/2/'+data[i].issue_id+'" class="item-link item-content"><div class="item-media"><img src="'+data[i].img.replace('medium','large')+'" width="80" onerror="this.src=\'assets/images/no-img.jpg\'"/></div><div class="item-inner"><div class="item-text">'+data[i].name+'</div></div></a></li></ul></div>';
						}
						
					}
					//cont += '</ul></div></div>';
						//content += cont+'</div>';
				} else {
					content += '<div class="no-record">No records found</div>';
				}
				$('.appendKamadenuContent').html(content);
				//lazyLoadFunctionality({page:'kamadenu',field:'.appendKamadenuContent'});
			} else {
			
			}
		},error:function(err) {
			toaster('You are in Offline');
		}
	});	
}

function getKamaDenuDetails(data) {
	showPreLoader($('.appendKamadenuDetailsContent'),1);
	data.type = 'mag_home';
	data.key = accessToken;
	$.ajax({
		url:apiUrl,
		method:'GET',
		dataType:'json',
		data:data,
		success:function(res) {
			if(res.msg == "success") {
				var data = res.data;
				var content = '';
				var cont = '';
				if(data.length > 0) {
					if(typeof(cordova) != 'undefined') {		
						setfirebaseAnalytics({page:'Kamadenu detail page',property:{content_type: "Kamadenu detail page", item_id:{aid:'Kamadenu'}}});
					}
					
					for (var i = 0; i < data.length; i++) {
						cont = '';
						var resp = data[i].data;
						content += '<div class="block-title"><h2>'+data[i].cat_title+' <a href="#" class="more pull-right"></a></h2></div><div class="row">';
						cont += '<div class="col-100 medium-40"><div class="list media-list news-list"><ul>';
						for (var j = 0; j < resp.length; j++) {
							if(j == 0) {
								content += '<div class="col-100 medium-60"><div class="card news news_lg"><a href="javascript:;" class="card-header cover-img align-items-flex-end getKamaDenuInterior" data-aid="'+resp[j].aid+'"><img src="'+resp[j].img.replace('thumb','large')+'" onerror="this.src=\'assets/images/no-img.jpg\'"/></a><div class="card-content card-content-padding"><a href="javascript:;" class="news-title getKamaDenuInterior" data-aid="'+resp[j].aid+'">'+resp[j].title_ta+'</a><p class="news-desc">'+resp[j].desc_ta+'</p></div></div></div>';
							} else {
								cont += '<li><a href="javascript:;" data-aid="'+resp[j].aid+'" class="item-link item-content getKamaDenuInterior"><div class="item-media"><img src="'+resp[j].img.replace('thumb','large')+'" width="80" onerror="this.src=\'assets/images/no-img.jpg\'"/></div><div class="item-inner"><div class="item-text">'+resp[j].title_ta+'</div></div></a></li>';	
							}
						}
						cont += '</ul></div></div>';
						content += cont+'</div>';
					}
				} else {

				}
				$('.appendKamadenuDetailsContent').html(content+'<br>');
			} else {
			
			}
		},error:function(err) {
			toaster('You are in Offline');
		}
	});	
}

function forgotPassword(email) {
	app.preloader.show();
	var data = {type:'forgot_pass',key:accessToken,email:email};
	$.ajax({
		url:apiUrl,
		method:'GET',
		dataType:'json',
		data:data,
		success:function(res) {
			app.popup.close('.fpassword');
			app.preloader.hide();
			toaster(res.msg);
		},error:function(err) {
			app.preloader.hide();
			toaster('You are in Offline');
		}
	});	
}
function loadYoutubeJSON(data,tit)
{
	var resp = JSON.parse(localStorage.getItem('youTubeVideos'));
	if(tit == 'all') {
		if(resp != null) {
			var data1 = data.concat(resp);
			localStorage.setItem('youTubeVideos',JSON.stringify(data1));
		} else {
			localStorage.setItem('youTubeVideos',JSON.stringify(data));
		}
	}
}
function loadDailyMotionJSON(data)
{
	localStorage.setItem('dailyMotionVideos',JSON.stringify(data));
	
}
/*function to get all videos*/
function getVideos(title) {
	allowInfinite = false;
	if(typeof(cordova) != 'undefined') {		
		setfirebaseAnalytics({page:'Video page',property:{content_type: "Video page", item_id:'Video page'}});
	}
	localStorage.setItem('tabActive',0);
	var loader = {page:'video',value:title,field:'.page-content .video-page'};
	var data = {type:'cate_article',key:accessToken,mid:5,page:scrollPageNo};
	
	if(scrollPageNo == 1) {
		showPreLoader($('.appendVideo'),1);
	} 
	
	if(title != 'all' && title != 0){
		data.cid = title;
		loader.cid = title;
	}
	
	lazyLoadFunctionality(loader);
	
	$.ajax({
		url:apiUrl,
		method:'GET',
		dataType:'json',
		data:data,
		success:function(res) {
			var content = '';
			if(res.msg == "success") {	
				var data = res.data;
				var content = '';
				if(data != null && data.length > 0) {
					//content += '<div class="row">';
					var cont = '';
					for (var i = 0; i < data.length; i++) {
						var type = data[i].cate_ta;
						var title = data[i].title_ta;							
						var url = data[i].img.replace("default", "0");
						var date =  convertMonth(data[i].created);
						var id = data[i].content;
						content += '<div class="col-100 medium-50 large-33 youtube-video"><div class="card album-card"><div style="background:url(assets/images/no-img.jpg) no-repeat center center / cover" class="card-header cover-img video-popup align-items-flex-end cover-img"><img class="playYouTubeVideo" data-id="https://www.youtube.com/embed/'+id+'" data-cap="'+title+'" src="'+url+'"><div class="play-icon"><i class="fa fa-play playYouTubeVideo" data-id="https://www.youtube.com/embed/'+id+'" data-cap="'+title+'"></i></div><span class="category">'+type+'</span></div><div class="card-content card-content-padding"><h3 class="mn playYouTubeVideo" data-id="https://www.youtube.com/embed/'+id+'" data-cap="'+title+'">'+title.substr(0,70)+'...</h3><p><span>'+date+'</span> <a href="#" data-msg="'+title+'" data-url="https://www.youtube.com/embed/'+id+'" class="pull-right shareLink"><i class="fa fa-share-alt"></i> Share</a></p></div></div></div>';
					}
					//content += '</div>';
					if(data.length >= 15) {
						allowInfinite = true;
					}
						
				} else {
					content += '<div class="no-record">No record found</div>';
				}
				content += '</div>';
			
				if(scrollPageNo != 1)
					$('.appendVideo').append(content);
				else 
					$('.appendVideo').html(content);
					
			}
		},error:function(err) {
			toaster('You are in Offline');
		}
	});
	
	/*if(title == 'all') {
		localStorage.removeItem('youTubeVideos');
		localStorage.removeItem('dailyMotionVideos');
		showPreLoader($('.appendVideo'),1);
		getYoutubeVideos1("UCJ36XbT02JNAlBEBgZtW7GQ",'Hindu Tamil Thisai',title,function(data){
			showPreLoader($('.appendVideo'),0);
			appendYouTubeData(data,'Hindu Tamil Thisai',title);
			getYoutubeVideos1("UCFwhrXOTW6wj-j5qUYWbbOQ",'Selfie Review',title,function(data){
				appendYouTubeData(data,'Selfie Review',title);
				getDailyMotionVideos1(title,function(data){
					appendDailyMotionVideo(data,title);
				});
			});
		});
		allColor = 'color-blue';
	} else if(title == "hindu-tamil") {
		showPreLoader($('.appendVideo'),1);
		getYoutubeVideos("UCJ36XbT02JNAlBEBgZtW7GQ",'Hindu Tamil Thisai',title);
		hinduColor = 'color-blue';
	} else if(title == "selfie-review") {
		showPreLoader($('.appendVideo'),1);
		getYoutubeVideos("UCFwhrXOTW6wj-j5qUYWbbOQ",'Selfie Review',title);
		selfieColor = 'color-blue';
	} else if(title == "daily-motion") {
		showPreLoader($('.appendVideo'),1);
		getDailyMotionVideos(title);
		dailyColor = 'color-blue';
	}
	$('.video-category').html('<div class="chip getVideoDetails '+allColor+'" data-type="all"><div class="chip-label">All</div></div><div class="chip getVideoDetails '+hinduColor+'" data-type="hindu-tamil"><div class="chip-label">Hindu Tamil Thisai</div></div><div class="chip getVideoDetails '+selfieColor+'" data-type="selfie-review"><div class="chip-label">Selfie Review</div></div><div class="chip getVideoDetails '+dailyColor+'	" data-type="daily-motion"><div class="chip-label">மற்றவை</div><div class="chip-label">&nbsp;&nbsp;&nbsp;&nbsp;</div></div>');
	$('.video-category').attr('style','width:'+(($(".video-category").width())+100)+'px');*/
}

function getYoutubeVideos1(youTubeChannelId,title,tit,callback) {
	var preTopic = $('.video-category').find('div.color-blue').attr('data-type');
	var data = {part:'snippet,id',channelId:youTubeChannelId,maxResults:50,key:gogApiKey,order:'date',maxResults:50};
	$.ajax({
		url:youtubeUrl,
		method:'GET',
		dataType:'json',
		data:data,
		success:function(res) {
			var data = res.items;
			data.map(i=>i.title=title);
			if(tit == 'all')
				loadYoutubeJSON(data,tit);
			callback(data);
			
			
			// app.preloader.hide();
			
		},error:function(err) {
			app.preloader.hide();
			toaster('You are in Offline');
		}
	});	
}
function getYoutubeVideos(youTubeChannelId,title,tit) {
	if(title == 'Hindu Tamil Thisai' && tit == 'all'){
		//showPreLoader($('.appendVideo'),0);
	}
	var preTopic = $('.video-category').find('div.color-blue').attr('data-type');
	//var data = {part:'snippet,contentDetails',channelId:youTubeChannelId,maxResults:50,key:gogApiKey};
	var data = {part:'snippet,id',channelId:youTubeChannelId,maxResults:50,key:gogApiKey,order:'date',maxResults:50};
	$.ajax({
		url:youtubeUrl,
		method:'GET',
		dataType:'json',
		data:data,
		success:function(res) {
			var data = res.items;
			/*if(tit == 'all') {
				var resp = JSON.parse(localStorage.getItem('youTubeVideos'));
				console.log(resp);
				if(resp != null) {
					console.log($.merge(resp,data));
					data = $.merge(resp,data);
				} else {
					data = res.items;
				}
			}*/
			if(title == 'Hindu Tamil Thisai'){
				//showPreLoader($('.appendVideo'),0);
			}
			appendYouTubeData(data,title,tit);
			
			
			var resp = JSON.parse(localStorage.getItem('youTubeVideos'));
			if(tit == 'all') {
				data.map(i=>i.title=title);
				if(resp != null) {
					var data = data.concat(resp);
					localStorage.setItem('youTubeVideos',JSON.stringify(data));
				} else {
					localStorage.setItem('youTubeVideos',JSON.stringify(data));
				}
			}
			
			// app.preloader.hide();
			
		},error:function(err) {
			app.preloader.hide();
			toaster('You are in Offline');
		}
	});	
}
function getDailyMotionVideos1(type,callback) {
	// showPreLoader($('.appendVideo'),1);
	var preTopic = $('.video-category').find('div.color-blue').attr('data-type');
	if(type != preTopic){
		// app.preloader.show();
		
	}
	var data = {limit:50};
	$.ajax({
		url:dailyMotionUrl,
		method:'GET',
		dataType:'json',
		data:data,
		success:function(res) {
			var data = res.list;
			data.map(i=>i.titles="Daily Motion");
			loadDailyMotionJSON(data);
			callback(data);
			// app.preloader.hide();
		},error:function(err) {
			app.preloader.hide();
			toaster('You are in Offline');
		}
	});	
}

function getDailyMotionVideos(type) {
	// showPreLoader($('.appendVideo'),1);
	var preTopic = $('.video-category').find('div.color-blue').attr('data-type');
	if(type != preTopic){
		// app.preloader.show();
		
	}
	var data = {limit:50};
	$.ajax({
		url:dailyMotionUrl,
		method:'GET',
		dataType:'json',
		data:data,
		success:function(res) {
			var data = res.list;
			data.map(i=>i.titles="Daily Motion");
			/*var resp = JSON.parse(localStorage.getItem('youTubeVideos'));
			
			if(resp != null) {
				console.log($.merge(resp,data));
				localStorage.setItem('youTubeVideos',JSON.stringify($.merge(resp,data)));
			} else {
				localStorage.setItem('youTubeVideos',JSON.stringify(data));
			}*/
			localStorage.setItem('dailyMotionVideos',JSON.stringify(data));
			appendDailyMotionVideo(data,type);
			// app.preloader.hide();
		},error:function(err) {
			app.preloader.hide();
			toaster('You are in Offline');
		}
	});	
}

function appendYouTubeData(data,type,tit) {
	
	var content = '';
	//content += '<input class="searchYouTubeVideo form-control" placeholder="Search" '+val+'/>';
	if(data.length > 0) {
		content += '<div class="row">';
		var cont = '';
		for (var i = 0; i < data.length; i++) {
			var title = data[i].snippet.title;
			var url = data[i].snippet.thumbnails.high.url;
			var date =  data[i].snippet.publishedAt.split('T');
		  	var id = url.split('/')[4];
		  	content += '<div class="col-100 medium-50 large-33 youtube-video"><div class="card album-card"><div style="background:url(assets/images/no-img.jpg) no-repeat center center / cover" class="card-header cover-img video-popup align-items-flex-end cover-img"><img class="playYouTubeVideo" data-id="https://www.youtube.com/embed/'+id+'" data-cap="'+title+'" src="'+url+'"><div class="play-icon"><i class="fa fa-play playYouTubeVideo" data-id="https://www.youtube.com/embed/'+id+'" data-cap="'+title+'"></i></div><span class="category">'+type+'</span></div><div class="card-content card-content-padding"><h3 class="mn playYouTubeVideo" data-id="https://www.youtube.com/embed/'+id+'" data-cap="'+title+'">'+title.substr(0,100)+'</h3><p><span>'+convertMonth(date[0])+'</span> <a href="#" data-msg="'+title+'" data-url="https://www.youtube.com/embed/'+id+'" class="pull-right shareLink"><i class="fa fa-share-alt"></i> Share</a></p></div></div></div>';
		}	
		content += '</div>';
	} else {
		content += '<div class="no-record">No record found</div>';
	}
	
	content += '</div>';
	//showPreLoader($('.appendVideo'),0);
	if(tit != 'all') {
		$('.appendVideo').html(content);
		//setTimeout(function(){if(tit=='Selfie re')getDailyMotionVideos(tit);	},1500);
	} else {
		$('.appendVideo').append(content);
	}
}

function searchYouTubeVideo(obj,searchField,searchVal) {
	var results = [];
	var searchField = searchField;
	var searchVal = searchVal.toLowerCase();
	for (var i=0 ; i < obj.length ; i++) {
		var str = (obj[i].snippet.title);
		if (typeof(str) != 'undefined' && (str.toLowerCase()).indexOf(searchVal) !== -1) {
	        results.push(obj[i]);
	    }
	}
	return results;
}

function searchNormal(obj,searchField,searchVal) {
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

function appendDailyMotionVideo(data,type) {
	
	var val = '';
	
	var content = '';
	//content += '<input class="searchDailyMotionVideo form-control" placeholder="Search" '+val+'/>';
	if(data.length > 0) {
		for (var i = 0; i < data.length; i++) {
			let returnDate = '';var url = '';
			content += '<div class="col-100 medium-50 large-33 dailymotion-video"><div class="card album-card"><div style="background:url(assets/images/no-img.jpg) no-repeat center center / cover ;)" class="card-header cover-img video-popup align-items-flex-end cover-img"><img class="playYouTubeVideo" data-id="https://www.dailymotion.com/embed/video/'+data[i].id+'" data-cap="'+data[i].title+'" src="https://www.dailymotion.com/thumbnail/video/'+data[i].id+'"/><div class="play-icon"><i class="fa fa-play playYouTubeVideo" data-id="https://www.dailymotion.com/embed/video/'+data[i].id+'" data-cap="'+data[i].title+'"></i></div><span class="category">Daily Motion</span></div><div class="card-content card-content-padding"><h3 data-id="https://www.dailymotion.com/embed/video/'+data[i].id+'" data-cap="'+data[i].title+'" class="mn playYouTubeVideo">'+data[i].title.substr(0,50)+'...</h3><p><span>'+returnDate+'</span> <a href="#" data-url="https://www.dailymotion.com/embed/video/'+data[i].id+'" data-msg="'+data[i].title+'" class="pull-right shareLink"><i class="fa fa-share-alt"></i> Share</a></p></div></div></div>';
		}
	} else {
		content += '<div class="no-record">No record found</div>';
	}
	if(type != 'all') {
		$('.appendVideo').html(content);
	} else {

		//showPreLoader($('.appendVideo'),0);
		$('.appendVideo').append(content);
	}
}

function loadSubscriptionBrowser() {
	//var device = {};
	//device.platform = 'iOS';
	var userDetails = JSON.parse(localStorage.getItem('userDetails'));
	var user_email = '';var user_id = '';
	//var data = {key:accessToken,user_email:userDetails.user_email,user_id:userDetails.user_id,type:'go_store'};
	if(typeof(device)!='undefined' && device.platform=='Android')
	{
		if(userDetails != null) {
			user_email = userDetails.user_email;
			user_id = userDetails.user_id;
			//OnlineStoreInappBrowser=cordova.InAppBrowser.open("https://api.hindutamil.in/app/index.php?type=go_store&key="+accessToken+"&user_email="+userDetails.user_email+"&user_id="+userDetails.user_id,'_self','location=yes,hideurlbar=yes,footer=no,closebuttoncolor=#FFFFFF,closebuttoncaption=Close,toolbarcolor=#00569d,navigationbuttoncolor=#FFFFFF');	
			
		}
		OnlineStoreInappBrowser=cordova.InAppBrowser.open("https://api.hindutamil.in/app/index.php?type=go_store&key="+accessToken+"&user_email="+user_email+"&user_id="+user_id,'_self','location=yes,hideurlbar=yes,footer=no,closebuttoncolor=#FFFFFF,closebuttoncaption=Close,toolbarcolor=#00569d,navigationbuttoncolor=#FFFFFF');
		if(userDetails != null) {
			
			OnlineStoreInappBrowser.addEventListener('exit',function(event){
				
				inBrowserClose();
			});
			
		}
				
		console.log("https://api.hindutamil.in/app/index.php?type=go_store&key="+accessToken+"&user_email="+user_email+"&user_id="+user_id);
		
	}
	else if(typeof(device)!='undefined' && device.platform=='iOS')
	{
		//OnlineStoreInappBrowser=cordova.InAppBrowser.open("https://api.hindutamil.in/app/index.php?type=go_store&key="+accessToken+"&user_email="+userDetails.user_email+"&user_id="+userDetails.user_id,'_blank','location=no,usewkwebview=yes,closebuttoncaption=Close,toolbar=yes,toolbarcolor=#00569d,closebuttoncolor=#FFFFFF,toolbarposition=top');	
		/*OnlineStoreInappBrowser = cordova.InAppBrowser.open("https://store.hindutamil.in/",'_blank','location=no,usewkwebview=yes,closebuttoncaption=Close,toolbar=yes,toolbarcolor=#00569d,closebuttoncolor=#FFFFFF,toolbarposition=top');
		OnlineStoreInappBrowser.addEventListener('exit',function(){
			inBrowserClose();
		});*/
		if(userDetails != null) {
			user_email = userDetails.user_email;
			user_id = userDetails.user_id;
		}
		app.panel.close();
		mainView.router.load({url:'pages/in-app-purchase.html'});
		/*if(moment().unix()>='1622831400') {
			OnlineStoreInappBrowser=cordova.InAppBrowser.open("https://api.hindutamil.in/app/index.php?type=go_store&key="+accessToken+"&user_email="+user_email+"&user_id="+user_id,'_blank','location=no,usewkwebview=yes,closebuttoncaption=Close,toolbar=yes,toolbarcolor=#00569d,closebuttoncolor=#FFFFFF,toolbarposition=top,navigationbuttoncolor=#FFFFFF,hidenavigationbuttons=no');
			if(userDetails != null) {
				OnlineStoreInappBrowser.addEventListener('exit',function(){
					inBrowserClose();
				});
			}
		}*/
	}
	
}

function inBrowserClose() {
	var userDetails = JSON.parse(localStorage.getItem('userDetails'));
	var password = JSON.parse(localStorage.getItem('userPassword'));
	var loginType = 0;
	var loginFrom = localStorage.getItem('loginFrom');
	if(loginFrom != null) {		
		loginType = 1;
	}
	
	if(userDetails != null) {
		var data = {key:"GsWbpZpD21Hsd",type:'login',email:userDetails.user_email,password:password,social:loginType};
		/*ajax call for login*/
		$.ajax({
			url:"https://api.hindutamil.in/app/index.php",
			method:'GET',
			dataType:'json',
			data:data,
			success:function(res) {
				// alert(JSON.stringify(res));
				
				if(res.msg == "success") {
					localStorage.getItem('userDetails',JSON.stringify(res.data));
					getAllMenus();
				}				
			},error:function(err) {
				toaster('You are in Offline');
			}
		});
	}
}

function getNotificationCount() {
	showNotifications(function(res) {
		// alert(JSON.stringify(res));
		if(res.length > 0) {
			$('.notificationCount').html('<span class="badge color-red">'+res.length+'</span>');
		}
	});
}

function getNotificationDetails(data) {
	localStorage.setItem('previousPage','notify-details');
	app.preloader.show();
	$('#mid').val(data.mid);
	$('#aid').val(data.aid);
	data.key = accessToken;
	data.type = 'article';
	// $('.navToCommentPage').prepend('');
	var login = JSON.parse(localStorage.getItem('userDetails'));
	/*ajax call*/
	$.ajax({
		url:apiUrl,
		method:'GET',
		dataType:'json',
		data:data,
		success:function(res) {
			
			if(res.msg == 'success'){ 
				var data = res.data;
				if(data != null) {
					if(typeof(cordova) != 'undefined') {
						setfirebaseAnalytics({page:'Notification detail page',property:{content_type: "Notification detail page", item_id:{aid:data.aid,category:data.cate_ta,title:data.title_ta,description:data.desc_ta}}});
					}
					
					var attribute = JSON.stringify(data);
					var attribute = JSON.stringify({aid:data.aid,cid:data.cid,category:data.cate_ta,web_url:data.web_url,title:data.title_ta,description:data.desc_ta,image:data.img});
					var emoteSum = 0;
					emoteSum += data.emote.e1;
					emoteSum += data.emote.e2;
					emoteSum += data.emote.e3;
					emoteSum += data.emote.e4;
					emoteSum += data.emote.e5;
					emoteSum += data.emote.e6;
					var emotes = data.emote;
					$('#msg').val(data.title_ta);
					$('.shareLink').attr('data-msg',data.title_ta);
					$('.addTitle').html('<span>'+data.cate_ta+'</span>');
					var content = '';
					content += "<div id='div-gpt-ad-1605624284210-1' class='text-center' ></div>";
					var pass = {aid:data.aid,a_url:data.web_url,a_title:data.title_ta};
					//getCommentList({aid:data.aid});
					$('.addBottomTab').append('<div class="news-share" style="display: none;"><ul><li class="fb shareViaWhatsApp" data-type="facebook" data-url="'+data.web_url+'" data-msg="'+data.title_ta+'"><a href="#"><i class="fab fa-facebook"></i></a></li><li class="twt shareViaWhatsApp" data-type="twitter" data-url="'+data.web_url+'" data-msg="'+data.title_ta+'"><a href="#"><i class="fab fa-twitter"></i></a></li><li class="wtsap shareViaWhatsApp" data-type="whatsapp" data-url="'+data.web_url+'" data-msg="'+data.title_ta+'"><a href="#"><i class="fab fa-whatsapp"></i></a></li></ul></div><div class="all_data" style="display:none;">'+attribute+'</div>');
					content += '<div class="card-header"><h4>'+data.title_ta+'</h4></div><div class="card-content card-content-padding"><img src="'+data.img+'" class="article-image" onerror="this.src=\'assets/images/no-img.jpg\'" /></div><div class="card-footer"><div class="uavatar"><img src="assets/images/admin.jpg" onerror="this.src=\'assets/images/no-img.jpg\'" width="34" height="34"/></div><div class="uname">'+data.author+'</div><div class="udate">'+convertMonth(data.created)+'</div><div class="share_news"><ul><li><a href="javascript:void(0)" class="facebook shareViaWhatsApp" data-type="facebook" data-url="'+data.web_url+'" data-msg="'+data.title_ta+'"><i class="fab fa-facebook"></i></a></li><li><a href="javascript:void(0)" class="whatsapp shareViaWhatsApp" data-type="whatsapp" data-url="'+data.web_url+'" data-msg="'+data.title_ta+'"><i class="fab fa-whatsapp"></i></a></li><li><a href="javascript:void(0)" class="twitter shareViaWhatsApp" data-type="twitter" data-url="'+data.web_url+'" data-msg="'+data.title_ta+'"><i class="fab fa-twitter"></i></a></li></ul></div></div>';
					$('.addNewsDetailHeader').html(content+'<div id=\'div-gpt-ad-1605624597553-1\' class=\'text-center\' ></div>');
					$('.page-current .newsDetailDescription').html(data.desc_ta+'<div style="overflow-x:auto;">'+data.content+'</div>');
					$('.page-current .newsDetailDescription').find('img').removeAttr('width');
					$('.page-current .newsDetailDescription').find('img').removeAttr('height');
					$('.page-current .newsDetailDescription').find('img').addClass('article-image');
					setTimeout(function(){refreshAds('article_page_ad_1');  },1500);
					// localStorage.setItem('articleDetails',JSON.stringify(pass));
				} else {
					$('.page-current .newsDetailDescription').html('<div class="no-record">No records found</div>');
					$('.right').find('a').hide();
					$('.page-current .block-title').find('h2').hide();
				}
				app.preloader.hide();
				loader(2);
				window.googletag.pubads().refresh();
			} else {
				toaster(res.msg);
				loader(2);
			}
		},error:function(err) {
			toaster('You are in Offline');
		}
	});	
}

function notificationSubmit() {
	var notificationTopics = ['tamilnadu','india','sports','cinema','world','business','science-technology','crime','supplements','spirituals','videos','album','corona-virus','vetrikodi','opinion','kamadenu','discussion','blogs','breaking-news','promo'];
	unsubscribeTopics(0,notificationTopics,function(){
		notiSet = [];
		$('input[name="demo-checkbox[]"]:checked').each(function(index,value){
			notiSet.push($(value).val());
		});
		localStorage.setItem('notificationSettings',JSON.stringify(notiSet));
		subscribeTopics(0,notiSet,function() {
			toaster('Notification settings updated successfully');
		});
	});
}

function notificationSubmit2() {
	var notiSet = JSON.parse(localStorage.getItem('notificationSettings'));
	notiSet = ['tamilnadu','india','sports','cinema','world','business','science-technology','crime','supplements','spirituals','videos','album','corona-virus','vetrikodi','opinion','kamadenu','discussion','blogs','breaking-news','promo'];
	/*unsubscribeTopics(0,notiSet,function(){
		notiSet = [];
		$('input[name="demo-checkbox[]"]:checked').each(function(index,value){
			notiSet.push($(value).val());
		});
		console.log('2181',notiSet);
		subscribeTopics(0,notiSet,function() {
			toaster('Notification settings updated successfully');
		});
	});*/
	//for(var j = 0;j < 2;j++) {
		for(var i = 0;i < notiSet.length;i++) {
			window.FirebasePlugin.unsubscribe(notiSet[i]);
			/*if(typeof(cordova) != 'undefined') {
				if(cordova.platformId == 'android') {
					window.FirebasePlugin.unsubscribe(notiSet[i]);
				} else {
					FirebasePlugin.unsubscribe(notiSet[i], function(){
						
					}, function(error){
						 console.error("Error subscribing to topic: " + error);
					});
				}
			}*/
		}
	//}
	
	var notiSet = [];
	$('input[name="demo-checkbox[]"]:checked').each(function(index,value){
		notiSet.push($(value).val());
	});
	if(notiSet.length == 0) {
		toaster('Please select atleast one category');return false;
	}
	localStorage.setItem('notificationSettings',JSON.stringify(notiSet));
	//for(var j = 0;j < 2;j++) {
		for(var i = 0;i < notiSet.length;i++) {
			window.FirebasePlugin.subscribe(notiSet[i]);
			/*if(typeof(cordova) != 'undefined') {
				if(cordova.platformId == 'android') {
					window.FirebasePlugin.subscribe(notiSet[i]);
				} else {
					FirebasePlugin.subscribe(notiSet[i], function(){
						
					}, function(error){
						 console.error("Error subscribing to topic: " + error);
					});
				}
			}*/
		}
	//}
	
	if(notiSet.length == i) {
		toaster('Notification settings updated successfully');return false;
	}
	/*subscribeTopics(0,checkedTopics,function(){
		toaster('Notification settings updated successfully');
	});*/
}

function subscribeTopics(key,topics,callback)
{
	topic=topics[key];
	if(typeof(topic)!='undefined')
	{
		if(typeof(cordova) != 'undefined') {
			if(cordova.platformId == 'android') {
				window.FirebasePlugin.subscribe(topic,function(){
					if(key==(topics.length-1))
						callback(true);
					else
						subscribeTopics((key+1),topics,callback);
				},function(){
					if(key==(topics.length-1))
						callback(true);
					else
						subscribeTopics((key+1),topics,callback);
				});
			} else {
				FirebasePlugin.subscribe(topic, function(){
					if(key==(topics.length-1))
						callback(true);
					else
						subscribeTopics((key+1),topics,callback);
				}, function(error){
					 if(key==(topics.length-1))
							callback(true);
						else
							subscribeTopics((key+1),topics,callback);
				});
			}
		}
	}
}
function unsubscribeTopics(key,topics,callback)
{
	topic=topics[key];
	if(typeof(cordova) != 'undefined') {
		if(cordova.platformId == 'android') {
			window.FirebasePlugin.unsubscribe(topic,function(){
				if(key==(topics.length-1))
					callback(true);
				else
					unsubscribeTopics((key+1),topics,callback);
			},function(){
				if(key==(topics.length-1))
					callback(true);
				else
					unsubscribeTopics((key+1),topics,callback);
			});
		} else {
			FirebasePlugin.unsubscribe(topic, function(){
				if(key==(topics.length-1))
					callback(true);
				else
					unsubscribeTopics((key+1),topics,callback);
			}, function(error){
				 if(key==(topics.length-1))
						callback(true);
					else
						unsubscribeTopics((key+1),topics,callback);
			});
		}
	}
}

function notificationSettings() {
	var notiSet = [];
	var noti = JSON.parse(localStorage.getItem('notificationSettings'));
	
	var notificationToggle = JSON.parse(localStorage.getItem('notificationToggle'))
	
	if(noti != null) {
		if(noti.length>0)
		{
			$('.saveNotificationHolder').show();
			$('.get-all-notification').attr('checked','checked');
		}
		else
		{
			$('.saveNotificationHolder').hide();
			$('.get-all-notification').removeAttr('checked');
		}
		notiSet = noti;
		$('input[name="demo-checkbox[]"]').removeAttr('checked');
		$('input[name="demo-checkbox[]"]').each(function(index,value){
			var element = $(value).val();
			if(notiSet.indexOf(element) !== -1){
		        $(value).prop('checked',true);
		    }
		});
		if(notificationToggle == false) {
			$('.get-all-notification').removeAttr('checked');
			$('input[name="demo-checkbox[]"]').each(function(index,value){
				$(value).prop('checked',false);
			});
		}
	} else if((noti == null) && (notificationToggle == false)) {
		$('.get-all-notification').removeAttr('checked');
		$('input[name="demo-checkbox[]"]').each(function(index,value){
			$(value).prop('checked',false);
		});
	}

	/* else if(notificationToggle == 'false' || notificationToggle == false) {
		console.log('notificationToggle',notificationToggle);
		$('.get-all-notification').removeAttr('checked');
		$('input[name="demo-checkbox[]"]').each(function(index,value){
			$(value).prop('checked',false);
		});
	}*/
	
	// $('input[name="demo-checkbox[]"]').attr('checked');
	
}

function loadNewsDetailMenus() {
	var swiperHome='';
	/*save bookmark*/
	$(document).on('click touchend','.saveBookMark',function() {
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
			/*ajax call for save bookmark*/
			$.ajax({
				url:apiUrl,
				method:'GET',
				dataType:'json',
				data:data,
				success:function(res) {
					if(res.msg == 'success') {
						app.popover.close();
						app.preloader.hide();
						toaster('Bookmark added successfully');
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

	$(document).on('click','.redirectToNotiDetails',function() {
		var aid = $(this).attr('data-aid');
		mainView.router.load({url:'pages/notify-details.html?aid='+aid});
	});

	$(document).on('click','#notificationSubmit',function() {
		notificationSubmit();
	});

	/*$(document).on('click','.showSubcription',function() {
		var login = checkSession();
		if(login) {
			var userDetails = JSON.parse(localStorage.getItem('userDetails'));
			
			var data = {key:accessToken,user_email:userDetails.user_email,user_id:userDetails.user_id,type:'go_store'};
			if(typeof(device)!='undefined' && device.platform=='Android')
			{
				OnlineStoreInappBrowser=cordova.InAppBrowser.open("https://api.hindutamil.in/app/index.php?type=go_store&key="+accessToken+"&user_email="+userDetails.user_email+"&user_id="+userDetails.user_id,'_self','location=yes,hideurlbar=yes,footer=no,closebuttoncolor=#FFFFFF,closebuttoncaption=Close,toolbarcolor=#00569d,navigationbuttoncolor=#FFFFFF');	
				OnlineStoreInappBrowser.addEventListener('exit',function(){
					inBrowserClose();
				});
			}
			else if(typeof(device)!='undefined' && device.platform=='iOS')
			{
				OnlineStoreInappBrowser=cordova.InAppBrowser.open("https://api.hindutamil.in/app/index.php?type=go_store&key="+accessToken+"&user_email="+userDetails.user_email+"&user_id="+userDetails.user_id,'_blank','location=no,usewkwebview=yes,closebuttoncaption=Close,toolbar=yes,toolbarcolor=#00569d,closebuttoncolor=#FFFFFF,toolbarposition=top');	
				OnlineStoreInappBrowser.addEventListener('exit',function(){
					inBrowserClose();
				});
			}
			
		}	
	});*/
	$(document).on('click','.showSubcription',function() {
		loadSubscriptionBrowser();	
	});

	$(document).on('click','.popover-open[data-popover=".font-settings"]',function(){
		setTimeout(function(){app.popover.open('.font-settings','.popover-open[data-popover=".popover-links"]');},500);
	});

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

	$(document).on('keyup','.videoSearchOption',function() {
		var val = $('.videoSearchOption').val();
		if(typeof(cordova) != 'undefined') {		
			setfirebaseAnalytics({page:'Video search page',property:{content_type: "Video search page", item_id:'Video search page'}});
		}
		
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

	$(document).on('click','.playYouTubeVideo',function() {
		var id = $(this).attr('data-id');
		var cap = $(this).attr('data-cap');
		
		
		initAlbum([{
	        //html: '<iframe src="'+id+'?autoplay=1&enablejsapi=1&mute=1" allow="autoplay" autoplay="1"></iframe>',
	        html:'<iframe src="'+id+'?	rel=0&autoplay=1" allow="autoplay;" autoplay="1"></iframe>',
	        caption:cap+'<div class="share_news"><ul><li><a href="javascript:void(0)" class="shareForAll" data-msg="'+cap+'" data-url="'+id+'"><i class="fa fa-share-alt"></i></a></li></ul></div>'
	    }],1);
	});

	/*$(document).on('click','.getVideoDetails',function() {
		// localStorage.removeItem('youTubeVideos');
		$('.videoSearchOption').val('');
		var type = $(this).attr('data-type');
		if(typeof(type) != 'undefined' && type != '') {
			getVideos(type);
			$(".video-category").animate({scrollLeft: $('.getVideoDetails.color-blue').position().left-20}, 1000);
		}
	});*/
	
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

	$(document).on('click','.forgotPassword',function() {
		if(!checkEmpty('#f_email')) {
			toaster('Enter email');
		} else if(!isEmail($('#f_email').val())) {
			toaster('Enter valid email id');
		} else {
			forgotPassword($('#f_email').val());
		}
	});

	$(document).on('click','.deleteNotification',function() {
		var id = ($(this).attr('data-id'));
		var aid = ($(this).attr('data-aid'));
		aid=typeof(aid)!='undefined'?aid:'';
		app.dialog.confirm('Are you sure want to delete?','Confirmation!',function(){
			app.preloader.show();
			var data = {id:id};
			deleteNotification(data,function(res) {
				app.preloader.hide();
				if(localStorage.lastNotificationID==aid)
					localStorage.lastNotificationID='';
				if(res.status) {
					toaster('Deleted successfully');	

					getAllNotifications();
				} else {
					toaster('Deletion failed');	
				}
			});
		});
	});

	$(document).on('click','.showAlbums',function() {
		var title = $(this).attr('data-type');
		
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
	$(document).on('click','.getKamaDenuInterior',function(){
		var aid = $(this).attr('data-aid');
		mainView.router.load({url:'pages/kamadenu-interior.html?aid='+aid});
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
	});


	$(document).on('click','.closeComment',function() {
		app.popup.close('.postNewsComment');
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

	$(document).on('click','.otherNewsSearchLoadMore',function() {
		$('.otherNewsSearchLoadMore').remove();
		newsSearchPageNo++;
		var data = {page:newsSearchPageNo,value:$('.homePageSearch').val()}; 
		getNewsSerachResult(data);
	});

	$(document).on('keyup paste','.homePageSearch',function(e) {
		// showPreLoader($('.searchResult'),1);
	
		var value = $('.homePageSearch').val();
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
		//alert(data.content_type);
		if(data.content_type=='free'){
			insertArticleDetails(data);
		}else if(data.content_type=='login_required' && login.user_id!='' ){
			insertArticleDetails(data);
		}else if(data.content_type=='login_required' && login.user_id=='' ){
			toaster('For Premium Article. Please login to save article');
		}else if(data.content_type=='paid' && login.user_id!='' && login.user_access.web_access==1){
			insertArticleDetails(data);
		}else if(data.content_type=='paid' && login.user_id==''){
			toaster('For Paid Article. Please subscribe save article');			
		}else{
			insertArticleDetails(data);
		}
	});

	$(document).on('click','.emoteSubmit',function() {
		var userDetails = JSON.parse(localStorage.getItem('userDetails'));
		/*if(userDetails == null && !checkEmpty('.postName') && !checkEmpty('.postEmail')) {
			app.popup.open('.my-login-screen');return false;
		}*/
		var thiz = $(this);
		var aId = ($('#aid').val());
		thiz.addClass('voted');
		setTimeout(function() {
			var emojiId = $('.selectEmoji').find('a.voted').data('value');
			console.log('emojiId');
			console.log(emojiId);
			if(userDetails != null){
				userId = userDetails.user_id;
			} else {
				var deviceDetail = JSON.parse(localStorage.getItem('deviceDetails'));
				userId = deviceDetail.uuid;
			}
			$('.emoteSubmit').find('a').addClass('voted');
			emotesSubmit(aId,emojiId,userId);
		},500);
		
		/*$(this).addClass('voted');
		var aId = ($('#aid').val());
		var emojiId = $('.selectEmoji').find('a.voted').data('value');
		if(userDetails != null){
			userId = userDetails.user_id;
		} else {
			var deviceDetail = JSON.parse(localStorage.getItem('deviceDetails'));
			userId = deviceDetail.uuid;
		}
		$('.emoteSubmit').find('a').addClass('voted');
		emotesSubmit(aId,emojiId,userId);*/
		
	});

	$(document).on('click','.shareViaWhatsApp',function() {
		var link = $(this).attr('data-url');
		var msg = $(this).attr('data-msg');
		var type = $(this).attr('data-type');
		var img = $(this).attr('data-img');
		// alert(img);
		if(type == 'twitter') {
			shareViaTwitter(msg,link,img);
		} else if(type == 'whatsapp') {
			shareViaWhatsApp(msg,link,img);
		} else if(type == 'facebook') {
			shareViaFacebook(msg,link,img);
		}
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

	$(document).on('click','.selectCategoryVideo',function() {
		var type = $(this).attr('data-type');
		getVideos(type);
	});

	/*open photo gallery*/
	$(document).on('click','.openPhotoBrowser',function(){
		// var images=$(this).find('.card-header').data('image');
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
		/*initiate album*/
		initAlbum(images);
	});

	var $$ = Dom7;

	$(document).on('click','.getAlbumFullCaption',function() {
		$('.hideAlbumDescription').hide();
		$('.showAlbumDescription').show();
	});

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

	/*Add new comment*/
	$(document).on('click','.addComment',function() {
		/*var userDetails = JSON.parse(localStorage.getItem('userDetails'));
		if(userDetails == null) {
			toaster('Please login to your account!');return false;
		} else {*/
		// var login = checkSession();
		// console.log(login);
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
		// console.log(login);
		// if(login) {
			var deviceDetails = JSON.parse(localStorage.getItem('deviceDetails'));
			var userDetails = JSON.parse(localStorage.getItem('userDetails'));
			var userId = deviceDetails.uuid;

			if(userDetails != null) {
				userId = userDetails.user_id;
			}

			app.preloader.show();
			var deviceDetails = JSON.parse(localStorage.getItem('deviceDetails'));
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

	/*post comment*/
	/*$(document).on('click','.postComment',function() {

		var reply = $('#comment_id').val();
		var userDetails = JSON.parse(localStorage.getItem('userDetails'));	
		if(userDetails != null) {
			if(!checkEmpty('#comment')) {
				toaster('Enter comment');
			} else {
				userDetails.reply = reply;
				postComment($('#comment').val(),userDetails);
			}	
		} else {
			if(!checkEmpty('.postName')) {
				toaster('Enter your name');
			} else if(!checkEmpty('.postEmail')) {
				toaster('Enter Email');
			} else if(!isEmail($('.postEmail').val())) {
				toaster('Enter valid email id');
			} else if(!checkEmpty('#comment')) {
				toaster('Enter your description');
			} else {
				var data = {name:$('.postName').val(),email:$('.postEmail').val(),type:'comments'};
				userRegViaCommentPost(data);
			}
		}
	});*/
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

	/*add feedback*/
	$(document).on('click','.addFeedBack',function() {
		/*call function for adding feedback*/
		addFeedback();
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
			app.preloader.show();
			/*ajax call for delete bookmark*/
			$.ajax({
				url:apiUrl,
				method:'GET',
				dataType:'json',
				data:data,
				success:function(res) {
					if(res.msg == "success") {
						getSavedStories();
						toaster('Deleted successfully');	
						app.preloader.hide();
					} else {
						toaster(res.msg);	
						app.preloader.hide();
					}
				},error:function(err) {
					toaster('You are in Offline');	
				}
			});	
		});	
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

	/*navigate page from setting*/
	$(document).on('click','.navToRespectivePage',function() {
		var page = $(this).attr('data-page');
		var userDetails = JSON.parse(localStorage.getItem('userDetails'));
		if(page == 'rate_this_app') {
			rateTheApp();
		} else if(page == 'logout') {
			localStorage.removeItem('userDetails');
			var loginType = localStorage.getItem('loginFrom');
			if(loginType == 'google') {
				googleLogout();
			} else if(loginType == 'facebook') {
				facebookLogout();	
			}
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

	$(document).on('click','.noContent',function() {
		var cID=$(this).data('cid');
		var mID=$(this).data('mid');
		/*alert(mID);
		alert(cID);*/
		if(mID == 2 && cID == 0) {
			app.panel.close();
			mainView.router.load({url:'pages/kamadenu.html'});
		} else {
			toaster("Sorry! No content found");	
		}	
	});

	$(document).on('click touchend','.moveToTab',function() {
		var cID=$(this).data('cid');
		var mID=$(this).data('mid');
		var sID=$(this).data('sid');
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

	/*$(document).on('click','.addEmotesFromArticlePage',function() {
		$('.selectEmoji').find('a').removeClass('voted');
		var emotes = JSON.parse(localStorage.getItem('emote'));
		
		var login = JSON.parse(localStorage.getItem('userDetails'));
		var input = '<div class="close-screen"><a href="#" class="popup-close">&times;</a></div><h2>What is your reaction?</h2>';
		if(login == null) {
			input += '<div class="form-group"><input type="text" class="form-control postName" name="" id="" placeholder="Enter Your Name"/></div><div class="form-group"><input type="email" class="form-control postEmail" name="" id="" placeholder="Enter Email"/></div>';
		}
		input += '<div class="form-group"><ul class="emoji"><li class="selectEmoji"><a href="#" data-value="1" class=""><img src="assets/images/emoji/excited.png" onerror="this.src=\'assets/images/no-img.jpg\'" alt=""> <span>Excited<br>'+emotes.e1+'%</span></a></li><li class="selectEmoji"><a href="#" data-value="2" class=""><img src="assets/images/emoji/great.png" onerror="this.src=\'assets/images/no-img.jpg\'" alt=""> <span>Great<br>'+emotes.e2+'%</span></a></li><li class="selectEmoji"><a href="#" data-value="3" class=""><img src="assets/images/emoji/unmoved.png" onerror="this.src=\'assets/images/no-img.jpg\'" alt=""> <span>Unmoved<br>'+emotes.e3+'%</span></a></li><li class="selectEmoji"><a href="#" data-value="4" class=""><img src="assets/images/emoji/shocked.png" onerror="this.src=\'assets/images/no-img.jpg\'" alt=""> <span>Shocked<br>'+emotes.e4+'%</span></a></li><li class="selectEmoji" ><a href="#" class="" data-value="5"><img src="assets/images/emoji/sad.png" onerror="this.src=\'assets/images/no-img.jpg\'" alt=""> <span>Sad<br>'+emotes.e5+'%</span></a></li><li class="selectEmoji"><a href="#" data-value="6" class=""><img src="assets/images/emoji/angry.png" alt="" onerror="this.src=\'assets/images/no-img.jpg\'"> <span>Angry<br>'+emotes.e6+'%</span></a></li></ul></div><div class="form-group"><button class="button button-block button-fill emoteSubmit" name="" id="">Submit</button></div>';
		
		$('.postCommentWithoutLogin').html(input);
		app.popup.open('.postNewsComment');
	});*/

	$(document).on('click','.addEmotesFromArticlePage',function() {
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
	});

	$(document).on('click','.selectEmoji',function() {
		$('.selectEmoji').find('a').removeClass('voted');
		$(this).find('a').addClass('voted');
	});

	/*get home page details*/
	$(document).on('click','#getHomePage',function() {
		//$('.showHomePageDetails').html('');
		/*get home page details*/
		$('.categoryMenu .tab-link').removeClass('tab-link-active');
		$(this).addClass('tab-link-active');
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
		//googleDFPTag();
		/*get other pages*/
		getOtherPageDetails(id,mId,cId,sid);

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
			toaster('Old password not same as new password');
		} else {
			/*calling function for change password*/
			changePassword($('#current_password').val(),$('#new_password').val());
		}
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
			}
		}
	});

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
			userLogin($('#user_name').val(),$('#password').val(),0);	
		}
	});

	/*Login via facebook*/
	$(document).on('click','.loginViaFacebook',function() {
		facebookLogin();
	});

	/*social sharing*/
	$(document).on('click','.shareLink',function() {
		var url = (typeof($(this).attr('data-url')) != 'undefined') ? $(this).attr('data-url') : $('#web_url').val();
		var msg = (typeof($(this).attr('data-msg')) != 'undefined') ? $(this).attr('data-msg') : $('#msg').val();
		if(typeof(url) != 'undefined') {
			shareSocial(url,msg);
		}
	});

	/*login user via google*/
	$(document).on('click','.loginViaGoogle',function() {
		googleLogin();
	});

	/*$(document).on('click','.share-link',function() {
		$('.news-share').toggle();
	});*/

	$('.loginEye').html('<i class="fa fa-eye-slash"></i>');
	$('.registerEye').html('<i class="fa fa-eye-slash"></i>');
	$('.registercEye').html('<i class="fa fa-eye-slash"></i>');

	/*$('.share-link').click(function(e){
        e.preventDefault();
        e.stopPropagation(); 
        
    });
    $('.news-share').click( function(e) {
        e.stopPropagation();
    });*/
    /*$('body').click( function() {       
        $('.news-share').hide();        
    });*/

	/*show user name with and without login*/
	$('.showUserName').html('<h5 class="user-name ">WELCOME <br><span>Guest</span></h5><a href="#" data-login-screen=".my-login-screen" class="mt-16 button button-small button-block button-round button-outline color-white panel-close login-screen-open">LOGIN OR REGISTER</a>');
	if((userDetails != null)) {
		$('.showUserName').html('<h5 class="user-name ">WELCOME <br><span>'+userDetails.user_name+'</span></h5>');
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
			cordova.plugins.market.open('search?q=hindu+tamil+newspaper&c=apps&hl=en');
		} else if(cordova.platformId == 'ios') {
			cordova.plugins.market.open('https://apps.apple.com/app/hindutamil/id1496636417');
		}
	});
	
	$(document).on('click','.navToNewsDetailPage',function() {
		var aid = $(this).attr('data-aid');
		$('#div-gpt-ad-1605624284210-1,#div-gpt-ad-1605624597553-0,#div-gpt-ad-1605624566043-100,#div-gpt-ad-1605624482177-100').remove();
		//window.googletag.destroySlots();
		setTimeout(function(){
			mainView.router.load({url:'pages/news-detail.html?back=false&aid='+aid});
		},500);
	});
	
	app.on('tabShow',function(){	
		$(document).off("scroll");
		setTimeout(function(){
			var myScrollPos = $('.categoryMenu a.tab-link-active').offset().left + $('.categoryMenu a.tab-link-active').outerWidth(true)/2 + $('.categoryMenu').scrollLeft() - $('.categoryMenu').width()/2;
			$('.categoryMenu').scrollLeft(myScrollPos);
		},300);
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
		if(typeof(aid) != 'undefined')
			mainView.router.load({url:'pages/comments.html?aid='+aid});
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
	$(document).on('change','.notification-topics-listing input[type="checkbox"]',function() {
		if($('input[name="demo-checkbox[]"]:checked').length>0)
			$('.saveNotificationHolder').show();
		else
			$('.saveNotificationHolder').hide();
	});
	/*$(document).on('change','.get-all-notification',function() {
		var notificationTopics = ['tamilnadu','india','sports','cinema','world','business','science-technology','crime','supplements','spirituals','videos','album','corona-virus','vetrikodi','opinion','kamadenu','discussion','blogs','breaking-news','promo'];
		
		if($(this).is(':checked')) {
			$('input[name="demo-checkbox[]"]').each(function(index,value){
				$(value).prop('checked',true);
			});
			subscribeTopics(0,notificationTopics,function() {
				$('.saveNotificationHolder').show();
				toaster('Notification switched ON successfully');
				var notiSet=[];
				$('input[name="demo-checkbox[]"]:checked').each(function(index,value){
					notiSet.push($(value).val());
				});
				localStorage.setItem('notificationSettings',JSON.stringify(notiSet));
			});
		} else {
			$('input[name="demo-checkbox[]"]:checked').each(function(index,value){
				$(value).prop('checked',false);
			});
			localStorage.setItem('notificationSettings',JSON.stringify([]));

			unsubscribeTopics(0,notificationTopics,function(){
				$('.saveNotificationHolder').hide();
				toaster('Notification switched OFF successfully');
			});
		}
	});*/
	
	$(document).on('change','.get-all-notification',function() {
		var notificationTopics = ['tamilnadu','india','sports','cinema','world','business','science-technology','crime','supplements','spirituals','videos','album','corona-virus','vetrikodi','opinion','kamadenu','discussion','blogs','breaking-news','promo'];
		localStorage.setItem('notificationToggle',$(this).is(':checked'));
		
		if($(this).is(':checked')) {
			$('input[name="demo-checkbox[]"]').each(function(index,value){
				$(value).prop('checked',true);
				$(value).prop('disabled',false);
			});
			subscribeTopics(0,notificationTopics,function() {
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
				getEmagazineList({show:1});
				getPurchasedBookCount();
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
		var object = {issue_id:issueId,url:url,file_name:fileName,mid:modId,type:'pdf',image:img,password:password,file_extention:'.pdf',title:title,show_button:button};
		localStorage.setItem('pdfViewer',JSON.stringify(object));
		if(userDetails != null) {
			if(userDetails.user_access.emagazine == 1) {
				app.preloader.show();
				if(type == 'read') {
					trackUserStatus({mid:modId,issue_id:issueId,user_id:userDetails.user_id,do:'books',act:1,password:password,url:url},function(res) {
						app.preloader.hide();
						if(res.msg == "success") {
							thiz.closest('div').find('.emagazineButton').replaceWith('<button class="button button-fill button-small button-block color-green emagazineButton viewMagzineDetail" '+attr+' data-type="save" data-file-name="'+fileName+'">Save Offline</button>');
							mainView.router.load({url:'pages/book-viewer.html?url='+url+'&password='+password+'&heading='+heading});
						} else {
							toaster('Unable to view file');
						}
					});
				} else if(type == 'save') {
					fileDownload({issue_id:issueId,url:url,file_name:fileName,mid:modId,type:'pdf',image:img,password:password,file_extention:'.pdf',title:title},function(res) {
						app.preloader.hide();
						if(res.status) {
							thiz.closest('div').find('.emagazineButton').replaceWith('<button class="button button-fill button-small button-block color-red emagazineButton viewMagzineDetail" data-type="stored" '+attr+'>Saved</button>');
							toaster('File downloaded successfully');
						} else {
							toaster('File already exists');
						}
						mainView.router.load({url:'pages/book-viewer.html?url='+url+'&password='+password+'&heading='+heading});
					});
				} else if(type == 'stored') {
					app.preloader.hide();
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
				app.preloader.show();
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
						app.preloader.hide();
						if(res.msg == "success") {
							mainView.router.load({url:'pages/book-viewer.html?url='+pdf+'&password=&heading='+heading});
						} else {
							toaster('Unable to view file');
						}
					});
				} else {
					app.preloader.hide();
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
		app.preloader.show();
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
		var object = {issue_id:issueId,url:url,file_name:fileName,mid:10,type:'epub',image:img,password:'',file_extention:'.epub',title:title,show_button:button};
		localStorage.setItem('pdfViewer',JSON.stringify(object));
		if(userDetails != null) {
			if(type == 'read') {
				trackUserStatus({mid:10,issue_id:issueId,user_id:userDetails.user_id,do:'books',act:1},function(res) {
					app.preloader.hide();
					if(res.msg == "success") {
						thiz.closest('div').find('.ebookbutton').replaceWith('<button class="button button-fill button-small button-block color-green ebookbutton viewEpubFile" data-type="save" data-file-name="'+fileName+'.epub" data-img="'+img+'" '+attr+'>Save Offline</button>');
						mainView.router.load({url:'pages/wow-book.html?url='+url+'&heading='+heading});
					} else {
						toaster('Unable to view file');
					}
				});
			} else if(type == 'stored') {
				app.preloader.hide();
				mainView.router.load({url:'pages/wow-book.html?url='+url+'&heading='+heading});
			} else if(type == 'save') {
				fileDownload({issue_id:issueId,url:url,file_name:fileName,mid:10,type:'epub',image:img,file_extention:'.epub',title:title},function(res) {
					app.preloader.hide();
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
				app.preloader.show();
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
						app.preloader.hide();
						if(res.msg == "success") {
							thiz.closest('div').find('.ePaperButton').replaceWith('<button class="button button-fill button-small button-block color-green e-paper-track-button" data-type="save" '+attr+'>Save Offline</button>');
							mainView.router.load({url:'pages/book-viewer.html?url='+pdf+'&password=&heading='+heading});
						} else {
							toaster('Unable to view file');
						}
					});
				} else if(type == 'save') {
					fileDownload({issue_id:editionId,url:pdf,file_name:fileName,mid:mId,type:'paper',image:img,password:'',file_extention:'.pdf',title:title},function(res) {
						app.preloader.hide();
						if(res.status) {
							thiz.closest('div').find('.ePaperButton').replaceWith('<button class="button button-fill button-small button-block color-red e-paper-track-button" data-type="stored" '+attr+'>Saved</button>');
							toaster('File downloaded successfully');
						} else {
							toaster('File already exists`');
						}
						mainView.router.load({url:'pages/book-viewer.html?url='+pdf+'&password='+password+'&heading='+heading});
					});				
				} else if(type == 'stored') {
					app.preloader.hide();
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
	
	/*$(document).on('click','.pdf-canvas',function() {
		var css = $('.pdf-toolbar').css('display');
		if(css == 'none') {
			$('.pdf-toolbar').slideDown();
		} else {
			$('.pdf-toolbar').slideUp();
		}
	});*/
	
	$(document).on('click','.moveFileToDir',function() {
		console.log('Move file to sirectory');
		var fileName = $(this).data('file-name');
		var password = $(this).data('password');
		moveFile({file_name:fileName,password:password});
	});

	$(document).on('click','.showStorageLocation',function() {
		app.popup.open('.file-storage-location');
	});
}

/*function createGoogleAds() {
	var admobid = {};
	var bannerType = 'FULL_BANNER';
	  if( /(android)/i.test(navigator.userAgent) ) {
		  bannerType = 'FULL_BANNER';
	    admobid = { // for Android
	      banner: 'ca-app-pub-9693451887247156/6821381181',
	      interstitial: 'ca-app-pub-9693451887247156/8235562878',
	      rewardvideo: 'ca-app-pub-3940256099942544/5224354917',
	    };
	  } else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
		  bannerType = 'SMART_BANNER';
	    admobid = { // for iOS
	      banner: 'ca-app-pub-9693451887247156/4355834094',
	      interstitial: 'ca-app-pub-9693451887247156/5253148648',
	      rewardvideo: 'ca-app-pub-3940256099942544/1712485313',
	    };
	  } else {
	    admobid = { // for Windows Phone, deprecated
	      banner: '',
	      interstitial: '',
	      rewardvideo: '',
	    };
	  }
	if(typeof(AdMob) != 'undefined') {
		AdMob.createBanner( {
		adId:admobid.banner, 
		position: AdMob.AD_POSITION.BOTTOM_CENTER,
		overlap:false, 
		adSize: bannerType,
		bgColor:'#FFFFFF',
		// position:AdMob.AD_POSITION.POS_XY, x:100, y:200, 
		autoShow:true},function(success) {
			
		},function(err) {
			
		});
		AdMob.prepareInterstitial( {adId:admobid.interstitial, autoShow:false} );
	}
}*/
// console.log(moment("2021-11-30").unix());
function createGoogleAds() {
	console.log('Loading google ads');
	var admobid = {};
	var bannerType = 'FULL_BANNER';
	  if( /(android)/i.test(navigator.userAgent) ) {
		  bannerType = 'SMART_BANNER';
	    admobid = { // for Android
	      banner: 'ca-app-pub-9693451887247156/6821381181',
	      interstitial: 'ca-app-pub-9693451887247156/8235562878',
	      rewardvideo: 'ca-app-pub-3940256099942544/5224354917',
	    };
	  } else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
		  bannerType = 'SMART_BANNER';
	    admobid = { // for iOS
	      banner: 'ca-app-pub-9693451887247156/1083132712',
	      interstitial: 'ca-app-pub-9693451887247156/5760744322',
	      rewardvideo: 'ca-app-pub-3940256099942544/1712485313',
	    };
	  } else {
	    admobid = { // for Windows Phone, deprecated
	      banner: '',
	      interstitial: '',
	      rewardvideo: '',
	    };
	  }
	  console.log('device model',device.model.includes('iPad'));
	 if(moment().unix()>='1638210600' && (device.model.includes('iPad')))
	 {
		if(typeof(AdMob) != 'undefined') {
			AdMob.createBanner( {
			adId:admobid.banner, 
			position: AdMob.AD_POSITION.BOTTOM_CENTER,
			overlap:false, 
			adSize: bannerType,
			bgColor:'#FFFFFF',
			// position:AdMob.AD_POSITION.POS_XY, x:100, y:200, 
			autoShow:true},function(success) {
				console.log('success');
				console.log(success);
			},function(err) {
				console.log('err');
				console.log(err);
			});
			AdMob.prepareInterstitial( {adId:admobid.interstitial, autoShow:false} );
		}
	 }
	 else if(cordova.platformId == "android" || !(device.model.includes('iPad')))
	 {
	 	if(typeof(AdMob) != 'undefined') {
			AdMob.createBanner( {
			adId:admobid.banner, 
			position: AdMob.AD_POSITION.BOTTOM_CENTER,
			overlap:false, 
			adSize: 'SMART_BANNER',
			bgColor:'#FFFFFF',
			// position:AdMob.AD_POSITION.POS_XY, x:100, y:200, 
			autoShow:true},function(success) {
				console.log('success');
				console.log(success);
			},function(err) {
				console.log('err');
				console.log(err);
			});
			AdMob.prepareInterstitial( {adId:admobid.interstitial, autoShow:false} );
		}
	 }
    
}

function getReply(comment_id) {	
	var userDetails = JSON.parse(localStorage.getItem('userDetails'));
	var input = '';
	if(userDetails == null) {
		input += '<div class="form-group"><input type="text" class="form-control replyName" name="" id="" placeholder="Enter Your Name"/></div><div class="form-group"><input type="email" class="form-control replyEmail" name="" id="" placeholder="Enter Email"/></div>';
	}
	input += '<h3>What is in your mind?</h3><div class="form-group"><textarea class="form-control replyVal" name="" id="" rows="10" placeholder="Max 300 Charaters"></textarea></div><div class="form-group"><button class="button button-fill button-block replyNewComment" data-id="'+comment_id+'">Reply</button></div>';
	$('.replyForComment').html(input);
}

function userLoginViaComment(data) {
	app.preloader.show();
	/*api request data*/
	var datas = {key:accessToken,type:'login',email:data.email,password:data.password,social:1};
	var userDetails = {user_email:data.email,password:data.password,user_name:data.name};
	localStorage.setItem('userLogin',JSON.stringify({user_email:data.email,password:data.password}));
	// localStorage.setItem('userPassword',JSON.stringify(password));
	
	/*ajax call for login*/
	$.ajax({
		url:apiUrl,
		method:'GET',
		dataType:'json',
		data:datas,
		success:function(res) {
			
			if(res.msg == "success") {
				$('form#userLogin input[type="text"],form#userLogin input[type="password"]').val('');
				userDetails.user_id = res.data.user_id;
				//localStorage.setItem('userDetails',JSON.stringify(res.data));
				//$('.showUserName').html('<h5 class="user-name ">WELCOME <br><span>'+res.data.user_name+'</span></h5>');
				app.popup.close('.login-screen');
				app.preloader.hide();
				
				if(data.type == 'emotes') {
					$('.emoteSubmit').find('a').addClass('voted');
					emotesSubmit(data.aid,data.emotion,res.data.user_id);	
				} else if(data.type == 'comments') {
					//var userDetails = JSON.parse(localStorage.getItem('userDetails'));
					userDetails.reply = data.reply;
					postComment(data.comment,userDetails);
				}
			} else if(res.msg == 'EMAIL_ALREADY_EXISTS') {
				toaster('Email id already exists');	
				app.preloader.hide();
				loader(2);
			} else if(res.msg == 'INVALID_EMAIL_ID') {
				//toaster('Email id is invalid');	
				userRegViaCommentPost(data);
				app.preloader.hide();
				loader(2);
			} else if(res.msg == 'ERROR_ACTIVATION') {
				// toaster('Error in Activate your email');	
				app.preloader.hide();
				loader(2);
			} else if(res.msg == 'ERROR_UPDATE') {
				// toaster('Error in update');	
				app.preloader.hide();
				loader(2);
			} else if(res.msg == 'CHECK_INPUTS') {
				// toaster('some parameter is missing.');	
				app.preloader.hide();
				loader(2);
			} else if(res.msg == 'ACTIVATION_NOT_DONE') {
				app.preloader.hide();
				// toaster('Activation not yet completed');
				localStorage.setItem('userLogin',JSON.stringify({user_email:userName,password:password,otp:res.data.otp}));
				localStorage.setItem('userOTP',JSON.stringify(res.data.otp));
				app.popup.open('.activation');
			} else if(res.msg == 'ACCOUNT_INACTIVE') {
				// toaster('Account is blocked.');	
				app.preloader.hide();
				loader(2);
			} else {
				userRegViaCommentPost(data);
				//toaster(res.msg);
				app.preloader.hide();
			}
		},error:function(err) {
			toaster('You are in Offline');
		}
	});
}

function showSubscription() {
	var userDetails = JSON.parse(localStorage.getItem('userDetails'));		
	if(typeof(device)!='undefined' && device.platform=='Android')
	{
		if(userDetails != null) {
			OnlineStoreInappBrowser=cordova.InAppBrowser.open("https://api.hindutamil.in/app/index.php?type=go_store&key="+accessToken+"&user_email="+userDetails.user_email+"&user_id="+userDetails.user_id,'_self','location=yes,hideurlbar=yes,footer=no,closebuttoncolor=#FFFFFF,closebuttoncaption=Close,toolbarcolor=#00569d,navigationbuttoncolor=#FFFFFF');	
			OnlineStoreInappBrowser.addEventListener('exit',function(){
				inBrowserClose();
			});
		} else {
			OnlineStoreInappBrowser = cordova.InAppBrowser.open("https://store.hindutamil.in/",'_self','location=yes,hideurlbar=yes,footer=no,closebuttoncolor=#FFFFFF,closebuttoncaption=Close,toolbarcolor=#00569d,navigationbuttoncolor=#FFFFFF');	
		}			
	}
	else if(typeof(device)!='undefined' && device.platform=='iOS')
	{
		if(userDetails != null) {
			mainView.router.load({url:'pages/in-app-purchase.html'});
			/*if(moment().unix()>='1622831400') {
				OnlineStoreInappBrowser=cordova.InAppBrowser.open("https://api.hindutamil.in/app/index.php?type=go_store&key="+accessToken+"&user_email="+userDetails.user_email+"&user_id="+userDetails.user_id,'_blank','location=no,usewkwebview=yes,closebuttoncaption=Close,toolbar=yes,toolbarcolor=#00569d,closebuttoncolor=#FFFFFF,toolbarposition=top,navigationbuttoncolor=#FFFFFF,hidenavigationbuttons=no');
				OnlineStoreInappBrowser.addEventListener('exit',function(){
					inBrowserClose();
				});
			}*/
		} else {
			mainView.router.load({url:'pages/in-app-purchase.html'});
			/*if(moment().unix()>='1622831400') {
				OnlineStoreInappBrowser = cordova.InAppBrowser.open("https://store.hindutamil.in/",'_blank','location=no,usewkwebview=yes,closebuttoncaption=Close,toolbar=yes,toolbarcolor=#00569d,closebuttoncolor=#FFFFFF,toolbarposition=top,navigationbuttoncolor=#FFFFFF,hidenavigationbuttons=no');	
			}*/
		}
	}
}

function loadTabView() {
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
			setAdPlacement('home',id);
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

	$(document).on('click','.albumDetail',function() {
		var aid = $(this).attr('data-aid');
		var cid = $(this).attr('data-cid');
		getAlbumDetailPage({aid:aid,cid:cid});
	});
}

function checkField(val) {
	if(typeof(val) != 'undefined' || val == '' || val == 0 || val) {
		return false;
	}
	return true;
}

/*function to get user details*/
function getUserDetails() {

	app.preloader.show();
	var userDetails = JSON.parse(localStorage.getItem('userDetails'));
	if(userDetails != null) {
		$('.feedbackUserName').val(userDetails.user_name);
		$('.feedbackEmail').val(userDetails.user_email);
	}
	app.preloader.hide();
}

function getAlbumDetailPage(input) {
	var userDetails = JSON.parse(localStorage.getItem('userDetails'));
	var accessKey = userDetails.access_key;
	var userId = userDetails.user_id;
	
	if(accessKey!='' && userId!=''){		
		var data = {type:'article',mid:4,cid:input.cid,key:accessToken,aid:input.aid,access_key:accessKey,user_id:userId};
	}else{
		var data = {type:'article',mid:4,cid:input.cid,key:accessToken,aid:input.aid};
	}
	/*ajax call for login*/
	$.ajax({
		url:apiUrl,
		method:'GET',
		dataType:'json',
		data:data,
		success:function(res) {
			if(res.msg == "success") {
				if(!checkField(res.data)) {
					var albumImages = (imgTOURL(res.data.content));
					Array.prototype.insert = function ( index, item ) {
						this.splice( index, 0, item );
					};
					//images.insert(5, {caption:'<div id="div-gpt-ad-1605632724271-0"><script>refreshAds("album_page_ad_2");</script></div>'});
					
					albumImages.insert(5, {html:"<div id='div-gpt-ad-1605624326531-2' class='album_ad' ></div>"});
					albumImages.insert(10, {html:"<div id='div-gpt-ad-1605624326531-3' class='album_ad' ></div>"});
					initAlbum(albumImages);	
				} else {
					toaster('No album found');
				}	
			}
		},error:function(err) {
			toaster('You are in Offline');
		}
	});
}

function lazyLoadFunctionality(pages) {
	var page = pages.page;
	var field = pages.field;
	$(field).on('scroll',function(){
	    var scrollTop = this.scrollTop;
        if($(this).scrollTop() + $(this).innerHeight() + 1000 > $(this)[0].scrollHeight) {
        	if(allowInfinite) {
        		if(page == 'home') {
        			scrollPageNo = scrollPageNo + 1;
        			triggerHomeDetails(1);
        		} else if(page == 'other-page') {
        			scrollPageNo = scrollPageNo + 1;
        			triggerOtherPageDetails(pages.id,1,pages.cid,pages.sid);
        		} else if(page == 'home-search') {
					scrollPageNo = scrollPageNo + 1;
		        	getNewsSerachResult(pages.value);
				} else if(page == 'video') {
					scrollPageNo = scrollPageNo + 1;
					getVideos($('.video-category').find('div.color-blue').attr('data-type'));
				}
        	}
        }
    });
}

function postComment(comment,userDetails) {

	app.preloader.show();
	if(typeof(userDetails.reply) == 'undefined') {
		userDetails.reply = 0;
	}
	
	// var userDetails = JSON.parse(localStorage.getItem('userDetails'));
	var comment = comment;
	var articleDetails = JSON.parse(localStorage.getItem('articleDetails'));
	
	var deviceDetails = JSON.parse(localStorage.getItem('deviceDetails'));
	/*request data*/
	var data = {key:accessToken,type:'comments_post',mid:modId,aid:articleDetails.aid,article_title:articleDetails.a_title,article_url:articleDetails.a_url,user_name:userDetails.user_name,user_email:userDetails.user_email,user_id:userDetails.user_id,comment:comment,remote_addr:deviceDetails.uuid,reply_for:userDetails.reply};
	/*ajax call for post comment*/
	$.ajax({
		url:apiUrl,
		method:'GET',
		dataType:'json',
		data:data,
		success:function(res) {
			app.preloader.hide();
			if(res.msg == "success") {
				app.popup.close('.replyComment');
				// $('#alert').fadeIn();
				$('.replyName').val('');
				$('.replyEmail').val('');
				$('.replyVal').val('');
				
				toaster('Thank you for your comments. We will review and notify soon');
				if(userDetails.reply != 0) {
					//mainView.router.load({url:'./pages/comments.html?aid='+articleDetails.aid});
					mainView.router.back({url:'pages/comments.html?aid='+articleDetails.aid});
				}
				getCommentList({aid:articleDetails.aid});
				
				// toaster('Thank you for your comments.We will review and notify soon');
				
			} else {
				toaster(res.msg);
			}
		},error:function(err) {
			toaster('You are in Offline');
		}
	});
}

function test() {
	var value = "test";
	alert(value.toString());
	window.FirebasePlugin.unsubscribe(value.toString());
}

function navigateBack() {
	closeBuffer();
	/*var url = $('.page-previous').data('url');
	var aid = $('.page-previous').data('aid');
	console.log('url',url);
	console.log('aid',aid);
	if(typeof(aid) != 'undefined') {
		url += '?back=true&aid='+aid;
	}
	mainView.router.load({url:url});*/
	console.log(app.views.main.history);
	//console.log(app.views.main.router.app.router);
	var currentPage = app.views.main.router.url;
	//console.log('currentPage',currentPage);
	//history.go(-1);
	var curPageType = $('.newdetails').attr('data-cur-page');
	console.log(curPageType);
	var url = app.views.main.history[app.views.main.history.length-2];
	console.log('url',url);
	if(curPageType=='premium'){ //console.log(122);
		mainView.router.load({url:'./index.html'});
		setTimeout( function() { loadHomePage(); },500);
	}else if(url != '' && url != '/' && url != app.views.main.router.url) {
		history.back();
	} else { 
		forceBack();
	}
	//mainView.router.load({url:app.views.main.history[len]});
	/*var data = JSON.parse(localStorage.getItem('detailPageBackData'));
	var test = data;
	var value = 0;
	const index = data.indexOf(value);
	data.splice(index, 1);
	value = test[test.length-1];
	localStorage.setItem('detailPageBackData',JSON.stringify(data));
	if(test.length >= 1) {
		mainView.router.load({url:'pages/news-detail.html?back=true&aid='+value});
	} else {
		var page = localStorage.getItem('previousPage');
		if(page != null && page == 'bookmark') {
			mainView.router.load({url:'pages/bookmarks.html'});
		} else if(page != null && page == 'saved') {
			mainView.router.load({url:'pages/saved.html'});
		} else if(page != null && page == 'notify-details') {
			mainView.router.load({url:'pages/notify-details.html'});
		} else if(page != null && page == 'home-search') {
			mainView.router.load({url:'pages/search.html'});
		} else {
				mainView.router.load({url:'index.html'});
		}
	}*/
}

function otherPageAds() {
	console.log('otherPageAds');
	refreshAds('category_page_ad_1');
	refreshAds('category_page_ad_2');
}

function showEyeInChangePassword() {
	$('.currentPasEye').html('<i class="fa fa-eye-slash"></i>');
	$('.newPasEye').html('<i class="fa fa-eye-slash"></i>');
	$('.confirmPasEye').html('<i class="fa fa-eye-slash"></i>');
}

function getSettings() {
	var value = localStorage.getItem('storageLocation');
	var userDetails = JSON.parse(localStorage.getItem('userDetails'));
	if(typeof(cordova) != 'undefined') {		
		setfirebaseAnalytics({page:'Setting Page',property:{content_type: "Setting Page", item_id:'Setting Page'}});
	}
	if(userDetails != null){
		$('.hideNotLogin').show();
	}
	$('li[data-page="version"]').remove();

	var checked1 = (value == 1) ? 'checked' : '';
	var checked2 = (value == 2) ? 'checked' : '';

	if(typeof(cordova) != 'undefined') {		
		if(cordova.platformId == 'ios') {
			$('li[data-page="storage-location"]').remove();
		} else {
			var content = '<li><label class="item-radio item-content"><input type="radio" name="my-radio" value="1" '+checked1+'/><i class="icon icon-radio"></i><div class="item-inner"><div class="item-title">Internal Storage</div></div></label></li>';
			if(typeof(cordova.file.externalSdCardDirectory) != 'undefined') {
				content += '<li><label class="item-radio item-content"><input type="radio" name="my-radio" value="2" '+checked2+'/><i class="icon icon-radio"></i><div class="item-inner"><div class="item-title">SD Card</div></div></label></li>';
			}
			$('.showMemorycardOption').html(content);
			$('.showStorageLocation').show();
		}
	}
	
	/*$('.showMemorycardOption').html(content);
	$('.showStorageLocation').show();*/

	var appVersion = (localStorage.getItem('appVersion'));
	//var appVersion = 3;
	if(appVersion != null) {
		$('.versions').append('<li data-page="version"><div class="item-content"><div class="item-media"><i class="icon fa fa-info-circle"></i></div><div class="item-inner"><div class="item-title">Version - '+appVersion+'</div></div></div></li>');
	}	
}
//setTimeout(function(){getAppVersion();},3000);
/*function to get app setting*/
function getAppVersion() {	
	var userDetails = JSON.parse(localStorage.getItem('userDetails'));
	if(userDetails != null){
		$('.hideNotLogin').show();
	}
	// app.preloader.hide();
	/*request data*/
	var data = {key:accessToken,type:'settings'};
	/*ajax call*/
	$.ajax({
		url:apiUrl,
		method:'GET',
		dataType:'json',
		data:data,
		success:function(res) {
			if(res.msg == "success") {
				var data = res.data;
				var version=data.version;
				/*var androidVersion=data.version_android;
				var iosVersion=data.version_ios;*/
				var appVersion=version;
				checkVersionUpdate(data);
				if( typeof(cordova) != 'undefined' && cordova.platformId == 'android' ) {
				    localStorage.setItem('appVersion',androidVersion);
					appVersion=androidVersion;
				  } else if(typeof(cordova) != 'undefined' && cordova.platformId == 'ios') {
				    localStorage.setItem('appVersion',iosVersion);
					appVersion=iosVersion;
				  } else {
				    localStorage.setItem('appVersion',version);
					appVersion=version;
				  }
				$('.version').html('<span>Version '+appVersion+'</span>');
				//$('.version').html('<span>Version 3</span>');
				$('li[data-page="version"]').remove();
				
				$('.versions').append('<li data-page="version"><div class="item-content"><div class="item-media"><i class="icon fa fa-info-circle"></i></div><div class="item-inner"><div class="item-title">Version - '+appVersion+'</div></div></div></li>');	
			}
			// loader(2);
		},error:function(err) {
			toaster('You are in Offline3');
		}
	});
}

/*function to initiate swipper*/
function initiateSwipper() {
	var swiper1 = app.swiper.create('.album-swiper.swiper-container', {
	    speed: 400,
	    spaceBetween: 5,
	    slidesPerView:2
	});
}


function initiateDetailSwipper() {
	var swiper = new Swiper('.swiper-container', {
    pagination: '.swiper-pagination',
    slidesPerView: 1,
    paginationClickable: true,
    spaceBetween: 30
});
}


function initSwiper() {
  var swiper = new Swiper(".premium-swiper", {
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    slidesPerView: 1,
    spaceBetween: 20,
    breakpoints: {
    // when window width is >= 320px
    320: {
      slidesPerView: 1,
    },
    // when window width is >= 480px
    480: {
      slidesPerView: 1,
    },
    // when window width is >= 640px
    640: {
      slidesPerView: 1,
    }
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
	autoplay: {
		delay: 5000,
	},
  });
}

/*function to get album list*/
function getAlbums(titles) {
	
	if(typeof(cordova) != 'undefined') {		
		setfirebaseAnalytics({page:'Album page',property:{content_type: "Album page", item_id:'Album page'}});
	}
	
	localStorage.setItem('tabActive',0);
	// loader(1);
	var previousTit = $('.video-category').find('div.color-blue').attr('data-type');
	if(typeof(previousTit) == 'undefined' || (titles != previousTit))
		showPreLoader($('.appendAlbum'),1);
	/*request data*/
	var data = {key:accessToken,type:'cate',mid:4};
	/*ajax call*/
	$.ajax({
		url:apiUrl,
		method:'GET',
		dataType:'json',
		data:data,
		success:function(res) {
			if(res.msg == "success") {
				var data = res.data;
				var color = '';
			
				if(titles == 0) {
					color = 'color-blue';
				} else {
					data = fetchMatchingResults(data,"cid",titles);
				}

				var catNam = '<div class="chip '+color+' showAlbums" data-type="0"><div class="chip-label">அனைத்தும்</div></div>';
				for(var k = 0;k < res.data.length;k++) {
					color = '';
					if(titles == res.data[k].cid) {
							color = 'color-blue';
					}
					catNam += '<div class="chip '+color+' showAlbums" data-type="'+res.data[k].cid+'"><div class="chip-label">'+res.data[k].title_ta+'</div></div>';
				}
				if(data.length > 0) {
					var content = '';var title = '';
					for(var k = 0;k < data.length;k++) {
						var color = '';
						title = data[k].title_ta;
						var res = getAlbumDetails(data[k].cid)
						var cont = '';
						if(i == 1) {
							content += "<div id='div-gpt-ad-1605624284210-4' class='text-center' ><script>refreshAds('album_page_ad_1');</script></div>";
						}
						content += '<div class="block-title mn"><h2>'+title+'</h2></div><div class="">';
						
						if(res.length > 0) {
							var slide = 2;
							if(res.length == 1) {
								slide = 1;
							}
							
							cont += '<div data-pagination=\'{"el": ".swiper-pagination"}\' data-space-between="'+slide+'" data-slides-per-view="'+slide+'" class="swiper-container swiper-init album-swiper"><div class="swiper-pagination"></div><div class="swiper-wrapper">';
							for (var i = 0; i < res.length; i++) {
								var share = res[i].web_url+'?cid='+res[i].cid;
								var albumImages=JSON.stringify(imgTOURL(res[i].content,share));
								cont += '<div class="swiper-slide"><div class="card album-card openPhotoBrowser triggerPhotoBrowser_'+res[i].aid+'" data-aid="'+res[i].aid+'" data-url="'+res[i].web_url+'"><div style="display:none" class="ablum_data">'+albumImages+'</div><div style="background:url(assets/images/no-img.jpg) no-repeat center center / cover;" class="cover-img card-header align-items-flex-end"><img src="'+res[i].img.replace("thumb", "large")+'"></div><div class="card-content card-content-padding"><h3>'+res[i].title_ta.substr(0,30)+'...</h3></div></div></div>';
							}
							cont += '</div></div>';
						}
						content += cont;
					}
					
				}
				$('.appendAlbum').html(content);
				$('.video-category').html(catNam);
				initiateSwipper();
				// loader(2);
				var myScrollPos = $('.video-category div.color-blue').offset().left + $('.video-category div.color-blue').outerWidth(true)/2 + $('.video-category').scrollLeft() - $('.video-category').width()/2;
				$('.video-category').scrollLeft(myScrollPos);				
			}
			loader(2);
		},error:function(err) {
			toaster('You are in Offline');
		}
	});
}


/*function searchAlbums(titles,value) {

}*/

function getAlbumDetails(cid,aid) {
	var data = {key:accessToken,type:'cate_article',mid:4,cid:cid};
	if(typeof(aid) != 'undefined') {
		data.aid = aid;
	}
	var returnArray = 0;
	$.ajax({
		url:apiUrl,
		method:'GET',
		dataType:'json',
		async:false,
		data:data,
		success:function(res) {
			if(res.msg == "success") {
				//callback(cid,res.data);
				returnArray = res.data;
				
			}
		},error:function(err) {
			toaster('You are in Offline');
		}
	});
	return returnArray;
}

/*function to initiate album*/
function initAlbum(photos,type) {
	
	if(type != 1)
		//photos.map(i=>i.caption='<div class="share_news"><ul><li><a href="javascript:void(0)" class="facebook shareViaWhatsApp" data-type="facebook" data-img="'+i.url+'" data-url="'+i.url+'"><i class="fab fa-facebook"></i></a></li><li><a href="javascript:void(0)" class="whatsapp shareViaWhatsApp" data-url="'+i.url+'" data-type="whatsapp" data-img="'+i.url+'"><i class="fab fa-whatsapp"></i></a></li><li><a href="javascript:void(0)" class="twitter shareViaWhatsApp" data-type="twitter" data-url="'+i.url+'" data-img="'+i.url+'"><i class="fab fa-twitter"></i></a></li></ul></div>'+((i.caption != null) ? ((i.caption.length > 25) ? '<p class="hideAlbumDescription">'+i.caption.substr(0,25)+'...<a href="javascript:void(0)" class="getAlbumFullCaption">மேலும் படிக்கச்</a></p>' : '<p class="showAlbumDescription">'+i.caption+'</p>') : ''));
	//photos.map(i=>i.caption='<div class="share_news"><ul><li><a href="javascript:void(0)" class="shareForAll" data-url="'+i.url+'"><i class="fa fa-share-alt"></i></a></li></ul></div>'+((i.caption != null) ? ('<p class="hideAlbumDescription">'+i.caption.substr(0,25)+'...<a href="javascript:void(0)" class="getAlbumFullCaption">மேலும் படிக்க</a></p><p class="showAlbumDescription" style="display:none;">'+i.caption+'</p>') : ''));
	photos.map(i=>i.caption='<div class="share_news"><ul><li><a href="javascript:void(0)" class="shareForAll" data-url="'+i.share+'"><i class="fa fa-share-alt"></i></a></li></ul></div>'+((i.caption != null) ? ('<p class="hideAlbumDescription">'+i.caption.substr(0,25)+'...<a href="javascript:void(0)" class="getAlbumFullCaption">மேலும் படிக்க</a></p><p class="showAlbumDescription" style="display:none;">'+i.caption+'</p>') : ''));
	//photos.map(i=>i.caption='<p>'+JSON.stringify(i)+'</p>');
    
	var data = {
      photos :photos,
      theme: 'dark',
      popupCloseLinkText:'&times;',
      on: {
	    opened: function () {
	      $(".photo-browser-caption-active").css("z-index", "999999");
	    }
	  }
  	};

  if(type == 1) {
  	data.toolbar = false;
  }
  var myPhotoBrowserDark = app.photoBrowser.create(data);
  myPhotoBrowserDark.on('slideChange',function(e){
  	setTimeout(function(){
  		$('.showAlbumDescription').hide();
  		$('.hideAlbumDescription').show();
  		var index=$('.photo-browser-slide.swiper-slide-active').attr('data-swiper-slide-index');
	  	
	  	if(index=='5')
	  		refreshAds('album_page_ad_2');
	  	if(index=='10')
	  		refreshAds('album_page_ad_3');
	  },1000);
  });
  //window.googletag.pubads().refresh();
  // myPhotoBrowserDark.type
 	myPhotoBrowserDark.open();
}

/*function to matching result*/
function fetchMatchingResults(array,column,value){
  value=String(value).toLowerCase();
  var matchedArray=new Array();
  if(Array.isArray(array))
  {
    array.forEach(function(ar){
      if(String(ar[column]).toLowerCase()==value)
        matchedArray.push(ar);
    });
    return matchedArray;
  }
  else
    return '';
}

/*function to array unique*/
function array_unique(arr){
  function onlyUnique(value, index, self) { 
      return self.indexOf(value) === index;
  }
  return arr.filter(onlyUnique);
}

/*function to array column*/
function array_column(input, ColumnKey, IndexKey = null) { 
  if (input !== null && (typeof input === 'object' || Array.isArray(input))) {
    var newarray = []
    if (typeof input === 'object') {
      let temparray = []
      for (let key of Object.keys(input)) {
        temparray.push(input[key])
      }
      input = temparray
    }
    if (Array.isArray(input)) {
      for (let key of input.keys()) {
        if (IndexKey && input[key][IndexKey]) {
          if (ColumnKey) {
            newarray[input[key][IndexKey]] = input[key][ColumnKey]
          } else {
            newarray[input[key][IndexKey]] = input[key]
          }
        } else {
          if (ColumnKey) {
            newarray.push(input[key][ColumnKey])
          } else {
            newarray.push(input[key])
          }
        }
      }
    }
    return Object.assign({}, newarray)
  }
}

function filterVideos(data,title) {

	var array = array_unique(Object.values(array_column((data),'cate_ta')));
	var color = '';
	if((title) == 'அனைத்தும்') {
		color = 'color-blue';
	}
	var cont = '<div class="chip '+color+' selectCategoryVideo" data-type="அனைத்தும்"><div class="chip-label">அனைத்தும்</div></div>';
	if(array.length > 0) {
		for(var j = 0;j < array.length;j++) {
			color = '';
			if((typeof(title) != 'undefined') && (title == array[j])) {
				color = 'color-blue';
			}
			cont += '<div class="chip '+color+' selectCategoryVideo" data-type="'+array[j]+'"><div class="chip-label">'+array[j]+'</div></div>';
		}
	}
	$('.video-category').html(cont);
	if((title) != 'அனைத்தும்') {
		data = fetchMatchingResults(data,"cate_ta",title);	
	}
	// var albumVideos=JSON.stringify(Object.values(array_column(data,'content')));
	
	var cont = '';var content = '';
	for (var i = 0; i < data.length; i++) {
		var aDay = 24*60*60*1000;
		var date =  getTimeInterval(data[i].created);
		content += '<div class="card album-card"><div style="background-image:url('+data[i].img.replace("default", 0)+')" data-id="'+data[i].content+'" data-cap="'+data[i].title_ta+'" class="card-header playVideo video-popup align-items-flex-end cover-img"><div class="play-icon"><i class="fa fa-play"></i></div><span class="category">Hindu Tamil Thisai</span></div><div class="card-content card-content-padding"><h3 class="mn">'+data[i].title_ta+'</h3><p><span>'+convertMonth(data[i].created)+'</span> <a href="#" data-url="'+data[i].web_url+'" data-msg="'+data[i].title_ta+'" class="pull-right shareLink"><i class="fa fa-share-alt"></i> Share</a></p></div></div>';
	}
	$('.appendVideo').html(content);
	$('.video-plyr').html(cont);
}

function shareViaTwitter(msg,link,img) {
	var link = (typeof(link) != 'undefined') ? link : '';
	var msg = (typeof(msg) != 'undefined') ? msg : '';
	var img = (typeof(img) != 'undefined') ? img : '';
	// link = link+'\n\n\n'+downLoadApp;
	if(cordova.platformId == 'ios') {
		link = link;
	} else {
		link = link+'\n\n\n'+downLoadApp;
	}
	//window.plugins.socialsharing.shareViaTwitter(msg, null /* img */,link);	
	window.plugins.socialsharing.shareViaTwitter(msg, img,link, function() {}, function(errormsg){
		//alert(errormsg);
		if(cordova.platformId == 'android') {
			cordova.plugins.market.open('com.twitter.android');
		} else {
			cordova.plugins.market.open('https://apps.apple.com/in/app/twitter/id333903271');
			//https://apps.apple.com/in/app/twitter/id333903271
		}
	});
}

function shareViaFacebook(msg,link,img) {
	var link = (typeof(link) != 'undefined') ? link : '';
	var msg = (typeof(msg) != 'undefined') ? msg : '';
	var img = (typeof(img) != 'undefined') ? img : '';

	if(cordova.platformId == 'ios') {
		link = link;
	} else {
		link = link+'\n\n\n'+downLoadApp;
	}
	console.log(msg);
	console.log(link);
	
	window.plugins.socialsharing.shareViaFacebook(msg, img,link, function() {}, function(errormsg){
		// alert(errormsg)
		if(cordova.platformId == 'android') {
			cordova.plugins.market.open('com.facebook.katana');
		} else {
			cordova.plugins.market.open('https://apps.apple.com/us/app/facebook/id284882215');
		}
	});
}

function shareViaWhatsApp(msg,link,img) {
	var link = (typeof(link) != 'undefined') ? link : '';
	var msg = (typeof(msg) != 'undefined') ? msg : '';
	var img = (typeof(img) != 'undefined') ? img : '';
	link = link+'\n\n\n'+downLoadApp;
	if(cordova.platformId == 'ios') {
		msg = link;
		link = '';
	}
	console.log(msg);
	console.log(link);

	window.plugins.socialsharing.shareViaWhatsApp(msg,img,link, function() {}, function(errormsg){
		//alert(errormsg)
		if(cordova.platformId == 'android') {
			//com.whatsapp
			cordova.plugins.market.open('com.whatsapp');
		} else {
			cordova.plugins.market.open('https://apps.apple.com/us/app/whatsapp-messenger/id310633997');
		}
	});
}

function emotesSubmit(aId,emojiId,userId) {
	
	// var login = checkSession();
	// console.log(login);
	// if(typeof(userId) != 'undefined') {
		
	if(typeof(userId) != 'undefined') {
		app.preloader.show();
		var data = {key:accessToken,type:'emote',mid:1,aid:aId,emid:emojiId};
		
		var userDetails = JSON.parse(localStorage.getItem('userDetails'));
		var deviceDetails = JSON.parse(localStorage.getItem('deviceDetails'));
		data.remote_addr = deviceDetails.uuid;
		data.user_uid = deviceDetails.uuid;
		data.user_id = userId;
		/*data.user_uid = "60569e1d06f42d7c";
		data.remote_addr = "192.168.1.134";
		data.user_id = "147029";*/
		/*ajax call*/
		$.ajax({
			url:apiUrl,
			method:'GET',
			dataType:'json',
			data:data,
			success:function(res) {
				if(res.msg == "success") {
					app.popup.close('.comment');
					//app.popup.close('.postNewsComment');
					app.sheet.close();
					toaster('Emoji added successfully');
					getCommentList({aid:aId});
				} else {
					toaster(res.msg);
				}
				app.preloader.hide();
			},error:function(err) {
				toaster('You are in Offline');
				app.preloader.hide();
			}
		});
	}	
}

function getSearchValue() {
	console.log('getSearchValue');
	var value = localStorage.getItem('homePageSearchValue');
	localStorage.setItem('tabActive',0);
	$('.homePageSearch').val(value);
	getNewsSerachResult(value);
}

function getRandomAdValue() {
  // min = Math.ceil(min);
  min = 1000000;
  // max = Math.floor(max);
  max = 999999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function googleDFPTag()
{
	window.adTags = {};
	window.googletag = window.googletag || {cmd: []};  
	googletag.cmd.push(function() {
	var mapping1 = googletag.sizeMapping().
				   addSize([748, 0], [[728,90]]).
				   addSize([0, 0], [[320, 50]]).
				   addSize([0, 0], [[970, 90]]).
				   addSize([0, 0], [[600, 80]]).
				   build();
 // googletag.destroySlots();
  googletag.cmd.push(function() {
   /* window.adTags['home_page_ad_1'] = googletag.defineSlot('/21697178033/Apps_HT_Digital_Subs_728x320', [[320, 50], [728, 90]], 'div-gpt-ad-1605624284210-0').updateTargetingFromMap("%%PATTERN:TARGET_IN_NEW_WINDOW%%").defineSizeMapping(mapping1).addService(googletag.pubads());
    window.adTags['home_page_ad_2'] = googletag.defineSlot('/21697178033/Apps_Books_300x250', [300, 250], 'div-gpt-ad-1605624482177-0').addService(googletag.pubads());
    window.adTags['home_page_ad_3'] = googletag.defineSlot('/21697178033/Apps_Digital_Mag_Subs_300x250', [300, 250], 'div-gpt-ad-1605624526675-0').addService(googletag.pubads());
    window.adTags['home_page_ad_4'] = googletag.defineSlot('/21697178033/Apps_Print_Mag_Subs_300x250', [300, 250], 'div-gpt-ad-1605624566043-0').addService(googletag.pubads());
    window.adTags['home_page_ad_5'] = googletag.defineSlot('/21697178033/Apps_HT_EPaper_Subs_728x320', [[320, 50], [728, 90]], 'div-gpt-ad-1605624326531-0').defineSizeMapping(mapping1).addService(googletag.pubads());*/
   
    /*window.adTags['home_page_ad_2'] =
    window.adTags['home_page_ad_3'] =
    window.adTags['home_page_ad_4'] =
    window.adTags['home_page_ad_5'] =
    window.adTags['home_page_ad_6'] = */

    window.adTags['article_page_ad_1'] = googletag.defineSlot('/21697178033/Apps_HT_Digital_Subs_728x320', [[320, 50], [728, 90]], 'div-gpt-ad-1605624284210-1').defineSizeMapping(mapping1).addService(googletag.pubads());
    window.adTags['article_page_ad_2'] = googletag.defineSlot('/21697178033/Apps_ebooks_300x250', [300, 250], 'div-gpt-ad-1605624597553-0').addService(googletag.pubads());
    window.adTags['article_page_ad_3'] = googletag.defineSlot('/21697178033/Apps_Print_Mag_Subs_300x250', [300, 250], 'div-gpt-ad-1605624566043-100').addService(googletag.pubads());
    window.adTags['article_page_ad_4'] = googletag.defineSlot('/21697178033/Apps_HT_EPaper_Subs_728x320', [[320, 50], [728, 90]], 'div-gpt-ad-1605624326531-1').defineSizeMapping(mapping1).addService(googletag.pubads());
    /*window.adTags['article_page_ad_5'] = googletag.defineSlot('/21697178033/Apps_Print_Mag_Subs_300x250', [300, 250], 'div-gpt-ad-1605624566043-2').addService(googletag.pubads());*/
    window.adTags['article_page_ad_5'] = googletag.defineSlot('/21697178033/Apps_Books_300x250', [300, 250], 'div-gpt-ad-1605624482177-100').addService(googletag.pubads());
    window.adTags['category_page_ad_1'] = googletag.defineSlot('/21697178033/Apps_HT_Digital_Subs_728x320', [[320, 50], [728, 90]], 'div-gpt-ad-1605624284210-2').defineSizeMapping(mapping1).addService(googletag.pubads());
    window.adTags['category_page_ad_2'] = googletag.defineSlot('/21697178033/Apps_HT_Digital_Subs_728x320', [[320, 50], [728, 90]], 'div-gpt-ad-1605624284210-3').defineSizeMapping(mapping1).addService(googletag.pubads());
    window.adTags['album_page_ad_1'] = googletag.defineSlot('/21697178033/Apps_HT_Digital_Subs_728x320', [[320, 50], [728, 90]], 'div-gpt-ad-1605624284210-4').defineSizeMapping(mapping1).addService(googletag.pubads());
    window.adTags['album_page_ad_2'] = googletag.defineSlot('/21697178033/Apps_HT_Digital_Subs_728x320', [[320, 50], [728, 90]], 'div-gpt-ad-1605624326531-2').defineSizeMapping(mapping1).addService(googletag.pubads());
    window.adTags['album_page_ad_3'] = googletag.defineSlot('/21697178033/Apps_HT_Digital_Subs_728x320', [[320, 50], [728, 90]], 'div-gpt-ad-1605624326531-3').defineSizeMapping(mapping1).addService(googletag.pubads());
	window.adTags['notification_page_ad_1'] = googletag.defineSlot('/21697178033/Apps_HT_Digital_Subs_728x320', [[320, 50], [728, 90]], 'div-gpt-ad-1605624284210-5').defineSizeMapping(mapping1).addService(googletag.pubads());
    window.adTags['notification_page_ad_2'] = googletag.defineSlot('/21697178033/Apps_ebooks_300x250', [300, 250], 'div-gpt-ad-1605624597553-1').addService(googletag.pubads());
	window.adTags['epaper_page_ad_1'] = googletag.defineSlot('/21697178033/Apps_HT_EPaper_Product_320x50', [320, 50], 'div-gpt-ad-1611987282522-0').addService(googletag.pubads());
	window.adTags['emagazine_page_ad_1'] = googletag.defineSlot('/21697178033/Apps_Digital_Mag_Product_320x50', [320, 50], 'div-gpt-ad-1611987325690-0').addService(googletag.pubads());
	window.adTags['ebook_page_ad_1'] = googletag.defineSlot('/21697178033/Apps_Digital_ebooks_Product_320x50', [320, 50], 'div-gpt-ad-1611987384338-0').addService(googletag.pubads());
	window.adTags['epaper_lib_page_ad_1'] = googletag.defineSlot('/21697178033/Apps_HT_EPaper_Product_320x50', [320, 50], 'div-gpt-ad-1611987282522-1').addService(googletag.pubads());
	window.adTags['emagazine_lib_page_ad_1'] = googletag.defineSlot('/21697178033/Apps_Digital_Mag_Product_320x50', [320, 50], 'div-gpt-ad-1611987325690-2').addService(googletag.pubads());
	window.adTags['ebook_lib_page_ad_1'] = googletag.defineSlot('/21697178033/Apps_Digital_ebooks_Product_320x50', [320, 50], 'div-gpt-ad-1611987384338-2').addService(googletag.pubads());
	
    googletag.pubads().enableSingleRequest();
    googletag.enableServices();

  });
  
  
});
}


/*function googleDFPTag()
{
 window.adTags = {};
  window.googletag = window.googletag || {cmd: []};  
 googletag.cmd.push(function() {
  var mapping1 = googletag.sizeMapping().
  addSize([748, 0], [[728,90]]).
  addSize([0, 0], [[320, 50]]).
  addSize([0, 0], [[970, 90]]).
  addSize([0, 0], [[600, 80]]).
  build();
  
  googletag.cmd.push(function() {
  	//window.adTags['home_page_ad_1'] = googletag.defineSlot('/21697178033/Apps_HT_Digital_Subs_728x320', [[320, 50], [728, 90]], 'div-gpt-ad-1605624284210-0').updateTargetingFromMap("%%PATTERN:TARGET_IN_NEW_WINDOW%%").defineSizeMapping(mapping1).addService(googletag.pubads());
    window.adTags['home_page_ad_1'] = googletag.defineSlot('/21697178033/Apps_HT_Digital_Subs_728x320', [[320, 50], [728, 90]], 'div-gpt-ad-1605624284210-0').updateTargetingFromMap("%%PATTERN:TARGET_IN_NEW_WINDOW%%").defineSizeMapping(mapping1).addService(googletag.pubads());
    window.adTags['home_page_ad_2'] = googletag.defineSlot('/21697178033/Apps_Books_300x250', [300, 250], 'div-gpt-ad-1605624482177-0').addService(googletag.pubads());
    window.adTags['home_page_ad_3'] = googletag.defineSlot('/21697178033/Apps_Digital_Mag_Subs_300x250', [300, 250], 'div-gpt-ad-1605624526675-0').addService(googletag.pubads());
    window.adTags['home_page_ad_4'] = googletag.defineSlot('/21697178033/Apps_Print_Mag_Subs_300x250', [300, 250], 'div-gpt-ad-1605624566043-0').addService(googletag.pubads());
    window.adTags['home_page_ad_5'] = googletag.defineSlot('/21697178033/Apps_HT_EPaper_Subs_728x320', [[320, 50], [728, 90]], 'div-gpt-ad-1605624326531-0').defineSizeMapping(mapping1).addService(googletag.pubads());
    window.adTags['article_page_ad_1'] = googletag.defineSlot('/21697178033/Apps_HT_Digital_Subs_728x320', [[320, 50], [728, 90]], 'div-gpt-ad-1605624284210-1').defineSizeMapping(mapping1).addService(googletag.pubads());
    window.adTags['article_page_ad_2'] = googletag.defineSlot('/21697178033/Apps_ebooks_300x250', [300, 250], 'div-gpt-ad-1605624597553-0').addService(googletag.pubads());
    window.adTags['article_page_ad_3'] = googletag.defineSlot('/21697178033/Apps_Print_Mag_Subs_300x250', [300, 250], 'div-gpt-ad-1605624566043-100').addService(googletag.pubads());
    window.adTags['article_page_ad_4'] = googletag.defineSlot('/21697178033/Apps_HT_EPaper_Subs_728x320', [[320, 50], [728, 90]], 'div-gpt-ad-1605624326531-1').defineSizeMapping(mapping1).addService(googletag.pubads());
    window.adTags['article_page_ad_5'] = googletag.defineSlot('/21697178033/Apps_Print_Mag_Subs_300x250', [300, 250], 'div-gpt-ad-1605624566043-2').addService(googletag.pubads());
    window.adTags['category_page_ad_1'] = googletag.defineSlot('/21697178033/Apps_HT_Digital_Subs_728x320', [[320, 50], [728, 90]], 'div-gpt-ad-1605624284210-2').defineSizeMapping(mapping1).addService(googletag.pubads());
    window.adTags['category_page_ad_2'] = googletag.defineSlot('/21697178033/Apps_HT_Digital_Subs_728x320', [[320, 50], [728, 90]], 'div-gpt-ad-1605624284210-3').defineSizeMapping(mapping1).addService(googletag.pubads());
    window.adTags['album_page_ad_1'] = googletag.defineSlot('/21697178033/Apps_HT_Digital_Subs_728x320', [[320, 50], [728, 90]], 'div-gpt-ad-1605624284210-4').defineSizeMapping(mapping1).addService(googletag.pubads());
    //window.adTags['album_page_ad_2'] = googletag.defineSlot('/21697178033/Apps_HT_Digital_Subs_728x320', [[320, 50], [728, 90]], 'div-gpt-ad-1605624326531-2').defineSizeMapping(mapping1).addService(googletag.pubads());
    //window.adTags['album_page_ad_3'] = googletag.defineSlot('/21697178033/Apps_HT_Digital_Subs_728x320', [[320, 50], [728, 90]], 'div-gpt-ad-1605624326531-3').defineSizeMapping(mapping1).addService(googletag.pubads());

    window.adTags['album_page_ad_2'] = googletag.defineSlot('/21697178033/Apps_Print_Mag_Subs_300x250', [300, 250], 'div-gpt-ad-1605624566043-1').addService(googletag.pubads());
    window.adTags['album_page_ad_3'] = googletag.defineSlot('/21697178033/Apps_Print_Mag_Subs_300x250', [300, 250], 'div-gpt-ad-1605624566043-10').addService(googletag.pubads());

	window.adTags['notification_page_ad_1'] = googletag.defineSlot('/21697178033/Apps_HT_Digital_Subs_728x320', [[320, 50], [728, 90]], 'div-gpt-ad-1605624284210-5').defineSizeMapping(mapping1).addService(googletag.pubads());
    window.adTags['notification_page_ad_2'] = googletag.defineSlot('/21697178033/Apps_ebooks_300x250', [300, 250], 'div-gpt-ad-1605624597553-1').addService(googletag.pubads());
	window.adTags['epaper_page_ad_1'] = googletag.defineSlot('/21697178033/Apps_HT_EPaper_Product_320x50', [320, 50], 'div-gpt-ad-1611987282522-0').addService(googletag.pubads());
	window.adTags['emagazine_page_ad_1'] = googletag.defineSlot('/21697178033/Apps_Digital_Mag_Product_320x50', [320, 50], 'div-gpt-ad-1611987325690-0').addService(googletag.pubads());
	window.adTags['ebook_page_ad_1'] = googletag.defineSlot('/21697178033/Apps_Digital_ebooks_Product_320x50', [320, 50], 'div-gpt-ad-1611987384338-0').addService(googletag.pubads());
	window.adTags['epaper_lib_page_ad_1'] = googletag.defineSlot('/21697178033/Apps_HT_EPaper_Product_320x50', [320, 50], 'div-gpt-ad-1611987282522-1').addService(googletag.pubads());
	window.adTags['emagazine_lib_page_ad_1'] = googletag.defineSlot('/21697178033/Apps_Digital_Mag_Product_320x50', [320, 50], 'div-gpt-ad-1611987325690-2').addService(googletag.pubads());
	window.adTags['ebook_lib_page_ad_1'] = googletag.defineSlot('/21697178033/Apps_Digital_ebooks_Product_320x50', [320, 50], 'div-gpt-ad-1611987384338-2').addService(googletag.pubads());
	
    googletag.pubads().enableSingleRequest();
    googletag.enableServices();

  });
  
  
});
}*/

function setfirebaseAnalytics(params) {
	
	var page = (typeof(params.page) != 'undefined') ? params.page : 'Default';
	var property = (typeof(params.property) != 'undefined') ? params.property : '';
	var propertyStringify = (property != '') ? JSON.stringify(property) : '';
	
	var deviceDetails = JSON.parse(localStorage.getItem('deviceDetails'));
	var userId = '';
	if(deviceDetails != null)
		userId = (typeof(deviceDetails.uuid) != 'undefined') ? deviceDetails.uuid : '';
	if(typeof(window.FirebasePlugin)!='undefined') {
		//setUserId
		window.FirebasePlugin.setUserId(userId,function(res){
			//console.log('setUserId Success ',res);
		},function(err){
			//console.log('setUserId Error ',err);
		});
	
		window.FirebasePlugin.logEvent(page, property,function(res){
			//console.log('logEvent Success ',res);
		},function(err){
			//console.log('logEvent Error ',err);
		});
	
		window.FirebasePlugin.setScreenName(page,function(res){
			//console.log('setScreenName Success ',res);
		},function(err){
			//console.log('setScreenName Error ',err);
		});
	
		window.FirebasePlugin.setUserProperty(page, propertyStringify,function(res){
			//console.log('setUserProperty Success ',res);
		},function(err){
			//console.log('setUserProperty Error ',err);
		});
	}
}

function getKamadenuInteriorDetail(aid) {
	localStorage.setItem('articleId',aid);
	var data = {type:'article',mid:2,key:accessToken,aid:aid};
	var userDetails = JSON.parse(localStorage.getItem('userDetails'));
	if(userDetails != null) {
		data.user_id = userDetails.user_id;
		data.access_key = userDetails.access_key;
		var emagazine = userDetails.user_access.emagazine;
		if(emagazine != 1) {
			app.dialog.confirm('Are you sure do you want to subscribe!','Confirmation!',function(){
				loadSubscriptionBrowser();
			});
		}
	} else {
		$('.showLoginButton').show();
	}
	$.ajax({
		url:apiUrl,
		method:'GET',
		dataType:'json',
		data:data,
		success:function(res) {
			if(res.msg == "success") {
				var data = res.data;
				if(data != null) {
					$('.addTittle').html(data.cate_ta);
					$('.kamadenuHeader').html('<div class="card-header"><h4>'+data.title_ta+'</h4></div><div class="card-content card-content-padding"><img src="'+data.img+'" onerror="this.src=\'assets/images/no-img.jpg\'" width="100%"/></div><div class="card-footer"><div class="uavatar"><img src="assets/images/admin.jpg"  width="34" height="34"/></div><div class="uname">காமதேனு</div><div class="udate">30 Sep 2020 18:37 PM</div><div class="share_news"><ul><li><a href="javascript:void(0)" class="facebook shareViaWhatsApp" data-type="facebook" data-url="'+data.web_url+'" data-msg="'+data.title_ta+'"><i class="fab fa-facebook"></i></a></li><li><a href="javascript:void(0)" class="whatsapp shareViaWhatsApp" data-type="whatsapp" data-url="'+data.web_url+'" data-msg="'+data.title_ta+'"><i class="fab fa-whatsapp"></i></a></li><li><a href="javascript:void(0)" class="twitter shareViaWhatsApp" data-type="twitter" data-url="'+data.web_url+'" data-msg="'+data.title_ta+'"><i class="fab fa-twitter"></i></a></li></ul></div></div>');
					$('.kamadenuContent').html('<div class="news_detail_desc">'+data.content+'</div>');
				}
			}
		},error:function(err) {
			toaster('You are in Offline');
		}
	});
}

function magazineLoginHandler(res) {
	if(res.msg == "success") {
		var aid = localStorage.getItem('articleId');
		
		var data = res.data;
		
		localStorage.setItem('userDetails',JSON.stringify(res.data));
		$('.showLoginButton').hide();
		$('#usercallback').val(false);
		getKamadenuInteriorDetail(aid);
		
		app.popup.close('.login-screen');
		var emagazine = data.user_access.emagazine;
		if(emagazine != 1) {
			app.dialog.confirm('Are you sure do you want to subscribe!','Confirmation!',function(){
				loadSubscriptionBrowser();
			});
		}
	}
}
/*$(document).on('click','.ios .navbar-inner .back',function(){
	console.log("back button pressed");
	mainView.router.back(mainView.history[0],{force:true});
});*/

$(document).on('click','.navbar-inner .backForce',function(){
	mainView.router.back(mainView.history[0],{force:true});
});

function generateKeyWord(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

function fileDownload(obj,callback) {
	
	if(cordova.platformId == 'android') {
		cordova.plugins.diagnostic.getExternalSdCardDetails(function(details){
			console.log('details',details);
			details.forEach(function(detail){
				console.log('detail',detail);
				cordova.file.externalSdCardDirectory = detail.filePath;
			});
		}, function(error){
			console.error(error);
		});
	}
	
	if(cordova.platformId == 'android') {
		fileDownLoadAndroid(obj,function(res) {
			callback(res);
		});
	} else if(cordova.platformId == 'ios') {
		fileDownLoadIos(obj,function(res) {
			callback(res);
		});
	}
	
	/*console.log(obj);
	console.log(cordova.file);
	app.preloader.show();	
	var fileTransfer = new FileTransfer();
	var path = '';
	//path = cordova.file.externalRootDirectory;	
	path = cordova.file.dataDirectory;
	
	cordova.plugins.diagnostic.requestExternalStorageAuthorization(function(success) {
		console.log('success');
		console.log(success);
		console.log("Authorization request for external storage use was " + (success == cordova.plugins.diagnostic.permissionStatus.GRANTED ? "granted" : "denied"));
		console.log(cordova.file);
		path = cordova.file.externalSdCardDirectory;
		var userDetails   = JSON.parse(localStorage.getItem('userDetails'));
	var file_name = generateKeyWord(6);
	var password = generateKeyWord(6);
	if(path != '') {
		fileTransfer.download(
			encodeURI(obj.url),
			path+file_name+'.ara',
			function(entry) {
				console.log('entry');
				console.log(entry);
				var encrypted = CryptoJS.AES.encrypt(entry.toURL(),password);
				app.preloader.hide();	
				saveElibrary({file_name:encrypted,image:obj.image,file_password:obj.password,file_path:entry.toURL(),file_extention:obj.file_extention,file_id:obj.issue_id,type:obj.type,title:obj.title,password:password,user_id:userDetails.user_id},function(res) {
					app.preloader.hide();
					callback(res);
				});	
				
			},
			function(error) {
				console.log('file handle error');
				console.log(error);
				app.preloader.hide();
				//alert('File downloaded failed');
				toaster('Download failed');
			}
		);
	}
	
		
	}, function(error) {
		console.log('error');
		console.log(error);
	});*/
}

function fileDownLoadIos(obj,callback) {
	console.log('obj');
	console.log(obj);
	var fileTransfer = new FileTransfer();
	path = cordova.file.dataDirectory;
	var userDetails   = JSON.parse(localStorage.getItem('userDetails'));
	var file_name = generateKeyWord(6);
	var password = generateKeyWord(6);
	if(path != '') {
		fileTransfer.download(
			encodeURI(obj.url),
			path+obj.file_name,
			function(entry) {
				console.log('entry');
				console.log(entry);
				var encrypted = CryptoJS.AES.encrypt(entry.toURL(),password);				 
				var encrypt_file = encrypted.toString();				
				var _file_name = encrypt_file+'.encrypt';                
                saveElibrary({file_name:_file_name,image:obj.image,file_password:obj.password,file_path:entry.toURL(),file_extention:obj.file_extention,file_id:obj.issue_id,type:obj.type,title:obj.title,password:password,user_id:userDetails.user_id},function(res) {
					app.preloader.hide();
					callback(res);
				});
				//app.preloader.hide();	
				/*saveElibrary({file_name:obj.file_name,image:obj.image,file_password:obj.password,file_path:entry.toURL(),file_extention:obj.file_extention,file_id:obj.issue_id,type:obj.type,title:obj.title,password:password,user_id:userDetails.user_id},function(res) {
					app.preloader.hide();
					callback(res);
				});	*/
				/*saveElibrary({file_name:obj.file_name,image:obj.image,file_password:obj.password,file_path:entry.toURL(),file_extention:obj.file_extention,file_id:obj.issue_id,type:obj.type,title:obj.title},function(res) {
					app.preloader.hide();
					callback(res);
				});*/
			},
			function(error) {
				console.log('file handle error');
				console.log(error);
				app.preloader.hide();
				//alert('File downloaded failed');
				toaster('Download failed');
			}
		);
	}
}

function fail(e) {
	console.log('Error : ', e.code);
}

function fileDownLoadAndroid(obj,callback) {
	app.preloader.show();	
	var fileTransfer = new FileTransfer();
	var path = '';
	//cordova.plugins.diagnostic.requestExternalStorageAuthorization(function(success) {
	path = (typeof(cordova.file.externalSdCardDirectory) != 'undefined') ? cordova.file.externalSdCardDirectory : cordova.file.dataDirectory;
	console.log(cordova.file);
	console.log(path);
	var userDetails   = JSON.parse(localStorage.getItem('userDetails'));
	var file_name = generateKeyWord(6);
	var password = generateKeyWord(6);
	if(path != '') {
		fileTransfer.download(
			encodeURI(obj.url),
			path+'/'+file_name+'.ara',
			function(entry) {
				console.log('entry');
				console.log(entry);
				console.log(entry.fullPath);
				var encrypted = CryptoJS.AES.encrypt(entry.fullPath,password);
				console.log(encrypted);
				var _file_name = file_name;
				encryptedText = encrypted.toString();
				var _filename = _file_name+'.encrypt';

				window.resolveLocalFileSystemURL(path, function(dir) {
					console.log("got main dir",dir);
					dir.getFile(file_name+'.ara.encrypted', {create:true}, function(createdFile) {
						console.log("got the file", createdFile);
						createdFile.createWriter(function(fileWriter) {
							console.log('Creae ann');
							fileWriter.seek(fileWriter.length);
							console.log(fileWriter.length);
							//var blob = new Blob([encryptedText], {type:'text/plain'});
							//fileWriter.write(blob);
							fileWriter.write(encryptedText);
							console.log('Encrypted text - added');
						},fail);
					});
				});

				/* dirEntry = path;
				dirEntry.getFile(file_name, {
			       create: true,
			       exclusive: false
			     }, (function(fileEntry,file_name,fullPath,encrypted) {
			       return writeFile(fileEntry,file_name,fullPath,encrypted); // writeFile is a method that would write blob into initialized temp storage.
			     }), fail); */

				/* fileEncrption({file_name:file_name+'.ara',password:password});*/
				console.log('Password',password);
				console.log(encryptedText);
				saveElibrary({file_name:_filename,image:obj.image,file_password:obj.password,file_path:entry.toURL(),file_extention:obj.file_extention,file_id:obj.issue_id,type:obj.type,title:obj.title,password:password,user_id:userDetails.user_id,encrypted:encrypted},function(res) {
					app.preloader.hide();
					callback(res);
				}); 
				//app.preloader.hide();	
					
				/*saveElibrary({file_name:obj.file_name,image:obj.image,file_password:obj.password,file_path:entry.toURL(),file_extention:obj.file_extention,file_id:obj.issue_id,type:obj.type,title:obj.title},function(res) {
					app.preloader.hide();
					callback(res);
				});*/
			},
			function(error) {
				console.log('file handle error');
				console.log(error);
				app.preloader.hide();
				//alert('File downloaded failed');
				toaster('Download failed');
			}
		);
	}		

	
	/*}, function(error) {
		console.log('error');
		console.log(error);
	});*/
}

function writeFile(fileEntry,filename,filepath,fileencrypt) {
   //base64 = canvasObject.toDataURL("image/png"); // Base64 string
  
  fileEntry.createWriter(function(fileWriter,filename,filepath,fileencrypt) {
  	 return fileWriter.write(fileEntry,filename,filepath,fileencrypt);
   /*  var data, string, type;
     string = base64.split(';base64,');
     type = string[0].split(':')[1];
     data = base64toBlob(string[1], type);
     
     fileWriter.onwriteend = function() {
       console.log('Successful file write...');
       
       // Call function that would upload file via File Transfer plugin.
       // Example: upload(fileEntry)
     };

     fileWriter.onerror = function(e) {
       return console.log('Failed file write: ' + e.toString());
     };
     */
     
     //return fileWriter.write(fileEntry);
   });
}

function fileDownload1() {
	
	var encrypted = CryptoJS.AES.encrypt('https://static.hindutamil.in/epaper/EpaperTest/2021/02/19/pdf/CH_glpax6v.pdf', '');
	 var file = 'data:application/octet-stream,' + encrypted;
	 console.log(file);
	var decrypted = CryptoJS.AES.decrypt(encrypted, '').toString(CryptoJS.enc.Latin1);
	console.log(decrypted);
}

function getVideoCategory(title) {
	
	var data = {type:'cate',key:accessToken,mid:5};
	$.ajax({
		url:apiUrl,
		method:'GET',
		dataType:'json',
		data:data,
		success:function(res) {
			var content = allColor = '';
			if(res.msg == "success") {				
				var data = res.data;
				if(data != null && data.length > 0) {
					if((title) == 'all') {
						allColor = 'color-blue';
					}
					
					content += '<div class="chip getVideoDetails '+allColor+'" data-type="all"><div class="chip-label">All</div></div>';
					for(var i = 0;i < data.length;i++) {
						allColor = '';
						if(data[i].cid == title) {
							allColor = 'color-blue';
						}
						content += '<div class="chip getVideoDetails '+allColor+'" data-type="'+data[i].cid+'"><div class="chip-label">'+data[i].title_ta+'</div></div>';
					}
					allColor = '';
					if((title) == 0) {
						allColor = 'color-blue';
					}
					
					content += '<div class="chip getVideoDetails '+allColor+'" data-type="0"><div class="chip-label">மற்றவை</div></div>';
					$('.video-category').html(content);
				}
			}
		},error:function(err) {
			toaster('You are in Offline');
		}
	});
}

function deepLink() {
	universalLinks.subscribe('DWND', function (eventData) {
	
	});
	
	universalLinks.subscribe('ul_myExampleEvent', function (eventData) {
	  var path = eventData.path;
	  
	  if(path != '' && typeof(path) != 'undefined') {
		var page = path.split('/');
		if(page[1] == 'news') {
			var aid = page[3].split('-')[0];
			if(aid != 0 && aid != '' && typeof(aid) != 'undefined') {
				mainView.router.load({url:'pages/news-detail.html?back=false&aid='+aid});
			}
		} else if(page[1] == 'album') {
			var aid = page[3].split('-')[0];
			var cid = eventData.params.cid;
			//openPhotoBrowserViaDeepLink(aid);
			if(typeof(cid) != 'undefined' && typeof(aid) != 'undefined') {				
				var res = getAlbumDetails(cid,aid);
				if(res.length > 0) {
					res = res[0];
					var share = res.web_url+'?cid='+res.cid;
					var images=(imgTOURL(res.content,share));
					Array.prototype.insert = function ( index, item ) {
						this.splice( index, 0, item );
					};
					images.insert(5, {html:"<div id='div-gpt-ad-1605624326531-2' class='album_ad' ></div>"});
					images.insert(10, {html:"<div id='div-gpt-ad-1605624326531-3' class='album_ad' ></div>"});
					
					/*initiate album*/
					initAlbum(images);
				}
			}
		}
	  }
	});
}

function openPhotoBrowserViaDeepLink(aid) {
	var shareUrl = $('.triggerPhotoBrowser_'+aid).attr('data-url');
	// var images=$(this).find('.card-header').data('image');
	var images = JSON.parse($('.triggerPhotoBrowser_'+aid).find('.ablum_data').html());
	
	Array.prototype.insert = function ( index, item ) {
	    this.splice( index, 0, item );
	};
	//images.insert(5, {caption:'<div id="div-gpt-ad-1605632724271-0"><script>refreshAds("album_page_ad_2");</script></div>'});
	
    images.insert(5, {html:"<div id='div-gpt-ad-1605624326531-2' class='album_ad' ></div>"});
    images.insert(10, {html:"<div id='div-gpt-ad-1605624326531-3' class='album_ad' ></div>"});
	
	/*var img = [];2169
	for(var i = 0;i < images.length;i++) {
		img.push(images[i].replace('thumb','large'));
	}*/
	
	/*initiate album*/
	initAlbum(images,shareUrl);
}

function getWowBook() {
	/*$('.showHomePageDetails').html('');
	setTimeout(function(){
		//$('body').html(html);
		
		$('#bookView').wowBook({
		
				height   : 400,
				updateBrowserURL:false,
				width    : '100%',
				pageNumbers: true,
				pdf: "API.pdf",
				pdfFind: true,
				curl: false,
				softPage:true,
				firstPageNumber:1,
				thumbnailWidth:120,
				thumbnailHeight:120,
				scaleToFit: ".book_section",
				responsiveHandleWidth : 120,
				
				slideShowDelay:500,
				toolbar: "lastLeft, left, right, lastRight, flipsound, slideshow",
				toolbarParent:'.wow_toolbar',
				containerBackground:'#1a242f',
				container: true,
				containerHeight: 500,
				containerWidth: 340,
		});   
	},500);
	
    var book = $('#mybook');*/
	
	/*var myState = {
		pdf: null,
		currentPage: 1,
		zoom: 1
	}

	pdfjsLib.getDocument('https://demolinc.com/hindu-app/API.pdf').then((pdf) => {
		myState.pdf = pdf;
		render(myState);
	});*/
	
	window.reader = ePubReader("ariviyal1000.epub", {
		restore: true,
		manager: "continuous",
		flow: "paginated",
		width: "100%",
		height: "100%",
		snap: true
	});
	
	/*setTimeout(function() {
		
		var book = ePub("ariviyal1000.epub");
		console.log(book);
		var rendition = book.renderTo("viewer-epub", {
		  manager: "continuous",
		  flow: "paginated",
		  width: "100%",
		  height: "100%"
		});
		console.log(rendition);
		var displayed = rendition.display("chapter_001.xhtml");

		displayed.then(function(renderer){
		  // -- do stuff
		});

		// Navigation loaded
		book.loaded.navigation.then(function(toc){
		  // console.log(toc);
		});

		var next = document.getElementById("next");
		next.addEventListener("click", function(){
		  rendition.next();
		}, false);

		var prev = document.getElementById("prev");
		prev.addEventListener("click", function(){
		  rendition.prev();
		}, false);

		document.addEventListener("keyup", function(e){

		  // Left Key
		  if ((e.keyCode || e.which) == 37) {
			rendition.prev();
		  }

		  // Right Key
		  if ((e.keyCode || e.which) == 39) {
			rendition.next();
		  }

		}, false);

		$(window).on( "swipeleft", function( event ) {
		  rendition.next();
		});

		$(window).on( "swiperight", function( event ) {
		  rendition.prev();
		});
	},2000);*/
}

function getEpaperList(date,val) {

	if(typeof(AdMob) != 'undefined') {
		AdMob.showBanner(AdMob.AD_POSITION.BOTTOM_CENTER);
	}

	showPreLoader($('#epaper-tab'),1);
	var city = JSON.parse(localStorage.getItem('ePaperCity'));
	if(city == null) {
		city = "சென்னை";
		localStorage.setItem('ePaperCity',JSON.stringify(city));
	}
	if(typeof(val) != 'undefined') {
		city = val;
	}
	var data = {key:accessToken,date:date,ptype:'edition',type:'epaper'};
	if(typeof(cordova) != 'undefined') {		
		setfirebaseAnalytics({page:'E-paper page',property:{content_type: "E-paper page", item_id:{ptype:'edition',type:'epaper'}}});
	}

	var userDetails   = JSON.parse(localStorage.getItem('userDetails'));
	if(userDetails != null) {
		data.user_id = userDetails.user_id;
	}
	$.ajax({
		url:apiUrl,
		method:'GET',
		dataType:'json',
		data:data,
		success:function(res) {
			if(res.msg == "success") {
				console.log(res);
				var data = res.data.editions;
				if(data != null) {
					var image = pdf = cityDropDown = isOpen = editorId = '';
					for(var i = 0;i < data.length;i++) {
						var selected =  '';
						if(city == data[i].city) {
							editorId = data[i].issue_id;
							isOpen = data[i].is_open;
							image = data[i].img;
							selected = 'selected';
							pdf = data[i].pdf;
						}						
						cityDropDown += '<option value="'+data[i].city+'" '+selected+'>'+data[i].city+'</option>';
					}
					var showButton = true;
					checkFileExists({id:editorId},function(response) {
						if(response.length > 0) {
							showButton = false;
						}
						var validationDate = JSON.parse(localStorage.getItem('epaperCredentials'));
						//var content = '<div class="subscribe-overlay" style="display:none;"><a href="javascript:;" class="button button-large button-fill color-green ePaperTryNow" data-mid="7"><i class="fa fa-bell"></i> Try 15 Days Free Trail</a></div>';
						var content = '<div class="subscribe-overlay" style="display:none;"><a href="javascript:;" class="button button-large button-fill color-green ePaperTryNow" data-mid="7"><i class="fa fa-bell"></i> Buy Now</a></div>';
						if(validationDate != null && validationDate.epaper != '') {
							content += '<p class="validity">your subscription is valid upto <strong>'+validationDate.epaper+'</strong></p>';
						}
						var attr = ' data-edition-id="'+editorId+'" data-title="'+city+'" data-mid="7" data-pdf="'+pdf+'" data-heading="'+city+'" data-img="'+image+'" data-date="'+date+'" ';
						content += "<div id='div-gpt-ad-1611987282522-0' class='text-center' ><script>refreshAds('epaper_page_ad_1');</script></div>";
						content += '<div class="block block-sm"><div class="row"><div class="col-50"><select placeholder="Choose Edition" class="form-control custom-select e-paper-city-dropdown">'+cityDropDown+'</select></div><div class="col-50"><input type="text" placeholder="Select date" value="'+date+'" class="form-control e-paper-date-picker datepicker" /></div></div>';
						
						var button = '<div class="row"><button class="button button-fill button-small button-block color-blue e-paper-track-button ePaperButton" data-type="read" '+attr+'>Read Now</button></div>';
						if(isOpen == 1 && showButton) {
							button = '<div class="row"><button class="button button-fill button-small button-block color-green e-paper-track-button ePaperButton" data-type="save" '+attr+'>Save Offline</button></div>';
						} else if(isOpen != 0 && !showButton) {
							button = '<button class="button button-fill button-small button-block color-red e-paper-track-button" data-type="stored" '+attr+'>Saved</button>';
						}
											
						content += '<a href="javascript:;" class="epaper-link viewEpaperDetail" '+attr+' data-pdf="'+pdf+'" data-heading="E-paper"><img src="'+image+'" onerror="this.src=\'assets/images/no-img.jpg\'" alt=""/></a>'+button+'</div>';
						
						$('#epaper-tab').html(content);	
						applyDatePicker();
					});
				}
			}
		},error:function(err) {
			toaster('You are in Offline');
		}
	});
	
	
}

function getEmagazineList(obj) {	
	var existingArray = [];
	checkFileExists({type:'pdf'},function(resp) {
		if(resp.length > 0) {
			for(var i = 0;i < resp.length;i++) {
				existingArray.push(resp[i].file_id);
			}
		}
		showPreLoader($('#emagazine-tab'),1);
		var userDetails = JSON.parse(localStorage.getItem('userDetails'));
		var year = month = '';
		var data = {key:accessToken,type:'mag_issue'};
		if(typeof(obj.year) != 'undefined') {
			data.year = obj.year;
			year = obj.year;
		}

		if(typeof(cordova) != 'undefined') {		
			setfirebaseAnalytics({page:'E-magazine page',property:{content_type: "E-magazine page", item_id:{type:'mag_issue'}}});
		}

		if(typeof(obj.month) != 'undefined') {
			data.month = obj.month;
			var month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
			month = month[obj.month-1];
		}
		if(userDetails != null) {
			data.user_id = userDetails.user_id;
		}
		var content = cont = '';
		/*ajax call*/
		$.ajax({
			url:apiUrl,
			method:'GET',
			dataType:'json',
			data:data,
			success:function(res) {
				if(res.msg == "success") {
					var data = res.data;
					if(data != null && data.length > 0) {
						var validationDate = JSON.parse(localStorage.getItem('epaperCredentials'));
						if(validationDate != null && validationDate.kamadenu != '') {
							content += '<p class="validity">your subscription is valid upto <strong>'+validationDate.kamadenu+'</strong></p>';
						}
						if(obj.show == 0) {
							content += '<div class="block block-sm"><div class="row"><div class="col-70"><input type="text" autocomplete="off" id="e-magazine-year" class="form-control yearpicker" placeholder="Select year" value="'+year+'-'+month+'"/></div><div class="col-30"><button class="filterMagazines">Submit</button></div></div></div>';
						}
						content += "<div id='div-gpt-ad-1611987325690-0' class='text-center' ><script>refreshAds('emagazine_page_ad_1');</script></div>";
						content += '<div class="block block-sm">';						
						content += '<div class="row">';
						for(var i = 0;i < data.length;i++) {
							var attr = ' data-module-id="'+data[i].module_id+'" data-issue-id="'+data[i].issue_id+'" data-url="'+data[i].file_url+'" data-password="'+data[i].file_password+'" data-img="'+data[i].img.replace('medium','large')+'" data-title="'+data[i].date+'" data-file-name="'+data[i].file_name+'" data-heading="'+data[i].name+'" ';
							var button = '<button class="button button-fill button-small button-block color-blue emagazineButton viewMagzineDetail replaceDownLoadButton" '+attr+' data-type="read">Read Now</button>';
							if(data[i].is_open == 1) {
								if($.inArray((data[i].issue_id),existingArray) != -1) {
									button = '<button class="button button-fill button-small button-block color-red emagazineButton viewMagzineDetail replaceDownLoadButton" '+attr+' data-type="stored">Saved</button>';
								} else {
									button = '<button class="button button-fill button-small button-block color-green emagazineButton viewMagzineDetail replaceDownLoadButton" '+attr+' data-type="save">Save Offline</button>';
								}
							}
							//content += '<div class="col-33 tablet-25" '+attr+'><div class="econtent"><a href="javascript:;" class="epaper"><img src="'+data[i].img+'" onerror="this.src=\'assets/images/no-img.jpg\'" class="" alt=""/></a><label class="ename">'+data[i].name+'</label>'+button+'</div></div>';
							content += '<div class="col-50 medium-25 changeDownLoadButton_'+data[i].issue_id+'" '+attr+'><div class="econtent"><a href="javascript:;" class="epaper"><img src="'+data[i].img.replace('medium','large')+'" '+attr+' class="viewEmagaZine" alt="" /></a><label class="ename">'+data[i].date+' <a href="javascript:;" class="popover-open" data-popover=".popover-viewer""></a></label>'+button+'</div></div>';
						}
						if(obj.show == 1) {
							cont += '<div class="text-center mt-20 viewArchives"><a href="javascript:;" class="button button-fill color-blue"><i class="fa fa-database"></i>&nbsp;&nbsp; View Archived</a></div>';
						}
						content += '</div>'+cont+'</div>';
					} else {
						if(obj.show == 0) {
							content += '<div class="block block-sm"><div class="row"><div class="col-70"><input type="text" autocomplete="off" id="e-magazine-year" class="form-control yearpicker" placeholder="Select year" value="'+year+'-'+month+'"/></div><div class="col-30"><button class="filterMagazines">Submit</button></div></div></div>';
						}
						content += '<div class="no-record">No records found</div>';
					}
					$('#emagazine-tab').html(content);
					
					setTimeout(function() {
						//applyMonthPicker();
						applyYearPicker();
					},500);
				}
			},error:function(err) {
				toaster('You are in Offline');
			}
		});
	});
}

function getEbooksList() {
	if(typeof(AdMob) != 'undefined') {
		AdMob.showBanner(AdMob.AD_POSITION.BOTTOM_CENTER);
	}
	
	$('.eBookAds').html("<div id='div-gpt-ad-1611987384338-0' class='text-center' ><script>refreshAds('ebook_page_ad_1');</script></div>");
	if(typeof(cordova) != 'undefined') {		
		setfirebaseAnalytics({page:'E-book page',property:{content_type: "E-book page", item_id:{type:'E-book'}}});
	}
	getPurchasedBook();
	getBuyMoreBooks();	
}

function getPurchasedBookCount() {
	var userDetails = JSON.parse(localStorage.getItem('userDetails'));
	if(userDetails != null) {
		var data = {type:'orders',key:accessToken,user_id:userDetails.user_id};
		/*ajax call*/
		$.ajax({
			url:apiUrl,
			method:'GET',
			dataType:'json',
			data:data,
			success:function(res) {	
				if(res.msg == "success") {
					var data = res.data;
					if(data != null) {
						var kamaDate = epaperDate = '';
						if(data.subscriptions.kamadenu != null) {
							kamaDate = typeof((data.subscriptions.kamadenu).split(' ')[0]) != 'undefined' ? (data.subscriptions.kamadenu).split(' ')[0].split('-') : '';
							kamaDate = kamaDate != '' ? (kamaDate[2]+'.'+kamaDate[1]+'.'+kamaDate[0]) : '';
						}
						if(data.subscriptions.epaper != null) {
							epaperDate = typeof((data.subscriptions.epaper).split(' ')[0]) != 'undefined' ? (data.subscriptions.epaper).split(' ')[0].split('-') : '';
							epaperDate = epaperDate != '' ? (epaperDate[2]+'.'+epaperDate[1]+'.'+epaperDate[0]) : '';
						}
						var epaper = 0;
						var array = [];
						if(data.ebooks != null && data.ebooks.length > 0) {
							epaper = data.ebooks.length;
							for(var i = 0;i < epaper;i++) {
								array.push(data.ebooks[i]['issue_id']);
							}
						}
						localStorage.setItem('productIds',JSON.stringify(array));
						var resp = {kamadenu:kamaDate,epaper:epaperDate,ebook:epaper};
						localStorage.setItem('epaperCredentials',JSON.stringify(resp));
					}
				}
			},error:function(err) {
				toaster('You are in Offline');
			}
		});
	} else {
		localStorage.removeItem('epaperCredentials');
	}
}

function getPurchasedBook() {
	var existingArray = [];
	var userDetails = JSON.parse(localStorage.getItem('userDetails'));
	if(userDetails != null) {
		checkFileExists({type:'epub'},function(resp) {
			if(resp.length > 0) {
				for(var i = 0;i < resp.length;i++) {
					existingArray.push(resp[i].file_id);
				}
			}
			var data = {type:'orders',key:accessToken,user_id:userDetails.user_id};
			/*ajax call*/
			$.ajax({
				url:apiUrl,
				method:'GET',
				dataType:'json',
				data:data,
				success:function(res) {
					if(res.msg == "success") {
						var purchasedBooks = '';
						var purBook = res.data.ebooks;
						if(purBook != null) {
							purchasedBooks += '<h4>Purchased Books</h4><div class="row">';
							for(var j = 0;j < purBook.length;j++) {
								var attr = ' data-url="'+purBook[j].file_url+'" data-issue-id="'+purBook[j].issue_id+'" data-title="'+purBook[j].issue_name+'" data-file-name="'+purBook[j].file_name+'.epub" data-img="'+purBook[j].img.replace('thumb','large')+'" data-heading="'+purBook[j].issue_name+'" ';
								var button = '<button class="button button-fill button-small button-block color-blue ebookbutton viewEpubFile replaceDownLoadButton" data-type="read" '+attr+'>Read Now</button>';
								if(purBook[j].is_open == 1) {
									if($.inArray((purBook[j].issue_id),existingArray) != -1) {
										button = '<button class="button button-fill button-small button-block color-red ebookbutton viewEpubFile replaceDownLoadButton" data-type="stored" '+attr+'>Saved</button>';
									} else {
										button = '<button class="button button-fill button-small button-block color-green ebookbutton viewEpubFile replaceDownLoadButton" data-type="save" '+attr+'>Save Offline</button>';
									}
								}
								purchasedBooks += '<div class="col-50 medium-25 changeDownLoadButton_'+purBook[j].issue_id+'"><div class="econtent"><a href="javascript:;" class="epaper"><img src="'+purBook[j].img.replace('thumb','large')+'" onerror="this.src=\'assets/images/no-img.jpg\'" class="viewEBookDetail" '+attr+' alt=""></a><label class="ename">'+purBook[j].issue_name.substr(0,30)+'</label>'+button+'</div></div>';
							}
							purchasedBooks += '</div>';
						}
						$('.purchasedBooks').html(purchasedBooks);
					}
				},error:function(err) {
					toaster('You are in Offline');
				}
			});
		});
	}
}

function getBuyMoreBooks() {
	var data = {type:'products',key:accessToken,ptype:'ebook'};
	showPreLoader($('.buyNewBooks'),1);
	$.ajax({
		url:apiUrl,
		method:'GET',
		dataType:'json',
		data:data,
		success:function(res) {
			if(res.msg == "success") {
				var data = res.data;
				var data = data.ebook;
				if(data != null && data.length > 0) {
					var buyMoreBooks = '';
					buyMoreBooks += '<h4>Buy More Books<a href="javascript:;" class="pull-right showProductSearchBuyMore"><i class="fa fa-search"></i> Search</a></h4>';
					buyMoreBooks += '<div class="list no-hairlines-md showProductSearch" style="display:none;"><ul><li class="item-content item-input"><div class="item-inner"><div class="item-title item-label">Title</div><div class="item-input-wrap"><input type="text" placeholder="Enter title" class="eBookTitle"/><span class="input-clear-button"></span></div></div></li><li class="item-content item-input"><div class="item-inner"><div class="item-title item-label">Author</div><div class="item-input-wrap"><input type="text" placeholder="Enter author" class="eBookAuthor"/><span class="input-clear-button"></span></div></div></li><li class="item-content item-input"><div class="item-inner"><div class="item-title item-label">Choose Category</div><div class="item-input-wrap input-dropdown-wrap"><select placeholder="Please choose..." class="searchProductsDropDown eBookCategory"></select></div></div></li></ul><div class="row mb-20"><a href="" class="col button button-fill color-gray eBookSearchClear">Clear</a><a href="javascript:;" class="col button button-fill eBookSearchResult">Submit</a></div></div>';
					buyMoreBooks += '<div class="row">';
					//buyMoreBooks += '<h4>Buy More Books</h4><div class="row">';
					var ids = JSON.parse(localStorage.getItem('productIds'));
					var category = '<option value="">Please select category</option>';
					var categoryArr = [];
					for(var i = 0;i < data.length;i++) {
						if(typeof(cordova)!='undefined') {
							storeProducts(data[i]);
						}
						
						if(($.inArray(data[i].cate_name,categoryArr)) == -1) {
							categoryArr.push(data[i].cate_name);
							category += '<option value="'+data[i].cate_name+'">'+data[i].cate_name+'</option>';
						}

						if($.inArray(data[i].prod_id,ids) < 1) {
							buyMoreBooks += '<div class="col-50 medium-25 ePaperTryNow" data-mid="10" data-issue-id="'+data[i].prod_id+'"><div class="econtent"><a data-type="subscribe" href="javascript:;" class="epaper"><img src="'+data[i].img.replace('thumb','large')+'" onerror="this.src=\'assets/images/no-img.jpg\'" class="" alt=""></a><label class="ename">'+data[i].title.substr(0,30)+'</label><button data-mid="10" data-issue-id="'+data[i].prod_id+'" class="button button-fill button-small button-block color-blue ePaperTryNow" data-type="subscribe">Buy Now</button></div></div>';
						}
					}
					setTimeout(function() {
						localStorage.setItem('productCategory',JSON.stringify(categoryArr));
						$('.searchProductsDropDown').html(category);
					},150);
					buyMoreBooks += '</div>';
					$('.buyNewBooks').html(buyMoreBooks);
				}
			}
		},error:function(err) {
			toaster('You are in Offline');
		}
	});
}

function applyYearPicker() {
	$('.yearpicker').datepicker('destroy');
	$('.yearpicker').datepicker({
		format: "yyyy-MM",
		viewMode: "months", 
		endDate: '+0d',
		autoclose:true,
		disableTouchKeyboard: true,
		orientation: 'bottom',
		minViewMode: "months"
	});
}

function applyMonthPicker(val) {
	$('.monthpicker').datepicker('destroy');
	endDate = '';
	if(val) {
		endDate = '+0m';
	}
	var data = {format: "MM",viewMode: "months",autoclose:true,orientation: 'bottom auto',minViewMode: "months",endDate:endDate,disableTouchKeyboard:true,orientation:'bottom'};
	$('.monthpicker').datepicker(data);
}

function applyDatePicker() {
	var d = new Date();
	var currDate = d.getDate();
	var currMonth = d.getMonth();
	var currYear = d.getFullYear();
	var startDate = '01-07-2018';
	var endDate = '+0d';
	var userDetails = JSON.parse(localStorage.getItem('userDetails'));
	
	$('.datepicker').datepicker('destroy');
	
	$('.datepicker').datepicker({
		setDate:new Date(currYear,currMonth,currDate),
		format:'dd-mm-yyyy',
		startDate: startDate,
		autoclose:true,
		endDate: endDate,
		disableTouchKeyboard: true,
		orientation: 'bottom'
	});
}

function loadSubscriptionToInAppBrowser(options) {
	var userDetails = JSON.parse(localStorage.getItem('userDetails'));
	var user_email = '';var user_id = '';
	var mid = typeof(options.mid) != 'undefined' ? options.mid : '';
	var issueId = typeof(options.issue_id) != 'undefined' ? options.issue_id : '';
	if(userDetails != null) {
		user_email = userDetails.user_email;
		user_id = userDetails.user_id;
	}
	console.log("https://api.hindutamil.in/app/index.php?type=go_store&key="+accessToken+"&user_email="+user_email+"&user_id="+user_id+"&mid="+mid+"&issue_id="+issueId);
	if(typeof(device)!='undefined' && device.platform=='Android')
	{
		OnlineStoreInappBrowser=cordova.InAppBrowser.open("https://api.hindutamil.in/app/index.php?type=go_store&key="+accessToken+"&user_email="+user_email+"&user_id="+user_id+"&mid="+mid+"&issue_id="+issueId,'_self','location=yes,hideurlbar=yes,footer=no,closebuttoncolor=#FFFFFF,closebuttoncaption=Close,toolbarcolor=#00569d,navigationbuttoncolor=#FFFFFF');
		if(userDetails != null) {
			OnlineStoreInappBrowser.addEventListener('exit',function(event){
				inBrowserClose();
			});			
		}		
	}
	else if(typeof(device)!='undefined' && device.platform=='iOS')
	{
		mainView.router.load({url:'pages/in-app-purchase.html'});
		/*if(moment().unix()>='1622831400') {
			OnlineStoreInappBrowser=cordova.InAppBrowser.open("https://api.hindutamil.in/app/index.php?type=go_store&key="+accessToken+"&user_email="+user_email+"&user_id="+user_id+"&mid="+mid+"&issue_id="+issueId,'_blank','location=no,usewkwebview=yes,closebuttoncaption=Close,toolbar=yes,toolbarcolor=#00569d,closebuttoncolor=#FFFFFF,toolbarposition=top,navigationbuttoncolor=#FFFFFF,hidenavigationbuttons=no');
			if(userDetails != null) {
				OnlineStoreInappBrowser.addEventListener('exit',function(){
					inBrowserClose();
				});
			}
		}*/
	}
}

function trackUserStatus(object,callback) {
	app.preloader.show();
	var deviceDetails = JSON.parse(localStorage.getItem('deviceDetails'));
	object.device_id = deviceDetails.uuid;
	object.key = accessToken;
	object.type = 'track';
	/*ajax call*/
	$.ajax({
		url:apiUrl,
		method:'GET',
		dataType:'json',
		data:object,
		success:function(res) {
			app.preloader.hide();
			callback(res);
		},error:function(err) {
			app.preloader.hide();
			toaster('You are in Offline');
		}
	});
}

function getElibrary(type) {
	$('#epaper-tab-library').html('');
	var isOnline = 'onLine' in navigator && navigator.onLine;
	if(!isOnline) {
		$('.eLibraryBackLink').hide();
	}
	app.popup.close();
	checkFileExists({type:type},function(resp) {
		var data = resp;
		if(type == 'paper') {
			if(typeof(cordova) != 'undefined' && isOnline) {		
				setfirebaseAnalytics({page:'E-library E-paper page',property:{content_type: "E-library E-paper page", item_id:{type:'E-library E-paper'}}});
			}

			console.log('epaper');
			console.log(data);
			showPreLoader($('#epaper-tab-library'),1);
			var data = resp;
			var content = '';
			if(resp.length > 0) {
				content = '';
				if(isOnline) {
					content += "<div id='div-gpt-ad-1611987282522-1' class='text-center'><script>refreshAds('epaper_lib_page_ad_1');</script></div>";
				}
				content += '<div class="block block-sm">';
				content += '<div class="row row-style-2">';
				getimageResolvedURL(0,data,content,function(content){
					console.log(content);
					$('#epaper-tab-library').html(content);
				});
			} else {
				content += '<div class="no-record">No records found</div>';
				$('#epaper-tab-library').html(content);
			}
			
		} else if(type == 'pdf') {
			console.log('emagazine');
			if(typeof(cordova) != 'undefined' && isOnline) {		
				setfirebaseAnalytics({page:'E-library E-magazine page',property:{content_type: "E-library E-magazine page", item_id:{type:'E-library E-magazine'}}});
			}
			console.log(resp);
			showPreLoader($('#emagazine-tab-library'),1);
			var content = '';
			if(resp.length > 0) {
				if(isOnline) {
					//content += "<div id='div-gpt-ad-1611987325690-2' class='text-center' ><script>refreshAds('emagazine_lib_page_ad_1');</script></div>";
				}
				content += '<div class="block block-sm">';
				content += '<div class="row row-style-2">';
				for(var i = 0;i < data.length;i++) {
					var attr = ' data-url="'+data[i].file_path+'" data-file-name="'+data[i].file_name+'" data-password="'+data[i].password+'" data-type="pdf" data-heading="'+data[i].title+'" ';
					var button = '<button class="button button-fill button-small button-block color-red deleteLibraryFile" data-type="pdf" data-file-name="'+data[i].file_name+'" data-id="'+data[i].id+'">Delete</button>';
					content += '<div class="col-50 medium-25 remove_e_paper_'+data[i].id+'"><div class="econtent"><a href="javascript:;" class="epaper viewElibrary" '+attr+'><img src="'+data[i].image+'" onerror="this.src=\'assets/images/no-img.jpg\'" class="" alt=""/></a><label class="ename">'+data[i].title.substr(0,30)+'</label>'+button+'</div></div>';
				}
			} else {
				content += '<div class="no-record">No records found</div>';
			}
			$('#emagazine-tab-library').html(content);
		} else if(type == 'epub') {
			console.log('ebook');
			if(typeof(cordova) != 'undefined' && isOnline) {		
				setfirebaseAnalytics({page:'E-library E-book page',property:{content_type: "E-library E-book page", item_id:{type:'E-library E-book'}}});
			}
			console.log(resp);
			showPreLoader($('#ebook-tab-library'),1);
			var purBook = resp;
			var purchasedBooks = '';
			if(resp.length > 0) {
				if(isOnline) {
					purchasedBooks += "<div id='div-gpt-ad-1611987384338-2' class='text-center' ><script>refreshAds('ebook_lib_page_ad_1');</script></div>";
				}
				purchasedBooks += '<div class="block block-sm">';
				purchasedBooks+= '<div class="row row-style-2">';
				for(var j = 0;j < purBook.length;j++) {
					var attr = ' data-url="'+purBook[j].file_path+'" data-file-name="'+purBook[j].file_name+'" data-issue-id="'+purBook[j].file_id+'" data-type="epub" data-heading="'+purBook[j].title+'" data-password="'+purBook[j].password+'" ';
					var button = '<button class="button button-fill button-small button-block color-red deleteLibraryFile" data-type="epub" data-file-name="'+purBook[j].file_name+'" data-id="'+purBook[j].id+'">Delete</button>';
					purchasedBooks += '<div class="col-50 medium-25 remove_e_paper_'+purBook[j].id+'"><div class="econtent"><a href="javascript:;" '+attr+' class="epaper viewElibrary" '+attr+'><img src="'+purBook[j].image+'" onerror="this.src=\'assets/images/no-img.jpg\'" class="" alt=""></a><label class="ename">'+purBook[j].title.substr(0,30)+'</label>'+button+'</div></div>';
				}
				purchasedBooks += '</div></div>';
			} else {
				purchasedBooks += '<div class="no-record">No records found</div>';
			}
			$('#ebook-tab-library').html(purchasedBooks);
		}
	});
}

function fileReader(file_name,callback)
{
	path = cordova.file.dataDirectory;
	/*if(typeof(device)!='undefined' && device.platform == 'Android') {
		path = cordova.file.dataDirectory;
	} else if(typeof(device)!='undefined' && device.platform == 'ios') {
		path = cordova.file.applicationStorageDirectory;
	}*/
	window.resolveLocalFileSystemURL(path+file_name, function (dirEntry) {
		dirEntry.file(function(file) {
			callback(file.localURL);
			/*var reader = new FileReader();

			reader.onloadend = function(e) {
				console.log("File contains: "+e);
				callback(e.target.result);
			}
			reader.readAsDataURL(file);*/
		});
	});
}
function fileReaderBlob(file_name,callback)
{
	path = cordova.file.dataDirectory;
	/*if(typeof(device)!='undefined' && device.platform == 'Android') {
		path = cordova.file.dataDirectory;
	} else if(typeof(device)!='undefined' && device.platform == 'ios') {
		path = cordova.file.applicationStorageDirectory;
	}*/
	window.resolveLocalFileSystemURL(path+file_name, function (dirEntry) {
		dirEntry.file(function(file) {
			callback(file.localURL);
			/*var reader = new FileReader();

			reader.onloadend = function(e) {
				console.log("File contains: "+e);
				var blob = new Blob([new Uint8Array(e.target.result)], { type: "application/epub" });
				fileURL=window.URL.createObjectURL(blob);
				console.log('fileURL',fileURL);
				callback(fileURL);
			}
			reader.readAsArrayBuffer(file);*/
		});
	});
}

function fileReaderePub(options,callback)
{	
	console.log(options);
	var file_name = options.file_name;
	var password = options.password;
	var isOnline = 'onLine' in navigator && navigator.onLine;
	if(typeof(cordova) != 'undefined' && isOnline) {		
		setfirebaseAnalytics({page:'E-library E-book detail page',property:{content_type: "E-library E-book detail page", item_id:{type:'E-library E-book detail page'}}});
	}

	//var fileName = CryptoJS.AES.
	(file_name,password).toString(CryptoJS.enc.Latin1);
	path = (typeof(cordova.file.externalSdCardDirectory) != 'undefined') ? cordova.file.externalSdCardDirectory : cordova.file.dataDirectory;
	var fileName = path+file_name;
	if(cordova.platformId == 'android') {
		fileName = path+'/'+file_name;
		var encryptor = cordova.plugins.disusered.safe;
		encryptor.decrypt(path+'/'+file_name, password, function(decryptedFile) {
			console.log('Decrypted file: ' + decryptedFile);
		}, function(error) {
			console.log(error);
		});
	}

	window.resolveLocalFileSystemURL(fileName, function (dirEntry) {
		dirEntry.file(function(file) {
			/*console.log('file',file);
			callback(file.localURL);*/
			var reader = new FileReader();

			reader.onloadend = function(e) {
				var blob = new Blob([new Uint8Array(e.target.result)], { type: "application/epub+zip" });
				fileURL=window.URL.createObjectURL(blob);
				callback(blob);
			}
			reader.readAsArrayBuffer(file);
		});
	});	
	setTimeout(function() {
		$('.showDownLoadButton').hide();
	},150);
}

function fileReaderPDF(options,callback)
{
	var file_name = options.file_name;
	var password = options.password;
	var isOnline = 'onLine' in navigator && navigator.onLine;
	if(typeof(cordova) != 'undefined' && isOnline) {		
		setfirebaseAnalytics({page:'E-library E-magazine detail page',property:{content_type: "E-library E-magazine detail page", item_id:{type:'E-library E-magazine detail page'}}});
	}
	//var fileName = CryptoJS.AES.decrypt(file_name,password).toString(CryptoJS.enc.Latin1);
	//cordova.plugins.diagnostic.requestExternalStorageAuthorization(function(success) {
		path = (typeof(cordova.file.externalSdCardDirectory) != 'undefined') ? cordova.file.externalSdCardDirectory : cordova.file.dataDirectory;
		var fileName = path+file_name;
	    if(cordova.platformId == 'android') {
			fileName = path+'/'+file_name;
			/* var encryptor = cordova.plugins.disusered.safe;
			encryptor.decrypt(path+'/'+file_name, password, function(decryptedFile) {
				console.log('decryptedFile');
				console.log(decryptedFile);
				//var fileName = decryptedFile;
			},function(errror) {
				console.log('errror');
				console.log(errror);
			}); */
		}
		//fileName = path+file_name;
		fileName = fileName.replace('encrypt','ara');
		console.log(fileName);

		window.resolveLocalFileSystemURL(fileName, function (dirEntry) {
			dirEntry.file(function(file) {
				console.log('file',file);
				/*console.log('file',file);
				callback(file.localURL);*/
				var reader = new FileReader();

				reader.onloadend = function(e) {
					var blob = new Blob([new Uint8Array(e.target.result)], { type: "application/epub+zip" });
					fileURL=window.URL.createObjectURL(blob);
					console.log(fileURL);
					callback(fileURL);
				}
				reader.readAsArrayBuffer(file);
			});
		});
	//});
}

function deleteFile(data) {
	console.log('deleteFile');
	console.log(data);
	var fileName = data.file_name;
	var path = cordova.file.dataDirectory;	
	if(cordova.platformId == 'android') {
		path = (typeof(cordova.file.externalSdCardDirectory) != 'undefined') ? cordova.file.externalSdCardDirectory : cordova.file.dataDirectory;
	}
	window.resolveLocalFileSystemURL(path, function(dir) {
		dir.getFile(fileName, {create:false}, function(fileEntry) {
			  fileEntry.remove(function(){
				  // The file has been removed succesfully
				  deleteFileById(data,function(res) {
					  toaster('Deleted successfully');
					  console.log($('.remove_e_paper_'+data.id));
					  setTimeout(function() {
					  	$('.remove_e_paper_'+data.id).remove();
					  	if($('.check-length-file').length == 0) {
					  		$('#epaper-tab-library').html('<div class="no-record">No records found</div>');
					  	}
					  },2000);
					  //getElibrary(data.type);
				  });
			  },function(error){
				  // Error deleting the file
				  toaster('Delete failed');
			  },function(){
				 // The file doesn't exist
				 toaster('File not exists in the folder');
			  });	  
		});
	}); 
}

function eBookSearch(options) {
	searchProducts(options,function(res) {
		var content = title = author = categoryVal = '';
		if(options.title != '') {
			title = options.title;
		}
		if(options.author != '') {
			author = options.author;
		}
		if(options.category != '') {
			categoryVal = options.category;
		}
		var data = res;
		var category = '<option value="">Please select category</option>';
		content += '<h4>Buy More Books<a href="javascript:;" class="pull-right showProductSearchBuyMore"><i class="fa fa-search"></i> Search</a></h4>';
		content += '<div class="list no-hairlines-md showProductSearch" style="display:none;"><ul><li class="item-content item-input"><div class="item-inner"><div class="item-title item-label">Title</div><div class="item-input-wrap"><input type="text" placeholder="Enter title" class="eBookTitle" value="'+title+'"/><span class="input-clear-button"></span></div></div></li><li class="item-content item-input"><div class="item-inner"><div class="item-title item-label">Author</div><div class="item-input-wrap"><input type="text" placeholder="Enter author" class="eBookAuthor" value="'+author+'"/><span class="input-clear-button"></span></div></div></li><li class="item-content item-input"><div class="item-inner"><div class="item-title item-label">Choose Category</div><div class="item-input-wrap input-dropdown-wrap"><select placeholder="Please choose..." class="searchProductsDropDown eBookCategory"></select></div></div></li></ul><div class="row mb-20"><a href="" class="col button button-fill color-gray eBookSearchClear">Clear</a><a href="javascript:;" class="col button button-fill eBookSearchResult">Submit</a></div></div>';
		if(data.length > 0) {
			//content += '<h4>'+data.length+' Results Found </h4>';buyMoreBooks += '<div class="col-50 medium-25 ePaperTryNow" data-mid="10" data-issue-id="'+data[i].prod_id+'"><div class="econtent"><a data-type="subscribe" href="javascript:;" class="epaper"><img src="'+data[i].img.replace('thumb','large')+'" onerror="this.src=\'assets/images/no-img.jpg\'" class="" alt=""></a><label class="ename">'+data[i].title.substr(0,30)+'</label><button data-mid="10" data-issue-id="'+data[i].prod_id+'" class="button button-fill button-small button-block color-blue ePaperTryNow" data-type="subscribe">Buy Now</button></div></div>';
			content += '<div class="row">';
			for(var i = 0;i < data.length;i++) {
				content += '<div class="col-50 medium-25 ePaperTryNow" data-mid="10" data-issue-id="'+data[i].product_id+'"><div class="econtent"><a href="javascript:;" class="epaper"><img src="'+data[i].image.replace("thumb","large")+'" class="" alt=""></a><label class="ename">'+data[i].title.substr(0,30)+'<a href="#" class="popover-open" data-popover=".popover-viewer""></a></label><button class="button button-fill button-small button-block color-blue ePaperTryNow" data-mid="10" data-issue-id="'+data[i].product_id+'" data-type="subscribe">Buy Now</button></div></div>';
			}
			content += '</div>';
		} else {
			content += '<div class="no-record"> No records found</div>';
		}
		var cat = JSON.parse(localStorage.getItem('productCategory'));
		for(var j = 0;j < cat.length;j++) {
			var selected = '';
			if(categoryVal == cat[j]) {
				selected = 'selected';
			}
			category += '<option value="'+cat[j]+'" '+selected+' >'+cat[j]+'</option>';
		}
		setTimeout(function() {
			   $('.searchProductsDropDown').html(category);
		},1500);
		$('.buyNewBooks').html(content);
	});
}

function hideOfflineButton() {
	setTimeout(function() {
		$('.showDownLoadButton').hide();
	},150);
}

function successCallbacks(entry) {
    console.log("New Path: " + entry.fullPath);
    //alert("Success. New Path: " + entry.fullPath);
}

function errorCallbacks(error) {
    console.log("Error:" + error.code)
    //alert(error.code);
}

function moveFile(option) {
	var fileUri = CryptoJS.AES.decrypt(option.file_name,option.password).toString(CryptoJS.enc.Latin1);
	var fileName = fileUri.substr(fileUri.length - 10);
	window.resolveLocalFileSystemURL(
		fileUri,
		function(fileEntry){
			newFileUri  = cordova.file.externalDataDirectory;
			newFileName = fileName;
			window.resolveLocalFileSystemURL(newFileUri,function(dirEntry) {
				// move the file to a new directory and rename it
				fileEntry.moveTo(dirEntry, newFileName, successCallbacks, errorCallbacks);
			},errorCallbacks);
		},
	errorCallbacks);
}

function fileEncrption(options) {
	if(cordova.platformId == 'android') {
		var file_name = options.file_name;
		var password = options.password;
		//var encryptor = cordova.plugins.;
		var key = password;		
		//cordova.plugins.diagnostic.requestExternalStorageAuthorization(function(success) {
		path = (typeof(cordova.file.externalSdCardDirectory) != 'undefined') ? cordova.file.externalSdCardDirectory : cordova.file.dataDirectory;
		console.log(path+'/'+file_name);
		console.log(password);
		console.log(encryptor);
		encryptor.encrypt(path+'/'+file_name, key, function(encryptedFile) {
			console.log(encryptedFile);
				
		}, function() {
			console.log('Error with cryptographic operation');
		});
		CordovaClearCache.clearExternalCache();
			//clearFileCache(file_name);
		//});
	}
}

function speakAudio(text) {
	console.log(text);
	/*TTS.speak({
			text: text,
			//locale:'en-us',
			locale:'ta_IN',
			identifier:'ta-in-x-tag-local'
		},function(res) {
			console.log('res');
			console.log(res);
		},function(err) {
			console.log('err');
			console.log(err);
		});*/
		/* original*/
	/*TTS.speak({
        text: text,
        locale:'ta_IN',
		identifier:'ta-in-x-tag-local',
        cancel: true
      }).then(function (success) {
		  console.log('success');
		  console.log(success);
    //alert('success');
  }, function (reason) {
	  console.log('reason');
	  console.log(reason);
    //alert(reason);
  });*/
}

function clearFileCache(file_name) {
	console.log('clearFileCache');
	console.log(cordova.file.cacheDirectory);
	var path = cordova.file.cacheDirectory;
	deleteAllFilesInPath(cordova.file.cacheDirectory);
}

function deleteAllFilesInPath(path) {
    if (!path) { return; }
    window.resolveLocalFileSystemURL(path, function (entry) {
        if (entry.isDirectory) {
            var dirReader = entry.createReader();
            dirReader.readEntries(function(entries) {
                console.log(entries);
                for (var i in entries) {
                    deleteFileOrDirEntry(entries[i]);
                }
            })
        }
    })
}

function deleteLocalPath(path) {
    window.resolveLocalFileSystemURL(path,
        deleteFileOrDirEntry,
        function (error) {
            //log.error("failed to access ", path, " error: ", JSON.stringify(error));
			console.log("failed to access ", path, " error: ", JSON.stringify(error));
        });
}
function deleteFileOrDirEntry(entry) {
    if (entry.isDirectory) {
        
    } else {
        entry.remove(function (code) {
                console.log("deleted file ", entry.fullPath, " ", code);
            },
            function (error) {
                console.log("failed to remove file ", entry.fullPath, " error: ", JSON.stringify(error))
            });
    }
}

function isHTML(str) {
  var a = document.createElement('div');
  a.innerHTML = str;

  for (var c = a.childNodes, i = c.length; i--; ) {
    if (c[i].nodeType == 1) return true; 
  }
  return false;
}

function googleHomeDfpAd() {
	window.adTags = {};
	/*window.googletag = window.googletag || {cmd: []};  
	var mapping1 = googletag.sizeMapping().addSize([748, 0], [[728,90]]).addSize([0, 0], [[320, 50]]).addSize([0, 0], [[970, 90]]).addSize([0, 0], [[600, 80]]).build();*/

	var data = {key:accessToken,type:'home',v:1.3};
	/*ajax call*/
	$.ajax({
		url:apiUrl,
		method:'GET',
		dataType:'json',
		data:data,
		success:function(res) {
			
			var data = res.data.other.top;
			if((data != null) && (typeof(data) != 'undefined')) {
				if(document.getElementById('appendTag') == null) {
					var head = document.getElementsByTagName('head')[0];

					console.log(document.getElementById('appendTag'));
					var script = document.createElement('script');
					script.setAttribute('id', 'appendTag');
					document.head.append(script);
					document.head.append(data);
					// $('#appendTag').html(data);
					//callback({status:'success'});
					googleDFPTag();	
				}
				
			}
		},error:function(err) {
			toaster('You are in Offline');
		}
	});
}

function getFileUrl(image,callback) {
	// var path = cordova.file.externalDataDirectory;
	var path = cordova.file.dataDirectory;
	console.log('getFileUrl');
	console.log(path+image);
	window.resolveLocalFileSystemURL(path+image, function (dirEntry) {
		console.log('dirEntry');
		console.log(dirEntry);
		dirEntry.file(function(file) {
			console.log('file');
			console.log(file);
			var reader = new FileReader();

			reader.onloadend = function(e) {
				console.log("File contains: "+e);
				callback(e.target.result);
			}
			reader.readAsDataURL(file);

			//callback(file.localURL);
		});
	},function(error) {
		console.log('error');
		console.log(error);
	});
}

function getimageResolvedURL(key,data,content,callback){

	i = key;
	var fDate = finDate = '';
	if(typeof(data[i].file_date) != 'undefined') {
		fDate = data[i].file_date.split('-');
		dat = fDate[1];
		if(fDate[1].length == 1) {
			dat = ('0'+fDate[1]);
		}
		if(fDate[0].length == 1) {
			fDate[0] = '0'+fDate[0];
		}
		finDate = fDate[2] + '-' + dat + '-' + fDate[0];
		console.log(finDate);
	}
	var attr = ' data-url="'+data[i].file_path+'" data-file-name="'+data[i].file_name+'" data-password="'+data[i].password+'" data-type="pdf" data-issue-type="paper" data-heading="'+data[i].title+'" ';
	
	var button = '<button class="button button-fill button-small button-block color-red deleteLibraryFile" data-type="paper" data-file-name="'+data[i].file_name+'" data-id="'+data[i].id+'">Delete</button>';
	
	var image = '';var title = data[i].title;
	var id = data[i].id;
	image = getFileUrl(data[i].image,function(localUrl) {
		
		content += '<div class="col-50 medium-25 check-length-file remove_e_paper_'+id+'"><div class="econtent"><a href="javascript:;" class="img-height epaper viewElibrary" '+attr+'><img src="'+localUrl+'" onerror="this.src=\'assets/images/no-img.jpg\'" class="" alt=""/></a><label class="ename">'+title.substr(0,30)+' '+convertMonth(finDate)+'</label>'+button+'</div></div>';
		if(key==(data.length-1))
			callback(content);
		else
			getimageResolvedURL(key+1,data,content,callback);
		
	});
}

function test() {
	responsiveVoice.speak('ஏதோ ஒன்று என்னை தாக்க யாரோ போல உன்னை பார்க்க சுற்றி எங்கும் நாடகம் நடக்க பெண்ணே நானும் எப்படி நடிக்க காலம் முழுதும் வாழும் கனவை கண்ணில் வைத்து தூங்கினேன் காலை விடிந்து போகும் நிலவை கையில் பிடிக்க ஏங்கினேன் பெண்ணே உந்தன் ஞாபகத்தை நெஞ்சில் சேர்த்து வைத்தேனே உன்னை பிரிந்து போகையிலே நெஞ்சை இங்கு தொலைத்தேனே என்னை உன்னிடம் விட்டு செல்கிறேன் ஏதும் இல்லையே என்னிடத்தில் எங்கே போவது யாரை கேட்பது எல்லா பாதையும் உன்னிடத்தில் ஏன் எந்தன் வாழ்வில் வந்தாய் என் இரவையும் பகலையும் மாற்றி போனாய் ஏன் இந்த பிரிவை தந்தாய் என் இதயத்தில் தனிமையை ஊற்றி போனாய் உள்ளே உன் குரல் கேட்குதடி என்னை என் உயிர் தாக்குதடி எங்கே இருக்கிறேன் எங்கே நடக்கிறேன் மறந்தேன் நான் ஓ… பெண்ணே உந்தன் ஞாபகத்தை நெஞ்சில் சேர்த்து வைத்தேனே உன்னை பிரிந்து போகையிலே நெஞ்சை இங்கு தொலைத்தேனே ஏதோ ஒன்று என்னை தாக்க யாரோ போல உன்னை பார்க்க சுற்றி எங்கும் நாடகம் நடக்க பெண்ணே நானும் எப்படி நடிக்க காலம் முழுதும் வாழும் கனவை கண்ணில் வைத்து தூங்கினேன் காலை விடிந்து போகும் நிலவை கையில் பிடிக்க ஏங்கினேன் பெண்ணே உந்தன் ஞாபகத்தை நெஞ்சில் சேர்த்து வைத்தேனே உன்னை பிரிந்து போகையிலே நெஞ்சை இங்கு தொலைத்தேனே ஓ',"Tamil Female",{pitch: 1});
}

/////// premium article ////////////////
$(document).on('click','.premiumProductList',function() {
		data = "";
		data.key = accessToken;
		data.type = 'products';
		data.ptype = 'web';
		$.ajax({
			url:apiUrl,
			method:'GET',
			dataType:'json',
			data:{key:accessToken,type:'products',ptype:'web'},
			success:function(res) {
				if(res.msg == 'success'){ 	
					var content='';
					var monthlyContent = '';
					mainView.router.load({url:'pages/premium.html'});
					var data = res.data;
					var dataLength = Object.entries(res.data).length;					
					//var paymonthLength = Object.entries(data.onetime).length;
					//console.log(data);					
					if(data == null) {
						content += '<div class="no-record">No records found</div>';
					} else if(dataLength > 0) { 
						$.each(data, function (dkey, dval) { 
							var onetimepremiumLength = Object.entries(data.onetime).length;
							var payMonthpremiumLength = Object.entries(data.monthly).length;
							//console.log(onetimepremiumLength);
							//console.log(payMonthpremiumLength);
							if(onetimepremiumLength>0 && dkey=='onetime'){
								var slide = 50;
								if(res.length == 1) {
									slide = 50;
								}
							
								content += '<div class="swiper premium-swiper"><div class="swiper-pagination"></div><div class="swiper-wrapper ">';
									
								//'<div class="swiper-slide"><p>test</p></div><div class="swiper-slide"><p>Rest</p></div>';
								$.each(data.onetime, function (key, val) { //console.log(data.onetime); 
								console.log(key);
									var card_title = (key=='silver'?'Silver (Premium content)':(key=='gold'?' Gold (E-paper)':(key=='platinum'?'Platinum (Premium+E-paper)':'Platinum (Premium+E-paper)')));
									content += ' <div class="swiper-slide"><div class="card"><div class="card-header">'+card_title+'</div><div class="card-content"><div class="list"><ul>';
									$.each(val,function(skey,sval){ //console.log(skey); console.log(sval);
										content += '<li><label class="item-radio item-content"><input type="radio" name="prem_prod_id" value="'+sval.prod_id+'" /><i class="icon icon-radio"></i><div class="item-inner"><div class="item-title">'+skey+'<strike> <i class="fas fa-rupee-sign"></i>'+sval.price+'</strike> <span><i class="fas fa-rupee-sign"></i> '+sval.offer_price+' </span></div></div></label></li>';
									});
									content += '</ul></div></div><div class="card-footer"><button class="button button-fill button-block premiumProductSubmit" href="javascript:;">Proceed</button></div></div></div>';
								});	
									content += '</div></div>';
									//console.log(content);
							}
							if(payMonthpremiumLength>0 && dkey=='monthly'){ 
								$.each(data.monthly, function (mkey, mval) { console.log(dkey);
									var card_title = (mkey=='silver'?'Silver (Premium content)':(mkey=='gold'?' Gold (E-paper)':(mkey=='platinum'?'Platinum (Premium+E-paper)':'Platinum (Premium+E-paper)')));
									monthlyContent += '  <div class="card"><div class="card-header">Platinum ( Premium + E-Paper )</div><div class="card-content"><div class="list"><ul>';
									$.each(mval,function(tkey,tval){ //console.log(tval.price); 
										monthlyContent += '<li><label class="item-radio item-content"><input type="radio" name="prem_prod_id" value="'+tval.prod_id+'" /><i class="icon icon-radio"></i><div class="item-inner"><div class="item-title">'+tkey+'<strike> <i class="fas fa-rupee-sign"></i>'+tval.price+'</strike> <span><i class="fas fa-rupee-sign"></i> '+tval.offer_price+' </span></div></div></label></li>';
									});
									monthlyContent += '</ul></div></div><div class="card-footer"><button class="button button-fill button-block premiumProductSubmit" href="javascript:;">Proceed</button></div></div>';
								});	
							}
						});
						
					}
					//console.log(content);					
					setTimeout( function() { $('.premiumList').html(content); $('.payMonthlyList').html(monthlyContent);   },350);
					setTimeout( function() {  initSwiper(); },600);
				}
			}
		});
});

$(document).on('click','.premiumProduct',function(){
		var thiz_ = $(this);
		var data; 
		var premProdId = '';	
		if(typeof premProdId === 'undefined' || premProdId === null){
			toaster('Please select any one option.');
			return false;
		}
		var userDetails = JSON.parse(localStorage.getItem('userDetails'));
		if(userDetails == null) {
			$('#usercallback').val(false);
			app.popup.open('.login-screen');return false;
		} else {
			var issueId = premProdId;
			var mId = 1;
			loadSubscriptionToInAppBrowser({mid:mId,issue_id:issueId});
	}
});


$(document).on('click','.gold-color',function(){ 
	$('.gold-premium').addClass('tab-link-active');
});

function getAdPlacementId(placement) {
    return 'disp_ad_'+placement+'_'+getRandomAdValue();
}

function setAdPlacement(page,tab) {
    let ads = [{},{id:'718qm460',refresh:45},{id:'svkpq2ez',refresh:90},{id:'c8u91pn6',refresh:120},{id:'j7c59dwk',refresh:180}];

    ad = ads[1];
	setTimeout(function(){
		$('[data-name="'+page+'"].page-current .ad-content').html('');
		console.log(tab);
		if(tab!=undefined) {
			$('[data-name="'+page+'"].page-current #tab-'+tab+' .ad_placement_1:visible').html('<ins id="'+getAdPlacementId(1)+'" data-adspot-key="'+ad['id']+'" data-source="com.news.hindutamil" data-refresh-rate="'+ad['refresh']+'" data-isclick-listener-attached="true"></ins>');

			ad = ads[2];
			$('[data-name="'+page+'"].page-current #tab-'+tab+' .ad_placement_2:visible').html('<ins id="'+getAdPlacementId(2)+'" data-adspot-key="'+ad['id']+'" data-source="com.news.hindutamil" data-refresh-rate="'+ad['refresh']+'" data-isclick-listener-attached="true"></ins>');

			ad = ads[3];
			$('[data-name="'+page+'"].page-current #tab-'+tab+' .ad_placement_3:visible').html('<ins id="'+getAdPlacementId(3)+'" data-adspot-key="'+ad['id']+'" data-source="com.news.hindutamil" data-refresh-rate="'+ad['refresh']+'" data-isclick-listener-attached="true"></ins>');

			ad = ads[4];
			$('[data-name="'+page+'"].page-current #tab-'+tab+' .ad_placement_4:visible').html('<ins id="'+getAdPlacementId(4)+'" data-adspot-key="'+ad['id']+'" data-source="com.news.hindutamil" data-refresh-rate="'+ad['refresh']+'" data-isclick-listener-attached="true"></ins>');
		}
		else {
			$('[data-name="'+page+'"].page-current .ad_placement_1:visible').html('<ins id="'+getAdPlacementId(1)+'" data-adspot-key="'+ad['id']+'" data-source="com.news.hindutamil" data-refresh-rate="'+ad['refresh']+'" data-isclick-listener-attached="true"></ins>');

			ad = ads[2];
			$('[data-name="'+page+'"].page-current .ad_placement_2:visible').html('<ins id="'+getAdPlacementId(2)+'" data-adspot-key="'+ad['id']+'" data-source="com.news.hindutamil" data-refresh-rate="'+ad['refresh']+'" data-isclick-listener-attached="true"></ins>');

			ad = ads[3];
			$('[data-name="'+page+'"].page-current .ad_placement_3:visible').html('<ins id="'+getAdPlacementId(3)+'" data-adspot-key="'+ad['id']+'" data-source="com.news.hindutamil" data-refresh-rate="'+ad['refresh']+'" data-isclick-listener-attached="true"></ins>');

			ad = ads[4];
			$('[data-name="'+page+'"].page-current .ad_placement_4:visible').html('<ins id="'+getAdPlacementId(4)+'" data-adspot-key="'+ad['id']+'" data-source="com.news.hindutamil" data-refresh-rate="'+ad['refresh']+'" data-isclick-listener-attached="true"></ins>');
		}
	},(page=='home'?500:0))
}

function closeBuffer() {
	//dummy function for play stop
}

function checkVersionUpdate(data) {
	if(typeof(cordova)!='undefined') {
		if(cordova.platformId == 'android') {
			if(versionCompare(data.version_android,androidVersion)) {
				app.popup.open('.check_app_version');
				/*app.dialog.alert('Update App','Update',function() {
					//alert(cordova.platformId);
					cordova.plugins.market.open('com.news.hindutamil');
				});	*/
			}
		} else {
			if(versionCompare(data.version_ios,iosVersion)) {
				app.popup.open('.check_app_version');
				/*app.dialog.alert('Update App','Update',function() {
					//alert(cordova.platformId);
					cordova.plugins.market.open('https://apps.apple.com/app/hindutamil/id1496636417');
				});*/
			}
		}
	}
}