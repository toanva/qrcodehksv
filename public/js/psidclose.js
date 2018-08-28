(function (d, s, id) {
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) {
			return;
		}
		js = d.createElement(s);
		js.id = id;
		js.src = "//connect.facebook.com/en_US/messenger.Extensions.js";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'Messenger'));
	
	window.extAsyncInit = () => {
		///var isSupported = MessengerExtensions.isInExtension(); 
		//alert(isSupported);
		// TODO: How to parse env file from here?
		MessengerExtensions.getSupportedFeatures(function success(result) {
			let features = result.supported_features;
			if (features.includes("context")) {
				MessengerExtensions.getContext('797301893703166',
					function success(thread_context) {
						// success
						console.log("success :" +thread_context.psid);
						document.getElementById("psid").value = thread_context.psid;
					    getInfo();
					},
					function error(err) {
						// error
						console.log("Err:"+err);
					}
				);
			}
		}, function error(err) {
			// error retrieving supported features
			console.log("Err:"+err);
		});
		document.getElementById('btnClose').addEventListener('click', () => {
			Close();
		});		

		function Close(){
			MessengerExtensions.requestCloseBrowser(function success() {
				$.ajax({
					dataType: "json",
					url: "/closeForm?psid="+document.getElementById("psid").value,
					data: obj,
					success: function (data) {
						console.log(data);
					}
				});
			}, function error(err) {
			   console.log("getElementById Err:"+err);
			});
		};

	};