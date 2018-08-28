// JavaScript Document
var txtMess = document.getElementById("txtMess");
function sendMess()
{
		if (txtMess.value == undefined || txtMess.value == "") {
			alert("Bạn phải nhập tin nhắn");			
			txtMess.focus();
			return;
		};
		var mess = {};
		mess.Msg=txtMess.value;
		
		//alert(objAi.Id);
		$.ajax({
		type: 'POST',
		data: JSON.stringify(mess),
		contentType: 'application/json',
		url: '/sendbroadcast.bot',				
		success: function(data) 
				{
					
					//console.log('success');
					console.log(data);
					
				},
		  	error: function(err) {
			 if(err.responseText=-'Unauthorized')
			  alert("Bạn đã bị time out");
			  window.location.href = 'login.html';
			}
	   });
	
	
	
}