
org.aurin.demonstratortools.health.mainUI = function() {

	leftpanel = new Ext.Panel(
			{
				title : 'Health Indicators',
				height : 330,
				id : 'extjsLeftpanel',
				width : Ext.getBody().getViewSize().width / 2,
				monitorResize: true,
				frame : true,
				items : new Ext.form.FormPanel(
						{
							//width : '100%',
							bodyPadding : 7,
							defaults : {
								anchor : '100%',
								flex : 1,
								style : {
									padding : '3px'
								}
							},
							layout : {
								type : 'table',
								height : 300,
								columns : 7
							},
							frame : false,
							// layoutConfig: {columns:2},
							items : [
									{
										xtype : 'checkbox',
										id : 'checkbox11',
										labelSeparator : '',
										hideLabel : true,
										boxLabel : 'SEIFA Index of Relative Socio-Economic Disadvantage',
										fieldLabel : 'text',
										checked : true,
										colspan : 7,
										listeners : {
											change : {
												fn : function(checkbox, checked) {
													Ext.getCmp('combo11')
															.setDisabled(
																	!checked);
													Ext.getCmp('slider11')
															.setDisabled(
																	!checked);
													Ext
															.getCmp(
																	'slider_value11')
															.setDisabled(
																	!checked);
												},
											}
										}

									},
									{
										xtype : "combo",
										id : 'combo11',
										hideLabel : true,
										value : org.aurin.demonstratortools.health.constants.operator.LESS_THAN,
										store : org.aurin.demonstratortools.health.model.operator_store,
										width : 40,
										colspan : 1
									},
									{
										xtype : "textfield",
										id : 'slider_value11',
										readOnly : true,
										width : 40,
										margins : '10',
										colspan : 1,
										value : 10
									},
									{
										xtype : 'slider',
										id : 'slider11',
										hideLabel : true,
										useTips : false,
										width : 214,
										value : 50,
										increment : 1,
										minValue : 0,
										maxValue : 10,
										anchor : '100%',
										colspan : 4
									},
									{
										xtype : 'label',
										id : 'slider_maxvalue11',
										colspan : 1
									},// ///
									{
										xtype : 'checkbox',
										id : 'checkbox12',
										labelSeparator : '',
										hideLabel : true,
										boxLabel : 'Type 2 Diabetes Prevalence',
										fieldLabel : 'text',
										colspan : 5,
										checked : true,
										listeners : {
											change : {
												fn : function(checkbox, checked) {
													Ext.getCmp('combo12')
															.setDisabled(
																	!checked);
													Ext.getCmp('slider12')
															.setDisabled(
																	!checked);
													Ext
															.getCmp(
																	'slider_value12')
															.setDisabled(
																	!checked);
												},
											}
										}

									},
									{
										xtype : 'label',
										text : 'Rate Per 100 	SLA Residents',
										margins : '0 0 0 10',
										colspan : 2
									},
									{
										xtype : "combo",
										id : 'combo12',
										hideLabel : true,
										value : org.aurin.demonstratortools.health.constants.operator.LESS_THAN,

										store : org.aurin.demonstratortools.health.model.operator_store,
										width : 40,
										colspan : 1,
									},
									{
										xtype : "textfield",
										id : 'slider_value12',
										readOnly : true,
										width : 40,
										colspan : 1,
										value : 4
									},
									{
										xtype : 'slider',
										id : 'slider12',
										hideLabel : true,
										useTips : false,
										width : 214,
										value : 15,
										increment : 1,
										minValue : 0,
										maxValue : 15,
										colspan : 4
									},
									{
										xtype : 'label',
										id : 'slider_maxvalue12',
										colspan : 1
									},// //
									{
										xtype : 'checkbox',
										id : 'checkbox13',
										labelSeparator : '',
										hideLabel : true,
										boxLabel : 'Depression (Mood Problems)',
										fieldLabel : 'text',
										colspan : 5,
										checked : true,
										listeners : {
											change : {
												fn : function(checkbox, checked) {
													Ext.getCmp('combo13')
															.setDisabled(
																	!checked);
													Ext.getCmp('slider13')
															.setDisabled(
																	!checked);
													Ext
															.getCmp(
																	'slider_value13')
															.setDisabled(
																	!checked);
												},
											}
										}

									},
									{
										xtype : 'label',

										text : 'Rate Per 100 	SLA Residents',
										margins : '0 0 0 10',
										colspan : 2
									},
									{
										xtype : "combo",
										id : 'combo13',
										hideLabel : true,
										value : org.aurin.demonstratortools.health.constants.operator.LESS_THAN,

										store : org.aurin.demonstratortools.health.model.operator_store,
										width : 40,
										colspan : 1
									},
									{
										xtype : "textfield",
										id : 'slider_value13',
										readOnly : true,
										width : 40,
										colspan : 1,
										value : 10
									},
									{
										xtype : 'slider',
										id : 'slider13',
										hideLabel : true,
										useTips : false,
										width : 214,
										value : 50,
										increment : 1,
										minValue : 0,
										maxValue : 100,						
										colspan : 4
									},
									{
										xtype : 'label',
										id : 'slider_maxvalue13',
										colspan : 1
									},// ///
									{
										xtype : 'checkbox',
										id : 'checkbox14',
										labelSeparator : '',
										hideLabel : true,
										boxLabel : 'Obesity',
										fieldLabel : 'text',
										colspan : 5,
										checked : false,
										listeners : {
											change : {
												fn : function(checkbox, checked) {
													Ext.getCmp('combo14')
															.setDisabled(
																	!checked);
													Ext.getCmp('slider14')
															.setDisabled(
																	!checked);
													Ext
															.getCmp(
																	'slider_value14')
															.setDisabled(
																	!checked);
												},
											}
										}

									},
									{
										xtype : 'label',

										text : 'Rate Per 100 	SLA Residents',
										margins : '0 0 0 10',
										colspan : 2
									},
									{
										xtype : "combo",
										id : 'combo14',
										hideLabel : true,
										value : org.aurin.demonstratortools.health.constants.operator.LESS_THAN,

										store : org.aurin.demonstratortools.health.model.operator_store,
										width : 40,
										disabled : true,
										colspan : 1
									},
									{
										xtype : "textfield",
										id : 'slider_value14',
										readOnly : true,
										width : 40,
										disabled : true,
										colspan : 1,
										value : 20
									},
									{
										xtype : 'slider',
										id : 'slider14',
										hideLabel : true,
										useTips : false,
										width : 214,
										value : 50,
										increment : 1,
										minValue : 0,
										maxValue : 100,
										disabled : true,
										colspan : 4
									},
									{
										xtype : 'label',
										id : 'slider_maxvalue14',
										colspan : 1
									},// ///
									{
										xtype : 'checkbox',
										id : 'checkbox15',
										labelSeparator : '',
										hideLabel : true,
										boxLabel : 'Smoking',
										fieldLabel : 'text',
										colspan : 5,
										checked : false,
										listeners : {
											change : {
												fn : function(checkbox, checked) {
													Ext.getCmp('combo15')
															.setDisabled(
																	!checked);
													Ext.getCmp('slider15')
															.setDisabled(
																	!checked);
													Ext
															.getCmp(
																	'slider_value15')
															.setDisabled(
																	!checked);
												},
											}
										}

									},
									{
										xtype : 'label',

										text : 'Rate Per 100 	SLA Residents',
										margins : '0 0 0 10',
										colspan : 2
									},
									{
										xtype : "combo",
										id : 'combo15',
										hideLabel : true,
										value : org.aurin.demonstratortools.health.constants.operator.LESS_THAN,

										store : org.aurin.demonstratortools.health.model.operator_store,
										width : 40,
										disabled : true,
										colspan : 1
									},
									{
										xtype : "textfield",
										id : 'slider_value15',
										readOnly : true,
										width : 40,
										disabled : true,
										colspan : 1,
										value : 20
									},
									{
										xtype : 'slider',
										id : 'slider15',
										hideLabel : true,
										useTips : false,
										width : 214,
										value : 50,
										increment : 1,
										minValue : 0,
										maxValue : 100,
										disabled : true,
										colspan : 4
									}, {
										xtype : 'label',
										id : 'slider_maxvalue15',
										colspan : 1
									},
									{
										xtype : 'label',

										text : ' ',
										margins : '0 0 0 10',
										colspan : 7
									},
									{
										xtype : 'label',

										text : '',
										margins : '0 0 0 10',
										colspan : 7
									},
									{
										xtype : 'label',

										text : '',
										margins : '0 0 0 10',
										colspan : 7
									}
							]
						})
			});

	rightpanel = new Ext.Panel(
			{
				title : 'Health Services',
				height : 330,
				id : 'extjsRightpanel',
				width : Ext.getBody().getViewSize().width / 2,
				monitorResize: true,
				frame : true,
				items : new Ext.form.FormPanel(
						{
							//width : '100%',
							bodyPadding : 7,
							defaults : {
								anchor : '100%',
								flex : 1,
								style : {
									padding : '3px'
								}
							},
							layout : {
								type : 'table',
								height : 300,
								columns : 7
							},
							frame : false,
							// layoutConfig: {columns:2},
							items : [
									{
										xtype : 'checkbox',
										id : 'checkbox21',
										labelSeparator : '',
										hideLabel : true,
										boxLabel : 'General Practice',
										fieldLabel : 'text',
										colspan : 12,
										
										checked : false,
										listeners : {
											change : {
												fn : function(checkbox, checked) {
													Ext.getCmp('combo21')
															//.setDisabled(!checked);
															.setDisabled(true);
													Ext.getCmp('slider21')
															.setDisabled(!checked);
													Ext
															.getCmp('slider_value21')
															.setDisabled(!checked);

												},
											}
										}

									},
									{
										xtype : 'label',
										text : 'No access to GP within:',
										margins : '0 0 0 10',
										colspan : 7
									},
									{
										xtype : "combo",
										id : 'combo21',
										hideLabel : true,
										value : org.aurin.demonstratortools.health.constants.operator.LESS_THAN,

										store : org.aurin.demonstratortools.health.model.operator_store,
										width : 40,
										disabled : true,
										hidden : true,
										colspan : 1
									},
									{
										xtype : "textfield",
										id : 'slider_value21',
										readOnly : true,
										width : 40,
										disabled : true,
										colspan : 1,
										value : 100
									},
									{
										xtype : 'slider',
										id : 'slider21',
										hideLabel : true,
										useTips : false,
										width : 214,
										value : 100,
										increment : 100,
										minValue : 100,
										maxValue : 1200,
										disabled : true,
										listeners : {
											change : function(select, thumb,
													newval, oldval) {
												Ext.getCmp("slider_value21")
														.setValue(thumb);
											}
										},
										colspan : 3
									},
									{
										xtype : 'label',
										id : 'slider_maxvalue21',
										colspan : 1
									},
									{
										xtype : 'label',
										text : 'Meter',
										margins : '0 0 0 10',
										colspan : 1
									},
									{
										xtype : 'component',
										fieldLabel : '&nbsp;',
										labelSeparator : ' ',
										colspan : 7
									},// ///////////
									{
										xtype : 'label',

										text : 'Which has:',
										margins : '0 0 0 10',
										colspan : 7
									},
									{
										xtype : 'checkbox',
										id : 'checkbox22',
										labelSeparator : '',
										hideLabel : true,
										boxLabel : 'Bulk billing and fee based service',
										fieldLabel : 'text',
										colspan : 7,
										checked : false

									},
									{
										xtype : 'checkbox',
										id : 'checkbox23',
										labelSeparator : '',
										hideLabel : true,
										boxLabel : 'Bulk billing only',
										fieldLabel : 'text',
										colspan : 7,
										checked : false

									},
									{
										xtype : 'checkbox',
										id : 'checkbox24',
										labelSeparator : '',
										hideLabel : true,
										boxLabel : 'Fee only',
										fieldLabel : 'text',
										colspan : 7,
										checked : false

									},
									{
										xtype : 'component',
										fieldLabel : '&nbsp;',
										labelSeparator : ' ',
										colspan : 7
									},// //////////////////

									{
										xtype : 'label',

										text : 'After Hours Services:',
										margins : '0 0 0 10',
										colspan : 7
									},
									{
										xtype : 'checkbox',
										id : 'checkbox25',
										labelSeparator : '',
										hideLabel : true,
										boxLabel : 'After 5 up until 8 PM on weekdays',
										fieldLabel : 'text',
										colspan : 4,
										checked : false

									},
									{
										xtype : 'checkbox',
										id : 'checkbox26',
										labelSeparator : '',
										hideLabel : true,
										boxLabel : 'After 8 PM on weekdays',
										fieldLabel : 'text',
										colspan : 3,
										checked : false

									},
									{
										xtype : 'checkbox',
										id : 'checkbox27',
										labelSeparator : '',
										hideLabel : true,
										boxLabel : 'Any Saturday service after 12 noon',
										fieldLabel : 'text',
										colspan : 4,
										checked : false

									},
									{
										xtype : 'checkbox',
										id : 'checkbox28',
										labelSeparator : '',
										hideLabel : true,
										boxLabel : 'Any Sunday service',
										fieldLabel : 'text',
										colspan : 3,
										checked : false

									},
									{
										xtype : 'component',
										fieldLabel : '&nbsp;',
										labelSeparator : ' ',
										colspan : 7
									},// //////////
									{
										xtype : 'checkbox',
										id : 'checkbox29',
										labelSeparator : '',
										hideLabel : true,
										boxLabel : 'Community Health Centre',
										fieldLabel : 'text',
										colspan : 7,
										checked : false,
										hidden : false,
										disabled: true

									},
									{
										xtype : 'component',
										fieldLabel : '&nbsp;',
										labelSeparator : ' ',
										colspan : 7
									},// //////////
									{
										xtype : 'checkbox',
										id : 'checkbox30',
										labelSeparator : '',
										hideLabel : true,
										boxLabel : 'Mental Health Service Provider',
										fieldLabel : 'text',
										colspan : 7,
										checked : false,
										hidden : false,
										disabled: true

									},
									{
										xtype : 'label',

										text : '',
										margins : '0 0 0 10',
										colspan : 7
									},
									{
										xtype : 'label',

										text : '',
										margins : '0 0 0 10',
										colspan : 7
									}
									]
						})
			});
			
	org.aurin.demonstratortools.health.mainPanel = Ext.create(
			'Ext.Panel', {
				region: 'north',
				collapsible: true,
			//	id : 'recordWindow',
				// renderTo: 'maindiv',
				title : 'Health Demonstrator Tool',
				resizable : false,
				//closable : true,
				width : '100%',
				//height : 300,
				align : 'center',
				minWidth : 400,
				  //	minHeight: 500,
				layout : {
					type : 'table',
					columns : 2
				},

				plain : true,
				modal : true,

				items : [ leftpanel, rightpanel, window['mapPanel']],
				
				buttons : [ {
					text : 'Run',
					handler : function(w) {
						org.aurin.demonstratortools.health.run();
					}
				} ]
			});
		 
			//
			VIEWPORT = Ext.create('Ext.container.Viewport', {
			layout: 'border',
			items: [ org.aurin.demonstratortools.health.mainPanel
			,
			{			 	
				xtype:'panel',
				region: 'center',
				 layout : 'fit',
				items:[
				{
					xtype : "component",				 
					 id    : 'iframe-window',
					height: 370,
					autoEl : {
						tag : "iframe",
						src : "map.html"
					
					}
				}
				]	
			 
			}
			
			
			 ]
		});	
			//

	org.aurin.demonstratortools.health.fetchMetricsConfiguration = function(
			_callback) {

		var _url = 'fetchMetricsConfiguration.json';
		Ext.Ajax
				.request({
					url : _url,
					success : function(data, options) {
						console.log(data)

						if (data != null && data != undefined) {
							if (data.responseText != null
									&& data.responseText != undefined) {
								var _responseObj = Ext
										.decode(data.responseText);
								/*for SEIFA_METRIC slider*/
								Ext
										.getCmp('slider11')
										.setMaxValue(
												(_responseObj[org.aurin.demonstratortools.health.constants.UIOutputModel.SEIFA_METRIC_MAX]-_responseObj[org.aurin.demonstratortools.health.constants.UIOutputModel.SEIFA_METRIC_MIN])/_responseObj[org.aurin.demonstratortools.health.constants.UIOutputModel.SEIFA_METRIC_INTERVAL]);
								Ext
										.getCmp('slider11')
										.setValue(
												(_responseObj[org.aurin.demonstratortools.health.constants.UIOutputModel.SEIFA_METRIC_MAX]-_responseObj[org.aurin.demonstratortools.health.constants.UIOutputModel.SEIFA_METRIC_MIN])/_responseObj[org.aurin.demonstratortools.health.constants.UIOutputModel.SEIFA_METRIC_INTERVAL]);
								Ext
										.getCmp('slider11')
										.addListener('change', function(select, thumb, newval, oldval) {
											Ext 
												.getCmp("slider_value11") 
												.setValue(_responseObj[org.aurin.demonstratortools.health.constants.UIOutputModel.SEIFA_METRIC_MIN]+thumb/1);
										});
								
								Ext
										.getCmp('slider_maxvalue11')
										.setText(
												_responseObj[org.aurin.demonstratortools.health.constants.UIOutputModel.SEIFA_METRIC_MAX]);
								
								/*for TYPE2_DIABETES slider*/
								Ext
										.getCmp('slider12')
										.setMaxValue(
												(_responseObj[org.aurin.demonstratortools.health.constants.UIOutputModel.TYPE2_DIABETES_MAX]-_responseObj[org.aurin.demonstratortools.health.constants.UIOutputModel.TYPE2_DIABETES_MIN])/_responseObj[org.aurin.demonstratortools.health.constants.UIOutputModel.TYPE2_DIABETES_INTERVAL]);
								Ext
										.getCmp('slider12')
										.setValue(
										(_responseObj[org.aurin.demonstratortools.health.constants.UIOutputModel.TYPE2_DIABETES_MAX]-_responseObj[org.aurin.demonstratortools.health.constants.UIOutputModel.TYPE2_DIABETES_MIN])/_responseObj[org.aurin.demonstratortools.health.constants.UIOutputModel.TYPE2_DIABETES_INTERVAL]);
	
								Ext
										.getCmp('slider12')
										.addListener('change', function(select, thumb, newval, oldval) {
											Ext 
											.getCmp("slider_value12") 
											.setValue(_responseObj[org.aurin.demonstratortools.health.constants.UIOutputModel.TYPE2_DIABETES_MIN]+thumb/10.0);
										});
								
								Ext
										.getCmp('slider_maxvalue12')
										.setText(
												_responseObj[org.aurin.demonstratortools.health.constants.UIOutputModel.TYPE2_DIABETES_MAX]);
								
								/*for Depression slider*/
								Ext
										.getCmp('slider13')
										.setMaxValue(
												(_responseObj[org.aurin.demonstratortools.health.constants.UIOutputModel.DEPRESSION_MAX]-_responseObj[org.aurin.demonstratortools.health.constants.UIOutputModel.DEPRESSION_MIN])/_responseObj[org.aurin.demonstratortools.health.constants.UIOutputModel.DEPRESSION_INTERVAL]);
								Ext
										.getCmp('slider13')
										.setValue(
										(_responseObj[org.aurin.demonstratortools.health.constants.UIOutputModel.DEPRESSION_MAX]-_responseObj[org.aurin.demonstratortools.health.constants.UIOutputModel.DEPRESSION_MIN])/_responseObj[org.aurin.demonstratortools.health.constants.UIOutputModel.DEPRESSION_INTERVAL]);
								
								Ext
										.getCmp('slider13')
										.addListener('change', function(select, thumb, newval, oldval) {
											Ext 
											.getCmp("slider_value13") 
											.setValue(_responseObj[org.aurin.demonstratortools.health.constants.UIOutputModel.DEPRESSION_MIN]+thumb/10.0);
										});
								
								Ext
										.getCmp('slider_maxvalue13')
										.setText(
												_responseObj[org.aurin.demonstratortools.health.constants.UIOutputModel.DEPRESSION_MAX]);

								/*for OBESITY slider*/
								Ext
										.getCmp('slider14')
										.setMaxValue(
												(_responseObj[org.aurin.demonstratortools.health.constants.UIOutputModel.OBESITY_MAX]-_responseObj[org.aurin.demonstratortools.health.constants.UIOutputModel.OBESITY_MIN])/_responseObj[org.aurin.demonstratortools.health.constants.UIOutputModel.OBESITY_INTERVAL]);
								Ext
										.getCmp('slider14')
										.setValue(
										(_responseObj[org.aurin.demonstratortools.health.constants.UIOutputModel.OBESITY_MAX]-_responseObj[org.aurin.demonstratortools.health.constants.UIOutputModel.OBESITY_MIN])/_responseObj[org.aurin.demonstratortools.health.constants.UIOutputModel.OBESITY_INTERVAL]);
		
								Ext
										.getCmp('slider14')
										.addListener('change', function(select, thumb, newval, oldval) {
											Ext 
											.getCmp("slider_value14") 
											.setValue(_responseObj[org.aurin.demonstratortools.health.constants.UIOutputModel.OBESITY_MIN]+thumb/10.0);
										});
								Ext
										.getCmp('slider_maxvalue14')
										.setText(
												_responseObj[org.aurin.demonstratortools.health.constants.UIOutputModel.OBESITY_MAX]);
								/*for SMOKING slider*/
								Ext
										.getCmp('slider15')
										.setMaxValue(
												(_responseObj[org.aurin.demonstratortools.health.constants.UIOutputModel.SMOKING_MAX]-_responseObj[org.aurin.demonstratortools.health.constants.UIOutputModel.SMOKING_MIN])/_responseObj[org.aurin.demonstratortools.health.constants.UIOutputModel.SMOKING_INTERVAL]);
								Ext
										.getCmp('slider15')
										.setValue(
												(_responseObj[org.aurin.demonstratortools.health.constants.UIOutputModel.SMOKING_MAX]-_responseObj[org.aurin.demonstratortools.health.constants.UIOutputModel.SMOKING_MIN])/_responseObj[org.aurin.demonstratortools.health.constants.UIOutputModel.SMOKING_INTERVAL]);
								Ext
										.getCmp('slider15')
										.addListener('change', function(select, thumb, newval, oldval) {
											Ext 
											.getCmp("slider_value15") 
											.setValue(_responseObj[org.aurin.demonstratortools.health.constants.UIOutputModel.SMOKING_MIN]+thumb/10.0);
										});
								Ext
										.getCmp('slider_maxvalue15')
										.setText(
												_responseObj[org.aurin.demonstratortools.health.constants.UIOutputModel.SMOKING_MAX]);

								Ext
										.getCmp('slider21')
										.setMaxValue(
												_responseObj[org.aurin.demonstratortools.health.constants.UIOutputModel.NO_ACCESS_TO_GENERAL_PRACTICE]);
								Ext
										.getCmp('slider_maxvalue21')
										.setText(
												_responseObj[org.aurin.demonstratortools.health.constants.UIOutputModel.NO_ACCESS_TO_GENERAL_PRACTICE]);

								_callback();
							}
						}

					},
					failure : function(response, options) {
						new Ext.Window({
							minHeight : '600px',
							width : '50%',
							id : 'messagewindowid',
							// x: 0,
							// y: 30,
							layout : "fit",
							html : response.responseText
						}) 
					}
				});
	}
	org.aurin.demonstratortools.health.fetchMetricsConfiguration(function() {
		//  org.aurin.demonstratortools.health.mainPanel.show();
	});

	org.aurin.demonstratortools.health.run = function() {
		
		var waitingMsg = Ext.MessageBox.wait('Please wait unill the map is refreshed.','Performing Analysis');
		
		var _url2 = generateURL("service/health-filter/runAnalysis");
		var _UIParams = org.aurin.demonstratortools.health
				.prepareUIParameteres();
		var _encodedUIParams = Ext.encode(_UIParams);
		Ext.Ajax.request({
			url : _url2,
			method : 'post',
			waitMsg : 'Saving changes...',
			jsonData : {
				'params' : _encodedUIParams
			},
			callback: function() { 
				Ext.getDom('iframe-window').src = Ext.getDom('iframe-window').src;
				waitingMsg.hide();
				}
		});
		//Ext.getDom('iframe-window').src = Ext.getDom('iframe-window').src
	}

}

Ext.onReady(function() {
	org.aurin.demonstratortools.health.init();
	org.aurin.demonstratortools.health.mainUI();
});

Ext.EventManager.onWindowResize(function(){
	Ext.getCmp("extjsLeftpanel").setWidth(Ext.getBody().getViewSize().width/2);
	Ext.getCmp("extjsRightpanel").setWidth(Ext.getBody().getViewSize().width/2);
});
