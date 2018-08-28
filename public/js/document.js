
var dataImg = null;
var imgName = null;

var txtFullName = document.getElementById("txtFullName");
var txtDay = document.getElementById("txtBirthday");
var txtPhone = document.getElementById('txtPhone');
var txtCMT = document.getElementById('txtCMT');
var txtAddress = document.getElementById('txtAddress'); 
//var txtDocument = document.getElementById('txtDocument');
var btnSend = document.getElementById('btnSend');

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
    if (txtCMT.value == undefined || txtCMT.value == "") {
		alert("Bạn phải nhập CMT");
		btnSend.disabled = false;
		btnSend.style.color = '#FFFFFF';
        txtCMT.focus();
		return;
    };

	var mydate = txtBirthday.valueAsDate;
	var inputDate = new Date(mydate.toISOString());

	var objMember = {};
	objMember.psid = psid;
	objMember.Name = txtFullName.value;
	objMember.Birthday =  mydate.getDate()+'/'+(mydate.getMonth()+1)+'/'+mydate.getFullYear();
	objMember.Phone = txtPhone.value;
    objMember.CMT = txtCMT.value;
    objMember.Address = txtAddress.value;
    //objMember.Document = imgName;
	var form = new FormData();
	form.append('psid', objMember.psid);
	form.append('Name', objMember.Name);
    form.append('Birthday', objMember.Birthday);
    form.append('Address', objMember.Address);
    form.append('CMT', objMember.CMT);
    form.append('Phone', objMember.Phone);

	$.ajax({
		type: 'POST',
		data: form,
		contentType: false,
		processData: false,
		url: '/document',
		success: function (data) {
			btnSend.disabled = false;
			btnSend.style.color = '#FFFFFF';
			//console.log(data);
			//alert("Thêm mới thành công");
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
function removeChar(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    return str;
};