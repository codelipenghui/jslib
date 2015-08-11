Ext.application({
    name: "class",
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
            remoteSort :true,
            autoLoad: true
        });

        /** 年级数据源 */
        var store_grade_grid = Ext.create("Ext.data.Store", {
            model: "GradeBean",
            pageSize : 15,
            proxy: {
                type: "ajax",
                url: "../grade/getGradeList_grid.do",
                reader : {root : "dataArray", totalProperty : "totalSize"},
                extraParams : {"keyWord" : "", "schoolId" : 0}
            },
            remoteSort :true
            //autoLoad: true
        });

        /** 班级数据源 */
        var store_class_grid = Ext.create("Ext.data.Store", {
            model: "ClassBean",
            pageSize : 15,
            proxy: {
                type: "ajax",
                url: "../class/getClassList_grid.do",
                reader : {root : "dataArray", totalProperty : "totalSize"},
                extraParams : {"keyWord" : "", "gradeId" : 0}
            },
            remoteSort :true
            //autoLoad: true
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
            proxy: {
                type: "ajax",
                url: "../room/getRoomList_grid.do",
                reader : {root : "dataArray", totalProperty : "totalSize"},
                extraParams : {"keyWord" : "", "schoolId" : 0, "buildId": 0, "floorNumber" : null, "page" : 1, "limit" : 0}
            },
            autoLoad: true
        });



        /** -------------------------------------视图区------------------------------------- */
        /** 年级列表 */
        var grid_grade_list = Ext.create("Ext.grid.Panel", {
            store : store_grade_grid,
            renderTo : "grid_grade_div",
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
                enableTextSelection : true,
                listeners: {
                    itemcontextmenu: function(view, record, node, index, e){
                        if (record) {
                            Ext.getCmp("menu_gradeUpdate").enable();
                            Ext.getCmp("menu_gradeDelete").enable();
                        } else {
                            Ext.getCmp("menu_gradeUpdate").disable();
                            Ext.getCmp("menu_gradeDelete").disable();
                        }
                        e.stopEvent();
                        menu_grade.showAt(e.getXY());
                        return false;
                    }
                }
            },
            columns : [
                {text : "序号", width : "20%", minWidth: 50, resizable: true, align : "center", sortable: false, xtype : "rownumberer"},
                {text : "年级名称", width : "78%", minWidth: 150, resizable: true, align : "left", sortable: true, dataIndex : "gradeName"}
            ],
            /**顶部工具栏*/
            tbar : new Ext.Toolbar({
                height: 35,
                layout: { type: "hbox", pack: "center", align: "middle" },
                items : [
                    { id: "param_schoolId", xtype: "combobox", emptyText: "选择学校查询...", editable: false, store: store_school_grid, displayField: "schoolName", valueField: "schoolId", value: 0, listeners: { "select": school_select_handler } },
                    { text : "新增", disabled : false, height : 25, glyph: Icon.BUTTON_ADD, handler : grade_addHandler}
                ]
            }),
            /**底部工具栏*/
            bbar : Ext.create("Ext.PagingToolbar", {
                store : store_grade_grid,
                displayInfo : true,
                displayMsg : "当前显示{0} - {1}条，共 {2} 条记录",
                emptyMsg : "当前没有任何记录"
            }),
            listeners: { "select": grade_select_handler }
        });

        var menu_grade = Ext.create("Ext.menu.Menu", {
            items: [
                { text : "新增", id : "menu_classCreate", disabled : true, height : 25, glyph: Icon.BUTTON_ADD, handler : class_addHandler},
                { text : "修改", id : "menu_gradeUpdate", disabled : false, height : 25, glyph: Icon.BUTTON_EDIT, handler : grade_updateHandler},
                { text : "删除", id : "menu_gradeDelete", disabled : false, height : 25, glyph: Icon.BUTTON_DELETE, handler : grade_deleteHandler}
            ]
        });

        /**
         * 年级 - 编辑formPanel
         */
        var form_gradeDetail = Ext.create("Ext.form.Panel", {
            bodyPadding: 20,
            bodyBorder: false,
            frame: false,
            fieldDefaults: { labelAlign: "right", labelWidth: 70, anchor: "100%" },
            items: [
                {id: "hidden_grade_id", xtype: "hidden", name: "gradeId" },
                {id: "combo_schoolId", xtype: "combobox", name: "schoolId", fieldLabel: "学校", allowBlank: false, store: store_school_grid, invalidText: "请选择学校！", forceSelection: true, editable: false, displayField: "schoolName", valueField: "schoolId"},
                {xtype: 'container', layout:'column', items: [
                    { xtype: 'container', columnWidth:.5, layout: 'anchor', items: [
                        {id: "text_gradeName",  xtype: "textfield", name: "gradeName", fieldLabel: "年级名称", allowBlank: false, emptyText: "请输入年级名称", invalidText: "请输入正确的年级名称！", maxLength: 200}
                    ]},
                    { xtype: 'container', columnWidth:.5, layout: 'anchor', items: [
                        {id: "text_stage",  xtype: "textfield", name: "stage", fieldLabel: "所在阶段", allowBlank: false, emptyText: "请输入所在阶段", invalidText: "请输入正确的阶段！", maxLength: 200}
                    ]}
                ]},
                {xtype: 'container', layout:'column', items: [
                    { xtype: 'container', columnWidth:.5, layout: 'anchor', items: [
                        {id: "number_startYear",  xtype: "numberfield", decimalPrecision: 0, name: "startYear", fieldLabel: "开始年份", allowBlank: false, emptyText: "请输入开始年份", invalidText: "请输入正确的开始年份！"}
                    ]},
                    { xtype: 'container', columnWidth:.5, layout: 'anchor', items: [
                        {id: "number_duration",  xtype: "numberfield", decimalPrecision: 0, name: "duration", fieldLabel: "学制(年)", allowBlank: false, emptyText: "请输入学制", invalidText: "请输入正确的学制！"}
                    ]}
                ]}
            ]
        });

        /**
         * 年级 - 编辑窗口显示
         */
        var window_gradeDetail = Ext.create("Ext.window.Window", {
            width : 570,
            modal : true,
            closable : true,
            closeAction : "hide",
            resizable : true,
            layout : "fit",
            dock: "bottom",
            items : [
                form_gradeDetail
            ],
            glyph: Icon.FUNCTION_SETUP,
            buttonAlign : "right",
            buttons: [
                { text: "关闭", glyph: Icon.BUTTON_CLOSE, cls: 'btn-danger', handler: function(){ window_gradeDetail.hide(); } },
                { text: "提交", glyph: Icon.BUTTON_SUBMIT, cls: 'btn-success', handler: function(){ grade_submitHandler(); } }
            ]
        });


        /** 班级列表 */
        var grid_class_list = Ext.create("Ext.grid.Panel", {
            store : store_class_grid,
            renderTo : "grid_class_div",
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
                {text : "序号", width : "6%", minWidth: 50, resizable: true, align : "center", sortable: false, xtype : "rownumberer"},
                {text : "班级名称", width : "45%", minWidth: 150, resizable: true, align : "left", sortable: true, dataIndex : "className"},
                {text : "班级类型", width : "45%", minWidth: 150, resizable: true, align : "left", sortable: true, dataIndex : "classType", renderer: renderer_class_type}
            ],
            /**顶部工具栏*/
            tbar : new Ext.Toolbar({
                height: 35,
                layout: { type: "hbox", pack: "left", align: "left" },
                items : [
                    { text : "新增", disabled : false, height : 25, glyph: Icon.BUTTON_ADD, handler : class_addHandler},
                    { text : "修改", disabled : false, height : 25, glyph: Icon.BUTTON_EDIT, handler : class_updateHandler},
                    { text : "删除", disabled : false, height : 25, glyph: Icon.BUTTON_DELETE, handler : class_deleteHandler}

                ]
            }),
            /**底部工具栏*/
            bbar : Ext.create("Ext.PagingToolbar", {
                store : store_class_grid,
                displayInfo : true,
                displayMsg : "当前显示{0} - {1}条，共 {2} 条记录",
                emptyMsg : "当前没有任何记录"
            })
        });

        /**
         * 班级 - 编辑formPanel
         */
        var form_classDetail = Ext.create("Ext.form.Panel", {
            bodyPadding: 20,
            bodyBorder: false,
            frame: false,
            fieldDefaults: { labelAlign: "right", labelWidth: 70, anchor: "100%" },
            items: [

                {id: "hidden_class_id", xtype: "hidden", name: "classId" },
                {xtype: 'container', layout:'column', items: [
                    { xtype: 'container', columnWidth:.5, layout: 'anchor', items: [
                        {id: "text_className",  xtype: "textfield", name: "className", fieldLabel: "班级名称", allowBlank: false, emptyText: "请输入班级名称", invalidText: "请输入正确的班级名称！", maxLength: 200}
                    ]},
                    { xtype: 'container', columnWidth:.5, layout: 'anchor', items: [
                        {id: "combo_classType", xtype: "combobox", name: "classType", fieldLabel: "班级类型", store: store_class_type_edit, displayField: "display", valueField: "value", queryMode: "local", forceSelection: true, editable: false, allowBlank: false, emptyText: "选择班级类型"}
                    ]}
                ]},
                {xtype: 'container', layout:'column', items: [
                    { xtype: 'container', columnWidth:.5, layout: 'anchor', items: [
                        {id: "combo_buildId", xtype: "combobox", name: "buildId", fieldLabel: "教学楼", store: store_buildTree, forceSelection: true, editable: false, displayField: "buildName", valueField: "buildId", listeners: {select: function(record){roomList_refreshHandler(record)}}},
                    ]},
                    { xtype: 'container', columnWidth:.5, layout: 'anchor', items: [
                        {id: "combo_roomId", xtype: "combobox", name: "roomId", fieldLabel: "教室", allowBlank: false, store: store_room_grid, invalidText: "请选择教室！", forceSelection: true, editable: false, displayField: "roomName", valueField: "roomId"},
                    ]}
                ]}
            ]
        });

        /**
         * 班级 - 编辑窗口显示
         */
        var window_classDetail = Ext.create("Ext.window.Window", {
            width : 570,
            modal : true,
            closable : true,
            closeAction : "hide",
            resizable : true,
            layout : "fit",
            dock: "bottom",
            items : [
                form_classDetail
            ],
            glyph: Icon.FUNCTION_SETUP,
            buttonAlign : "right",
            buttons: [
                { text: "关闭", glyph: Icon.BUTTON_CLOSE, cls: 'btn-danger', handler: function(){ window_classDetail.hide(); } },
                { text: "提交", glyph: Icon.BUTTON_SUBMIT, cls: 'btn-success', handler: function(){ class_submitHandler(); } }
            ]
        });



        /** -------------------------------------按钮事件方法区------------------------------------- */
        /** 年级新增 */
        function grade_addHandler(){
            form_gradeDetail.getForm().reset();
            window_gradeDetail.setTitle("新增年级");
            window_gradeDetail.show();
        }

        /** 年级修改 */
        function grade_updateHandler(){
            if (grid_grade_list.getSelectionModel().hasSelection()){
                var record = grid_grade_list.getSelectionModel().getSelection()[0];
                form_gradeDetail.getForm().loadRecord(record);
                window_gradeDetail.setTitle("修改年级");
                window_gradeDetail.show();
            }else{
                Notify('请选择数据再操作', 'top-right', '5000', 'warning', 'fa-warning', true)
            }
        }

        /** 年级删除 */
        function grade_deleteHandler(){
            if (grid_grade_list.getSelectionModel().hasSelection()) {
                var record = grid_grade_list.getSelectionModel().getSelection()[0];
                liming.message_question("是否确定删除？",function(){
                    $.post("../grade/deleteEntity.do", {
                        gradeId: record.data.gradeId
                    }, function(data){
                        if (data.success) {
                            Notify(data.msg, 'top-right', '5000', 'success', 'fa-check', true);
                            gradeList_refreshHandler();
                        } else {
                            Notify(data.msg, 'top-right', '5000', 'danger', 'fa-bolt', true);
                            gradeList_refreshHandler();
                        }
                    });
                })
            }else{
                Notify('请选择数据再操作', 'top-right', '5000', 'warning', 'fa-warning', true)
            }
        }

        /** 年级提交 */
        function grade_submitHandler(){
            if (!Ext.getCmp("combo_schoolId").isValid()) {
                Notify(Ext.getCmp("combo_schoolId").invalidText, 'top-right', '5000', 'danger', 'fa-bolt', true);
            } else if (!Ext.getCmp("text_gradeName").isValid()) {
                Notify(Ext.getCmp("text_gradeName").invalidText, 'top-right', '5000', 'danger', 'fa-bolt', true);
            } else if (!Ext.getCmp("text_stage").isValid()) {
                Notify(Ext.getCmp("text_stage").invalidText, 'top-right', '5000', 'danger', 'fa-bolt', true);
            } else if (!Ext.getCmp("number_startYear").isValid()) {
                Notify(Ext.getCmp("number_startYear").invalidText, 'top-right', '5000', 'danger', 'fa-bolt', true);
            } else if (!Ext.getCmp("number_duration").isValid()) {
                Notify(Ext.getCmp("number_duration").invalidText, 'top-right', '5000', 'danger', 'fa-bolt', true);
            } else {
                $.post("../grade/createOrUpdate.do",{
                    schoolId : Ext.getCmp("combo_schoolId").getValue(),
                    gradeId : Ext.getCmp("hidden_grade_id").getValue(),
                    gradeName : Ext.getCmp("text_gradeName").getValue(),
                    stage : Ext.getCmp("text_stage").getValue(),
                    startYear : Ext.getCmp("number_startYear").getValue(),
                    duration : Ext.getCmp("number_duration").getValue()
                },function(data){
                    if (data.success) {
                        window_gradeDetail.hide();
                        Notify(data.msg, 'top-right', '5000', 'success', 'fa-check', true);
                        gradeList_refreshHandler();
                    } else {
                        Notify(data.msg, 'top-right', '5000', 'danger', 'fa-bolt', true);
                    }
                })
            }
        }

        function class_addHandler(){
            if (grid_grade_list.getSelectionModel().hasSelection()){
                form_classDetail.getForm().reset();
                window_classDetail.setTitle("新增班级");
                window_classDetail.show();
            }else{
                Notify('请先选择年级', 'top-right', '5000', 'warning', 'fa-warning', true)
            }

        }

        function class_deleteHandler(){
            if (grid_class_list.getSelectionModel().hasSelection()) {
                var record = grid_class_list.getSelectionModel().getSelection()[0];
                liming.message_question("是否确定删除？",function(){
                    $.post("../class/deleteEntity.do", {
                        classId: record.data.classId
                    }, function(data){
                        if (data.success) {
                            Notify(data.msg, 'top-right', '5000', 'success', 'fa-check', true);
                            classList_refreshHandler();
                        } else {
                            Notify(data.msg, 'top-right', '5000', 'danger', 'fa-bolt', true);
                            classList_refreshHandler();
                        }
                    });
                })
            }else{
                Notify('请选择数据再操作', 'top-right', '5000', 'warning', 'fa-warning', true)
            }
        }

        function class_updateHandler(){
            if(grid_class_list.getSelectionModel().hasSelection()){
                var record = grid_class_list.getSelectionModel().getSelection()[0];
                form_classDetail.getForm().loadRecord(record);
                window_classDetail.setTitle("修改班级");
                window_classDetail.show();
            }else{
                Notify('请先选择班级', 'top-right', '5000', 'warning', 'fa-warning', true)
            }
        }

        function class_submitHandler(){
            if (grid_grade_list.getSelectionModel().hasSelection()){
                var record = grid_grade_list.getSelectionModel().getSelection()[0];
                if (!Ext.getCmp("text_className").isValid()) {
                    Notify(Ext.getCmp("text_className").invalidText, 'top-right', '5000', 'danger', 'fa-bolt', true);
                } else if (!Ext.getCmp("combo_classType").isValid()) {
                    Notify(Ext.getCmp("combo_classType").invalidText, 'top-right', '5000', 'danger', 'fa-bolt', true);
                } else if (!Ext.getCmp("combo_roomId").isValid()) {
                    Notify(Ext.getCmp("combo_roomId").invalidText, 'top-right', '5000', 'danger', 'fa-bolt', true);
                } else {
                    $.post("../class/createOrUpdate.do",{
                        gradeId: record.data.gradeId,
                        classId : Ext.getCmp("hidden_class_id").getValue(),
                        roomId : Ext.getCmp("combo_roomId").getValue(),
                        className : Ext.getCmp("text_className").getValue(),
                        classType : Ext.getCmp("combo_classType").getValue()
                    },function(data){
                        if (data.success) {
                            window_gradeDetail.hide();
                            Notify(data.msg, 'top-right', '5000', 'success', 'fa-check', true);
                            classList_refreshHandler();
                        } else {
                            Notify(data.msg, 'top-right', '5000', 'danger', 'fa-bolt', true);
                        }
                    })
                }
            }else{
                Notify('请选择数据再操作', 'top-right', '5000', 'warning', 'fa-warning', true)
            }

        }

        function school_select_handler(){
            gradeList_refreshHandler();
            buildList_refreshHandler();

        }

        function grade_select_handler(){
            classList_refreshHandler();
        }


        /** 年级列表刷新 */
        function gradeList_refreshHandler(){
            var schoolId = Ext.getCmp("param_schoolId").getValue();
            store_grade_grid.proxy.extraParams = {"schoolId" : schoolId};
            store_grade_grid.load();
        }

        /** 班级列表刷新 */
        function classList_refreshHandler(){
            if (grid_grade_list.getSelectionModel().hasSelection()){
                var record = grid_grade_list.getSelectionModel().getSelection()[0];
                store_class_grid.proxy.extraParams = {"gradeId" : record.data.gradeId};
                store_class_grid.load();
            }else{
                store_class_grid.load();
            }
        }

        /** 教学楼列表刷新 */
        function buildList_refreshHandler(){
            var schoolId = Ext.getCmp("param_schoolId").getValue();
            store_buildTree.proxy.extraParams = {"schoolId" : schoolId};
            store_buildTree.load();
        }

        /** 教室列表刷新 */
        function roomList_refreshHandler(record){
            var buildId = record.value;
            var schoolId = Ext.getCmp("param_schoolId").getValue();

            store_room_grid.proxy.extraParams = {"schoolId" : schoolId, "buildId" : buildId, "floorNumber" : null, "keyWord" : ""};
            store_room_grid.load();
        }

        /** 班级类型列渲染 */
        function renderer_class_type(value, cellmeta, record){
            var type = record.data.classType;
            var types = store_class_type_edit.data.items;
            for (var i = 0; i < types.length; i++){
                if (type == types[i].data.value){
                    return types[i].data.display;
                }
            }
        }

        window.onresize= function(){
            grid_grade_list.setWidth(0);
            grid_grade_list.setWidth(Ext.get("grid_grade_div").getWidth());

            grid_class_list.setWidth(0);
            grid_class_list.setWidth(Ext.get("grid_class_div").getWidth());
        }
    }

})