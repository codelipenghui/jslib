Ext.application({
    name: "room",
    launch: function () {

        /** -------------------------------------数据源区------------------------------------- */

        /** 学校数据源 */
        var store_school_grid = Ext.create("Ext.data.Store", {
            model: "SchoolBean",
            pageSize : 0,
            proxy: {
                type: "ajax",
                url: "../school/getSchoolList_grid.do",
                reader : {root : "dataArray", totalProperty : "totalSize"},
                extraParams : {"keyWord" : "", "regionId" : 0, "schoolType": null, "schoolLevel" : null, limit: 0, page: 1}
            },
            autoLoad: true
        });

        /** 教学楼数据源 */
        var store_buildTree = Ext.create("Ext.data.TreeStore", {
            model: "BuildBean",
            proxy: {
                type: "ajax",
                url: "../build/getTreeList.do",
                extraParams : {"schoolId" : 0}
            },
            autoLoad: true
        });

        /** 教室数据源 */
        var store_room_grid = Ext.create("Ext.data.Store", {
            model: "RoomBean",
            pageSize : 15,
            proxy: {
                type: "ajax",
                url: "../room/getRoomList_grid.do",
                reader : {root : "dataArray", totalProperty : "totalSize"},
                extraParams : {"keyWord" : "", "schoolId" : 0, "buildId": 0, "floorNumber" : null}
            },
            remoteSort :true,
            autoLoad: true
        });

        /** -------------------------------------视图区------------------------------------- */
        var tree_buildList = Ext.create("Ext.tree.Panel", {
            store: store_buildTree,
            renderTo: "grid_build_div",
            stateful: false,
            collapsible: false,
            multiSelect: false,
            stateId: "stateGrid",
            height: 515,
            minWidth: 200,
            header: false,
            iconCls: "ext-grid-icon-cls",
            rootVisible: false,
            columns: [
                { text: "名称", minWidth: 200, width: "98%", align: "left",   dataIndex: "name", sortable: false, xtype: "treecolumn" }
            ],
            tbar: new Ext.Toolbar({
                height: 35,
                layout: { type: "hbox", pack: "center", align: "middle" },
                items: [
                    { id: "param_schoolId", xtype: "combobox", emptyText: "选择学校查询...", editable: false, store: store_school_grid, displayField: "schoolName", valueField: "schoolId", value: 0, listeners: { select: function(record){ school_select_handler() } } },
                    { text : "新增",  disabled : false, height : 25, glyph: Icon.BUTTON_ADD, handler : build_addHandler},
                ]
            }),
            listeners: {
                select: function(record){
                    build_select_handler(record);
                }
            },
            viewConfig: {
                stripeRows: true,
                listeners: {
                    itemcontextmenu: function(view, record, node, index, e){
                        if (record) {
                            Ext.getCmp("menu_buildUpdate").enable();
                            Ext.getCmp("menu_buildDelete").enable();
                        } else {
                            Ext.getCmp("menu_buildUpdate").disable();
                            Ext.getCmp("menu_buildlDelete").disable();
                        }
                        e.stopEvent();
                        menu_buildTree.showAt(e.getXY());
                        return false;
                    }
                }
            }
        });

        var menu_buildTree = Ext.create("Ext.menu.Menu", {
            items: [
                { text : "新增", id : "menu_buildCreate", disabled : false, height : 25, glyph: Icon.BUTTON_ADD, handler : build_addHandler},
                { text : "修改", id : "menu_buildUpdate", disabled : true, height : 25, glyph: Icon.BUTTON_EDIT, handler : build_updateHandler},
                { text : "删除", id : "menu_buildDelete", disabled : true, height : 25, glyph: Icon.BUTTON_DELETE, handler : build_deleteHandler}
            ]
        });

        /**
         * 教学楼 - 编辑formPanel
         */
        var form_buildDetail = Ext.create("Ext.form.Panel", {
            bodyPadding: 20,
            bodyBorder: false,
            frame: false,
            fieldDefaults: { labelAlign: "right", labelWidth: 70, anchor: "100%" },
            items: [
                {id: "hidden_build_id", xtype: "hidden", name: "buildId" },
                {id: "combo_schoolId", xtype: "combobox", name: "schoolId", fieldLabel: "学校", allowBlank: false, store: store_school_grid, invalidText: "请选择学校！", forceSelection: true, editable: false, displayField: "schoolName", valueField: "schoolId"},
                {xtype: 'container', layout:'column', items: [
                    { xtype: 'container', columnWidth:.5, layout: 'anchor', items: [
                        {id: "text_buildName",  xtype: "textfield", name: "buildName", fieldLabel: "教学楼名称", allowBlank: false, emptyText: "请输入教学楼名称", invalidText: "请输入正确的教学楼名称！", maxLength: 200}
                    ]},
                    { xtype: 'container', columnWidth:.5, layout: 'anchor', items: [
                        {id: "number_floorTotal",  xtype: "numberfield", decimalPrecision: 0, name: "floorTotal", fieldLabel: "楼层数", allowBlank: false, emptyText: "请输入楼层数", invalidText: "请输入正确的楼层数！"}
                    ]}
                ]},
                {id: "text_description",  xtype: "textarea", name: "description", fieldLabel: "备注", allowBlank: true, invalidText: "请输入正确的备注！", maxLength: 200}
            ]
        });

        /**
         * 教学楼 - 编辑窗口显示
         */
        var window_buildDetail = Ext.create("Ext.window.Window", {
            width : 570,
            modal : true,
            closable : true,
            closeAction : "hide",
            resizable : true,
            layout : "fit",
            dock: "bottom",
            items : [
                form_buildDetail
            ],
            glyph: Icon.FUNCTION_SETUP,
            buttonAlign : "right",
            buttons: [
                { text: "关闭", glyph: Icon.BUTTON_CLOSE, cls: 'btn-danger', handler: function(){ window_buildDetail.hide(); } },
                { text: "提交", glyph: Icon.BUTTON_SUBMIT, cls: 'btn-success', handler: function(){ build_submitHandler() } }
            ]
        });

        /** 教室列表 */
        var grid_room_list = Ext.create("Ext.grid.Panel", {
            store : store_room_grid,
            renderTo : "grid_room_div",
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
                {text : "教室名称", width : "25%", minWidth: 100, resizable: true, align : "left", sortable: true, dataIndex : "roomName"},
                {text : "教室编号", width : "25%", minWidth: 100, resizable: true, align : "left", sortable: true, dataIndex : "roomCode"},
                {text : "教学楼", width : "23%", minWidth: 100, resizable: true, align : "left", sortable: true, dataIndex : "buildName"},
                {text : "楼层", width : "20%", minWidth: 100, resizable: true, align : "center", sortable: true, dataIndex : "floorNumber"}
            ],
            /**顶部工具栏*/
            tbar : new Ext.Toolbar({
                height : 35,
                items : [
                    { width : "1%", disabled : true, xtype: "label"},
                    { text : "新增", width:'6%', minWidth:60, id : "createButton", disabled : false, height : 25, glyph: Icon.BUTTON_ADD, handler : room_addHandler}, "-",
                    { text : "修改", width:'6%', minWidth:60, id : "updateButton", disabled : true, height : 25, glyph: Icon.BUTTON_EDIT, handler : room_updateHandler}, "-",
                    { text : "删除", width:'6%', minWidth:60, id : "deleteButton", disabled : true, height : 25, glyph: Icon.BUTTON_DELETE, handler : room_deleteHandler}, "-",
                    { width: "30%", minWidth: 300, disabled: true, xtype: "label"},
                    { id: "param_keyword" ,width: '15%', minWidth: 150,  xtype: "textfield", emptyText: "关键字" },
                    { width: '6%', minWidth: 60,  text: "查询", handler: "", glyph: Icon.BUTTON_SEARCH}
                ]
            }),
            /**底部工具栏*/
            bbar : Ext.create("Ext.PagingToolbar", {
                store : store_room_grid,
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
         * 教室 - 编辑formPanel
         */
        var form_roomDetail = Ext.create("Ext.form.Panel", {
            bodyPadding: 20,
            bodyBorder: false,
            frame: false,
            fieldDefaults: { labelAlign: "right", labelWidth: 70, anchor: "100%" },
            items: [
                {id: "hidden_room_build_id", xtype: "hidden", name: "buildId" },
                {xtype: 'container', layout:'column', items: [
                    { xtype: 'container', columnWidth:.5, layout: 'anchor', items: [
                        {id: "text_roomName",  xtype: "textfield", name: "roomName", fieldLabel: "教室名称", allowBlank: false, emptyText: "请输入教室名称", invalidText: "请输入正确的教室名称！", maxLength: 200}
                    ]},
                    { xtype: 'container', columnWidth:.5, layout: 'anchor', items: [
                        {id: "text_roomCode",  xtype: "textfield", name: "roomCode", fieldLabel: "教室编号", allowBlank: false, emptyText: "请输入教室编号", invalidText: "请输入正确的教室编号！", maxLength: 200}
                    ]}
                ]},
                {id: "text_room_description",  xtype: "textarea", name: "description", fieldLabel: "备注", allowBlank: true, invalidText: "请输入正确的备注！", maxLength: 200}
            ]
        });

        /**
         * 教室 - 编辑窗口显示
         */
        var window_roomDetail = Ext.create("Ext.window.Window", {
            width : 570,
            modal : true,
            closable : true,
            closeAction : "hide",
            resizable : true,
            layout : "fit",
            dock: "bottom",
            items : [
                form_roomDetail
            ],
            glyph: Icon.FUNCTION_SETUP,
            buttonAlign : "right",
            buttons: [
                { text: "关闭", glyph: Icon.BUTTON_CLOSE, cls: 'btn-danger', handler: function(){ window_roomDetail.hide(); } },
                { text: "提交", glyph: Icon.BUTTON_SUBMIT, cls: 'btn-success', handler: function(){ room_submitHandler()  } }
            ]
        });

        /** -------------------------------------按钮事件方法区------------------------------------- */
        /** 教学楼新增 */
        function build_addHandler(){
            form_buildDetail.getForm().reset();
            window_buildDetail.setTitle("新增教学楼");
            window_buildDetail.show();
        }

        /** 教学楼修改 */
        function build_updateHandler(){
            if (tree_buildList.getSelectionModel().hasSelection()){
                var record = tree_buildList.getSelectionModel().getSelection()[0];
                form_buildDetail.getForm().loadRecord(record);
                window_buildDetail.setTitle("修改教学楼");
                window_buildDetail.show();
            }else{
                Notify('请选择数据再操作', 'top-right', '5000', 'warning', 'fa-warning', true)
            }
        }

        /** 教学楼删除 */
        function build_deleteHandler(){
            if (tree_buildList.getSelectionModel().hasSelection()) {
                var record = tree_buildList.getSelectionModel().getSelection()[0];
                liming.message_question("是否确定删除？",function(){
                    $.post("../build/deleteEntity.do", {
                        buildId: record.data.buildId
                    }, function(data){
                        if (data.success) {
                            Notify(data.msg, 'top-right', '5000', 'success', 'fa-check', true);
                            buildList_refreshHandler();
                        } else {
                            Notify(data.msg, 'top-right', '5000', 'danger', 'fa-bolt', true);
                            buildList_refreshHandler();
                        }
                    });
                })
            }else{
                Notify('请选择数据再操作', 'top-right', '5000', 'warning', 'fa-warning', true)
            }
        }

        /** 教学楼提交 */
        function build_submitHandler(){
            if (!Ext.getCmp("combo_schoolId").isValid()) {
                Notify(Ext.getCmp("combo_schoolId").invalidText, 'top-right', '5000', 'danger', 'fa-bolt', true);
            } else if (!Ext.getCmp("text_buildName").isValid()) {
                Notify(Ext.getCmp("text_buildName").invalidText, 'top-right', '5000', 'danger', 'fa-bolt', true);
            } else if (!Ext.getCmp("number_floorTotal").isValid()) {
                Notify(Ext.getCmp("number_floorTotal").invalidText, 'top-right', '5000', 'danger', 'fa-bolt', true);
            } else {
                $.post("../build/createOrUpdate.do",{
                    schoolId : Ext.getCmp("combo_schoolId").getValue(),
                    buildId : Ext.getCmp("hidden_build_id").getValue(),
                    buildName : Ext.getCmp("text_buildName").getValue(),
                    floorTotal : Ext.getCmp("number_floorTotal").getValue(),
                    description : Ext.getCmp("text_description").getValue()
                },function(data){
                    if (data.success) {
                        window_buildDetail.hide();
                        Notify(data.msg, 'top-right', '5000', 'success', 'fa-check', true);
                        buildList_refreshHandler();
                    } else {
                        Notify(data.msg, 'top-right', '5000', 'danger', 'fa-bolt', true);
                    }
                })
            }
        }

        function school_select_handler(){
            buildList_refreshHandler();
            roomList_refreshHandler();
        }

        function build_select_handler(){
            roomList_refreshHandler();
        }


        function buildList_refreshHandler(){
            var schoolId = Ext.getCmp("param_schoolId").getValue();
            store_buildTree.proxy.extraParams = {"schoolId" : schoolId};
            store_buildTree.load();
        }

        /** ------------------------教室方法区------------------------*/
        /** 教室新增 */
        function room_addHandler(){
            if (tree_buildList.getSelectionModel().hasSelection()){
                var record = tree_buildList.getSelectionModel().getSelection()[0];
                if (record.data.floorNumber > 0) {
                    form_roomDetail.getForm().reset();
                    window_roomDetail.setTitle("新增教室");
                    window_roomDetail.show();
                }else{
                    Notify('请选择楼层', 'top-right', '5000', 'warning', 'fa-warning', true)
                }
            }else{
                Notify('请选择教学楼及楼层', 'top-right', '5000', 'warning', 'fa-warning', true)
            }
        }

        /** 教室修改 */
        function room_updateHandler(){
            if (grid_room_list.getSelectionModel().hasSelection()){
                var record = grid_room_list.getSelectionModel().getSelection()[0];
                form_roomDetail.getForm().loadRecord(record);
                window_roomDetail.setTitle("修改教室");
                window_roomDetail.show();
            }else{
                Notify('请选择数据再操作', 'top-right', '5000', 'warning', 'fa-warning', true)
            }
        }

        /** 教室删除 */
        function room_deleteHandler(){
            if (grid_room_list.getSelectionModel().hasSelection()) {
                var record = grid_room_list.getSelectionModel().getSelection()[0];
                liming.message_question("是否确定删除？",function(){
                    $.post("../room/deleteEntity.do", {
                        roomId: record.data.roomId
                    }, function(data){
                        if (data.success) {
                            Notify(data.msg, 'top-right', '5000', 'success', 'fa-check', true);
                            roomList_refreshHandler();
                        } else {
                            Notify(data.msg, 'top-right', '5000', 'danger', 'fa-bolt', true);
                            roomList_refreshHandler();
                        }
                    });
                })
            }else{
                Notify('请选择数据再操作', 'top-right', '5000', 'warning', 'fa-warning', true)
            }
        }

        /** 教室提交 */
        function room_submitHandler(){
            var buildId;
            var floorNumber;
            if (tree_buildList.getSelectionModel().hasSelection()){
                var record = tree_buildList.getSelectionModel().getSelection()[0];
                if (record.data.floorNumber > 0) {
                    buildId = record.data.buildId;
                    floorNumber = record.data.floorNumber;
                }else{
                    Notify('请选择楼层', 'top-right', '5000', 'warning', 'fa-warning', true)
                    return;
                }
            }else{
                Notify('请选择教学楼及楼层', 'top-right', '5000', 'warning', 'fa-warning', true)
                return;
            }
            if (!Ext.getCmp("text_roomName").isValid()) {
                Notify(Ext.getCmp("text_roomName").invalidText, 'top-right', '5000', 'danger', 'fa-bolt', true);
            } else if (!Ext.getCmp("text_roomCode").isValid()) {
                Notify(Ext.getCmp("text_roomCode").invalidText, 'top-right', '5000', 'danger', 'fa-bolt', true);
            } else if (!Ext.getCmp("text_room_description").isValid()) {
                Notify(Ext.getCmp("text_room_description").invalidText, 'top-right', '5000', 'danger', 'fa-bolt', true);
            } else {
                $.post("../room/createOrUpdate.do",{
                    buildId : buildId,
                    floorNumber : floorNumber,
                    roomName : Ext.getCmp("text_roomName").getValue(),
                    roomCode : Ext.getCmp("text_roomCode").getValue(),
                    description : Ext.getCmp("text_room_description").getValue()
                },function(data){
                    if (data.success) {
                        window_roomDetail.hide();
                        Notify(data.msg, 'top-right', '5000', 'success', 'fa-check', true);
                        roomList_refreshHandler();
                    } else {
                        Notify(data.msg, 'top-right', '5000', 'danger', 'fa-bolt', true);
                    }
                })
            }
        }

        function roomList_refreshHandler(){
            var buildId = null;
            var floorNumber = null;
            var schoolId = Ext.getCmp("param_schoolId").getValue();
            var keyWord = Ext.getCmp("param_keyword").getValue();
            if (tree_buildList.getSelectionModel().hasSelection()){
                var record = tree_buildList.getSelectionModel().getSelection()[0];
                buildId = record.data.buildId;
                floorNumber = record.data.floorNumber;
            }
            store_room_grid.proxy.extraParams = {"schoolId" : schoolId, "buildId" : buildId, "floorNumber" : floorNumber, "keyWord" : encodeURIComponent(keyWord)};
            store_room_grid.load();
        }

        window.onresize= function(){
            tree_buildList.setWidth(0);
            tree_buildList.setWidth(Ext.get("grid_build_div").getWidth());

            grid_room_list.setWidth(0);
            grid_room_list.setWidth(Ext.get("grid_room_div").getWidth());
        }
    }
});
