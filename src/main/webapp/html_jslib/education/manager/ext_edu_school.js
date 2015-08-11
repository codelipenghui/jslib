Ext.application({
    name   : 'School',
    launch : function() {
        /** -------------------------------------数据源区------------------------------------- */
        /** 学校数据源 */
        var store_school_grid = Ext.create("Ext.data.Store", {
            model: "SchoolBean",
            pageSize : 15,
            proxy: {
                type: "ajax",
                url: "../school/getSchoolList_grid.do",
                reader : {root : "dataArray", totalProperty : "totalSize"},
                extraParams : {"keyWord" : "", "regionId" : 0, "schoolType": null, "schoolLevel" : null}
            },
            remoteSort :true,
            autoLoad: true
        });
        /** 区域数据源 */
        var store_regionTree = Ext.create("Ext.data.TreeStore", {
            model: "RegionTreeBean",
            nodeParam: "regionId",
            proxy: {
                type: "ajax",
                url: "../region/getRegionTreeAllByParentId.do"
            },
            root: { id: "-1", text: "请选择区域",regionId: "-1", regionName: "请选择区域", expanded: true },
            autoLoad: true
        });

        /** -------------------------------------视图区------------------------------------- */
        /** 学校列表 */
        var grid_school_list = Ext.create("Ext.grid.Panel", {
            store : store_school_grid,
            renderTo : "grid_school_div",
            stateful : false,
            collapsible : false,
            multiSelect : false,
            stateId : "stateGrid",
            header:false,
            height : 515,
            iconCls : "ext-grid-icon-cls",
            scroll : true,
            border: true,
            resizable: true,
            viewConfig : {
                stripeRows : true,
                enableTextSelection : true
            },
            columns : [
                {text : "序号", width : "5%", minWidth: 50, resizable: true, align : "center", sortable: false, xtype : "rownumberer"},
                {text : "学校名称", width : "20%", minWidth: 200, resizable: true, align : "left", sortable: true, dataIndex : "schoolName"},
                {text : "简称", width : "20%", minWidth: 200, resizable: true, align : "left", sortable: true, dataIndex : "shortName"},
                {text : "类型", width : "10%", minWidth: 100, resizable: true, align : "center", sortable: true, dataIndex : "schoolType", renderer: renderer_school_type},
                {text : "级别", width : "10%", minWidth: 100, resizable: true, align : "center", sortable: true, dataIndex : "schoolLevel", renderer: renderer_school_level},
                {text : "地址", width : "34%", minWidth: 350, resizable: true, align : "left", sortable: true, dataIndex : "address"}
            ],
            /**顶部工具栏*/
            tbar : new Ext.Toolbar({
                height : 35,
                items : [
                    { width : "1%", disabled : true, xtype: "label"},
                    { text : "新增", width:'6%', minWidth:60, id : "createButton", disabled : false, height : 25, glyph: Icon.BUTTON_ADD, handler : school_addHandler}, "-",
                    { text : "修改", width:'6%', minWidth:60, id : "updateButton", disabled : true, height : 25, glyph: Icon.BUTTON_EDIT, handler : school_updateHandler}, "-",
                    { text : "删除", width:'6%', minWidth:60, id : "deleteButton", disabled : true, height : 25, glyph: Icon.BUTTON_DELETE, handler : school_deleteHandler}, "-",
                    { width: "30%", minWidth: 300, disabled: true, xtype: "label"},
                    { width: '10%', minWidth: 100, id: "param_school_type", xtype: "combobox", store: store_school_type, displayField: "display", valueField: "value", queryMode: "local", forceSelection: true, editable: false, emptyText: "学校类型" },
                    { width: '10%', minWidth: 100, id: "param_school_level", xtype: "combobox", store: store_school_level, displayField: "display", valueField: "value", queryMode: "local", forceSelection: true, editable: false, emptyText: "学校级别" },
                    { id: "param_keyword" ,width: '15%', minWidth: 150,  xtype: "textfield", emptyText: "关键字" },
                    { width: '6%', minWidth: 60,  text: "查询", handler: schoolList_refreshHandler, glyph: Icon.BUTTON_SEARCH}
                ]
            }),
            /**底部工具栏*/
            bbar : Ext.create("Ext.PagingToolbar", {
                store : store_school_grid,
                displayInfo : true,
                displayMsg : "当前显示{0} - {1}条，共 {2} 条记录",
                emptyMsg : "当前没有任何记录"
            }),
            /** 控制按钮可用不可用*/
            listeners : {
                selectionchange : function(thiz, selected, eOpts) {
                    if (selected.length > 0) {
                        Ext.getCmp("updateButton").enable();
                        Ext.getCmp("deleteButton").enable();
                    } else {
                        Ext.getCmp("updateButton").disable();
                        Ext.getCmp("deleteButton").disable();
                    }
                }
            }
        });

        /**
         * 学校 - 编辑formPanel
         */
        var form_schoolDetail = Ext.create("Ext.form.Panel", {
            bodyPadding: 20,
            bodyBorder: false,
            frame: false,
            fieldDefaults: { labelAlign: "right", labelWidth: 70, anchor: "100%" },
            items: [
                {id: "hidden_school_id", xtype: "hidden", name: "schoolId" },
                {id: "picker_region", xtype: "treepicker", name: "regionId",    fieldLabel: "区域", allowBlank: false, store: store_regionTree, invalidText: "请选择区域！", forceSelection: true, editable: false, displayField: "text", valueField: "id"},
                {xtype: 'container', layout:'column', items: [
                    { xtype: 'container', columnWidth:.5, layout: 'anchor', items: [
                        {id: "text_schoolName",  xtype: "textfield", name: "schoolName", fieldLabel: "学校名称", allowBlank: false, emptyText: "请输入学校名称", invalidText: "请输入正确的学校名称！", maxLength: 200}
                    ]},
                    { xtype: 'container', columnWidth:.5, layout: 'anchor', items: [
                        {id: "text_shortName",  xtype: "textfield", name: "shortName", fieldLabel: "学校简称", allowBlank: false, emptyText: "请输入学校简称", invalidText: "请输入正确的学校简称！", maxLength: 200}
                    ]}
                ]},
                {xtype: 'container', layout:'column', items: [
                    { xtype: 'container', columnWidth:.5, layout: 'anchor', items: [
                        {id: "combo_schoolType", xtype: "combobox", name: "schoolType", fieldLabel: "学校类型", store: store_school_type_edit, displayField: "display", valueField: "value", queryMode: "local", forceSelection: true, editable: false, allowBlank: false, emptyText: "选择学校类型"}
                    ]},
                    { xtype: 'container', columnWidth:.5, layout: 'anchor', items: [
                        {id: "combo_schoolLevel", xtype: "combobox", name: "schoolLevel", fieldLabel: "学校级别", store: store_school_level_edit, displayField: "display", valueField: "value", queryMode: "local", forceSelection: true, editable: false, allowBlank: false, emptyText: "选择学校级别"}
                    ]}
                ]},
                {xtype: 'container', layout:'column', items: [
                    { xtype: 'container', columnWidth:.5, layout: 'anchor', items: [
                        {id: "number_longitude",  xtype: "numberfield", decimalPrecision: 10, name: "longitude", fieldLabel: "经度", allowBlank: false, emptyText: "请输入经度", invalidText: "请输入正确的经度！"}
                    ]},
                    { xtype: 'container', columnWidth:.5, layout: 'anchor', items: [
                        {id: "number_latitude",  xtype: "numberfield", decimalPrecision: 10, name: "latitude", fieldLabel: "纬度", allowBlank: false, emptyText: "请输入纬度", invalidText: "请输入正确的纬度！"}
                    ]}
                ]},
                {id: "text_address",  xtype: "textarea", name: "address", fieldLabel: "地址", allowBlank: false, emptyText: "请输入地址", invalidText: "请输入正确的地址！", maxLength: 200},
                {id: "text_description",  xtype: "textarea", name: "description", fieldLabel: "备注", allowBlank: true, invalidText: "请输入正确的备注！", maxLength: 200}
            ]
        });

        /**
         * 学校 - 编辑窗口显示
         */
        var window_schoolDetail = Ext.create("Ext.window.Window", {
            width : 570,
            modal : true,
            closable : true,
            closeAction : "hide",
            resizable : true,
            layout : "fit",
            dock: "bottom",
            items : [
                form_schoolDetail
            ],
            glyph: Icon.FUNCTION_SETUP,
            buttonAlign : "right",
            buttons: [
                { text: "关闭", glyph: Icon.BUTTON_CLOSE, cls: 'btn-danger', handler: function(){ window_schoolDetail.hide(); } },
                { text: "提交", glyph: Icon.BUTTON_SUBMIT, cls: 'btn-success', handler: function(){ school_submitHandler(); } }
            ]
        });

        /** -------------------------------------按钮事件方法区------------------------------------- */

        /** 学校新增 */
        function school_addHandler(){
            form_schoolDetail.getForm().reset();
            window_schoolDetail.setTitle("新增学校");
            window_schoolDetail.show();
        }

        /** 学校修改 */
        function school_updateHandler(){
            if (grid_school_list.getSelectionModel().hasSelection()){
                var record = grid_school_list.getSelectionModel().getSelection()[0];
                form_schoolDetail.getForm().loadRecord(record);
                window_schoolDetail.setTitle("修改学校");
                window_schoolDetail.show();
            }else{
                Notify('请选择数据再操作', 'top-right', '5000', 'warning', 'fa-warning', true)
            }
        }

        /** 学校删除 */
        function school_deleteHandler(){
            if (grid_school_list.getSelectionModel().hasSelection()) {
                var record = grid_school_list.getSelectionModel().getSelection()[0];
                liming.message_question("是否确定删除？",function(){
                    $.post("../school/deleteEntity.do", {
                        schoolId: record.data.schoolId
                    }, function(data){
                        if (data.success) {
                            Notify(data.msg, 'top-right', '5000', 'success', 'fa-check', true);
                            schoolList_refreshHandler();
                        } else {
                            Notify(data.msg, 'top-right', '5000', 'danger', 'fa-bolt', true);
                            schoolList_refreshHandler();
                        }
                    });
                })
            }else{
                Notify('请选择数据再操作', 'top-right', '5000', 'warning', 'fa-warning', true)
            }
        }

        /** 学校提交 */
        function school_submitHandler(){
            if (!Ext.getCmp("picker_region").isValid() || Ext.getCmp("picker_region").getValue() <= 0) {
                Notify(Ext.getCmp("picker_region").invalidText, 'top-right', '5000', 'danger', 'fa-bolt', true);
            } else if (!Ext.getCmp("text_schoolName").isValid()) {
                Notify(Ext.getCmp("text_schoolName").invalidText, 'top-right', '5000', 'danger', 'fa-bolt', true);
            } else if (!Ext.getCmp("text_shortName").isValid()) {
                Notify(Ext.getCmp("text_shortName").invalidText, 'top-right', '5000', 'danger', 'fa-bolt', true);
            } else if (!Ext.getCmp("combo_schoolType").isValid()) {
                Notify(Ext.getCmp("combo_schoolType").invalidText, 'top-right', '5000', 'danger', 'fa-bolt', true);
            } else if (!Ext.getCmp("combo_schoolLevel").isValid()){
                Notify(Ext.getCmp("combo_schoolLevel").invalidText, 'top-right', '5000', 'danger', 'fa-bolt', true);
            } else if (!Ext.getCmp("text_address").isValid()){
                Notify(Ext.getCmp("text_address").invalidText, 'top-right', '5000', 'danger', 'fa-bolt', true);
            } else {
                $.post("../school/createOrUpdate.do",{
                    schoolId : Ext.getCmp("hidden_school_id").getValue(),
                    schoolName : Ext.getCmp("text_schoolName").getValue(),
                    shortName : Ext.getCmp("text_shortName").getValue(),
                    address : Ext.getCmp("text_address").getValue(),
                    schoolType : Ext.getCmp("combo_schoolType").getValue(),
                    schoolLevel : Ext.getCmp("combo_schoolLevel").getValue(),
                    description : Ext.getCmp("text_description").getValue(),
                    longitude: Ext.getCmp("number_longitude").getValue(),
                    latitude: Ext.getCmp("number_latitude").getValue(),
                    regionId: Ext.getCmp("picker_region").getValue()
                },function(data){
                    if (data.success) {
                        window_schoolDetail.hide();
                        Notify(data.msg, 'top-right', '5000', 'success', 'fa-check', true);
                        schoolList_refreshHandler();
                    } else {
                        Notify(data.msg, 'top-right', '5000', 'danger', 'fa-bolt', true);
                    }
                })
            }
        }

        /** 学校类型类型列渲染 */
        function renderer_school_type(value, cellmeta, record){
            var type = record.data.schoolType;
            var types = store_school_type.data.items;
            for (var i = 0; i < types.length; i++){
                if (type == types[i].data.value){
                    return types[i].data.display;
                }
            }
        }

        /** 学校级别类型列渲染 */
        function renderer_school_level(value, cellmeta, record){
            var type = record.data.schoolLevel;
            var types = store_school_level.data.items;
            for (var i = 0; i < types.length; i++){
                if (type == types[i].data.value){
                    return types[i].data.display;
                }
            }
        }

        /** 学校列表刷新 */
        function schoolList_refreshHandler(){
            var schoolType = Ext.getCmp("param_school_type").getValue();
            var schoolLevel = Ext.getCmp("param_school_level").getValue();
            var keyWord = Ext.getCmp("param_keyword").getValue();
            store_school_grid.proxy.extraParams = {"schoolType" : schoolType, "schoolLevel" : schoolLevel, "keyWord" : encodeURIComponent(keyWord)};
            store_school_grid.currentPage = 1;
            store_school_grid.load();
        }

        window.onresize= function(){
            grid_school_list.setWidth(0);
            grid_school_list.setWidth(Ext.get("grid_school_div").getWidth());
        }
    }
});