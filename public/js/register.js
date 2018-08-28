//var psid = document.getElementById("psid").value;
//Chức danh
var cboPosition = document.getElementById("cboPosition");
/// Chức danh khác
var stPositionNA = document.getElementById("stPositionNA");
var txtPositionNA = document.getElementById("txtPositionNA");

/// Chức danh kiêm nhiệm
var stConcurrently = document.getElementById("stConcurrently");
var lblConcurrently = document.getElementById("lblConcurrently");
var lblConcurrently2 = document.getElementById("lblConcurrently2");
var cboConcurrently = document.getElementById("cboConcurrently");
var txtConcurrently = document.getElementById("txtConcurrently");


var txtFullName = document.getElementById("txtFullName");
var stName = document.getElementById("stName");

var stBirthday = document.getElementById("stBirthday");
var txtDay = document.getElementById("txtBirthday");

/// Cấp cán bộ
var stLevel = document.getElementById("stLevel");
var txtLevel = document.getElementById("txtLevel");
var cboLevel = document.getElementById("cboLevel");

var stProvincial = document.getElementById("stProvincial");
var txtProvincial = document.getElementById("txtProvincial");
var cboProvincial = document.getElementById("cboProvincial");

var stDistricts = document.getElementById("stDistricts");
var stDistrictsNA = document.getElementById("stDistrictsNA");
var txtDistricts = document.getElementById("txtDistricts");
var txtDistrictsNA = document.getElementById("txtDistrictsNA");
var cboDistricts = document.getElementById("cboDistricts");

var stWards = document.getElementById("stWards");
var stWardsNA = document.getElementById("stWardsNA");
var txtWards = document.getElementById("txtWards");
var txtWardsNA = document.getElementById("txtWardsNA");
var cboWards = document.getElementById("cboWards");

var stBranch = document.getElementById("stBranch");
var txtBranch = document.getElementById("txtBranch");
var cboBranch = document.getElementById("cboBranch");
var stBranchNA = document.getElementById("stBranchNA");
var txtBranchNA = document.getElementById("txtBranchNA");

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
function setDataPosition(position,layer){
	while (cboPosition.length > 0) {
				cboPosition.remove(0);
			}
	for (var i = 0, len = position.length; i < len; ++i) {
				var o = new Option(position[i], layer[i]);
				//o.selected=true;
				$("#cboPosition").append(o);

			}
	var value = cboPosition[cboPosition.selectedIndex].text;
	var valueLevel = cboLevel[cboLevel.selectedIndex].value;
	if (value == 'Khác') {

		stPositionNA.style.display = "inline";
		txtPositionNA.value = '';

	} else{
		stPositionNA.style.display = "none";
		txtPositionNA.value = null;

	} 
	//////////////////////////////
	document.getElementById("cboConcurrently").selectedIndex = 0;
	if(value=='Hội viên' && valueLevel == '5'){

		stConcurrently.style.display = "inline";
		txtConcurrently.style.display = "none";
		lblConcurrently2.style.display = "none";
		lblConcurrently.textContent = 'Bạn có phải là Đoàn viên không?';

	}else{			
		stConcurrently.style.display = "inline";
		lblConcurrently.textContent = 'Bạn có phải là Cán bộ Đoàn kiêm nhiệm không?';
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
	var valueLevel = cboLevel[cboLevel.selectedIndex].value;
	if (value == 'Khác' && valueLevel>=3) {

		stDistrictsNA.style.display = "inline";
		txtDistrictsNA.value = '';

	} else{
		stDistrictsNA.style.display = "none";
		txtDistrictsNA.value = null;

	}
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
	var value = cboWards[cboWards.selectedIndex].text;
	var valueLevel = cboLevel[cboLevel.selectedIndex].value;
	if (value == 'Khác' && valueLevel>=4) {

		stWardsNA.style.display = "inline";
		txtWardsNA.value = '';

	} else{
		stWardsNA.style.display = "none";
		txtWardsNA.value = null;

	}
	LoadCboBranch(id);
};

function LoadCboBranch(idWards) {
	var selectElemRef = document.getElementById("cboBranch");
	var objBranch;
	$.ajax({
		dataType: "json",
		url: "/getBranch?idWards=" + idWards,
		data: objBranch,
		success: function (data) {
			objBranch = data;
			while (selectElemRef.length > 0) {
				selectElemRef.remove(0);
			}
			for (var i = 0, len = objBranch.length; i < len; ++i) {
				var o = new Option(objBranch[i].Name, objBranch[i]._id);
				//o.selected=true;
				$("#cboBranch").append(o);

			}
			var o = new Option("Khác", "NA");
			$("#cboBranch").append(o);
			if (objBranch.length > 1) {
				document.getElementById("cboBranch").selectedIndex = 1;
				document.getElementById("txtBranch").value = document.getElementById("cboBranch")[1].text;
				stBranchNA.style.display = "none";
				//alert(document.getElementById("cboWards")[0].text);
			}else
			{
				onCboBranch(cboBranch);
			}
		}
	});
};

function onCboBranch(event) {
	var value = event.value;
    var valueLevel = cboLevel[cboLevel.selectedIndex].value;
	if ((value == "NA" || value == '9999') && valueLevel>=5) {
		stBranchNA.style.display = "inline";
		document.getElementById("txtBranch").value = "NA";
	} else {
		stBranchNA.style.display = "none";
	}
	//alert(event);
};

LoadCboProvincials();
function cboPositionChange(event) {
	var value = event[event.selectedIndex].text;
	document.getElementById("cboConcurrently").selectedIndex = 0;
	if (value == 'Khác') {
		
		stPositionNA.style.display = "inline";
		txtPositionNA.value = '';
		
	} else{
		stPositionNA.style.display = "none";
		txtPositionNA.value = null;

	}
	
	var valueLevel = cboLevel[cboLevel.selectedIndex].value;
	//if (valueLevel == '5')
	//{
	if(value=='Hội viên' && valueLevel == '5'){

		stConcurrently.style.display = "inline";
		txtConcurrently.style.display = "none";
		lblConcurrently2.style.display = "none";
		lblConcurrently.textContent = 'Bạn có phải là Đoàn viên không?';

	}else{			
		stConcurrently.style.display = "inline";
		lblConcurrently.textContent = 'Bạn có phải là Cán bộ Đoàn kiêm nhiệm không?';
	}
	//}else{
	//	stConcurrently.style.display = "none";
	//	txtConcurrently.style.display = "none";
	//	lblConcurrently.textContent = '...';
	//}
	
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
function setNaField(value){
	var valueWards = cboWards[cboWards.selectedIndex].text;
	var valueDistricts = cboDistricts[cboDistricts.selectedIndex].text;
	var valueBranch = cboBranch[cboBranch.selectedIndex].text;
	if (value == '1') {
		
		stDistrictsNA.style.display = "none";
		txtDistrictsNA.value = null;
		stWardsNA.style.display = "none";
		txtWardsNA.value = '';
		stBranchNA.style.display = "none";
		txtBranchNA.value = '';

	} else if (value == '2') {
		
		stDistrictsNA.style.display = "none";
		txtDistrictsNA.value = null;
		stWardsNA.style.display = "none";
		txtWardsNA.value = '';
		stBranchNA.style.display = "none";
		txtBranchNA.value = '';	

	}else if (value == '3') {
		
		if (valueDistricts == 'Khác') {

			stDistrictsNA.style.display = "inline";
			txtDistrictsNA.value = '';

		} else{
			stDistrictsNA.style.display = "none";
			txtDistrictsNA.value = null;
		}
		stWardsNA.style.display = "none";
		txtWardsNA.value = '';
		stBranchNA.style.display = "none";
		txtBranchNA.value = '';
		
	} else if (value == '4') {
		
		if (valueDistricts == 'Khác') {

			stDistrictsNA.style.display = "inline";
			txtDistrictsNA.value = '';

		} else{
			stDistrictsNA.style.display = "none";
			txtDistrictsNA.value = null;

		};
		if (valueWards == 'Khác') {

			stWardsNA.style.display = "inline";
			txtWardsNA.value = '';

		} else{
			stWardsNA.style.display = "none";
			txtWardsNA.value = null;

		};
		stBranchNA.style.display = "none";
		txtBranchNA.value = '';
		
	} else if (value >= '5'){
		
		if (valueDistricts == 'Khác') {

			stDistrictsNA.style.display = "inline";
			txtDistrictsNA.value = '';

		} else{
			stDistrictsNA.style.display = "none";
			txtDistrictsNA.value = null;

		};
		if (valueWards == 'Khác') {

			stWardsNA.style.display = "inline";
			txtWardsNA.value = '';

		} else{
			stWardsNA.style.display = "none";
			txtWardsNA.value = '';

		};	
		if (valueBranch == 'Khác') {

			stBranchNA.style.display = "inline";
			txtBranchNA.value = '';

		} else{
			stBranchNA.style.display = "none";
			txtBranchNA.value = '';

		};
	}
};
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
	/// xử lý chức danh kiêm nhiệm
	var valuePosition = cboPosition[cboPosition.selectedIndex].text;
	//if (value == '5')
	//{
		if(valuePosition=='Hội viên' && value == '5'){
			
			stConcurrently.style.display = "inline";
			txtConcurrently.style.display = "none";
			lblConcurrently2.style.display = "none";
			lblConcurrently.textContent = 'Bạn có phải là Đoàn viên không';
			
		}else if(valuePosition=='Khác'){
			stConcurrently.style.display = "none";
			txtConcurrently.style.display = "none";
			lblConcurrently2.style.display = "none";
			
		}else{			
			stConcurrently.style.display = "inline";
			lblConcurrently.textContent = 'Bạn có phải là Cán bộ Đoàn kiêm nhiệm không?';
		}
	//}else{
	//	stConcurrently.style.display = "none";
	//	txtConcurrently.style.display = "none";
	//	lblConcurrently.textContent = '...';
	//}
	setNaField(value);
	//document.getElementById("txtWards").value=event[event.selectedIndex].text;
	//alert(event);
};
//// Hàm xử lý chức danh kiêm nhiệm
function oncboConcurrentlyChange(event){
	var value = event.value;
	var valuePosition = cboPosition[cboPosition.selectedIndex].text;
	var valueLevel = cboLevel[cboLevel.selectedIndex].value;
	if(value=='Có' && valuePosition!='Hội viên'){
		
		txtConcurrently.style.display = "inline";
		lblConcurrently2.style.display = "inline";
		lblConcurrently.value="Là cán bộ Đoàn kiêm nhiệm";
		
	}else if(value=='Không'){
		
		txtConcurrently.style.display = "none";
		lblConcurrently2.style.display = "none";
		lblConcurrently.value="";
	}else if(valuePosition=='Hội viên'&& valueLevel=='5'){
		
		txtConcurrently.style.display = "none";
		lblConcurrently2.style.display = "none";
		lblConcurrently.value="Là cán bộ Đoàn viên";
	}
	
}
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
//	if (cboLevel.value == '5') {
	if(cboConcurrently.selectedIndex==0)
	{
		alert("Bạn phải lựa chọn có kiêm nhiệm hay không");
		btnSend.disabled = false;
		btnSend.style.color = '#FFFFFF';
		cboConcurrently.focus();
		return;
	}
//	};
//	if (txtAvatar.files[0] == undefined || txtAvatar.files[0] == "") {
//		alert("Bạn phải chọn ảnh đại diện");
//		btnSend.disabled = false;
//		btnSend.style.color = '#FFFFFF';
//		txtAvatar.focus();
//		return;
//	};
	if ((txtBranch.value == "NA" || txtBranch.value == "9999") && txtBranchNA.value == "NA") {
		alert("Bạn phải nhập tên chi hội khác");
		btnSend.disabled = false;
		btnSend.style.color = '#FFFFFF';
		txtBranchNA.focus();
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
		if(cboDistricts[cboDistricts.selectedIndex].text=="Khác"){
			txtDistricts.value=txtDistrictsNA.value;
		}
		txtWards.value = 'NA';
		txtBranch.value = 'NA';
		
	} else if (cboLevel.value == '4') {
		if(cboDistricts[cboDistricts.selectedIndex].text=="Khác"){
			txtDistricts.value=txtDistrictsNA.value;
		}
		if(cboWards[cboWards.selectedIndex].text=="Khác"){
			txtWards.value=txtWardsNA.value;
		}
		txtBranch.value = 'NA';
		
	}else if (cboLevel.value == '5') {
		if(cboDistricts[cboDistricts.selectedIndex].text=="Khác"){
			txtDistricts.value=txtDistrictsNA.value;
		}
		if(cboWards[cboWards.selectedIndex].text=="Khác"){
			txtWards.value=txtWardsNA.value;
		}
		if(cboBranch[cboBranch.selectedIndex].text=="Khác"){
			txtBranch.value=txtBranchNA.value;
		}
		
	}
	


	var mydate = txtBirthday.valueAsDate;
	var inputDate = new Date(mydate.toISOString());

	var objMember = {};
	objMember.psid = psid;
	objMember.Name = txtFullName.value;
	objMember.Birthday =  mydate.getDate()+'/'+(mydate.getMonth()+1)+'/'+mydate.getFullYear();
	//objMember.Birthday = inputDate;
	//objMember.Birthday =  txtDay.value+'/'+txtMonth.value+'/'+txtYear.value;;
	if(cboPosition.options[cboPosition.selectedIndex].text=='Khác')
	{
		objMember.Position=txtPositionNA.value;
		
	}else
	{
		objMember.Position = cboPosition.options[cboPosition.selectedIndex].text;
	}
	if(lblConcurrently.value!=undefined)
		objMember.IsConcurrently = lblConcurrently.value;
	else
		objMember.IsConcurrently ='';
	objMember.Concurrently = txtConcurrently.value;
	
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
		url: '/registerspostback.bot',
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
