google.charts.setOnLoadCallback(onInit);
var piechartBlockStatus;
var piechartGeoCode;
var piechartPosition;
var isComplate=true;
function onInit(){

 piechartBlockStatus = new google.visualization.PieChart(document.getElementById('dvBlockStatus'));
 piechartGeoCode = new google.visualization.PieChart(document.getElementById('dvGeoCode'));
 piechartPosition = new google.visualization.PieChart(document.getElementById('dvPosition'));
 lblTotalUser =  document.getElementById('lblTotalUser');
 lblUserOnline =  document.getElementById('lblUserOnline');
 
 getData();
	
};

function getData(){
	if(isComplate)
	{
		isComplate=false;
		
		var objBlockStatus;		
		$.ajax({
		dataType: "json",
		url: "/getMemberByGroup?code=BlockStatus",
		data: objBlockStatus,
		success: function(data) {
				objBlockStatus=	data;
				drawBlockStatus(objBlockStatus);
			 },
		  	error: function(err) {
			 if(err.responseText=-'Unauthorized')
			  alert("Bạn đã bị time out");
			  window.location.href = 'login.html';
			}            
		});
		
		
		var objGeoCode;		
		$.ajax({
		dataType: "json",
		url: "/getMemberByGroup?code=GeoCode",
		data: objGeoCode,
		success: function(data) {
				objGeoCode=	data;
			    drawGeoCode(objGeoCode);
			 },
		  	error: function(err) {
			 if(err.responseText=-'Unauthorized')
			  alert("Bạn đã bị time out");
			  window.location.href = 'login.html';
			}            
		});
		
		var objPosition;		
		$.ajax({
		dataType: "json",
		url: "/getMemberByGroup?code=Position",
		data: objPosition,
		success: function(data) {
				objPosition=data;
			drawPosition(objPosition);
			 },
		  	error: function(err) {
			 if(err.responseText=-'Unauthorized')
			  alert("Bạn đã bị time out");
			  window.location.href = 'login.html';
			}            
		});
		
		var objPosition;		
		$.ajax({
		dataType: "json",
		url: "/getMemberOnline",
		data: objPosition,
		success: function(data) {
			 
			lblUserOnline.innerHTML=data.length;
				//objPosition=data;
			//drawPosition(objPosition);
			 },
		  	error: function(err) {
			 if(err.responseText=-'Unauthorized')
			  alert("Bạn đã bị time out");
			  window.location.href = 'login.html';
			}            
		});
		var objPosition;		
		$.ajax({
		dataType: "json",
		url: "/getMemberConnect",
		data: objPosition,
		success: function(data) {
			 
			lblTotalUser.innerHTML=data.length;
				//objPosition=data;
			//drawPosition(objPosition);
			 },
		  	error: function(err) {
			 if(err.responseText=-'Unauthorized')
			  alert("Bạn đã bị time out");
			  window.location.href = 'login.html';
			}            
		});
		
	}else
	{
	  setTimeout(getData,5000);
	}
};

function drawBlockStatus(objBlockStatus) {
	
 	var dataProduct = new google.visualization.DataTable();
    dataProduct.addColumn('string','Trạng thái');
    dataProduct.addColumn('number','Thành viên');	
	
   //var total=0; 
   var len = objBlockStatus.length;
   for (var i = 0; i < len; ++i) {			
		//var o = new Option(objProvincials[i-1].Name,  objProvincials[i-1]._id);
		var name=objBlockStatus[i].BlockStatus;
		//var geoCode=objBlockStatus[i-1].GeoCode;
		dataProduct.addRow([name,objBlockStatus[i].Total]);
		//total=total+objBlockStatus[j].Total;
  }
	

	
var piechartProduct = {title:'Thành viên phân bổ theo trạng thái',
                       width:450,
                       height:300,
					   is3D: true};	
piechartBlockStatus.draw(dataProduct, piechartProduct);
//google.visualization.events.addListener(piechartBlockStatus, 'select', function() {
//
//	var selectedItem = piechartBlockStatus.getSelection()[0];
//	if (selectedItem && piechartBlockStatus.getSelection().length>0) {
//	 // console.log(data.getValue(selectedItem.row, 0));
//	 // console.log(data.getFormattedValue(selectedItem.row, 0));
//	 // piechart.setSelection(chart.getSelection());
//	  SearcProduct(dataProduct.getFormattedValue(selectedItem.row, 0));
//	}
//
//});
	//oldObjGroupProduct=objGroupProduct;
	
 isComplate=true;	
 setTimeout(getData,5000);	
};
function drawGeoCode(objGeoCode) {
	
 	var dataProduct = new google.visualization.DataTable();
    dataProduct.addColumn('string','Trạng thái');
    dataProduct.addColumn('number','Thành viên');	
	
   //var total=0; 
   var len = objGeoCode.length;
   for (var i = 0; i < len; ++i) {			
		//var o = new Option(objProvincials[i-1].Name,  objProvincials[i-1]._id);
		var name=objGeoCode[i].Provincial;
		//var geoCode=objBlockStatus[i-1].GeoCode;
		dataProduct.addRow([name,objGeoCode[i].Total]);
		//total=total+objBlockStatus[j].Total;
  }
	

	
var piechartProduct = {title:'Thành viên phân bổ theo khu vực',
                       width:450,
                       height:300,
					   is3D: true};	
piechartGeoCode.draw(dataProduct, piechartProduct);
//google.visualization.events.addListener(piechartBlockStatus, 'select', function() {
//
//	var selectedItem = piechartBlockStatus.getSelection()[0];
//	if (selectedItem && piechartBlockStatus.getSelection().length>0) {
//	 // console.log(data.getValue(selectedItem.row, 0));
//	 // console.log(data.getFormattedValue(selectedItem.row, 0));
//	 // piechart.setSelection(chart.getSelection());
//	  SearcProduct(dataProduct.getFormattedValue(selectedItem.row, 0));
//	}
//
//});
	//oldObjGroupProduct=objGroupProduct;
	
isComplate=true;	
setTimeout(getData,5000);
};
function drawPosition(objPosition) {
	
 	var dataProduct = new google.visualization.DataTable();
    dataProduct.addColumn('string','Trạng thái');
    dataProduct.addColumn('number','Thành viên');	
	
   //var total=0; 
   var len = objPosition.length;
   for (var i = 0; i < len; ++i) {			
		//var o = new Option(objProvincials[i-1].Name,  objProvincials[i-1]._id);
		var name=objPosition[i].Position;
		//var geoCode=objBlockStatus[i-1].GeoCode;
		dataProduct.addRow([name,objPosition[i].Total]);
		//total=total+objBlockStatus[j].Total;
  }
	

	
var piechartProduct = {title:'Thành viên phân bổ theo chức vụ',
                       width:447,
                       height:300,
					   is3D: true};	
piechartPosition.draw(dataProduct, piechartProduct);
//google.visualization.events.addListener(piechartBlockStatus, 'select', function() {
//
//	var selectedItem = piechartBlockStatus.getSelection()[0];
//	if (selectedItem && piechartBlockStatus.getSelection().length>0) {
//	 // console.log(data.getValue(selectedItem.row, 0));
//	 // console.log(data.getFormattedValue(selectedItem.row, 0));
//	 // piechart.setSelection(chart.getSelection());
//	  SearcProduct(dataProduct.getFormattedValue(selectedItem.row, 0));
//	}
//
//});
	//oldObjGroupProduct=objGroupProduct;
	
isComplate=true;	
setTimeout(getData,5000);	
};

