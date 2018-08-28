//https://nongsanvn.herokuapp.com/getMember
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

function ConverDate(value) {
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
	};

jsGrid.fields.myDateField = MyDateField;




function LoadCboProvincials()
	{   var  selectElemRef = document.getElementById("cboProvincial");
		var objProvincials;   
		$.ajax({
		dataType: "json",
		url: "/getProvincial",
		data: objProvincials,
		success: function(data) {
			objProvincials = data;
			var html = '';
			//var x = document.getElementById("mySelect");
			//removeOptions($("#cboProvincial"));
			while (selectElemRef.length> 0) {
				selectElemRef.remove(0);
			}
			    var o = new Option("Tất cả", "0");
				//o.selected=true;
				$("#cboProvincial").append(o);
			for (var i = 1, len = objProvincials.length+1; i < len; ++i) {			
				var o = new Option(objProvincials[i-1].Name,  objProvincials[i-1]._id);
				//o.selected=true;
				$("#cboProvincial").append(o);
			}
			if(cboProvincial.length>1)
			{
			  document.getElementById("cboProvincial").selectedIndex=0;			  
			}
			//$('#cboProvincial').append(html);
			//$('#cboProvincial').select
		  },
		  error: function(err) {
			 if(err.responseText=-'Unauthorized')
			  alert("Bạn đã bị time out");
			  window.location.href = 'login.html';
			}
		});
	};
LoadCboProvincials();
function SearcProduct()
{	var dvGrdProduct = document.getElementById("dvGrdProduct");
    var cboProvincial=document.getElementById("cboProvincial");
   
	var name="";
	var provincial ="";
	
	if(document.getElementById("txtName").value!="" && document.getElementById("txtName").value!=undefined)
		name=document.getElementById("txtName").value;
	if( cboProvincial.selectedIndex!=0)
		 provincial=cboProvincial[cboProvincial.selectedIndex].text;	
	
	var query ="name="+name+"&provincial="+provincial;
	var objProduct; 
	$.ajax({
	dataType: "json",
	url: "/getProduct?"+query,
	data: objProduct,
	success: function(data) {
		objProduct = data;
		$("#dvGrdProduct").jsGrid({
		height: "550",
		width: "100%",		
		sorting: true,
		paging: true,
		autoload: true,
		pageSize: 15,
		pageButtonCount: 5,
		deleteConfirm: "Do you really want to delete the client?",
		data: objProduct, 
		fields: [
			{ name: "Name", type: "text", title: "Tên SP" ,width: 150 },
			{ name: "InsertDate", type: "myDateField", title: "Ngày" ,width: 80 },
			{ name: "Quantity", type: "text", title: "SL dự kiến" ,width: 70 },	
			{ name: "Price", type: "text", title: "Giá dự kiến" ,width: 70 },
			{ name: "Acreage", type: "text", title: "Diện tích" ,width: 100 },	
			{ name: "Cooperative", type: "text", title: "HTX" ,width: 50 },
			{ name: "IdPost", type: "text", title: "ID tạo" ,width: 110 },	
			{ name: "Provincial", type: "text", title: "Tỉnh/TP" ,width: 120 }
			]
		});
	  },
	});
};
function SearcProduct2()
{	var dvGrdProduct = document.getElementById("dvGrdProduct");
    var cboProvincial=document.getElementById("cboProvincial");
   
	var name="";
	var provincial ="";
	
	if(document.getElementById("txtName").value!="" && document.getElementById("txtName").value!=undefined)
		name=document.getElementById("txtName").value;
	if( cboProvincial.selectedIndex!=0)
		 provincial=cboProvincial[cboProvincial.selectedIndex].text;	
	
	var query ="name="+name+"&provincial="+provincial;
	var objProduct; 
	$("#dvGrdProduct").jsGrid({
             	height: "550",
				width: "100%",		
				sorting: true,
				paging: true,
				autoload: true,
				pageSize: 5,
				pageButtonCount: 5,
                controller: {
                    loadData: function() {
                        var deferred = $.Deferred();

                        $.ajax({
                            url: "/getProduct?"+query,
                            dataType: 'json',
                            success: function(data){
                                deferred.resolve(data);
                            }
                        });

                        return deferred.promise();
                    }
                },
                rowRenderer: function(item) {
                    var product = item;
                    var $photo = $("<div>").addClass("client-photo").append($("<img>").attr("src",product.ImgUrl));
					
                    var $info = $("<div>").addClass("client-info")
						.append($("<p>").append($("<strong>").text(product.Type+", "+"sản phẩm " + product.Name+ ", ngày đăng "+ ConverDate(product.InsertDate))))
                        .append($("<p>").text("SL dự kiến : " + product.Quantity +" "+ product.QuantityUnit+" , giá dự kiến : "+ product.Price +" "+product.PriceUnit+ ", diện tích : "+ product.Acreage+" "+ product.AcreageUnit))                    .append($("<p>").append($("<strong>").text("Người đăng: "+product.PostName)))
                        .append($("<p>").text("Địa chỉ: Tỉnh/TP " + product.Provincial + ", Quận/Huyện " + product.District +", Phường/Xã "+product.Ward));

                    return $("<tr>").append($("<td>").append($photo).append($info));
                },
                fields: [
                    { title: "Danh sách sản phẩm" }
                ]
            });


            String.prototype.capitalize = function() {
                return this.charAt(0).toUpperCase() + this.slice(1);
            };
      
};
SearcProduct2();