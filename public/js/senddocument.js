//import { image } from "./C:/Users/Toanva/AppData/Local/Microsoft/TypeScript/2.6/node_modules/@types/d3";

var dataImg = null;
var imgName = null;

//var txtDocument = document.getElementById('txtDocument');
var txtLinkDocument = document.getElementById('txtLinkDocument');
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
    if (txtLinkDocument.value == undefined || txtLinkDocument.value == "") {
        alert("Bạn hãy điền link bài viết muốn gửi");
        btnSend.disabled = false;
        btnSend.style.color = '#FFFFFF';
        txtLinkDocument.focus();
        return;
    };
 //   if (txtDocument.files[0] == undefined || txtDocument.files[0] == "")
	//{
	//	alert("Bạn hãy chọn bài viết muốn gửi");
	//	btnSend.disabled=false;
	//	btnSend.style.color = '#FFFFFF';
 //       txtDocument.focus();
	//	return;
 //   };

    //var nameTemp = txtImage.files[0].name;
    //nameTemp = removeChar(nameTemp);
    //arr = nameTemp.split('.');
    ///////Random number name 1-10;
    //imgName = Math.floor((Math.random() * 10) + 1) + "." + arr[arr.length - 1];

	//var mydate = txtBirthday.valueAsDate;
	//var inputDate = new Date(mydate.toISOString());

	var objMember = {};
	objMember.psid = psid;
    //objMember.Document = imgName;
    objMember.LinkDocument = txtLinkDocument.value;
	var form = new FormData();
	form.append('psid', objMember.psid);
    //form.append('Document', objMember.Document);
    form.append('LinkDocument', objMember.LinkDocument);
	$.ajax({
		type: 'POST',
		data: form,
		contentType: false,
		processData: false,
		url: '/senddocument',
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