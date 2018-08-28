var psid = document.getElementById("psid").value;
var cboPosition = document.getElementById("cboPosition");

var txtFullName = document.getElementById("txtFullName");
var stName = document.getElementById("stName");

var stBirthday = document.getElementById("stBirthday");
var txtDay = document.getElementById("txtDay");
var txtMonth = document.getElementById("txtMonth");
var txtYear = document.getElementById("txtYear");

var stLevel = document.getElementById("stLevel");
var txtLevel = document.getElementById("txtLevel");
var cboLevel = document.getElementById("cboLevel");

var stProvincial = document.getElementById("stProvincial");
var txtProvincial = document.getElementById("txtProvincial");
var cboProvincial = document.getElementById("cboProvincial");

var stDistricts = document.getElementById("stDistricts");
var txtDistricts = document.getElementById("txtDistricts");
//var cboDistricts = document.getElementById("cboDistricts");

var stWards = document.getElementById("stWards");
var txtWards = document.getElementById("txtWards");
//var cboWards = document.getElementById("cboWards");

var stBranch = document.getElementById("stBranch");
///var txtBranchNA = document.getElementById("txtBranchNA");
var txtBranch = document.getElementById("txtBranch");
//var cboBranch = document.getElementById("cboBranch");
////var stBranchNA = document.getElementById("stBranchNA");


var txtAvatar = document.getElementById('txtAvatar');
// var stBranch= document.getElementById('stBranch');
//var txtBranch= document.getElementById('txtBranch');

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
//
//var position2 = ["Chủ tịch", "P. Chủ tịch", "Ủy viên ban thư ký hội", "Chánh văn phòng", "Cán bộ văn phòng"];
//var arrLayer2 = [2, 3,3,3,3];
//
//var position3 = ["Chủ tịch", "P. Chủ tịch"];
//var arrLayer3= [3, 4];
//
//var position4 = ["Chủ tịch", "P. Chủ tịch"];
//var arrLayer4= [4, 5];
//
//var position5 = ["Chi hội trưởng", "Tổ trưởng", "Đội trưởng", "Chủ nhiệm CLB", "Trưởng nhóm"];
//var arrLayer5 = [5,5, 5, 5,5];

//var arrPosition=[position1,position2,position3,position4,position5];
//var arrLayer=[arrLayer1,arrLayer2,arrLayer3,arrLayer4,arrLayer5];
var arrPosition=[];
var arrLayer=[];

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
	// evt is an ProgressEvent.
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
function setDataPosition(position,layer){
	while (cboPosition.length > 0) {
				cboPosition.remove(0);
			}
	for (var i = 0, len = position.length; i < len; ++i) {
				var o = new Option(position[i], layer[i]);
				//o.selected=true;
				$("#cboPosition").append(o);

			}
};
function loadPosition(){
	//var selectElemRef = document.getElementById("cboProvincial");
	var position1 = [];
    var arrLayer1= [];
	var position2 = [];
    var arrLayer2= [];
	var position3 = [];
    var arrLayer3= [];
	var position4 = [];
    var arrLayer4= [];
	var position5 = [];
    var arrLayer5= [];
	var objPosition;
	$.ajax({
		dataType: "json",
		url: "/getPosition",
		data: objPosition,
		success: function (data) {
			objPosition = data;
			
			for (var i = 0, len = objPosition.length; i < len; ++i) {
				var value = objPosition[i].Level;
				if (value == '1') {
					position1.push(objPosition[i].Name);						
					arrLayer1.push(objPosition[i].Layer);					
				} else if (value == '2') {
					position2.push(objPosition[i].Name);						
					arrLayer2.push(objPosition[i].Layer);
				} else if (value == '3') {
					position3.push(objPosition[i].Name);						
					arrLayer3.push(objPosition[i].Layer);	
				} else if (value == '4') {
					position4.push(objPosition[i].Name);						
					arrLayer4.push(objPosition[i].Layer);
				} else {
					position5.push(objPosition[i].Name);						
					arrLayer5.push(objPosition[i].Layer);
				}	
				
			}
			arrPosition=[position1,position2,position3,position4,position5];
			arrLayer=[arrLayer1,arrLayer2,arrLayer3,arrLayer4,arrLayer5];
			setDataPosition(arrPosition[0],arrLayer[0]);
		}
	});
};
loadPosition();
function LoadCboProvincials() {
	var selectElemRef = document.getElementById("cboProvincial");
	var objProvincials;
	$.ajax({
		dataType: "json",
		url: "/getProvincialTemp",
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
	//LoadCboDistricts(value);
};
LoadCboProvincials();
function cboLevelChange(event) {
	var value = event.value;
	if (value == '1') {
		setDataPosition(arrPosition[0],arrLayer[0]);
		selectCTHLHTNTU();

	} else if (value == '2') {
		setDataPosition(arrPosition[1],arrLayer[1]);
		selectCTHLHTNT();

	} else if (value == '3') {
		setDataPosition(arrPosition[2],arrLayer[2]);
		selectCTHLHTNH();
	} else if (value == '4') {
		setDataPosition(arrPosition[3],arrLayer[3]);
		selectCTHLHTNX();
	} else {
		setDataPosition(arrPosition[4],arrLayer[4]);
		selectCTHLHTN();
	}
	//document.getElementById("txtWards").value=event[event.selectedIndex].text;
	//alert(event);
};

function cboPositionChange(event) {

};

function selectCTHLHTNTU() {
	stProvincial.style.display = "none";
	txtProvincial.value = 'NA';
	stDistricts.style.display = "none";
	txtDistricts.value = 'NA';
	stWards.style.display = "none";
	txtWards.value = 'NA';
	stBranch.style.display = "none";
	txtBranch.value = 'NA';
	//stBranch.value='NA';
	//stBranch.style.display="none";
};

function selectCTHLHTNT() {
	stProvincial.style.display = "inline";
	stDistricts.style.display = "none";
	txtDistricts.value = 'NA';
	stWards.style.display = "none";
	txtWards.value = 'NA';
	stBranch.style.display = "none";
	txtBranch.value = 'NA';
	//stBranch.value='NA';
	//stBranch.style.display="none";
};

function selectCTHLHTNH() {
	stProvincial.style.display = "inline";
	stDistricts.style.display = "inline";
	stWards.style.display = "none";
	txtWards.value = 'NA';
	stBranch.style.display = "none";
	txtBranch.value = 'NA';
};

function selectCTHLHTNX() {
	stProvincial.style.display = "inline";
	stDistricts.style.display = "inline";
	stWards.style.display = "inline";
	stBranch.style.display = "none";
	txtBranch.value = 'NA';

};

function selectCTHLHTN() {
	stProvincial.style.display = "inline";
	stDistricts.style.display = "inline";
	stWards.style.display = "inline";
	stBranch.style.display = "inline";

};


function SaveObject() {
	btnSend.disabled = true;
	btnSend.style.color = '#5d98fb';
	var psid = document.getElementById("psid").value;

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



	if (cboLevel.value == '1') {
		txtProvincial.value = 'NA';
		txtDistricts.value = 'NA';
		txtWards.value = 'NA';
		txtBranch.value = 'NA';
		//stBranch.value='NA';

	} else if (cboLevel.value == '2') {
		txtDistricts.value = 'NA';
		txtWards.value = 'NA';
		txtBranch.value = 'NA';
		//stBranch.value='NA';

	} else if (cboLevel.value == '3') {
		txtWards.value = 'NA';
		txtBranch.value = 'NA';
		//stBranch.value='NA';
	} else if (cboLevel.value == '4') {
		//txtWards.value='NA';
		txtBranch.value = 'NA';
		//stBranch.value='NA';
	}
	


	var mydate = new Date(parseInt(txtYear.value), parseInt(txtMonth.value) - 1, parseInt(txtDay.value));
	var inputDate = new Date(mydate.toISOString());

	var objMember = {};
	objMember.psid = psid;
	objMember.Name = txtFullName.value;
	objMember.Birthday = inputDate;
	objMember.Position = cboPosition.options[cboPosition.selectedIndex].text;

	objMember.Provincial = txtProvincial.value;
	objMember.Districts = txtDistricts.value;
	objMember.Wards = txtWards.value;
	objMember.Branch = txtBranch.value;

	//objMember.Branch = txtBranch.value;
	objMember.Phone = txtPhone.value;
	objMember.Email = txtEmail.value;
	objMember.LevelName = cboLevel.options[cboLevel.selectedIndex].text;
	objMember.Level = cboLevel.value;
	objMember.Layer = cboPosition.value;
	//objMember.DataImg = dataImg;
	//objMember.ImgName = txtAvatar.files[0].name;
	//objProduct.Status="Active";
	var form = new FormData();
	form.append('psid', objMember.psid);
	form.append('Name', objMember.Name);
	form.append('Birthday', objMember.Birthday);

	form.append('Position', objMember.Position);
	form.append('LevelName', objMember.LevelName);
	form.append('Level', objMember.Level);
	form.append('Layer', objMember.Layer);
	form.append('Provincial', objMember.Provincial);
	form.append('IdProvincial', cboProvincial.value);
	form.append('IdDistricts', txtDistricts.value);
	form.append('Districts', objMember.Districts);
	form.append('Wards', objMember.Wards);
	form.append('IdWards', txtWards.value);
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
		url: '/registerspostbacktemp.bot',
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
