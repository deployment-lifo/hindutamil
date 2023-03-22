var app = new Framework7({
  root: '#app',
  material: true,
  pushState: true,
  name: 'Hindu Tamil',
  id: 'com.myapp.test',
  panel: {
    swipe: false,
  },
  photoBrowser: {
    type: 'standalone',
  },
  routes: [
    {
      path: '/',
      url: './index.html',
       on: {
            pageInit: function(event, page) {
              //loadHomePage(); 
              
            }
        }   
    },
    {
      path: '/news-detail',
      url: './pages/news-detail.html',
    },
    {
      path: '/settings',
      url: './pages/settings.html',
    },
    {
      path: '/saved',
      url: './pages/saved.html',
    },
    {
      path: '/bookmarks',
      url: './pages/bookmarks.html',
    },
    {
      path: '/notifications',
      url: './pages/notifications.html',
    },
    {
      path: '/profile',
      url: './pages/profile.html',
    },
    {
      path: '/change-password',
      url: './pages/change-password.html',
    },
    {
      path: '/feedback',
      url: './pages/feedback.html',
    },
    {
      path: '/terms',
      url: './pages/terms.html',
    },
    {
      path: '/comments',
      url: './pages/comments.html',
    },
    {
      path: '/albums',
      url: './pages/albums.html',
      on: {
          pageInit: function(event, page) {
            //initAlbum();

          },
      } 
    },
    {
      path: '/videos',
      url: './pages/videos.html',
    },
    {
      path: '/notify-settings',
      url: './pages/notify-settings.html',
      on: {
          pageInit: function(event, page) {
            //initAlbum();
            notificationSettings();
          },
      } 
    },
    {
      path: '/videos/:vid',
      url: './pages/videos.html',
    },
    {
      path: '/font-settings',
      url: './pages/font-settings.html',
    },
    {
      path: '/search',
      url: './pages/search.html',
    },
    {
      path: '/kamadenu',
      url: './pages/kamadenu.html',
    },
    {
      path: '/kamadenu-detail/:mid/:issue_id',
      url: './pages/kamadenu-detail.html',
    },
    {
      path: '/albums-search',
      url: './pages/albums-search.html',
    },
    {
      path: '/wow-book',
      url: './pages/wow-book.html',
    },
    {
      path: '/notify-details',
      url: './pages/notify-details.html',
    },
    {
      path: '/video-search',
      url: './pages/video-search.html',
    },
    {
      path: '/reply',
      url: './pages/reply.html',
    },
	{
      path: '/kamadenu-interior',
      url: './pages/kamadenu-interior.html',
    },
	{
      path: '/e-subscription',
      url: './pages/e-subscription.html',
    },
    {
      path: '/book-viewer',
      url: './pages/book-viewer.html',
    },
	{
      path: '/e-library',
      url: './pages/e-library.html',
    },
	{
      path: '/elibrary-book-viewer',
      url: './pages/elibrary-book-viewer.html',
    },
	{
      path: '/elibrary-epub-viewer',
      url: './pages/elibrary-epub-viewer.html',
    },
	{
      path: '/search-result',
      url: './pages/search-result.html',
    },
    {
      path: '/in-app-purchase',
      url: './pages/in-app-purchase.html',
    },
    {
      path: '/premium',
      url: './pages/premium.html',
      on: {
          pageInit: function(event, page) {
            initSwiper();
          },
      } 
    },
  ],
  view:{
    pushState: true
  }
});

var mainView = app.views.create('.view-main', {
  url: '/'
});



//For Navigation Submenu
$('.menu-list .has-submenu .menu-links-head').click(function() {
    if ($(this).parent().hasClass('opened')) {
        $(this).parent().removeClass('opened');
    } else {
        $(this).parent().addClass('opened');
    }
});

$(document).on('click','.has-submenu',function() {
  $('.has-submenu').not(this).each(function(){
    $(this).removeClass('opened');
  });
  $(this).toggleClass('opened');
  
	//$(this).addClass('opened');
	
	/*if($(this).hasClass('opened')) {
		$(this).removeClass('opened');
	} else {
		//$(this).parent().addClass('opened');
		//$('.has-submenu').addClass('opened');
		$(this).addClass('opened');
	}*/
	
    /*if ($(this).parent().hasClass('opened')) {
		$(this).parent().removeClass('opened');
    } else {
        $(this).parent().addClass('opened');
    }*/
	
    /*if($('.has-submenu').hasClass('opened')) {
      $('.has-submenu').removeClass('opened');
    } else {
      $(this).parent().addClass('opened');
    }*/
    /*if($(this).parent().hasClass('opened')) {
        $(this).parent().removeClass('opened');
    } else {
        $(this).parent().addClass('opened');
    }*/
});
//For Navigation Submenu

function sliders() {
  var swiper = new Swiper(".detail-swiper", {
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
}
sliders()

app.on('pageInit', function(page) {sliders();})