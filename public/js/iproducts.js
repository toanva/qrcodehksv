  var reader;
  var progress = document.querySelector('.percent');
  var dataImg=null;
  var imgName=null;
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
///////////////////////Image Load and resize
  function abortRead() {
    reader.abort();
  }
 //// Resize Image
  function resizeInCanvas(img){
	  /////////  3-3 manipulate image
	  var perferedWidth = 500;
	  var ratio = perferedWidth / img.width;
	  var canvas = $("<canvas>")[0];
	  canvas.width = img.width * ratio;
	  canvas.height = img.height * ratio;
	  var ctx = canvas.getContext("2d");
	  ctx.drawImage(img, 0,0,canvas.width, canvas.height);
	  //////////4. export as dataUrl
	  return canvas.toDataURL();
	};	
  function errorHandler(evt) {
    switch(evt.target.error.code) {
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
   ///read image data
  function handleFileSelect(evt) {
    // Reset progress indicator on new file selection.
    progress.style.width = '0%';
    progress.textContent = '0%';

    reader = new FileReader();
    reader.onerror = errorHandler;
    reader.onprogress = updateProgress;
    reader.onabort = function(e) {
      alert('File read cancelled');
    };
    reader.onloadstart = function(e) {
      document.getElementById('progress_bar').className = 'loading';
    };
    reader.onload = function(e) {
      // Ensure that the progress bar displays 100% at the end.
      progress.style.width = '100%';
      progress.textContent = '100%';
	  var img = new Image();
	  img.onload = function() {         
		dataImg=resizeInCanvas(img).replace(/^data:image\/[a-z]+;base64,/, "");
		//dataImg= dataImg.replace(/^data:image\/[a-z]+;base64,/, "");
		  //onRedSS();
	  };
	  //dataImg=e.target.result.replace(/^data:image\/[a-z]+;base64,/, "");;
	  img.src=e.target.result;
      setTimeout("document.getElementById('progress_bar').className='';", 2000);
	  onRedSS();
    }

    // Read in the image file as a binary string.
    reader.readAsDataURL(evt.target.files[0]);
  }
  document.getElementById('txtImage').addEventListener('change', handleFileSelect, false);
  function onRedSS()	{
		//alert(dataImg);
	};
///////////////////////End Image Load and resize
////// Post product
function SaveProduct(){
	var btnSend=document.getElementById("btnSend");
	var psid;
	if(document.getElementById("psid").value!="" && document.getElementById("psid").value!=undefined)
	{
		psid = document.getElementById("psid").value;
	}else
	{
		psid= getParamValue("psid");
	}
	var cboType=document.getElementById("cboType");
	var txtName=document.getElementById("txtName");
	var txtQuantity=document.getElementById("txtQuantity");
	var txtToMonth=document.getElementById("txtToMonth");
	var txtFromMonth=document.getElementById("txtFromMonth");
	var cboQuantityUnit=document.getElementById("cboQuantityUnit");
	var txtPrice=document.getElementById("txtPrice");
	var cboPriceUnit=document.getElementById("cboPriceUnit");
	var txtAcreage=document.getElementById("txtAcreage");
    var cboAcreageUnit=document.getElementById("cboAcreageUnit");
	var cboIsCooperative = document.getElementById("cboIsCooperative");
    var txtImage= document.getElementById('txtImage');
	var txtDescription= document.getElementById('txtDescription');
	btnSend.disabled=true;
	if(txtName.value==undefined || txtName.value=="")
	{
		alert("Bạn phải nhập tên");
		btnSend.disabled=false;
		btnSend.style.color = '#FFFFFF';
		txtName.focus();
		return;
	};
	if(txtQuantity.value==undefined || txtQuantity.value=="")
	{
		alert("Bạn phải nhập số lượng");
		btnSend.disabled=false;
		btnSend.style.color = '#FFFFFF';
		txtQuantity.focus();
		return;
	};
	if(txtPrice.value==undefined || txtPrice.value=="")
	{
		alert("Bạn phải nhập giá");
		btnSend.disabled=false;
		btnSend.style.color = '#FFFFFF';
		txtPrice.focus();
		return;
	};
	if(txtAcreage.value==undefined || txtAcreage.value=="")
	{
		alert("Bạn phải nhập diện tích");
		btnSend.disabled=false;
		btnSend.style.color = '#FFFFFF';
		txtAcreage.focus();
		return;
	};
//	if(txtImage.files[0]==undefined || txtImage.files[0]=="")
//	{
//		alert("Bạn phải chọn ảnh sản phẩm");
//		btnSend.disabled=false;
//		btnSend.style.color = '#FFFFFF';
//		txtImage.focus();
//		return;
//	};
	
	if(txtImage.files[0]==undefined || txtImage.files[0]=="")
	{
		 imgName=null;
		 dataImg=null;
		 isImage=1;
	}else
	{
		 var nameTemp=txtImage.files[0].name;
		 nameTemp =removeChar(nameTemp);
		 arr=nameTemp.split('.');
		 /////Random number name 1-10;
		 imgName=Math.floor((Math.random() * 10) + 1)+"."+arr[arr.length-1];
		 isImage=0;
		 //isImage.length
	}
    
	var objProduct = {};
	objProduct.psid = psid;
	objProduct.Type = cboType.value;
	objProduct.Name = txtName.value;
	objProduct.Quantity = txtQuantity.value;
	objProduct.QuantityUnit = cboQuantityUnit.value;
	objProduct.Price = txtPrice.value;
	objProduct.PriceUnit = cboPriceUnit.value;
	objProduct.Acreage = txtAcreage.value;
	objProduct.AcreageUnit = cboAcreageUnit.value;
	objProduct.IsCooperative = cboIsCooperative.value;
	objProduct.ImgName = imgName;
	objProduct.DataImg = dataImg;
	objProduct.ToMonth=txtToMonth.value;
	objProduct.FromMonth=txtFromMonth.value;
	objProduct.Description=txtDescription.value;
	objProduct.isImage=isImage;
	//objProduct.Status="Active";
	var form = new FormData();
	////psid Pacebook string
	form.append('psid', objProduct.psid);
	//// Type Product string 
	form.append('Type', objProduct.Type);
	//// Name Product string
    form.append('Name', objProduct.Name);
	//// Quantity Product string
	form.append('Quantity', objProduct.Quantity);
	//// Unit Quantity Product string
	form.append('QuantityUnit', objProduct.QuantityUnit);
	//// Price Product string
	form.append('Price', objProduct.Price);
	//// Unit Price Product string
	form.append('PriceUnit', objProduct.PriceUnit);
	//// Unit Price Product string
	form.append('Acreage', objProduct.Acreage);
	//// Unit Price Product string
	form.append('AcreageUnit', objProduct.AcreageUnit);
	//// Unit Price Product String
	form.append('IsCooperative', objProduct.IsCooperative);
	//// Unit Price Product string
	form.append('ImgName', objProduct.ImgName);
	/// Base64 Data image Product dataImg=resizeInCanvas(img).replace(/^data:image\/[a-z]+;base64,/, "");
    form.append('DataImg', objProduct.DataImg); //no need to stringify!
	/// string
	form.append('ToMonth', objProduct.ToMonth);
	///string
	form.append('FromMonth', objProduct.FromMonth);
	//string string
	form.append('Description', objProduct.Description);
	// string number,IsImage= 1 no post image, sImage= 0 post image
	form.append('IsImage', objProduct.isImage);
	// number
	//form.append('Lat', objProduct.Lat);
	// number
	//form.append('Lng', objProduct.Lng);
	$.ajax({
		type: 'POST',
		data: form,
		contentType: false,
        processData: false,	
		url: '/iproductspostback.bot',				
		success: function(data) 
		{
			//alert("Thêm mới sản phẩm thành công!")
			console.log('success');
			console.log(data);
			btnSend.disabled=false;
			isSs=true;
			//window.extAsyncInit = () => {
				MessengerExtensions.requestCloseBrowser(function success() {
						console.log("Webview closing");
					}, function error(err) {
					   console.log("getElementById Err:"+err);
					});	
			//};
			//Close();
			//console.log(data);
		},
	    error: function(err) {
		 	btnSend.disabled=false;
			btnSend.style.color = '#FFFFFF';
			alert("Lỗi :",err);
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