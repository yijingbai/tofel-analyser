$(function() {

    //Form Wizard Validations
    var $validator = $("#taskForm").validate({
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
            cron: {
                required: true
            },
            hdfspath: {
                required: true
            },
            fileename: {
                required: true
            },
            filecname: {
                required: true
            },
            filedesc: {
                required: true
            },
            manager: {
                required: true
            },
            delimiter: {
                required: true
            },
            frquency: {
                required: true
            },
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
            cron: {
                required: '运行周期不能为空'
            },
            fileename: {
                required: '文件英文名不能为空'
            },
            filecname: {
                required: '文件中文名不能为空'
            },
            filedesc: {
                required: '文件描述不能为空'
            },
            manager: {
                required: '接口人'
            },
            delimiter: {
                required: '分隔符不能为空'
            },
            frquency: {
                required: '更新频率不能为空'
            },


        },
        errorPlacement: function(label, element) {
            $('<span class="arrow"></span>').insertBefore(element);
            $('<span class="error"></span>').insertAfter(element).append(label)
        }
    });

    $('#rootwizard').bootstrapWizard({
        'tabClass': 'form-wizard',
        'onNext': function(tab, navigation, index) {
            var $valid = $("#taskForm").valid();
            if (!$valid) {
                $validator.focusInvalid();
                return false;
            } else {
                if (index == 2) {
                    $(".next").attr('style', 'display:none');
                } else {
                    $(".next").attr('style', 'display:""');
                }
                $('#rootwizard').find('.form-wizard').children('li').eq(index - 1).addClass('complete');
                $('#rootwizard').find('.form-wizard').children('li').eq(index - 1).find('.step').html('<i class="fa fa-check"></i>');
            }
        },
        'onPrevious': function(tab, navigation, index) {
            if (index == 2) {
                $(".next").attr('style', 'display:none');
            } else {
                $(".next").attr('style', 'display:""');
            }
        }
    });

    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/tomorrow");
    editor.getSession().setMode("ace/mode/python");

    $("#taskForm").submit(function(e) {
        e.preventDefault();
        var form = $('#taskForm').serializeJson();
        var filetags = $('#filetags').tagsinput('items');
        var tags = $('#tags').tagsinput('items');
        var code = editor.getSession().getDocument().getValue();
        // var filekeys = ['filecname', 'filedesc', 'fileename', 'frquency', 'hdfspath', 'manager', 'delimiter']
        // var fileform = _.pick(form, filekeys);
        var taskform = form;
        taskform['tags'] = tags;
        taskform['code'] = code;
        taskform['creator'] = 'baiyijing';
        taskform['param'] = '';
        tasklist.create(taskform, {
            success: function(m) {
                if (m.get('id') != undefined) {
                    Messenger().post({
                        message: "添加task成功!",
                        showCloseButton: true
                    });
                }
            }
        });

    });
})