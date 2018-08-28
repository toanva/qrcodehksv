//https://nongsanvn.herokuapp.com/getMemberCMS
var idatadetail = null;
var cboProvincial = document.getElementById("cboProvincial");
var cboPosition = document.getElementById("cboPosition");
var cboDistricts = document.getElementById("cboDistricts");
var cboWards = document.getElementById("cboWards");
var cboStatus = document.getElementById("cboStatus");

function cboLevelChange(event) {
    var value = event.value;
    if (value == '1') {
        setDataPosition(arrPosition[0], arrLayer[0]);
    } else if (value == '2') {
        setDataPosition(arrPosition[1], arrLayer[1]);
    } else if (value == '3') {
        setDataPosition(arrPosition[2], arrLayer[2]);
    } else if (value == '4') {
        setDataPosition(arrPosition[3], arrLayer[3]);
    } else {
        setDataPosition(arrPosition[4], arrLayer[4]);
    }
    /// xử lý chức danh kiêm nhiệm
    var valuePosition = cboPosition[cboPosition.selectedIndex].text;
};

function setDataPosition(position, layer) {
    while (cboPosition.length > 0) {
        cboPosition.remove(0);
    }
    var o = new Option("Tất cả", "0");
    //o.selected=true;
    $("#cboPosition").append(o);
    for (var i = 0, len = position.length; i < len; ++i) {
        var o = new Option(position[i], layer[i]);
        $("#cboPosition").append(o);
    }
    var value = cboPosition[cboPosition.selectedIndex].text;
    var valueLevel = cboLevel[cboLevel.selectedIndex].value;
};

function loadPosition() {
    var position1 = [];
    var arrLayer1 = [];
    var position2 = [];
    var arrLayer2 = [];
    var position3 = [];
    var arrLayer3 = [];
    var position4 = [];
    var arrLayer4 = [];
    var position5 = [];
    var arrLayer5 = [];
    var objPosition;
    $.ajax({
        dataType: "json",
        url: "/getPosition",
        data: objPosition,
        success: function (data) {
            objPosition = data;
            for (var i = 0, len = objPosition.length; i < len; ++i) {
                var value = objPosition[i].Level;
                if (value == '1') {
                    position1.push(objPosition[i].Name);
                    arrLayer1.push(objPosition[i].Layer);
                } else if (value == '2') {
                    position2.push(objPosition[i].Name);
                    arrLayer2.push(objPosition[i].Layer);
                } else if (value == '3') {
                    position3.push(objPosition[i].Name);
                    arrLayer3.push(objPosition[i].Layer);
                } else if (value == '4') {
                    position4.push(objPosition[i].Name);
                    arrLayer4.push(objPosition[i].Layer);
                } else {
                    position5.push(objPosition[i].Name);
                    arrLayer5.push(objPosition[i].Layer);
                }
            }
            arrPosition = [position1, position2, position3, position4, position5];
            arrLayer = [arrLayer1, arrLayer2, arrLayer3, arrLayer4, arrLayer5];
            setDataPosition(arrPosition[0], arrLayer[0]);
        }
    });
};
loadPosition();

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
            var o = new Option("Tất cả", "0");
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
        url: "/getMemberCMS",
        data: function (d) {
            var name = "";
            var provincial = "";
            var districts = "";
            var wards = "";
            var blockstatus = "";
            var position = "";
            var layer = "";
            var level = "";
            if ($('#txtName').val() != "" && $('#txtName').val() != undefined)
                name = $("#txtName").val();
            if (cboProvincial.selectedIndex != 0)
                provincial = cboProvincial[cboProvincial.selectedIndex].text;
            if (cboDistricts.selectedIndex != 0)
                districts = cboDistricts[cboDistricts.selectedIndex].text;
            if (cboWards.selectedIndex != 0)
                wards = cboWards[cboWards.selectedIndex].text;
            if (cboStatus.selectedIndex != 0)
                blockstatus = cboStatus.value;
            level = cboLevel.value;
            if (cboPosition.selectedIndex != 0)
                position = cboPosition[cboPosition.selectedIndex].text;
            
            d.phone = $("#txtPhone").val();
            d.name = name;
            d.position = position;
            d.blockstatus = blockstatus;
            d.provincial = provincial;
            d.districts = districts;
            d.wards = wards;
            d.level = level;
            d.layer = "";
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
                return '<img src="' + data + '" height="80" width="80">';
            }
        },
        {
            data: 'Name', render: function (data, type, row, meta) {
                return '<a href="#" onclick="ShowDetail(' + row._id + ')">' + data + '</a>';
            }
        },
        {
            data: 'Birthday', render: function (data, type, row, meta) {
                return GetBirthDay(row.Birthday);
            }
        },
        { data: 'Position', defaultContent: "" },
        { data: 'Provincial', defaultContent: "" },
        { data: 'District', defaultContent: "" },
        { data: 'Ward', defaultContent: "" },
        { data: 'Phone', defaultContent: "" },
        { data: 'Email', defaultContent: "" },
        {
            data: 'BlockStatus', render: function (data, type, row, meta) {
                return data === "ACTIVE" ? "Đã duyệt" : "Chưa duyệt";
            }
        }
    ]
});

function SearchMember() {
    datatable.ajax.reload();
    datatable.draw();
};

function ShowDetail(id) {
	tableInfoPending.clear();
	tableInfoPending.draw();
	$("#info_name").text('');
	$("#info_level").text('');
	$("#info_position").text('');
	$("#info_birthday").text('');
	$("#info_phone").text('');
	$("#info_email").text('');
	$("#info_address").text('');
    $("#info_status").text('');
    $('#info_img').attr('src', '../img/logo.jpg');
    var imgAvatar = document.getElementById("info_img");
    var objInfo;
    $.ajax({
        dataType: "json",
        url: "/getMember?psid=" + id,
        data: objInfo,
        success: function (data) {
            objInfo = data[0];
            imgAvatar.src = objInfo.ImgUrl;
            var date = new Date(objInfo.Birthday);
            var birthday = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
			var status = objInfo.BlockStatus === "ACTIVE" ? "Đã duyệt":"Chưa duyệt";
            $("#info_name").text(objInfo.Name);
            $("#info_level").text(objInfo.LevelName);
            $("#info_position").text(objInfo.Position);
            $("#info_birthday").text(birthday);
            $("#info_phone").text(objInfo.Phone);
            $("#info_email").text(objInfo.Email);
            $("#info_address").text(objInfo.Ward + ' - ' + objInfo.District + ' - ' + objInfo.Provincial );
			$("#info_status").text(status);
        }
    });
    var objMembers;
    $.ajax({
        dataType: "json",
        url: "/getListMemberKsv?psid=" + id,
        data: objMembers,
        success: function (data) {
            objMembers = data;
            if(data !== null) drawTable(data);
        }
    });
    $('#myModal').modal('show');
}
var tableInfoPending = $("#grvInfoPending").DataTable({
	scrollY: 300,
    scrollX: true,
    scrollCollapse: true
	});
$('#myModal').on('shown.bs.tab', function(e){
   $($.fn.dataTable.tables(true)).DataTable()
      .columns.adjust();
});
$('#myModal').on('shown.bs.modal', function(e){
   $($.fn.dataTable.tables(true)).DataTable()
      .columns.adjust();
});
function drawTable(objMembers) {
	
    for (var i = 0; i < objMembers.length; i++) {
        obj = objMembers[i];
        if (obj.BlockStatus == 'PENDING') {
            //var date = new Date(obj.Birthday);
            //var birthday = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
			var img = '<img id="img_infodetail" src="' + obj.ImgUrl + '" alt="Ảnh đại diện" class="img-responsive">';
            var strRow = '';
            strRow = strRow + '<div class="col-sm-12"><label class="col-sm-4 text-right margin0">Họ và Tên:</label><label class="margin0 col-sm-8"> ' + obj.Name + '</label></div>';
            strRow = strRow + '<div class="col-sm-12"><label class="col-sm-4 text-right margin0">Cấp cán bộ:</label><label class="margin0 col-sm-8"> ' + obj.LevelName + '</label></div>';
            strRow = strRow + '<div class="col-sm-12"><label class="col-sm-4 text-right margin0">Chức vụ:</label><label class="margin0 col-sm-8"> ' + obj.Position + '</label></div>';
            strRow = strRow + '<div class="col-sm-12"><label class="col-sm-4 text-right margin0">Ngày sinh:</label><label class="margin0 col-sm-8"> ' + obj.Birthday + '</label></div>';
            strRow = strRow + '<div class="col-sm-12"><label class="col-sm-4 text-right margin0">Điện thoại:</label><label class="margin0 col-sm-8"> ' + obj.Phone + '</label></div>';
            strRow = strRow + '<div class="col-sm-12"><label class="col-sm-4 text-right margin0">Email:</label><label class="margin0 col-sm-8"> ' + obj.Email + '</label></div>';
            strRow = strRow + '<div class="col-sm-12"><label class="col-sm-4 text-right margin0">Địa chỉ :</label><label class="margin0 col-sm-8"> ' + obj.Ward + ' - ' + obj.District + ' - '+ obj.Provincial + '</label></div>';
            strRow = strRow + '<div class="col-sm-12"><label class="col-sm-4 text-right margin0">Trạng thái :</label><label class="margin0 col-sm-8"> Chờ duyệt</label></div>';
            tableInfoPending.row.add([ img, strRow]).draw(false);
        } 
    }
	tableInfoPending.draw();
	 
};
