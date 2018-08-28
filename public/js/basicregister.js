//var psid = document.getElementById("psid").value;
//Chức danh



var txtFullName = document.getElementById("txtFullName");
var stName = document.getElementById("stName");

var stBirthday = document.getElementById("stBirthday");
var txtDay = document.getElementById("txtBirthday");




var stProvincial = document.getElementById("stProvincial");
var txtProvincial = document.getElementById("txtProvincial");
var cboProvincial = document.getElementById("cboProvincial");

var stDistricts = document.getElementById("stDistricts");
var txtDistricts = document.getElementById("txtDistricts");
var cboDistricts = document.getElementById("cboDistricts");

var stWards = document.getElementById("stWards");
var txtWards = document.getElementById("txtWards");
var cboWards = document.getElementById("cboWards");

var stBranch = document.getElementById("stBranch");
var txtBranch = document.getElementById("txtBranch");
var cboBranch = document.getElementById("cboBranch");


var stPhone = document.getElementById('stPhone');
var txtPhone = document.getElementById('txtPhone');

var stEmail = document.getElementById('stEmail');
var txtEmail = document.getElementById('txtEmail');
var btnSend = document.getElementById('btnSend');
var reader;
var progress = document.querySelector('.percent');
var dataImg;
var nameImg;
//var position1 = ["Chủ tịch", "P. Chủ tịch thường trực", "P. Chủ tịch", "UV thường trực Đoàn chủ tịch", "Chánh văn phòng", "Phó chánh văn phòng", "Cán bộ văn phòng", "Trưởng Cổng Thánh Gióng", "Trưởng Trung tâm tình nguyện", "Trưởng Trung tâm hỗ trợ thanh niên khởi nghiệp"];
//var arrLayer1 = [1, 1, 1, 2, 2, 2, 2,2, 2, 2];

//var position2 = ["Chủ tịch", "P. Chủ tịch", "Ủy viên ban thư ký hội", "Chánh văn phòng", "Cán bộ văn phòng"];
//var arrLayer2 = [2, 3,3,3,3];

//var position3 = ["Chủ tịch", "P. Chủ tịch"];
//var arrLayer3= [3, 4];

//var position4 = ["Chủ tịch", "P. Chủ tịch"];
//var arrLayer4= [4, 5];

//var position5 = ["Chi hội trưởng", "Tổ trưởng", "Đội trưởng", "Chủ nhiệm CLB", "Trưởng nhóm"];
//var arrLayer5 = [5,5, 5, 5,5];
var arrPosition=[];
var arrLayer=[];
function getParamValue(param) {
    var urlParamString = location.search.split(param + "=");
    if (urlParamString.length <= 1) 
	{
		return "";
	}
    else {
        var tmp = urlParamString[1].split("&");
        return tmp[0];
    }
};
function resizeInCanvas(img) {
	/////////  3-3 manipulate image
	var perferedWidth = 500;
	var ratio = perferedWidth / img.width;
	var canvas = $("<canvas>")[0];
	canvas.width = img.width * ratio;
	canvas.height = img.height * ratio;
	var ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
	//////////4. export as dataUrl
	return canvas.toDataURL();
};

function abortRead() {
	reader.abort();
}

function errorHandler(evt) {
	switch (evt.target.error.code) {
		case evt.target.error.NOT_FOUND_ERR:
			alert('File Not Found!');
			break;
		case evt.target.error.NOT_READABLE_ERR:
			alert('File is not readable');
			break;
		case evt.target.error.ABORT_ERR:
			break; // noop
		default:
			alert('An error occurred reading this file.');
	};
}

function updateProgress(evt) {
	
	if (evt.lengthComputable) {
		var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
		// Increase the progress bar length.
		if (percentLoaded < 100) {
			progress.style.width = percentLoaded + '%';
			progress.textContent = percentLoaded + '%';
		}
	}
}

function handleFileSelect(evt) {
	// Reset progress indicator on new file selection.
	progress.style.width = '0%';
	progress.textContent = '0%';

	reader = new FileReader();
	reader.onerror = errorHandler;
	reader.onprogress = updateProgress;
	reader.onabort = function (e) {
		alert('File read cancelled');
	};
	reader.onloadstart = function (e) {
		document.getElementById('progress_bar').className = 'loading';
	};
	reader.onload = function (e) {
			// Ensure that the progress bar displays 100% at the end.
			progress.style.width = '100%';
			progress.textContent = '100%';
			var img = new Image();
			img.onload = function () {
				dataImg = resizeInCanvas(img).replace(/^data:image\/[a-z]+;base64,/, "");
				//dataImg= dataImg.replace(/^data:image\/[a-z]+;base64,/, "");
				//onRedSS();
			};
			//dataImg=e.target.result.replace(/^data:image\/[a-z]+;base64,/, "");;
			img.src = e.target.result;
			setTimeout("document.getElementById('progress_bar').className='';", 2000);

		}
		// Read in the image file as a binary string.
	reader.readAsDataURL(evt.target.files[0]);
}
//document.getElementById('txtAvatar').addEventListener('change', handleFileSelect, false);

function onRedSS() {
	alert(dataImg);
};

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
	
	var value = event.value;
	document.getElementById("txtProvincial").value = event[event.selectedIndex].text;
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
			for (var i = 0, len = objDistricts.length; i < len; ++i) {
				var o = new Option(objDistricts[i].Name, objDistricts[i]._id);
				//o.selected=true;
				$("#cboDistricts").append(o);
			}
			var o = new Option("Khác", "9999");
			$("#cboDistricts").append(o);
			if (objDistricts.length > 1) {
				document.getElementById("cboDistricts").selectedIndex = 1;
				onCboDistrictsChange(document.getElementById("cboDistricts"));
				document.getElementById("txtDistricts").value = document.getElementById("cboDistricts")[1].text;
			}else
			{
				onCboDistrictsChange(cboDistricts);
			}
		}
	});
};

function onCboDistrictsChange(event) {

	var id = event.value;
	document.getElementById("txtDistricts").value = event[event.selectedIndex].text;
	//alert(event);
	var value = cboDistricts[cboDistricts.selectedIndex].text;
	LoadCboWards(id);
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
			for (var i = 0, len = objWards.length; i < len; ++i) {
				var o = new Option(objWards[i].Name, objWards[i]._id);
				//o.selected=true;
				$("#cboWards").append(o);

			}
			var o = new Option("Khác", "NA");
			$("#cboWards").append(o);
			if (objWards.length > 1) {
				document.getElementById("cboWards").selectedIndex = 1;
				onCboWards(document.getElementById("cboWards"));
				document.getElementById("txtWards").value = document.getElementById("cboWards")[1].text;
				//alert(document.getElementById("cboWards")[0].text);
			}else
			{
				onCboWards(cboWards);
			}
			//$('#cboWards').append(html);
		}
	});
};

function onCboWards(event) {
	var id = event.value;
	document.getElementById("txtWards").value = event[event.selectedIndex].text;
	
};

LoadCboProvincials();
function SaveObject() {
	btnSend.disabled = true;
	btnSend.style.color = '#5d98fb';
	var psid;
	if(document.getElementById("psid").value!="" && document.getElementById("psid").value!=undefined)
	{
		psid = document.getElementById("psid").value;
	}else
	{
		psid= getParamValue("psid");
	}
	//var file_data = txtImage.prop("files")[0]; 

	if (txtFullName.value == undefined || txtFullName.value == "") {
		alert("Bạn phải nhập tên");
		btnSend.disabled = false;
		btnSend.style.color = '#FFFFFF';
		txtFullName.focus();
		return;
	};

	if (txtPhone.value == undefined || txtPhone.value == "") {
		alert("Bạn phải nhập số ĐT");
		btnSend.disabled = false;
		btnSend.style.color = '#FFFFFF';
		txtPhone.focus();
		return;
	};
	if (txtEmail.value == undefined || txtEmail.value == "") {
		alert("Bạn phải nhập Email");
		btnSend.disabled = false;
		btnSend.style.color = '#FFFFFF';
		txtEmail.focus();
		return;
	};

	


	var mydate = txtBirthday.valueAsDate;
	var inputDate = new Date(mydate.toISOString());

	var objMember = {};
	objMember.psid = psid;
	objMember.Name = txtFullName.value;	
	objMember.Birthday =  mydate.getDate()+'/'+(mydate.getMonth()+1)+'/'+mydate.getFullYear();
	
	objMember.Position="Khác";
	
	objMember.IsConcurrently ='';
	objMember.Concurrently = '';
	
	objMember.Provincial = txtProvincial.value;	
	objMember.Districts = txtDistricts.value;
	objMember.Wards = txtWards.value;
	objMember.Branch = '';

	//objMember.Branch = txtBranch.value;
	objMember.Phone = txtPhone.value;
	objMember.Email = txtEmail.value;
	objMember.LevelName = 'Khác';
	objMember.Level = 8;
	objMember.Layer = 9;
	//objMember.DataImg = dataImg;
	//objMember.ImgName = txtAvatar.files[0].name;
	//objProduct.Status="Active";
	var form = new FormData();
	form.append('psid', objMember.psid);
	form.append('Name', objMember.Name);
	form.append('Birthday', objMember.Birthday);

	form.append('Position', objMember.Position);
	form.append('IsConcurrently', objMember.IsConcurrently);
	form.append('Concurrently', objMember.Concurrently);
	form.append('LevelName', objMember.LevelName);
	form.append('Level', objMember.Level);
	form.append('Layer', objMember.Layer);
	form.append('Provincial', objMember.Provincial);
	form.append('Districts', objMember.Districts);
	form.append('IdDistrict', cboDistricts.value);
	form.append('Wards', objMember.Wards);
	form.append('IdWard', cboWards.value);
	form.append('Branch', objMember.Branch);
	//form.append('Branch', objMember.Branch);
	form.append('Phone', objMember.Phone);
	form.append('Email', objMember.Email);
	//form.append('ImgName', objMember.ImgName);
	//form.append('DataImgAvatar', objMember.DataImg); //n	
	$.ajax({
		type: 'POST',
		data: form,
		contentType: false,
		processData: false,
		url: '/basicregisterspostback.bot',
		success: function (data) {
			//alert("Thêm mới sản phẩm thành công!")
			//console.log('success');
			btnSend.disabled = false;
			btnSend.style.color = '#FFFFFF';
			console.log(data);
			alert("Thêm mới thành công");
			MessengerExtensions.requestCloseBrowser(function success() {
				console.log("Webview closing");
			}, function error(err) {
				console.log("getElementById Err:" + err);
			});

		},
		error: function (err) {
			btnSend.disabled = false;
			btnSend.style.color = '#FFFFFF';
			alert("Lỗi :", err);
		}
	});

};
