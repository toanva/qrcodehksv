//https://nongsanvn.herokuapp.com/getProductCMS
var cboProvincial = document.getElementById("cboProvincial");
var cboPosition = document.getElementById("cboPosition");
var cboDistricts = document.getElementById("cboDistricts");
var cboWards = document.getElementById("cboWards");

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
            while (selectElemRef.length > 0) {
                selectElemRef.remove(0);
            }
            var o = new Option("Chọn Tỉnh/TP", "0");
            //o.selected=true;
            $("#cboProvincial").append(o);
            for (var i = 1, len = objProvincials.length + 1; i < len; ++i) {
                var o = new Option(objProvincials[i - 1].Name, objProvincials[i - 1]._id);
                $("#cboProvincial").append(o);
            }
            if (cboProvincial.length > 1) {
                document.getElementById("cboProvincial").selectedIndex = 0;
            }
        },
        error: function (err) {
            if (err.responseText == 'Unauthorized') {
                alert("Bạn đã bị time out");
                window.location.href = 'login.html';
            }
        }
    });
};
function onCboProvincialsChange(event) {
    if (event.selectedIndex > 0) {
        var value = event.value;
        LoadCboDistricts(value);
    }
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
            var o = new Option("Chọn Quận/Huyện", "0");
            $("#cboDistricts").append(o);
            for (var i = 1, len = objDistricts.length + 1; i < len; ++i) {
                var o = new Option(objDistricts[i - 1].Name, objDistricts[i - 1]._id);
                $("#cboDistricts").append(o);
            }
            if (objDistricts.length > 1) {
                document.getElementById("cboDistricts").selectedIndex = 0;
                onCboDistrictsChange(document.getElementById("cboDistricts"));
            }
        },
        error: function (err) {
            if (err.responseText == 'Unauthorized') {
                alert("Bạn đã bị time out");
                window.location.href = 'login.html';
            }
        }
    });
};
function onCboDistrictsChange(event) {
    if (event.selectedIndex > 0) {
        var value = event.value;
        LoadCboWards(value);
    }
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
            var o = new Option("Chọn Xã/Phường", "0");
            $("#cboWards").append(o);
            for (var i = 1, len = objWards.length + 1; i < len; ++i) {
                var o = new Option(objWards[i - 1].Name, objWards[i - 1]._id);
                $("#cboWards").append(o);

            }
            if (objWards.length > 1) {
                document.getElementById("cboWards").selectedIndex = 0;

            }
        },
        error: function (err) {
            if (err.responseText == 'Unauthorized') {
                alert("Bạn đã bị time out");
                window.location.href = 'login.html';
            }
        }
    });
};
LoadCboProvincials();

var datatable = $('#grvResult').DataTable({
    scrollY: 400,
    scrollX: true,
    scrollCollapse: true,
    select: true,
    dom: 'Bfrtip',
    buttons: [
        {
            extend: 'excelHtml5',
        },
        {
            extend: 'pdfHtml5',
        }
    ],
    ajax: {
        dataType: "json",
        url: "/getProductCMS",
        data: function (d) {
            
            var name = "";
            var provincial = "";
            var districts = "";
            var wards = "";
            if ($('#txtName').val() != "" && $('#txtName').val() != undefined)
                name = $("#txtName").val();
            if (cboProvincial.selectedIndex != 0)
                provincial = cboProvincial[cboProvincial.selectedIndex].text;
            if (cboDistricts.selectedIndex != 0)
                districts = cboDistricts[cboDistricts.selectedIndex].text;
            if (cboWards.selectedIndex != 0)
                wards = cboWards[cboWards.selectedIndex].text;
            
            d.name = name;
            d.provincial = provincial;
            d.districts = districts;
            d.wards = wards;
            d.psid = "";
        },
        error: function(err) {
            if (err.responseText == 'Unauthorized') {
                alert("Bạn đã bị time out");
                window.location.href = 'login.html';
            }
        },
        dataSrc: ""
    },
    columns: [
        {
            data: 'ImgUrl', render: function (data, type, row, meta) {
                if (data == null) return '<div style="text-align:center;vertical-align:middle;height:90px;width:90px"><img src="../img/logo.jpg" height="80" width="80"></div>';
                else return '<div style="text-align:center;vertical-align:middle;height:90px;width:90px"><img src="' + data + '" height="80" width="80"></div>';
            }
        },
        {
            data: 'Name', render: function (data, type, row, meta) {
                var strRow = '<div class="col-sm-12 info">';
                strRow = strRow + '<div class="col-sm-12"><label class="col-sm-2 text-right margin0">Tên sản phẩm:</label><label class="margin0 col-sm-4"> ' + row.Name + '</label>';
                strRow = strRow + '<label class="col-sm-2 text-right margin0">Loại sản phẩm:</label><label class="margin0 col-sm-4"> ' + row.Type + '</label></div>';

                strRow = strRow + '<div class="col-sm-12"><label class="col-sm-2 text-right margin0">SL dự kiến:</label><label class="margin0 col-sm-4"> ' + row.Quantity + ' ' + row.QuantityUnit + '</label>';
                strRow = strRow + '<label class="col-sm-2 text-right margin0">Mô tả:</label><label class="margin0 col-sm-4"> ' + row.Description + '</label></div>';
                
                strRow = strRow + '<div class="col-sm-12"><label class="col-sm-2 text-right margin0">Giá dự kiến:</label><label class="margin0 col-sm-4"> ' + row.Price + ' ' + row.PriceUnit + '</label>';
                strRow = strRow + '<label class="col-sm-2 text-right margin0">Thời vụ:</label><label class="margin0 col-sm-4"> Tháng ' + (row.ToMonth !== undefined ? row.ToMonth : 'NA') + ' - ' + (row.FromMonth !== undefined ? row.FromMonth : 'NA') + '</label></div>';
                
                strRow = strRow + '<div class="col-sm-12"><label class="col-sm-2 text-right margin0">Diện tích:</label><label class="margin0 col-sm-4"> ' + row.Acreage + ' ' + row.AcreageUnit + '</label>';
                strRow = strRow + '<label class="col-sm-2 text-right margin0">Người đăng:</label><label class="margin0 col-sm-4"> ' + row.PostName + '</label></div>';
                
                strRow = strRow + '<div class="col-sm-12"><label class="col-sm-2 text-right margin0">Địa chỉ :</label><label class="margin0 col-sm-4"> ' + row.Ward + ' - ' + row.District + ' - ' + row.Provincial + '</label>';
                strRow = strRow + '<label class="col-sm-2 text-right margin0">Ngày đăng:</label><label class="margin0 col-sm-4"> ' + row.InsertDate + '</label></div>';

                strRow = strRow + '</div>';
                return strRow;
            }
        }
    ],
    columnDefs: [
        { className: "img-product", "targets": [0] }
    ]
});

function Search() {
    datatable.ajax.reload();
    datatable.draw();
};
