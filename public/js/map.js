function initMap(){
	    /// Địa điểm trung tâm
		var ldn = {lat: 16.6992117, lng: 105.0611555};
	    /// Tạo bản đồ
        var map = new google.maps.Map(document.getElementById('dvMap'), {
          zoom: 5.7,
          center: ldn
        });        
		
	    //////Lấy danh sách Huyện và thành phố trực thuộc
	    var objDistricts;   
		$.ajax({
		dataType: "json",
		url: "/getDistrict?idProvincial=ALL",
		data: objDistricts,
		success: function(data) {
			objDistricts = data;
		    var markers = objDistricts.map(function(obj, i) {
				return new google.maps.Marker({
				position: {lat: obj.Lat, lng: obj.Lng},
				label: obj.Name
				});
			});
			 // Add a marker clusterer to manage the markers.
			var markerCluster = new MarkerClusterer(map, markers,
					{imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
			 }            
		});
};



google.charts.setOnLoadCallback(onInit);
var isComplate=true;
var oldObjGroupProduct={};
var chart;
var piechart;
var tableProduct;
function checkNewData(oldData,newData){   
	var isNew=false;	
	if(oldData.length!=newData.length)
	{
		isNew=true;
		oldData=newData;
	}else
	{
		
		for(var j=0;j<newData.length;j++)
			{
				if(oldData[j].GeoCodeProvincial !=newData[j].GeoCodeProvincial || oldData[j].Total !=newData[j].Total )
				{
					isNew=true;
					oldData=newData;
				}
			}
	}
	return isNew;
}
function onInit(){
 chart = new google.visualization.GeoChart(document.getElementById('dvMap'));	
 piechart = new google.visualization.PieChart(document.getElementById('dvPie'));
 tableProduct = new google.visualization.Table(document.getElementById('dvGrdProduct'));
 getGeoProvincial();
	
}
function geoChartClick(chart,data){
   
	
	var selectedItem = chart.getSelection()[0];
    if (selectedItem && selectedItem.length>0) {
	  console.log(data.getValue(selectedItem.row, 0));
      //var country = data.getValue(selectedItem.row, 0);
      //if (country = 'France') { alert ('ciao') };
    }
		
	
}

function getGeoProvincial(){
	if(isComplate)
	{
		isComplate=false;
		var objProvincials; 
		var objGroupProduct;
		$.ajax({
		dataType: "json",
		url: "/getProvincial",
		data: objProvincials,
		success: function(data) {
				objProvincials=data;
				$.ajax({
				dataType: "json",
				url: "/getGroupProduct",
				data: objGroupProduct,
				success: function(data2) {
					  objGroupProduct=data2;
					  drawRegionsMap(objProvincials,objGroupProduct);
					 }            
				});
			 // 
			 },
		  	error: function(err) {
			 if(err.responseText=-'Unauthorized')
			  alert("Bạn đã bị time out");
			  window.location.href = 'login.html';
			}            
		});
	}else
	{
	  setTimeout(getGeoProvincial,5000);
	}
};

function drawRegionsMap(objProvincials,objGroupProduct) {
	
    var data = new google.visualization.DataTable();
    data.addColumn('string','Country');
    data.addColumn('number','SL');
	var lengthGP=objGroupProduct.length;
	var max=0;	
	var dataProduct = new google.visualization.DataTable();
    dataProduct.addColumn('string','Tỉnh');
    dataProduct.addColumn('number','SL Đơn hàng');	
//	for(var j=0;j<lengthGP;j++)
//		{
//		    dataProduct.addRow([objGroupProduct[j].GeoCodeProvincial,objGroupProduct[j].Total]);
//			
//		}
	
   var total=0; 	  
   for (var i = 1, len = objProvincials.length+1; i < len; ++i) {			
		//var o = new Option(objProvincials[i-1].Name,  objProvincials[i-1]._id);
		var name=objProvincials[i-1].Name;
		var geoCode=objProvincials[i-1].GeoCode;
		if(max < lengthGP)
		{
			var isAdd=false;
			for(var j=0;j<lengthGP;j++)
			{
				if(geoCode==objGroupProduct[j].GeoCodeProvincial)
				{
					 data.addRow([{f:name, v:geoCode},objGroupProduct[j].Total]);
					 dataProduct.addRow([name,objGroupProduct[j].Total]);
					 total=total+objGroupProduct[j].Total;
					 max=max+1;
					 isAdd=true;
				}
			}
			if(!isAdd)
			{
				data.addRow([{f:name, v:geoCode},0]);
			}

		}else
		{
			data.addRow([{f:name, v:geoCode},0]);
		}
  }
	
 var options = {region: 'VN',
			   displayMode: 'regions',
			   resolution: 'provinces',
			   colorAxis: {colors: ['#00ff80',	'#00bfff' , '#0000ff','#ff0040']},
			   height: 347 ,
			   width: 556

			  };
	
var piechartProduct = {title:'Số lượng chào bán theo tỉnh / TP : '+total,
                       width:447,
                       height:347,
					   is3D: true};
if(checkNewData(oldObjGroupProduct,objGroupProduct))
{
	chart.draw(data, options);
	google.visualization.events.addListener(chart, 'select', function() {
										   
		var selectedItem = chart.getSelection()[0];
		if (selectedItem && chart.getSelection().length>0) {
		 // console.log(data.getValue(selectedItem.row, 0));
		 // console.log(data.getFormattedValue(selectedItem.row, 0));
		 // piechart.setSelection(chart.getSelection());
		  SearcProduct(data.getFormattedValue(selectedItem.row, 0));
		}
	
	});
	piechart.draw(dataProduct, piechartProduct);
	google.visualization.events.addListener(piechart, 'select', function() {
										   
		var selectedItem = piechart.getSelection()[0];
		if (selectedItem && piechart.getSelection().length>0) {
		 // console.log(data.getValue(selectedItem.row, 0));
		 // console.log(data.getFormattedValue(selectedItem.row, 0));
		 // piechart.setSelection(chart.getSelection());
		  SearcProduct(dataProduct.getFormattedValue(selectedItem.row, 0));
		}
	
	});
	oldObjGroupProduct=objGroupProduct;
}	
isComplate=true;	
setTimeout(getGeoProvincial,5000);	
};
function SearcProduct(provincialValue){	
	
	//var dvGrdProduct = document.getElementById("dvGrdProduct");
    //var cboProvincial=document.getElementById("cboProvincial");
    var lblP = document.getElementById("lblP");
	lblP.innerHTML="Sản phẩm chào bán của tỉnh / TP  : "+provincialValue;
	var name="";
	//var provincial ="";

	
	var query ="name="+name+"&provincial="+provincialValue;
	var objProduct; 
	 $.ajax({
			url: "/getProduct?"+query,
			dataType: 'json',
			success: function(data){
				drawTableProduct(data);
				
			},
		  	error: function(err) {
			 if(err.responseText=-'Unauthorized')
			  alert("Bạn đã bị time out");
			  window.location.href = 'login.html';
			}
		});
};

function drawTableProduct(objProducts) {
  
	
  var cssClassNames = {
    'headerRow': 'italic-darkblue-font large-font bold-font',
    'tableRow': 'a',
    'oddTableRow': 'beige-background',
    'selectedTableRow': 'orange-background large-font',
    'hoverTableRow': '',
    'headerCell': 'gold-border',
    'tableCell': 'b',
    'rowNumberCell': 'underline-blue-font'};

  var options = {showRowNumber: true, width: '100%', 'allowHtml': true, page: "enable",pageSize: 10 ,'cssClassNames': cssClassNames};
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Tên');
  data.addColumn('string', 'Loại');
  data.addColumn('number', 'SL/Quý');
  data.addColumn('string', 'Đơn vị');
  data.addColumn('number', 'Giá');
  data.addColumn('string', 'Đơn vị');
  data.addColumn('number', 'Diện tích');
  data.addColumn('string', 'Đơn vị');
  data.addColumn('string', 'Có HTX');
  data.addColumn('string', 'Người đăng');
  data.addColumn('string', 'Quận/Xã');
  data.addColumn('string', 'Huyện/Phường');
  data.addColumn('string', 'Ngày đăng');
  for(var i=0;i<objProducts.length;i++)
	{
		var date =new Date(objProducts[i].InsertDate);
		//date =  date.toGMTString(); 
		//date = new Date(date);
		//date = new Date(date.getTime() + (date.getTimezoneOffset() * 60 * 1000));
		//date= objProducts[i].InsertDate;
		var month =parseInt(date.getMonth())+1;
		var mydate = date.getDate()+"/"+month+"/"+date.getFullYear();
		data.addRow([objProducts[i].Name,objProducts[i].Type,parseInt(objProducts[i].Quantity),objProducts[i].QuantityUnit,parseInt(objProducts[i].Price),objProducts[i].PriceUnit,parseInt(objProducts[i].Acreage),objProducts[i].AcreageUnit,objProducts[i].Cooperative,objProducts[i].PostName,objProducts[i].District,objProducts[i].Ward,mydate]);
	}

  //tableProduct = new google.visualization.Table(dvGrdProduct);
  tableProduct.draw(data,options);

  google.visualization.events.addListener(tableProduct, 'select', function() {
    //var row = tableProduct.getSelection()[0].row;
   // alert('You selected ' + data.getValue(row, 0));
  });
}
