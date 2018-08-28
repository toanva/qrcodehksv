// JavaScript Document
var table = document.createElement("table");
var objProduct;
var objProductOld;
function numberWithCommas(x) {
  x=String(x).toString();
  var afterPoint = '';
  if(x.indexOf('.') > 0)
     afterPoint = x.substring(x.indexOf('.'),x.length);
  x = Math.floor(x);
  x=x.toString();
  var lastThree = x.substring(x.length-3);
  var otherNumbers = x.substring(0,x.length-3);
  if(otherNumbers != '')
      lastThree = ',' + lastThree;
  return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;
};
function drawTable() {

	var arrLabel = ['Tên', 'Số lượng',  'Giá', 'Diện tích',  'Người đăng','Mô tả']	
	table.setAttribute("width", "100%");
	table.setAttribute("class", "demo-table");
	//var row = table.insertRow(0);
	var header = table.createTHead();
	var row = table.insertRow(0);
	for (j = 0; j < arrLabel.length; j++) {
		var cell1 = row.insertCell(j);
		cell1.setAttribute("align", "center");
		cell1.textContent = arrLabel[j];
		if(j==arrLabel.length-2)
			cell1.style.width ='20%';
		if(j==arrLabel.length-1)
			cell1.style.width ='20%';
	};
	for (var i = 1; i <= 10; i++) {		

		var row = table.insertRow(i);
		
		var cell = row.insertCell(0);
		cell.setAttribute("align", "left");
		//cell1.textContent = obj.Provincial;

		
		var cell1 = row.insertCell(1);
		cell1.setAttribute("align", "left");
		
		//cell1.textContent = obj.Provincial;

		var cell2 = row.insertCell(2);
		cell2.setAttribute("align", "left");
		//cell2.textContent = obj.Districts;

		var cell3 = row.insertCell(3);
		cell3.setAttribute("align", "left");
		//cell3.textContent = obj.Wards;

		var cell4 = row.insertCell(4);
		cell4.setAttribute("align", "left");
		//cell4.textContent = obj.Position;

		var cell5 = row.insertCell(5);
		cell5.setAttribute("align", "left");
		//cell5.textContent = obj.Name;

	//	var cell6 = row.insertCell(6);
		//cell6.setAttribute("align", "left");
		//cell6.setAttribute("with", "30%");
		//var date = new Date(obj.Birthday);
		//cell6.textContent = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

//		var cell7 = row.insertCell(7);
//		cell7.setAttribute("align", "center");
//		//cell7.textContent = obj.Phone;
//
//
//		var cell8 = row.insertCell(8);
//		cell8.setAttribute("align", "left");
		//cell8.textContent = obj.Email;
		
//		var cell9 = row.insertCell(9);
//		cell9.setAttribute("align", "left");
//		
//		var cell10 = row.insertCell(10);
//		cell10.setAttribute("align", "left");
//		
//		var cell11 = row.insertCell(11);
//		cell11.setAttribute("align", "left");

	}
	document.getElementById("dvGrdProduct").appendChild(table);
	getTopProduct();
};
drawTable();
//////////////////////
function getTopProduct() {
	//var objMember;
	$.ajax({
		dataType: "json",
		url: "/getTopProduct?Top=10",
		data: objProduct,
		success: function (data) {
			objProduct = data;	
			setTableValue(objProduct);
		}
	});
};
function setTableValue(dataProduct)
{
	for(var i=0;i<dataProduct.length;i++)
	{
		row =table.rows[i+1];
		row.cells[0].textContent=dataProduct[i].Name;
		row.cells[1].textContent=numberWithCommas(dataProduct[i].Quantity)+' '+dataProduct[i].QuantityUnit;		
		row.cells[2].textContent=numberWithCommas(dataProduct[i].Price)+' '+dataProduct[i].PriceUnit;
		row.cells[3].textContent=numberWithCommas(dataProduct[i].Acreage)+' '+dataProduct[i].AcreageUnit;	
		row.cells[4].textContent=dataProduct[i].PostName +", ĐC: "+dataProduct[i].Ward+", "+dataProduct[i].District +", " +dataProduct[i].Provincial;
		row.cells[5].textContent=dataProduct[i].Description;
	}
	setTimeout(getTopProduct,6000);
	
}