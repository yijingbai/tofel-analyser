$(function() {
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/tomorrow");
    editor.getSession().setMode("ace/mode/sql");

    //Form Wizard Validations
    var $validator = $("#martForm").validate({
        rules: {
            ename: {
                required: true
            },
            cname: {
                required: true
            },
            desc: {
                required: true
            },
            manager: {
                required: true
            },
            frquency: {
                required: true
            },
            code: {
                required: true
            }
        },
        messages: {
            ename: {
                required: '英文名不能为空'
            },
            cname: {
                required: '中文名不能为空'
            },
            desc: {
                required: '描述不能为空'
            },
            manager: {
                required: '接口人不能为空'
            },
            frequency: {
                required: '频率不能为空'
            }
        },
        errorPlacement: function(label, element) {
            $('<span class="arrow"></span>').insertBefore(element);
            $('<span class="error"></span>').insertAfter(element).append(label)
        }
    });

    oTable3 = $('#example3').dataTable({
        "sDom": "<'row'<'col-md-6'<'toolbar'>><'col-md-6'>r>t<'row'<'col-md-12'p>>",
        "oTableTools": {
            "aButtons": [{
                "sExtends": "collection",
                "sButtonText": "<i class='fa fa-cloud-download'></i>",
                "aButtons": ["csv", "xls", "pdf", "copy"]
            }]
        },
        "aoColumnDefs": [{
            "bSortable": false,
            "aTargets": [0]
        }],
        "oLanguage": {
            "sLengthMenu": "_MENU_ ",
            "sInfo": "Showing <b>_START_ to _END_</b> of _TOTAL_ entries"
        },
    });

    var columnlist = [];

    $('#fieldform').submit(function(e) {
        e.preventDefault();
        var form = $('#fieldform').serializeJson();
        console.log(form);
        console.log(_.values(form))
        $('#example3').dataTable().fnAddData(_.values(form));
        columnlist.push(form);
        console.log(columnlist);
        $('#fieldform')[0].reset();
    })

    $('#quick-access .btn-cancel').click(function() {
        $("#quick-access").css("bottom", "-150px");
    });
    $('#quick-access .btn-add').click(function() {
        $("#quick-access").css("bottom", "-150px");
    });

    $('#example3_wrapper .dataTables_filter input').addClass("input-medium ");
    $('#example3_wrapper .dataTables_length select').addClass("select2-wrapper span12");
    $("div.toolbar").html('<div class="table-tools-actions"><button class="btn btn-success" id="test2">新建字段</button></div>');

    $('#test2').on("click", function() {
        $("#quick-access").css("bottom", "0px");
    });




    $('#submitmart').click(function() {
        $('#martForm').submit();
    });



    $("#martForm").submit(function(e) {
        e.preventDefault();
        var form = $('#martForm').serializeJson();
        var code = editor.getSession().getDocument().getValue();
        var tags = $('#tags').tagsinput('items');
        form['code'] = code;
        form['tags'] = tags;
        form['task'] = 0;
        table = martlist.create(form, {
            success: function(m) {
                if (m.get('id') != undefined) {
                    _.each(columnlist, function(c) {
                        c['table_id'] = m.get('id');
                        metalist.create(c);
                    })
                    Messenger().post({
                        message: "添加Mart表成功!",
                        showCloseButton: true
                    });
                }
            }
        });

    });
})