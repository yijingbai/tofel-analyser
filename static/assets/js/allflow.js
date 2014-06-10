$(function () {
	function getCurrentTime() {

	}

	$('.cbp_tmtime').html(moment().calendar());
	$(".form_datetime").datetimepicker({
		format: 'mm-dd hh:ii:ss'
	});

	$('#allflowform').submit(function (e) {
		e.preventDefault();
		form = $('#allflowform').serializeJson();
		$("#PageOpenTimer").fadeIn('slow');
		$("#PageOpenTimer").TimeCircles().destroy();
		$("#PageOpenTimer").TimeCircles({
			"bg_width": 1.0,
			"fg_width": 0.14,
			"circle_bg_color": "#e8e8e8",
			'time': {
				'Days': {
					show: false
				},
				'Hours': {
					'text': '小时'
				},
				'Minutes': {
					'text': '分',
					'color': '#0aa699'
				},
				'Seconds': {
					'text': '秒'
				}
			}
		});
		var finaloutput = form.output;
		form.output = form.output + "_redunphase";



		var timelineTemplate = _.template('<li>\
                  <time class="cbp_tmtime">\
                    <span class="date"><%= day %></span>\
                    <span class="time">\
                      <%= time %>\
                      <span class="semi-bold"><%= moa %></span>\
                    </span>\
                  </time>\
                  <div class="cbp_tmicon success animated bounceIn">\
                    <i class="fa fa-comments"></i>\
                  </div>\
                  <div class="cbp_tmlabel">\
                    <div class="p-t-10 p-l-30 p-r-20 p-b-20 xs-p-r-10 xs-p-l-10 xs-p-t-5">\
                      <div class="m-t-5 dark-text" style="text-align:center;">\
                        <h3 >\
                          <span class="semi-bold"><%= content %></span>\
                        </h3>\
                      </div>\
                    </div>\
                    <div class="clearfix"></div>\
                  </div>\
                </li>');

		submitData('post', '/api/startredundancy', form, function (msg) {
			console.log('reduncy complete');
			console.log(form);
			console.log(moment().calendar());
			var times = moment().calendar().split(' ');
			var reduncyRecord = timelineTemplate({
				'day': times[0],
				'time': times[2],
				'moa': times[3],
				'content': "去冗余操作完成"
			});
			$('.cbp_tmtimeline').append(reduncyRecord);


			form.input = form.output;
			form.output = form.output + "_corrphase";
			submitData('post', '/api/startCorrelation', form, function (msg) {
				console.log('correlation complete');
				console.log(msg);

				var times = moment().calendar().split(' ');
				var correRecord = timelineTemplate({
					'day': times[0],
					'time': times[2],
					'moa': times[3],
					'content': "告警关联操作完成"
				});
				$('.cbp_tmtimeline').append(correRecord);

				form.input = form.output;
				form.output = form.output + "_judgephase";
				submitData('post', '/api/startJudge', form, function (msg) {
					console.log('judge complete');
					console.log(msg);
					var times = moment().calendar().split(' ');
					var judgeRecord = timelineTemplate({
						'day': times[0],
						'time': times[2],
						'moa': times[3],
						'content': "决策操作完成"
					});
					$('.cbp_tmtimeline').append(judgeRecord);
					$("#PageOpenTimer").TimeCircles().stop();
					$('#reduceresult').fadeIn('slow');
					reduceresultDataTable = $("#reduceresult").dataTable({
						"sDom": "<'row'<'col-md-6'l T><'col-md-6'f>r>t<'row'<'col-md-12'p i>>",
						'bProcessing': true,
						"bDestroy": true,
						'bPaginate': true,
						"sPaginationType": "bootstrap",
						"aaData": msg.data.reduce,
						"aoColumns": [{
							"sTitle": 'KEY'
						}, {
							"sTitle": 'VALUE'
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
							'sEmptyTable': '无reduce结果'
						},
						bAutoWidth: false,
						"fnCreatedRow": function (nRow, aData, iDataIndex) {
							$('td', nRow).addClass('tdcenter');
						},
					});

				}, function (xhr, msg) {
					$("#PageOpenTimer").TimeCircles().stop();
				})
			}, function (xhr, msg) {
				$("#PageOpenTimer").TimeCircles().stop();
			});
		}, function (xhr, msg) {
			$("#PageOpenTimer").TimeCircles().stop();
		});
	});
});
