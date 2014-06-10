$(function() {
    var responsiveHelper = undefined;
    var breakpointDefinition = {
        tablet: 1024,
        phone: 480
    };
    var tableElement = $('#example');

    var knowledgeDataTable = tableElement.dataTable({
        "sDom": "<'row'<'col-md-6'l T><'col-md-6'f>r>t<'row'<'col-md-12'p i>>",
        "sAjaxDataProp": 'data',
        "oTableTools": {
            "aButtons": [{
                "sExtends": "collection",
                "sButtonText": "<i class='fa fa-cloud-download'></i>",
                "aButtons": ["csv", "xls", "pdf", "copy"]
            }]
        },
        'bProcessing': true,
        'sAjaxSource': '/api/KnowledgeBases/',
        'bPaginate': false,
        "sPaginationType": "bootstrap",
        "aoColumns": [{
            'mData': 'pre',
            'bSortable': false
        }, {
            'mData': 'seg_id',
            'bSortable': false
        }, {
            'mData': 'con',
            'bSortable': false
        }],
        "aaSorting": [
            [1, "asc"]
        ],
        'oLanguage': {
            'oPaginate': {
                'sPrevious': '上一页',
                'sNext': '下一页'
            },
            'sSearch': '搜索',
            'sInfo': '共_TOTAL_条字段',
            'sLoadingRecords': '载入数据中...',
            'sProcessing': '载入中...',
            'sEmptyTable': '知识库为空'
        },
        bAutoWidth: false,
        fnPreDrawCallback: function() {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper) {
                responsiveHelper = new ResponsiveDatatablesHelper(tableElement, breakpointDefinition);
            }
        },
        fnRowCallback: function(nRow) {
            responsiveHelper.createExpandIcon(nRow);
        },
        fnDrawCallback: function(oSettings) {
            responsiveHelper.respond();
        },
        "fnCreatedRow": function(nRow, aData, iDataIndex) {
            var nCloneTd = document.createElement('td');
            nCloneTd.innerHTML = '<div class="btn-group"><a href="#modal-editknowledge" class="btn btn-xs btn-warning editknowledge" data-toggle="modal">编辑</a><a href="#modal-deleteknowledge" class="btn btn-xs btn-danger btn-rounded deleteknowledge" data-toggle="modal">删除</a></div>';
            $(nRow).append(nCloneTd.cloneNode(true));

            $('td', nRow).addClass('tdcenter');

            function addTdClass(splits, selector) {
                for (var i in splits) {
                    $(selector, nRow).append(alertTemplate({
                        alertid: splits[i]
                    }));
                }
            }
            var alertTemplate = _.template('<a class="alertsegid" href="#"><%= alertid %></a>');
            presplit = aData['pre'].split(',')
            consplit = aData['con'].split(',')
            $('td:eq(1)', nRow).html('');
            addTdClass(presplit, 'td:eq(1)');
            $('td:eq(2)', nRow).html('');
            addTdClass(consplit, 'td:eq(2)');
            $('td:eq(0)', nRow).html(alertTemplate({
                alertid: aData['seg_id']
            }));

            $('.alertsegid', nRow).each(function() {
                $(this).qtip({
                    style: 'Green',
                    content: {
                        text: function(event, api) {
                            $.ajax({
                                url: '/api/AlertInfos/' + api.elements.target.html().trim()
                            })
                                .then(function(content) {
                                    console.log(content);
                                    if (content.data.info != "") {
                                        api.set('content.title', content.data.content);
                                        api.set('content.text', content.data.info);
                                    } else {
                                        api.set('content.title', content.data.content);
                                        api.set('content.text', "");
                                    }

                                }, function(xhr, status, error) {
                                    api.set('content.text', status + ': ' + error);
                                });
                            return '';
                        }
                    },
                    position: {
                        viewport: $(window)
                    }
                })
            })



            /*=删除，编辑表单数据填充=*/
            $('.editknowledge, .deleteknowledge', nRow).click(function() {

                submitData('get', '/api/KnowledgeBases/' + aData['id'], '', function(msg) {
                    console.log(msg.data);
                    fillFormUseObject(msg.data, 'editknowledgeform');
                    fillFormUseObject(msg.data, 'deleteknowledgeform');
                }, function(XmlHttpRequest, textStatus, errorThrown) {
                    console.log(XmlHttpRequest.responseText);
                })



            });
        },
    });

    $('#editknowledgeform').submit(function(e) {
        e.preventDefault();
        var form = $("#editknowledgeform").serializeJson();
        console.log(form);
        submitData("PATCH", "/api/KnowledgeBases/" + form.id, form, callBackGenerator('success', '#editmodal', '恭喜您，编辑知识库条目已成功！'), callBackGenerator('error', '#editmodal', '对不起，编辑知识库条目未成功，错误信息为:'));
    })

    $('#deleteknowledgeform').submit(function(e) {
        e.preventDefault();
        var form = $("#deleteknowledgeform").serializeJson();
        submitData("DELETE", "/api/KnowledgeBases/" + form.id, {}, callBackGenerator('success', '#deletemodal', '恭喜您， 删除知识库条目已成功！'), callBackGenerator('success', '#deletemodal', '恭喜您， 删除知识库条目已成功！'));
    })

    $('#addknowledgeform').submit(function(e) {
        e.preventDefault();
        var form = $("#addknowledgeform").serializeJson();
        submitData("POST", "/api/KnowledgeBases/" + form.id, form, callBackGenerator('success', '#addmodal', '恭喜您， 添加知识库条目已成功！'), callBackGenerator('error', '#addmodal', '对不起, 添加知识库条目未成功，错误信息为：'))
    })

    $('#example_wrapper .dataTables_filter input').addClass("input-medium "); // modify table search input
    $('#example_wrapper .dataTables_length select').addClass("select2-wrapper span12"); // modify table per page dropdown



    $('#example input').click(function() {
        $(this).parent().parent().parent().toggleClass('row_selected');
    });


})