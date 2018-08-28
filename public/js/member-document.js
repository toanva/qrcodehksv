//https://nongsanvn.herokuapp.com/getMemberCMS

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
            var phone = "";
            var cmt = "";
            //if ($('#txtName').val() != "" && $('#txtName').val() != undefined)
            //    name = $("#txtName").val();
            //if ($('#txtPhone').val() != "" && $('#txtPhone').val() != undefined)
            //    phone = $("#txtPhone").val();
            //if ($('#txtCMT').val() != "" && $('#txtCMT').val() != undefined)
            //    cmt = $("#txtCMT").val();

            d.phone = phone;
            d.name = name;
            d.cmt = cmt;
            d.psid = "";
        },
        error: function (err) {
            if (err.responseText == 'Unauthorized') {
                alert("Bạn đã bị time out");
                window.location.href = 'login.html';
            }
        },
        dataSrc: ""
    },
    columns: [
        {
            data: 'Name', defaultContent: ""
        },
        {
            data: 'Birthday', render: function (data, type, row, meta) {
                return GetBirthDay(row.Birthday);
            }
        },
        { data: 'CMT', defaultContent: "" },
        { data: 'Phone', defaultContent: "" },
        { data: 'Address', defaultContent: "" },
        {
            data: 'list_document', render: function (data, type, row, meta) {
                var detail = "";
                if (row.list_document !== null) {
                    data.forEach(function (element) {
                        detail += '<p>' + element.LinkDocument + '</p>'; 
                    });
                }
                return detail;
            }
        }
    ]
});

function SearchMember() {
    datatable.ajax.reload();
    datatable.draw();
};
