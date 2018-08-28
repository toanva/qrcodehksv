function Login()
{
	var txtUsername=document.getElementById("txtUsername");
    var txtPassword= document.getElementById("txtPassword");
	var objUser = {};
	objUser.UserName = txtUsername.value;
	objUser.Password = txtPassword.value;
	
	
	$.ajax({
		type: 'POST',
		data: JSON.stringify(objUser),
		contentType: 'application/json',
		url: '/login.bot',				
		success: function(data) 
		{
			//alert("Login SS")
			if(data=="true")
			{
				console.log('success');
				window.location.href = 'index.html';
			}else
			{
				alert(data);					
			}
			//console.log(data);
		}
    });
}