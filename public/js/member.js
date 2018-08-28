//https://nongsanvn.herokuapp.com/getMember

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
            if (err.responseText = -'Unauthorized')
                alert("Bạn đã bị time out");
            window.location.href = 'login.html';
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
            if (err.responseText = -'Unauthorized')
                alert("Bạn đã bị time out");
            window.location.href = 'login.html';
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
            if (err.responseText = -'Unauthorized')
                alert("Bạn đã bị time out");
            window.location.href = 'login.html';
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
        url: "/getMembercms",
        data: function (d) {
            var cboProvincial = document.getElementById("cboProvincial");
            var cboDistricts = document.getElementById("cboDistricts");
            var cboWards = document.getElementById("cboWards");
            var name = "";
            var provincial = "";
            var districts = "";
            var wards = "";
            var blockstatus = "";
            var position = "";
            if ($('#txtName').val() != "" && $('#txtName').val() != undefined)
                name = $("#txtName").val();
            if (cboProvincial.selectedIndex != 0)
                provincial = cboProvincial[cboProvincial.selectedIndex].text;
            if (cboDistricts.selectedIndex != 0)
                districts = cboDistricts[cboDistricts.selectedIndex].text;
            if (cboWards.selectedIndex != 0)
                wards = cboWards[cboWards.selectedIndex].text;
            if (document.getElementById("cboPosition").selectedIndex != 0)
                position = document.getElementById("cboPosition").value;
            if (document.getElementById("cboStatus").selectedIndex != 0)
                blockstatus = document.getElementById("cboStatus").value;
            d.phone = $("#txtPhone").val();
            d.name = name;
            d.position = position;
            d.blockstatus = blockstatus;
            d.provincial = provincial;
            d.districts = districts;
            d.wards = wards;
            d.layer = "";
        },
        dataSrc: ""
    },
    columns: [
        {
            data: 'ImgUrl', render: function (data, type, row, meta) {
                return '<img src="' + data + '" height="80" width="80">';
            }
        }, 
        { data: 'Name', defaultContent: ""},
        {
            data: 'Birthday', render: function (data, type, row, meta) {
                return GetBirthDay(row.Birthday);
            }},
        { data: 'Position', defaultContent: "" },
        { data: 'Provincial', defaultContent: "" },
        { data: 'District', defaultContent: "" },
        { data: 'Ward', defaultContent: ""},
        { data: 'Phone', defaultContent: "" },
        { data: 'Email', defaultContent: "" },
        { data: 'BlockStatus', defaultContent: "" }
        //,
        //{
        //    data: null,
        //    render: function CreateActionEdit() {
        //        var img = '<div class="btn-group" role="group"><button type="button" class="btn btn-default btn-sm edit" title="Sửa thông tin"><img src="assets/img/sf/notepad.svg" height="16" width="16">' +
        //            '</button><button type="button" title="Đổi mật khẩu" class="btn btn-default btn-sm reset"><img src="assets/img/sf/key.svg" height="16" width="16"></button>' +
        //            '</button><button type="button" title="Xóa tài khoản" class="btn btn-default btn-sm delete"><img src="assets/img/sf/sign-delete.svg" height="16" width="16"></button></div >'
        //        return img;
        //    }
        //}
    ]
}); 
function SearchMember() {
    datatable.ajax.reload();
    datatable.draw();
};
SearchMember();

