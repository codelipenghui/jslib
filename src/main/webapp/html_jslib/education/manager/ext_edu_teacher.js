Ext.application({
    name: "teacher",
    launch: function (){
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

        /** 组织机构数据源 */
        var store_organizationTree = Ext.create("Ext.data.TreeStore", {
            model: "OrganizationBean",
            nodeParam: "organizationId",
            proxy: {
                type: "ajax",
                url: "../organization/getTreeByParentId.do",
                extraParams : {"schoolId" : 0}
            },
            root: { id: "0", text: "全部", organizationId: 0, organizationName: "全部", expanded: true },
            autoLoad: true
        });

        /** -------------------------------------视图区------------------------------------- */
        var tree_organizationList = Ext.create("Ext.tree.Panel", {
            store: store_organizationTree,
            renderTo: "grid_organization_div",
            stateful: false,
            collapsible: false,
            multiSelect: false,
            stateId: "stateGrid",
            height: 515,
            minWidth: 200,
            header: false,
            iconCls: "ext-grid-icon-cls",
            rootVisible: true,
            columns: [
                { text: "名称", minWidth: 200, width: "98%", align: "left",   dataIndex: "organizationName", sortable: false, xtype: "treecolumn" }
            ],
            tbar: new Ext.Toolbar({
                height: 35,
                layout: { type: "hbox", pack: "center", align: "middle" },
                items: [
                    { id: "param_schoolId", xtype: "combobox", emptyText: "选择学校查询...", editable: false, store: store_school_grid, displayField: "schoolName", valueField: "schoolId", value: 0, listeners: { select: function(record){  } } },
                    { text : "新增",  disabled : false, height : 25, glyph: Icon.BUTTON_ADD, handler : ""},
                ]
            }),
            listeners: {
                select: function(record){

                }
            },
            viewConfig: {
                stripeRows: true,
                listeners: {
                    itemcontextmenu: function(view, record, node, index, e){
                        if (record) {
                            Ext.getCmp("menu_organizationUpdate").enable();
                            Ext.getCmp("menu_organizationDelete").enable();
                        } else {
                            Ext.getCmp("menu_organizationUpdate").disable();
                            Ext.getCmp("menu_organizationDelete").disable();
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
                { text : "新增", id : "menu_organizationCreate", disabled : false, height : 25, glyph: Icon.BUTTON_ADD, handler : ""},
                { text : "修改", id : "menu_organizationUpdate", disabled : true, height : 25, glyph: Icon.BUTTON_EDIT, handler : ""},
                { text : "删除", id : "menu_organizationDelete", disabled : true, height : 25, glyph: Icon.BUTTON_DELETE, handler : ""}
            ]
        });

        /**
         * 组织机构 - 编辑formPanel
         */
        var form_organizationDetail = Ext.create("Ext.form.Panel", {
            bodyPadding: 20,
            bodyBorder: false,
            frame: false,
            fieldDefaults: { labelAlign: "right", labelWidth: 70, anchor: "100%" },
            items: [
                {id: "hidden_organization_id", xtype: "hidden", name: "organizationId" },
                {xtype: 'container', layout:'column', items: [
                    { xtype: 'container', columnWidth:.5, layout: 'anchor', items: [
                        {id: "text_organizationName",  xtype: "textfield", name: "organizationName", fieldLabel: "组织结构名称", allowBlank: false, emptyText: "请输入组织结构名称", invalidText: "请输入正确的组织结构名称！", maxLength: 200}
                    ]},
                    { xtype: 'container', columnWidth:.5, layout: 'anchor', items: [
                        {id: "combo_organizationType", xtype: "combobox", name: "organizationType", fieldLabel: "类型", allowBlank: false, store: store_organization_type_edit, invalidText: "请选择类型！", forceSelection: true, editable: false, displayField: "name", valueField: "value"},
                    ]}
                ]},
                {id: "text_description",  xtype: "textarea", name: "description", fieldLabel: "备注", allowBlank: true, invalidText: "请输入正确的备注！", maxLength: 200}
            ]
        });
    }
})
