var MyDateField = function(config){
   jsGrid.Field.call(this, config);
};
MyDateField.prototype = new jsGrid.Field({
	sorter: function(date1, date2) {
		return new Date(date1) - new Date(date2);
	},

	itemTemplate: function(value) {
		value=new Date(value);
		var dd=value.getDate();
		var mm = value.getMonth()+1; //January is 0!
		var yyyy = value.getFullYear();
		if(dd<10){
			dd='0'+dd;
		} 
		if(mm<10){
			mm='0'+mm;
		} 
		return dd+'/'+mm+'/'+yyyy;
	},

	insertTemplate: function(value) {
		return this._insertPicker = $("<input>").datepicker({ defaultDate: new Date() });
	},

	editTemplate: function(value) {
		return this._editPicker = $("<input>").datepicker().datepicker("setDate", new Date(value));
	},

	insertValue: function() {
		return this._insertPicker.datepicker("getDate").toISOString();
	},

	editValue: function() {
		return this._editPicker.datepicker("getDate").toISOString();
	}
});

jsGrid.fields.myDateField = MyDateField;

//////////////
function SaveAi(){
	var cboBlockStatus = document.getElementById("cboBlockStatus");
    var txtQuestion=document.getElementById("txtQuestion");
    var txtAnswer= document.getElementById("txtAnswer");
	if(txtQuestion.value==undefined || txtQuestion.value=="")
	{
		alert("Bạn phải nhập câu hỏi");
		txtQuestion.focus();
		return;
	}
	if(txtAnswer.value==undefined || txtAnswer.value=="")
	{
		alert("Bạn phải nhập câu trả lời");
		txtAnswer.focus();
		return;
	}
   // var cboWards= document.getElementById("cboWards");
	
	var objAi = {};
	objAi.BlockStatus = cboBlockStatus.value;
	objAi.Question = txtQuestion.value;
	objAi.Answer = txtAnswer.value;
	objAi.Status="Active";
	
	$.ajax({
		type: 'POST',
		data: JSON.stringify(objAi),
		contentType: 'application/json',
		url: '/insertAiMessage.bot',				
		success: function(data) 
		{
			alert("Thêm mới đối thoại thành công!")
			console.log('success');
			console.log(data);
		},
	    error: function(err) {
		 if(err.responseText=-'Unauthorized')
		  alert("Bạn đã bị time out");
		  window.location.href = 'login.html';
		}
    });
	
};
var selectedItems = [];
var selectItem = function(item) {
	selectedItems.push(item);
};
var unselectItem = function(item) {
	selectedItems = $.grep(selectedItems, function(i) {
		return i !== item;
	});
};
var oldLength=0;
var deleteSelectedItems = function() {
	if(!selectedItems.length || !confirm("Bạn có muốn xóa các hội thoại đã chọn?"))
		return;
	 var dvAiMessage = document.getElementById("dvAiMessage");	
	//deleteClientsFromDb(selectedItems);
	//console.(selectedItems._id);
	//var $grid = $("#dvAiMessage");
	//$grid.jsGrid("option", "pageIndex", 1);
	//$grid.jsGrid("loadData");
	//var 
	for(i=0;i<selectedItems.length ;i++)
	{
		oldLength=selectedItems.length;
		var objAi = {};
		objAi.Id=selectedItems[i]._id;
		objAi.Question=selectedItems[i].Question;
		//alert(objAi.Id);
		$.ajax({
		type: 'POST',
		data: JSON.stringify(objAi),
		contentType: 'application/json',
		url: '/deleteAiMessage.bot',				
		success: function(data) 
				{
					
					//console.log('success');
					//console.log(data);
					if(i==oldLength)
					{
					    SearchAiMessage();
						oldLength=0;
					    selectedItems = [];
						alert("Xóa đối thoại thành công!")
					}
				},
		  	error: function(err) {
			 if(err.responseText=-'Unauthorized')
			  alert("Bạn đã bị time out");
			  window.location.href = 'login.html';
			}
	   });
   };
  
};
function SearchAiMessage(){	
var dvAiMessage = document.getElementById("dvAiMessage");	
//	var query ="name="+name+"&provincial="+provincial+"&districts="+districts+"&wards="+wards+"&position="+position;
	var query ="Question=";
 	var objMember; 
	$.ajax({
	dataType: "json",
	url: "/getAiMessage?"+query,
	data: objMember,
	success: function(data) {
		objMember = data;
		$("#dvAiMessage").jsGrid({
		height: "390",
		width: "100%",		
		sorting: true,
		paging: true,
		confirmDeleting: false,
		autoload: true,
		pageSize: 15,
		pageButtonCount: 5,
		deleteConfirm: "Bạn muốn xóa đối thoại?",
		data: objMember, 
		fields: [
			{
				headerTemplate: function() {
					return $("<button>").attr("type", "button").text("Delete")
							.on("click", function () {
								deleteSelectedItems();
							});
				},
				itemTemplate: function(_, item) {
					return $("<input>").attr("type", "checkbox")
							.prop("checked", $.inArray(item, selectedItems) > -1)
							.on("change", function () {
								$(this).is(":checked") ? selectItem(item) : unselectItem(item);
							});
				},
				align: "center",
				width: 50
			},
			{ name: "Question", type: "text", title: "Câu hỏi" ,width:200 },
			{ name: "Answer", type: "text", title: "Trả lời" , width:400},			
			{ name: "BlockStatus", type: "text", title: "Chủ đề" ,width: 65 },	
			{ name: "Status", type: "text", title: "Trạng thái" ,width: 75 },	
			{ name: "InsertDay", type: "myDateField", title: "Ngày tạo" ,width: 80 }
			//{ name: "_id", type: "text", title: "ID" ,width: 5 },
			]
		});
	  },
	  error: function(err) {
		 if(err.responseText=-'Unauthorized')
		  alert("Bạn đã bị time out");
		  window.location.href = 'login.html';
		}
	});
};
SearchAiMessage();