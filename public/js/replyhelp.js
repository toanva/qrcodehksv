var psid = document.getElementById("psid").value;
var txtContent = document.getElementById("txtContent");
var stContent = document.getElementById("stContent");
var txtContent = document.getElementById("txtContent");
var stQuestion = document.getElementById("stQuestion");
var btnSend = document.getElementById('btnSend');



var reader;
var progress = document.querySelector('.percent');
var dataImg;
var nameImg;
function getParamValue(param) {
    var urlParamString = location.search.split(param + "=");
    if (urlParamString.length <= 1) return "";
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

function getData()
{
	document.getElementById("frompsid").value = getParamValue("fpsid");
	document.getElementById("txtQuestion").value = decodeURI(getParamValue("qs")).replace(/([.*+?^=!:${}()|\[\]\/\\])/g," ");
};
getData();
function SaveObject() {
	btnSend.disabled = true;
	btnSend.style.color = '#5d98fb';
	var psid = document.getElementById("psid").value;
	var fromPsid = document.getElementById("frompsid").value;
	
	if (txtContent.value == undefined || txtContent.value == "") {
		alert("Bạn phải điền nội dung cần được hỗ trợ");
		btnSend.disabled = false;
		btnSend.style.color = '#FFFFFF';
		txtContent.focus();
		return;
	};
	
	var objHelp = {};
	objHelp.psid = psid;
	objHelp.FromPsid = fromPsid;
	objHelp.Question = txtQuestion.value;
	objHelp.Content = txtContent.value;

	
	var form = new FormData();
	form.append('psid', objHelp.psid);
	form.append('fromPsid', objHelp.FromPsid);
	form.append('Question', objHelp.Question);
	form.append('Content', objHelp.Content);	
	$.ajax({
		type: 'POST',
		data: form,
		contentType: false,
		processData: false,
		url: '/replyhelppostback.bot',
		success: function (data) {
			//alert("Thêm mới sản phẩm thành công!")
			//console.log('success');
			btnSend.disabled = false;
			btnSend.style.color = '#FFFFFF';
			console.log(data);
			alert("Gửi trả lời thành công");
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
