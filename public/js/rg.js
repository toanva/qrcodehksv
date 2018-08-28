	var psid=document.getElementById("psid").value;
	var cboPosition=document.getElementById("cboPosition");

	var txtFullName=document.getElementById("txtFullName");
	var stName=document.getElementById("stName");
	
	var stBirthday=document.getElementById("stBirthday");
	var txtDay=document.getElementById("txtDay");
	var txtMonth=document.getElementById("txtMonth");
	var txtYear=document.getElementById("txtYear");	
	
	var stProvincial=document.getElementById("stProvincial");	
	var txtProvincial=document.getElementById("txtProvincial");	
    var cboProvincial=document.getElementById("cboProvincial");
	
	var stDistricts=document.getElementById("stDistricts");
    var txtDistricts=document.getElementById("txtDistricts");
 	var cboDistricts=document.getElementById("cboDistricts");

	var stWards = document.getElementById("stWards");
	var txtWards = document.getElementById("txtWards");
	var cboWards = document.getElementById("cboWards");
		
    var stBranch= document.getElementById('stBranch');
	var txtBranch= document.getElementById('txtBranch');

	var stPhone= document.getElementById('stPhone');
	var txtPhone= document.getElementById('txtPhone');

	var stEmail= document.getElementById('stEmail');
	var txtEmail= document.getElementById('txtEmail');
	var btnSend = document.getElementById('btnSend');

	function LoadCboProvincials()	{  
		var  selectElemRef = document.getElementById("cboProvincial");
		var objProvincials;   
		$.ajax({
		dataType: "json",
		url: "/getProvincial",
		data: objProvincials,
		success: function(data) {
			objProvincials = data;
			var html = '';
			//var x = document.getElementById("mySelect");
			//removeOptions($("#cboProvincial"));
			while (selectElemRef.length> 0) {
				selectElemRef.remove(0);
			} 
			for (var i = 0, len = objProvincials.length; i < len; ++i) {			
				var o = new Option(objProvincials[i].Name,  objProvincials[i]._id);
				//o.selected=true;
				$("#cboProvincial").append(o);
			}
			if(cboProvincial.length>1)
			{
			  document.getElementById("cboProvincial").selectedIndex=1;
			  onCboProvincialsChange(document.getElementById("cboProvincial"));			 document.getElementById("txtProvincial").value=document.getElementById("cboProvincial")[1].text;
			}		
		  }
		});
	};
	
	function onCboProvincialsChange(event)	{
	    //var selectElement = event.target;
	    var value = event.value;
		document.getElementById("txtProvincial").value=event[event.selectedIndex].text;
		//alert(value);
		//alert(document.getElementById("cboProvincial").value)
		//alert(event);
		LoadCboDistricts(value);
	};
	
    function LoadCboDistricts(idProvincial)	{   
		var  selectElemRef = document.getElementById("cboDistricts");
		var objDistricts;   
		$.ajax({
		dataType: "json",
		url: "/getDistrict?idProvincial="+idProvincial,
		data: objDistricts,
		success: function(data) {
			objDistricts = data;	
            while (selectElemRef.length> 0) {
				selectElemRef.remove(0);
			} 			
			for (var i = 0, len = objDistricts.length; i < len; ++i) {			
				var o = new Option(objDistricts[i].Name,  objDistricts[i]._id);
				//o.selected=true;
				$("#cboDistricts").append(o);
			}
			var o = new Option("Khác", "9999");
			$("#cboDistricts").append(o);
			if(objDistricts.length>1)
			{
			  document.getElementById("cboDistricts").selectedIndex=1;
			  onCboDistrictsChange(document.getElementById("cboDistricts"));
			  document.getElementById("txtDistricts").value=document.getElementById("cboDistricts")[1].text;
			}
			//$('#cboDistricts').append(html);
		  }
		});
	};
	function onCboDistrictsChange(event)	{
	    
	    var value = event.value;
		document.getElementById("txtDistricts").value=event[event.selectedIndex].text;
		//alert(event);
		LoadCboWards(value);
	};
	
	function LoadCboWards(idDistrict)	{	
		var  selectElemRef = document.getElementById("cboWards");
		var objWards;   
		$.ajax({
		dataType: "json",
		url: "/getWards?idDistrict="+idDistrict,
		data: objWards,
		success: function(data) {
			objWards = data;
			while (selectElemRef.length> 0) {
				selectElemRef.remove(0);
			} 
			for (var i = 0, len = objWards.length; i < len; ++i) {			
				var o = new Option(objWards[i].Name,  objWards[i]._id);
				//o.selected=true;
				$("#cboWards").append(o);
				
			}
			var o = new Option("Khác", "9999");
			$("#cboWards").append(o);
			if(objWards.length>1)
			{
			  document.getElementById("cboWards").selectedIndex=1;				
			  document.getElementById("txtWards").value=document.getElementById("cboWards")[1].text;
			  //alert(document.getElementById("cboWards")[0].text);
			}
			//$('#cboWards').append(html);
		  }
		});
	};
	function onCboWards(event)	{	    
	    var value = event.value;
		document.getElementById("txtWards").value=event[event.selectedIndex].text;
		//alert(event);
	};
    LoadCboProvincials();

	function cboPositionChange(event)	{	    
	    var value = event.value;
		if(value=='CTH LHTN Tỉnh' || value=='P.CTH LHTN Tỉnh')	
		{
				selectCTHLHTNT();
			
		}else if(value=='CTH LHTN huyện' || value=='P.CTH LHTN huyện')
		{
				selectCTHLHTNH(); 
		}
		else if(value=='CTH LHTN xã' || value=='P.CTH LHTN xã')
		{
				 selectCTHLHTNX();
		}else
		{
				selectCTHLHTNX();
		}
		//document.getElementById("txtWards").value=event[event.selectedIndex].text;
		//alert(event);
	};
	
	function selectCTHLHTNT()
	{
		stProvincial.style.display="inline";
		stDistricts.style.display="none";
		txtDistricts.value='NA';
		stWards.style.display="none";
		txtWards.value='NA';
		stBranch.value='NA';
		stBranch.style.display="none";
	};
	function selectCTHLHTNH()
	{
		stProvincial.style.display="inline";
		stDistricts.style.display="inline";
		stWards.style.display="none";
		txtWards.value='NA';
		stBranch.value='NA';
		stBranch.style.display="none";
	};
	function selectCTHLHTNX()
	{
		stProvincial.style.display="inline";
		stDistricts.style.display="inline";
		stWards.style.display="inline";		
		stBranch.style.display="inline";
		
	};

	
    function SaveObject(){
	btnSend.disabled=true;
	btnSend.style.color = '#5d98fb';
	var psid=document.getElementById("psid").value;	
	
	//var file_data = txtImage.prop("files")[0]; 
   
	if(txtFullName.value==undefined || txtFullName.value=="")
	{
		alert("Bạn phải nhập tên");
		txtFullName.focus();
		return;
	};

	if(txtPhone.value==undefined || txtPhone.value=="")
	{
		alert("Bạn phải nhập số ĐT");
		txtPhone.focus();
		return;
	};
	if(txtEmail.value==undefined || txtEmail.value=="")
	{
		alert("Bạn phải nhập số ĐT");
		txtEmail.focus();
		return;
	};
    

	if(cboPosition.value=='CTH LHTN Tỉnh')	
	{
			txtDistricts.value='NA';				
			txtWards.value='NA';
			stBranch.value='NA';

	}else if(cboPosition.value=='CTH LHTN huyện')
	{
			txtWards.value='NA';
			stBranch.value='NA';
	}
		
	
	var mydate = new Date(parseInt(txtYear.value), parseInt(txtMonth.value) - 1, parseInt(txtDay.value));	
	var inputDate = new Date(mydate.toISOString());
	
	var objMember = {};
	objMember.psid = psid;
	objMember.Name = txtFullName.value;
	objMember.Birthday = inputDate;
	objMember.Position = cboPosition.value;
		
	objMember.Provincial = txtProvincial.value;
	objMember.Districts = txtDistricts.value;
	objMember.Wards = txtWards.value;
		
	objMember.Branch = txtBranch.value;
	objMember.Phone = txtPhone.value;
	objMember.Email = txtEmail.value;

	//objProduct.Status="Active";
	var form = new FormData();
	form.append('psid', objMember.psid);	
    form.append('Name', objMember.Name);
	form.append('Birthday', objMember.Birthday);
	
	form.append('Position', objMember.Position);	
	form.append('Provincial', objMember.Provincial);
	form.append('Districts', objMember.Districts);
	form.append('Wards', objMember.Wards);
	form.append('IdWards', cboWards.value);
		
	form.append('Branch', objMember.Branch);
	form.append('Phone', objMember.Phone);
	form.append('Email', objMember.Email);
		
	$.ajax({
		type: 'POST',
		data: form,
		contentType: false,
        processData: false,	
		url: '/rgpostback.bot',				
		success: function(data) 
		{
				//alert("Thêm mới sản phẩm thành công!")
				//console.log('success');
				btnSend.disabled=false;
				btnSend.style.color = '#FFFFFF';
				console.log(data);
				alert("Thêm mới thành công");
				//window.extAsyncInit = () => {
					//MessengerExtensions.requestCloseBrowser(function success() {
			//	 alert("Thêm mới thành công");
			//}, function error(err) {
			//		 console.log("SaveObject Err:"+err);
			//});	
		
		},
	    error: function(err) {
		 	btnSend.disabled=false;
			btnSend.style.color = '#FFFFFF';
			alert("Lỗi :",err);
		}
    });
	
};