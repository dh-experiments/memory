var Facebook = (function(){

	var initalized = false;
	var appId = "";
	var defaultPermissions = "";
	var stash = [];

	window.fbAsyncInit = function() {
		FB.init({
			appId      : appId,
			status     : true, 
			cookie     : true, 
			xfbml      : true,
			oauth      : true
		});
		
		FB.getLoginStatus(function(response) {
			initalized = true;
			
			for ( var i=0, len=stash.length; i<len; i++ ) {
				var funct = stash.pop();
				funct();
			}
		});
	}
	
	function saveThis(foo) {
		if ( initalized == true ) { 
			foo();
		} else {
			stash.push(foo);
		}
	}

	return {

		initialize: function(siteAppId, siteDefaultPermissions){
			appId = siteAppId;
			defaultPermissions = siteDefaultPermissions;
			
			var script = document.createElement("script");
			script.src = "http://connect.facebook.net/en_US/all.js";
			document.getElementById("fb-root").appendChild(script);
		},

		get: function(path, callback) {
			saveThis(function(){
				FB.api(path, function(response) {
					if ( typeof callback == "function" ) {
						callback(response);
					}
				});
			});
		},

		post: function(data, callback) {
			saveThis(function(){
				FB.api("/me/feed", "post", data, function(response) {
					if ( typeof callback == "function" ) {
						callback(response);
					}
				});
			});
		},

		login: function(callback) {
			Facebook.getPermission(defaultPermissions, callback);
		}, 

		getPermission: function(permission, callback) {
			saveThis(function(){
				FB.login(function(response){
					if ( typeof callback == "function" ) {
						callback(response);
					}
				}, { scope: permission });
			});
		}

	}
	
})();