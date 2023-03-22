/*common code for google error*/
var common_code = {'google_17':'The client attempted to call a method from an API that failed to connect. Possible reasons include:The API previously failed to connect with a resolvable error, but the user declined the resolution.The device does not support GmsCore.The specific API cannot connect on this device.','google_20':'The connection was suspended while the call was in-flight.','google_10':'The application is misconfigured. This error is not recoverable and will be treated as fatal. The developer should look at the logs after this to determine more actionable information.','google_13':'The operation failed with no more detailed information.','google_8':'An internal error occurred. Retrying should resolve the problem.','google_14':'A blocking call was interrupted while waiting and did not run to completion.','google_5':'The client attempted to connect to the service with an invalid account name specified.','google_7':'A network error occurred. Retrying should resolve the problem.','google_22':'The connection timed-out while attempting to re-connect.','google_21':'The connection timed-out while waiting for Google Play services to update.','google_19':'There was a non-DeadObjectException RemoteException while calling a connected service.This signifies that an API was able to connect to Google Play services and received an instance, but that when calling an individual method, a RemoteException was thrown.Note that the exception would not be a DeadObjectException, which indicates that the binding has died (for example if the remote process died). This is because DeadObjectExceptions are handled by the connection management infrastructure of GoogleApi.If this is encountered during an API call for an API that uses the Google Play services ServiceBroker (most do), it is after a bound service is successfully received from the ServiceBroker.','google_6':'Completing the operation requires some form of resolution. A resolution will be available to be started with startResolutionForResult(Activity, int). If the result returned is RESULT_OK, then further attempts should either complete or continue on to the next issue that needs to be resolved.','google_3':'The installed version of Google Play services has been disabled on this device. The calling activity should pass this error code to getErrorDialog(Activity, int, int) to get a localized error dialog that will resolve the error when shown.','google_2':'The installed version of Google Play services is out of date. The calling activity should pass this error code to getErrorDialog(Activity, int, int) to get a localized error dialog that will resolve the error when shown.','google_4':'The client attempted to connect to the service but the user is not signed in. The client may choose to continue without using the API. Alternately, if hasResolution() returns true the client may call startResolutionForResult(Activity, int) to prompt the user to sign in. After the sign in activity returns with RESULT_OK further attempts should succeed.'};

function googleLogin() {
  
	var callFunction = $('form#userLogin #usercallback').val();
	/*console.log(window.plugins.googleplus);

console.log(window.FirebasePlugin);*/
	/*google plus plugin to login in google*/
	window.plugins.googleplus.login(
        {},
        function (obj) {
        	 console.log(obj);
          // alert('suc');
        	//alert(JSON.stringify(obj));
        	localStorage.setItem('loginFrom','google');
        	userLogin(obj.email,'',1,obj.displayName,magazineLoginHandler);
          
          //if(typeof())
        },
        function (msg) {
          console.log('msg');
          console.log(msg);
         // alert('err');
          //alert(JSON.stringify(msg));
         // googleError(msg);
        }
    );
}

/*function to show google errors*/
function googleError(code){
  field = '';
  switch(code){
    case '17': case 17:
      field = 'google_17';
	  alert(common_code.google_17);
    break;
    case '16': case 16:
      field = 'google_16';
	  alert(common_code.google_16);
    break;
    case '20': case 20:
      field = 'google_20';
	  alert(common_code.google_20);
    break;
    case '10': case 10:
      field = 'google_10';
	  alert(common_code.google_10);
    break;
    case '13': case 13:
      field = 'google_13';
	  alert(common_code.google_13);
    break;
    case '8': case 8:
      field = 'google_8';
	  alert(common_code.google_8);
    break;
    case '14': case 14:
      field = 'google_14';
	  alert(common_code.google_14);
    break;
    case '5': case 5:
      field = 'google_5';
	  alert(common_code.google_5);
    break;
    case '7': case 7:
      field = 'google_7';
	  alert(common_code.google_7);
    break;
    case '22': case 22:
      field = 'google_22';
	  alert(common_code.google_22);
    break;
    case '21': case 21:
      field = 'google_21';
	  alert(common_code.google_21);
    break;
    case '19': case 19:
      field = 'google_19';
	  alert(common_code.google_19);
    break;
    case '6': case 6:
      field = 'google_6';
	  alert(common_code.google_6);
    break;
    case '3': case 3:
      field = 'google_3';
	  alert(common_code.google_3);
    break;
    case '2': case 2:
      field = 'google_2';
	  alert(common_code.google_2);
    break;
    case '4': case 4:
      field = 'google_4';
	  alert(common_code.google_4);
    break;
  }
}

/*function to logout from google*/
function googleLogout() {
    window.plugins.googleplus.logout(
        function (msg) {
        	
        },
        function (msg) {
          //alert(msg);
        }
    );
}

/*function to logout from facebook*/
function facebookLogout(){
	facebookConnectPlugin.logout(function(res){
		
	}, function(error){
		//logout error
		//alert('facebook :'+JSON.stringify(error));
	});
}

/*function to login via facebook*/
function facebookLogin() {
	facebookConnectPlugin.login(["email"], function(result) {
		//alert(JSON.stringify(result));
		// console.log(result);
        //calling api after login success
        facebookConnectPlugin.api("/me?fields=email,name,picture",
            ["public_profile", "email"],
            function(userData) {
				//alert(2);
				localStorage.setItem('loginFrom','facebook');
				//alert(JSON.stringify(userData));
				// console.log(userData);
				userLogin(userData.email,'',1,userData.name,magazineLoginHandler);
            },
            function(error) {
                //API error callback
                //alert(JSON.stringify(error));
                //alert(error.errorMessage);
            });
    }, function(error) {
        //authenication error callback
        //alert(JSON.stringify(error));
		//if(error.errorMessage!='' && typeof error.errorMessage!='undefined' && error.errorMessage!='User cancelled dialog' )
		//	alert(error.errorMessage);

    });
}

function appleLogin() {
  // console.log(SignInWithApple);
  /*SignInWithApple.isAvailable().then(function (isAvailable) {
    console.info(isAvailable)
  });

  SignInWithApple.request({requestedScopes: [ SignInWithApple.Scope.Email, SignInWithApple.Scope.FullName ]},function(succ) {
    console.log(succ);
    alert(JSON.stringify(succ));
  }, function(err) {
    console.log(err);
    alert(JSON.stringify(err));
  });*/


  window.cordova.plugins.SignInWithApple.signin({ requestedScopes: [0, 1] },
  function(succ){
    console.log(succ);
    localStorage.setItem('loginFrom','apple');
    var email_id = succ.user;
    var name = succ.fullName.givenName;
    userLogin(email_id,'',1,name,magazineLoginHandler);
  },
  function(err){
    console.error(err);
    // alert(JSON.stringify(err));
  });
}