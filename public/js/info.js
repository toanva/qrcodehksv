// JavaScript Document
var objMember;
var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};
//var approvedId = document.getElementById("psid").value;
//document.getElementById('html').style.zoom = '70%';
function getParamValue(param) {
    var urlParamString = location.search.split(param + "=");
    if (urlParamString.length <= 1) 
	{return "";}
    else {
        var tmp = urlParamString[1].split("&");
        return tmp[0];
    }
};
//////////////////////
function getInfo() {
	
	//var psid = document.getElementById("psid").value;
	var dvInfo = document.getElementById("dvInfo");
	var imgAvatar= document.getElementById("imgAvatar");
	var objInfo;
	$.ajax({
		dataType: "json",
		url: "/getMember?psid="+document.getElementById("psid").value,
		data: objInfo,
		success: function (data) {
			objInfo = data[0];
			imgAvatar.src=objInfo.ImgUrl;
			//var date= new Date(objInfo.Birthday);
			//var birthday = date.getDate()+'/'+(date.getMonth() + 1)+'/'+date.getFullYear();
			var strRow ='';
			strRow= strRow+ '<b >Họ và Tên :'+ objInfo.Name+'</b>';
			strRow= strRow+ '<br><b> Cấp cán bộ :'+ objInfo.LevelName+'</b>';
			strRow= strRow+ '<br><b> Chức vụ :'+ objInfo.Position+'</b>';
			if(objInfo.Concurrently!=undefined && objInfo.Concurrently!='' && objInfo.Concurrently!=null)
				strRow= strRow+ '<br><b> Chức vụ kiêm nhiệm:'+ objInfo.Position+'</b>';
			else
				strRow= strRow+ '<br><b> Chức vụ kiêm nhiệm: không có</b>';
			strRow= strRow+ '<br><b>Tỉnh/TP :</b>'+ objInfo.Provincial;
			strRow= strRow+ '<br><b>Quận/Huyện :</b>'+ objInfo.District;
			strRow= strRow+ '<br><b>Xã/Phường :</b>'+ objInfo.Ward;
			strRow= strRow+ '<br><b>Ngày sinh :</b>' + objInfo.Birthday;
			strRow= strRow+ '<br><b>Điện thoại :</b>'+ objInfo.Phone;
			strRow= strRow+ '<br><b>Email :</b>'+ objInfo.Email;
			if(objInfo.ApprovedName!=null && objInfo.ApprovedName!=undefined)
		    	strRow= strRow+ '<br><b>Người xác thực :</b>'+ objInfo.ApprovedName;
		    else
				strRow= strRow+ '<br><b>Người xác thực : Chưa cập nhật</b>';
			if(objInfo.BlockStatus=='PENDING')
			{
				strRow= strRow+ '<br><b>Trạng thái :</b> Chưa được xác thực';
				
			}else if(objInfo.BlockStatus=='ACTIVE')
			{
				strRow= strRow+ '<br><b>Trạng thái :</b> Đã được xác thực';
				
			}else if(objInfo.BlockStatus=='CANCEL')
			{
				strRow= strRow+ '<br><b>Trạng thái :</b> Đã bị từ chối xác thực';
			}
		    dvInfo.innerHTML=strRow;
			getMembers();
		}
	});
};

function getMembers() {
	//var psid = document.getElementById("psid").value;
	$.ajax({
		dataType: "json",
		url: "/getListMemberApprovedById?psid="+document.getElementById("psid").value,
		data: objMember,
		success: function (data) {
			objMember = data;
			//document.getElementById("lblCount").innerHTML = 'Số lượng hội viên đã cập nhật ' + objMember.length + '/736';
			drawTable(data);
		}
	});
};
function drawTable(objMembers) {

	var table = document.createElement("table");
	table.setAttribute("width", "100%");
	table.setAttribute("class", "demo-table");
	
	
	for (var i = 0; i < objMembers.length; i++) {
		obj=objMembers[i];
		//var date= new Date(obj.Birthday);
		//var birthday = date.getDate()+'/'+(date.getMonth() + 1)+'/'+date.getFullYear();
		var row = table.insertRow(i);
		var strRow='<tr>';
			if(obj.BlockStatus=='ACTIVE')
			{
				strRow= strRow+ ' <td scope="col" width="120px" height="120px" style="text-align: center;align:center"><img src="'+obj.ImgUrl+'" alt="Ảnh đại diện" height="80px" width="80px"><br><br><input type="image" src="img/cancelvn.png" alt="Hủy" onClick="CancelStatusMember(this);return false;" height="21px" width="80px"/></td>';
			}else
			{
				strRow= strRow+ '<td scope="col" width="120px" height="120px" style="text-align: center;align:center"><img src="'+obj.ImgUrl+'" alt="Ảnh đại diện" height="80px" width="80px"></td>';			
			}
			strRow= strRow+ ' <td scope="col" >';
			strRow= strRow+ '<b >Họ và Tên :'+ obj.Name+'</b>';
			strRow= strRow+ '<br><b> Cấp cán bộ :'+ obj.LevelName+'</b>';
			strRow= strRow+ '<br><b> Chức vụ :'+ obj.Position+'</b>';
			strRow= strRow+ '<br><b>Tỉnh/TP :</b>'+ obj.Provincial;
			strRow= strRow+ '<br><b>Quận/Huyện :</b>'+ obj.District;
			strRow= strRow+ '<br><b>Xã/Phường :</b>'+ obj.Ward;
			strRow= strRow+ '<br><b>Ngày sinh :</b>' + obj.Birthday;
			strRow= strRow+ '<br><b>Điện thoại :</b>'+ obj.Phone;
			strRow= strRow+ '<br><b>Email :</b>'+ obj.Email;
			if(obj.ApprovedName!=null && obj.ApprovedName!=undefined)
		    	strRow= strRow+ '<br><b>Người xác thực :</b>'+ obj.ApprovedName;
		    else
				strRow= strRow+ '<br><b>Người xác thực : Chưa cập nhật</b>';
		
			
			strRow= strRow+ '</td>';
		
//			if(obj.BlockStatus=='PENDING')
//			{
//				strRow= strRow+ '<td scope="col" width="75px"><input type="image" src="img/Accept.png" alt="Duyệt" onClick="AccpetMember(this);return false;"/></td>';
//				strRow= strRow+ '<td scope="col" width="75px"> <input type="image" src="img/cancel2.png" alt="Từ chối" onClick="CancelMember(this);return false;"/> </td>';
//				
//			}else if(obj.BlockStatus=='ACTIVE')
//			{
//				strRow= strRow+ '<td scope="col" width="75px"><img src="img/ok.png" alt="Đã chọn"/></td>';
//				strRow= strRow+ '<td scope="col" width="75px" style="text-align: center">.</td>';
//				
//			}else if(obj.BlockStatus=='CANCEL')
//			{
//				strRow= strRow+ '<td scope="col" width="75px">.</td>';
//				strRow= strRow+ '<td scope="col" width="75px" style="text-align: center"><img src="img/ok1.png" alt="Đã chọn"/></td>';
//			}
		
			strRow= strRow+'</tr>';
		    row.innerHTML=strRow;
	}
	document.getElementById("dvMemberList").appendChild(table);
};

function AccpetMember(objImg) {
	var index = objImg.parentNode.parentNode.rowIndex;
	var row =objImg.parentNode.parentNode;
	//alert(objMember[index].Phone);
	var local ="";
	var level = objMember[index].Level;
	if(level==1)	
	{
			local = " trung ương"

	}else if(level==2)		
	{
			local=" Tỉnh/Tp " +objMember[index].Provincial;

	}else if(level==3)	
	{
			local=" Quận/Huyện " +objMember[index].Districts;
	}else if(level==4)	
	{
		 local=" Phường/Xã " +objMember[index].Wards;
	}else if(level==5)	
	{
		 local=" Chi hội " +objMember[index].Branch;
	}
	
	var objM = {};
	objM.BlockStatus = 'ACTIVE';
	objM.psid = objMember[index]._id;
	objM.Phone=objMember[index].Phone;
	objM.Name=objMember[index].Name;
	objM.ApprovedId=document.getElementById("psid").value;
	//objM.ApprovedName=objMember[index].Name;
	 var mess = "Bạn có muốn duyệt khai báo của " + objMember[index].Name + ", chức vụ " +objMember[index].Position +" ở " + local + ", có số ĐT:"+objM.Phone;
	var r = confirm(mess);
    if (r == true) {
		$.ajax({
			type: 'POST',
			data: JSON.stringify(objM),
			contentType: 'application/json',
			url: '/updateStatusMember.bot',				
			success: function(data) 
			{
				alert(data);			
				console.log(data);
				row.cells[2].innerHTML='<img src="img/ok.png" alt="logo" />';
				row.cells[3].innerHTML='.';
				row.cells[0].innerHTML='<td scope="col" width="120px" height="120px" style="text-align: center;align:center"><img src="'+objMember[index].ImgUrl+'" alt="Ảnh đại diện" height="80px" width="80px"><br><br><input type="image" src="img/cancelvn.png" alt="Hủy" onClick="CancelStatusMember(this);return false;" height="21px" width="80px"/></td>';
			},
			error: function(err) {		 
			  alert(err.statusText);

			}
		});
	 } 
};
function CancelMember(objImg) {
	var index = objImg.parentNode.parentNode.rowIndex;
	var row =objImg.parentNode.parentNode;
	var local ="";
	var level = objMember[index].Level;
	if(level==1)	
	{
			local = " trung ương"

	}else if(level==2)		
	{
			local=" Tỉnh/Tp " +objMember[index].Provincial;

	}else if(level==3)	
	{
			local=" Quận/Huyện " +objMember[index].Districts;
	}else if(level==4)	
	{
		 local=" Phường/Xã " +objMember[index].Wards;
	}else if(level==5)	
	{
		 local=" Chi hội " +objMember[index].Branch;
	}
	//alert(objMember[index].Phone);
	var objM = {};
	objM.BlockStatus = 'CANCEL';
	objM.psid = objMember[index]._id;
	objM.Phone=objMember[index].Phone;
	objM.Name=objMember[index].Name;
	objM.ApprovedId=document.getElementById("psid").value;
	 var mess = "Bạn có muốn từ chối khai báo của " + objMember[index].Name + ", chức vụ " +objMember[index].Position +" ở " + local + ", có số ĐT:"+objM.Phone;
	var r = confirm(mess);
    if (r == true) {
	$.ajax({
		type: 'POST',
		data: JSON.stringify(objM),
		contentType: 'application/json',
		url: '/updateStatusMember.bot',				
		success: function(data) 
		{
			alert(data);			
			console.log(data);
			row.cells[3].innerHTML='<img src="img/ok1.png" alt="logo" />';
			row.cells[2].innerHTML='.';			
		
			
		},
	    error: function(err) {		 
		  alert(err.statusText);
		 
		}
      });
	}
};
function CancelStatusMember(objInput) {
	var index = objInput.parentNode.parentNode.rowIndex;
	var row =objInput.parentNode.parentNode;
	var local ="";
	var level = objMember[index].Level;
	if(level==1)	
	{
			local = " trung ương"

	}else if(level==2)		
	{
			local=" Tỉnh/Tp " +objMember[index].Provincial;

	}else if(level==3)	
	{
			local=" Quận/Huyện " +objMember[index].Districts;
	}else if(level==4)	
	{
		 local=" Phường/Xã " +objMember[index].Wards;
	}else if(level==5)	
	{
		 local=" Chi hội " +objMember[index].Branch;
	}
	//alert(objMember[index].Phone);
	var objM = {};
	objM.BlockStatus = 'PENDING';
	objM.psid = objMember[index]._id;
	objM.Phone=objMember[index].Phone;
	objM.Name=objMember[index].Name;
	objM.ApprovedId=document.getElementById("psid").value;
	 var mess = "Bạn có muốn hủy xác thực của " + objMember[index].Name + ", chức vụ " +objMember[index].Position +" ở " + local + ", có số ĐT:"+objM.Phone;
	var r = confirm(mess);
    if (r == true) {
	$.ajax({
		type: 'POST',
		data: JSON.stringify(objM),
		contentType: 'application/json',
		url: '/cancelStatusMember.bot',				
		success: function(data) 
		{
			alert(data);			
			console.log(data);
			row.cells[0].innerHTML='<td scope="col" width="120px" height="120px" style="text-align: center;align:center"><img src="'+objMember[index].ImgUrl+'" alt="Ảnh đại diện" height="80px" width="80px"></td>';
			row.cells[2].innerHTML='<td scope="col" width="75px"><input type="image" src="img/Accept.png" alt="Duyệt" onClick="AccpetMember(this);return false;"/></td>';
			row.cells[3].innerHTML='<td scope="col" width="75px"> <input type="image" src="img/cancel2.png" alt="Từ chối" onClick="CancelMember(this);return false;"/> </td>';
		},
	    error: function(err) {		 
		  alert(err.statusText);
		 
		}
      });
	}
};
function ShowBranch(obj) {
	var index = obj.parentNode.parentNode.rowIndex;
	str = '';
	for (i = 0; i < objMember[index].Branch.length; i++) {
		str = str + " | " + objMember[index].Branch[i].Name;
	}
	alert(str);
};
//getMembers();
//$(document).ready(function(){
//if(!isMobile.any())
//	{
//		var width = document.getElementById('dvMain').offsetWidth;
//					var height = document.getElementById('dvMain').offsetHeight;
//					var windowWidth = $(document).outerWidth();
//					var windowHeight = $(document).outerHeight();
//					var r = 1;
//					r = Math.min(windowWidth / width, windowHeight / height)
//					if(r>=1)
//					r = 0.58;
//					$('#dvMain').css({
//						'-webkit-transform': 'scale(' + r + ')',
//						'-moz-transform': 'scale(' + r + ')',
//						'-ms-transform': 'scale(' + r + ')',
//						'-o-transform': 'scale(' + r + ')',
//						'transform': 'scale(' + r + ')'
//					});
//	}
//
//});



