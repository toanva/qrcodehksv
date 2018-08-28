// JavaScript Document
var objMember;

var txtProvincial = document.getElementById("txtProvincial");
var cboProvincial = document.getElementById("cboProvincial");

var txtDistricts = document.getElementById("txtDistricts");
var cboDistricts = document.getElementById("cboDistricts");

var txtWards = document.getElementById("txtWards");
var cboWards = document.getElementById("cboWards");

function LoadCboProvincials() {
	var selectElemRef = document.getElementById("cboProvincial");
	var objProvincials;
	$.ajax({
		dataType: "json",
		url: "/getProvincial",
		data: objProvincials,
		success: function (data) {
			objProvincials = data;
			var html = '';
			//var x = document.getElementById("mySelect");
			//removeOptions($("#cboProvincial"));
			while (selectElemRef.length > 0) {
				selectElemRef.remove(0);
			}
			for (var i = 0, len = objProvincials.length; i < len; ++i) {
				var o = new Option(objProvincials[i].Name, objProvincials[i]._id);
				//o.selected=true;
				$("#cboProvincial").append(o);
			}
			if (cboProvincial.length > 1) {
				document.getElementById("cboProvincial").selectedIndex = 1;
				onCboProvincialsChange(document.getElementById("cboProvincial"));
				document.getElementById("txtProvincial").value = document.getElementById("cboProvincial")[1].text;
			}
		}
	});
};

function onCboProvincialsChange(event) {
	//var selectElement = event.target;
	var value = event.value;
	document.getElementById("txtProvincial").value = event[event.selectedIndex].text;
	//alert(value);
	//alert(document.getElementById("cboProvincial").value)
	//alert(event);
	LoadCboDistricts(value);
};

function LoadCboDistricts(idProvincial) {
	var selectElemRef = document.getElementById("cboDistricts");
	var objDistricts;
	$.ajax({
		dataType: "json",
		url: "/getDistrict?idProvincial=" + idProvincial,
		data: objDistricts,
		success: function (data) {
			objDistricts = data;
			while (selectElemRef.length > 0) {
				selectElemRef.remove(0);
			}
			var o = new Option("Tất cả", "all");
			$("#cboDistricts").append(o);
			for (var i = 0, len = objDistricts.length; i < len; ++i) {

				var o = new Option(objDistricts[i].Name, objDistricts[i]._id);
				//o.selected=true;
				$("#cboDistricts").append(o);
			}
			$("#cboDistricts").append(o);
			if (objDistricts.length > 1) {
				document.getElementById("cboDistricts").selectedIndex = 0;
				onCboDistrictsChange(document.getElementById("cboDistricts"));
				document.getElementById("txtDistricts").value = document.getElementById("cboDistricts")[0].value;
			}
			//$('#cboDistricts').append(html);
		}
	});
};

function onCboDistrictsChange(event) {

	var value = event.value;
	
	if(value=='all')
		document.getElementById("txtDistricts").value = value;
	else
		document.getElementById("txtDistricts").value = event[event.selectedIndex].text;
	//alert(event);
	LoadCboWards(value);
};

function LoadCboWards(idDistrict) {
	var selectElemRef = document.getElementById("cboWards");
	var objWards;
	$.ajax({
		dataType: "json",
		url: "/getWards?idDistrict=" + idDistrict,
		data: objWards,
		success: function (data) {
			objWards = data;
			while (selectElemRef.length > 0) {
				selectElemRef.remove(0);
			}
			var o = new Option("Tất cả", "all");
			$("#cboWards").append(o);
			for (var i = 0, len = objWards.length; i < len; ++i) {

				var o = new Option(objWards[i].Name, objWards[i]._id);
				if (objWards.length > 1) //o.selected=true;
					$("#cboWards").append(o);

			}
			if (objWards.length > 1) {
				document.getElementById("cboWards").selectedIndex = 0;
				document.getElementById("txtWards").value = document.getElementById("cboWards")[0].value;
				//alert(document.getElementById("cboWards")[0].text);
			}
			//$('#cboWards').append(html);
		}
	});
};

function onCboWards(event) {
	var value = event.value;
	
	if(value=='all')
		document.getElementById("txtWards").value = value;
	else
		document.getElementById("txtWards").value = event[event.selectedIndex].text;
	//alert(event);
};
LoadCboProvincials();
//////////////////////
function getKycMembers() {
	//var objMember;
	$.ajax({
		dataType: "json",
		url: "/getKycMembers",
		data: objMember,
		success: function (data) {
			objMember = data;
			document.getElementById("lblCount").innerHTML = 'Số lượng hội viên đã cập nhật ' + objMember.length + '/736';
			drawTable(data);
		}
	});
}

function drawTable(objMembers) {

	var arrLabel = ['Tỉnh/TP', 'Quận/Huyện', 'Phường/Xã', 'Chức vụ', 'Họ và tên', 'Ngày sinh', 'Số ĐT', 'Email', 'Chi hội', 'Xác nhận', 'Từ chối']
	var table = document.createElement("table");
	table.setAttribute("width", "100%");
	table.setAttribute("class", "demo-table");
	//var row = table.insertRow(0);
	var header = table.createTHead();
	var row = table.insertRow(0);
	for (j = 0; j < arrLabel.length; j++) {
		var cell1 = row.insertCell(j);
		cell1.setAttribute("align", "center");
		cell1.textContent = arrLabel[j];
	};
	for (var i = 1; i < 737; i++) {

		// Stores Results
		// var object = results[i];
		//var text = object.get("firstName") + " " + object.get("lastName");

		var row = table.insertRow(i);
		if (i-1 < objMembers.length) {
			obj = objMembers[i-1];


			var cell1 = row.insertCell(0);
			cell1.setAttribute("align", "left");
			cell1.textContent = obj.Provincial;

			var cell2 = row.insertCell(1);
			cell2.setAttribute("align", "left");
			cell2.textContent = obj.Districts;

			var cell3 = row.insertCell(2);
			cell3.setAttribute("align", "left");
			cell3.textContent = obj.Wards;

			var cell4 = row.insertCell(3);
			cell4.setAttribute("align", "left");
			cell4.textContent = obj.Position;

			var cell5 = row.insertCell(4);
			cell5.setAttribute("align", "left");
			cell5.textContent = obj.Name;

			var cell6 = row.insertCell(5);
			cell6.setAttribute("align", "center");
			var date = new Date(obj.Birthday);
			cell6.textContent = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

			var cell7 = row.insertCell(6);
			cell7.setAttribute("align", "center");
			cell7.textContent = obj.Phone;


			var cell8 = row.insertCell(7);
			cell8.setAttribute("align", "left");
			cell8.textContent = obj.Email;


			var cell9 = row.insertCell(8);
			cell9.setAttribute("align", "center");
			if (obj.Branch != null && obj.Branch != 'null') {
				//arrBranch=obj.Branch.split(',');
				cell9.innerHTML = '<a href="#" onClick="ShowBranch(this)">' + obj.Branch.length + '</a>';

			} else {
				cell9.textContent = 0;
			}
			
			if(obj.BlockStatus=='PENDING')
			{
				var cell10 = row.insertCell(9);
				cell10.setAttribute("align", "center");
				cell10.innerHTML = '<img src="img/Accept.png" alt="logo" onClick="AccpetMember(this)"/>';


				var cell11 = row.insertCell(10);
				cell11.setAttribute("align", "center");
				cell11.innerHTML = '<img src="img/cancel2.png" alt="logo" onClick="CancelMember(this)"/>';
				
			}else if(obj.BlockStatus=='ACTIVE')
			{
				var cell10 = row.insertCell(9);
				cell10.setAttribute("align", "center");
				cell10.innerHTML = '<img src="img/ok.png" alt="logo" />';


				var cell11 = row.insertCell(10);
				cell11.setAttribute("align", "center");
				cell11.innerHTML = '.';
			}
			else if(obj.BlockStatus=='CANCEL')
			{
				var cell10 = row.insertCell(9);
				cell10.setAttribute("align", "center");
				cell10.innerHTML = '.';


				var cell11 = row.insertCell(10);
				cell11.setAttribute("align", "center");
				cell11.innerHTML = '<img src="img/ok1.png" alt="logo" />';
			}
				

		} else {
			for (var j = 0; j < 11; j++) {
				var cell = row.insertCell(j);
				cell.setAttribute("align", "center");
				cell.textContent = '...';
			}
		}

	}
	document.getElementById("dvMemberList").appendChild(table);
};

function AccpetMember(objImg) {
	var index = objImg.parentNode.parentNode.rowIndex-1;
	var row =objImg.parentNode.parentNode;
	//alert(objMember[index].Phone);
	var local ="";
	if(objMember[index].Position=='CTH LHTN Tỉnh')	
	{
			local=" Tỉnh/Tp " +objMember[index].Provincial;

	}else if(objMember[index].Positio=='CTH LHTN huyện')
	{
			local=" Quận/Huyện " +objMember[index].Districts;
	}
	else
	{
			local=" Phường/Xã " +objMember[index].Wards;
	}
	var objM = {};
	objM.BlockStatus = 'ACTIVE';
	objM.Phone = objMember[index].Phone;
	 var mess = "Bạn có muốn duyệt khai báo của " + objMember[index].Name + ", chức vụ " +objMember[index].Position +" ở " + local + ", có số ĐT:"+objM.Phone;
	var r = confirm(mess);
    if (r == true) {
		$.ajax({
			type: 'POST',
			data: JSON.stringify(objM),
			contentType: 'application/json',
			url: '/updateStatusKycMember.bot',				
			success: function(data) 
			{
				alert(data);			
				console.log(data);
				row.cells[9].innerHTML='<img src="img/ok.png" alt="logo" />';
				row.cells[10].innerHTML='.';
			},
			error: function(err) {		 
			  alert(err.statusText);

			}
		});
	 } 
};
function CancelMember(objImg) {
	var index = objImg.parentNode.parentNode.rowIndex-1;
	var row =objImg.parentNode.parentNode;
	var local ="";
	if(objMember[index].Position=='CTH LHTN Tỉnh')	
	{
			local=" Tỉnh/Tp " +objMember[index].Provincial;

	}else if(objMember[index].Positio=='CTH LHTN huyện')
	{
			local=" Quận/Huyện " +objMember[index].Districts;
	}
	else
	{
			local=" Phường/Xã " +objMember[index].Wards;
	}
	//alert(objMember[index].Phone);
	var objM = {};
	objM.BlockStatus = 'CANCEL';
	objM.Phone = objMember[index].Phone;
	 var mess = "Bạn có muốn từ chối khai báo của " + objMember[index].Name + ", chức vụ " +objMember[index].Position +" ở " + local + ", có số ĐT:"+objM.Phone;
	var r = confirm(mess);
    if (r == true) {
	$.ajax({
		type: 'POST',
		data: JSON.stringify(objM),
		contentType: 'application/json',
		url: '/updateStatusKycMember.bot',				
		success: function(data) 
		{
			alert(data);			
			console.log(data);
			row.cells[10].innerHTML='<img src="img/ok1.png" alt="logo" />';
			row.cells[9].innerHTML='.';
		},
	    error: function(err) {		 
		  alert(err.statusText);
		 
		}
      });
	}
};

function ShowBranch(obj) {
	var index = obj.parentNode.parentNode.rowIndex-1;
	str = '';
	for (i = 0; i < objMember[index].Branch.length; i++) {
		str = str + " | " + objMember[index].Branch[i].Name;
	}
	alert(str);
};
function ShowDeltail()
{
	  window.open("/ksvd.bot?p="+txtProvincial.value+"&d="+txtDistricts.value+"&w="+txtWards.value);
};

function Login()
{
	var fsListLogin=document.getElementById("fsListLogin");
    var fsListMember= document.getElementById("fsListMember");
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
				fsListMember.style.display="inline";
				fsListLogin.style.display="none";
				getKycMembers();
				//window.location.href = 'index.html';
			}else
			{
				alert(data);
				fsListMember.style.display="none";
				fsListLogin.style.display="inline";
			}
			//console.log(data);
		}
    });
};


