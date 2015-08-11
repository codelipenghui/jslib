Ext.application({
    name   : 'School',
    launch : function() {
        /** -------------------------------------数据源区------------------------------------- */
        var store_schoolTree = Ext.create("Ext.data.TreeStore", {
            model: "SchoolBean",
            nodeParam: "schoolId",
            proxy: {
                type: "ajax",
                url: "../school/getTreeByParentId.do"
            },
            root: { id: "-1", text: "全部",schoolId: "-1", schoolName: "全部", expanded: true },
            autoLoad: true
        });

        /** -------------------------------------视图区------------------------------------- */
        var tree_schoolList = Ext.create("Ext.tree.Panel", {
            store: store_schoolTree,
            renderTo: "grid_school_div",
            stateful: false,
            collapsible: false,
            multiSelect: false,
            stateId: "stateGrid",
            title: "学校列表",
            height: 501,
            width: 1000,
            iconCls: "ext-grid-icon-cls",
            rootVisible: true,
            columns: [
                { text: "名称", width: 200, align: "left",   dataIndex: "schoolName", sortable: false, xtype: "treecolumn" },
                { text: "简称", width: 150, align: "left",   dataIndex: "shortName", sortable: false},
                { text: "类型", width: 150, align: "left",   dataIndex: "schoolType", sortable: false},
                { text: "级别", width: 150, align: "left",   dataIndex: "schoolLevel", sortable: false},
            ],
            tbar: new Ext.Toolbar({
                height: 35,
                items: [
                    { width: 55,  text: "新增", id: "createButton", disabled: false, handler: ""}, "-",
                    { width: 55,  text: "修改", id: "updateButton", disabled: true, handler: ""}, "-",
                    { width: 55,  text: "删除", id: "deleteButton", disabled: true, handler: ""}
                ]
            }),
            listeners: {
                "select": school_selectHandler
            },
            viewConfig: {
                stripeRows: true,
                listeners: {
                    itemcontextmenu: function(view, record, node, index, e){
                        if (record.get("id") == 1) {
                            Ext.getCmp("menu_schoolUpdate").disable();
                            Ext.getCmp("menu_schoolDelete").disable();
                        } else {
                            Ext.getCmp("menu_schoolUpdate").enable();
                            Ext.getCmp("menu_schoolDelete").enable();
                        }
                        e.stopEvent();
                        menu_schoolTree.showAt(e.getXY());
                        return false;
                    }
                }
            }
        });

        var menu_schoolTree = Ext.create("Ext.menu.Menu", {
            items: [
                { id: "menu_schoolAddChild", text: "新增"},
                { id: "menu_schoolUpdate",	 text: "修改"},
                { id: "menu_schoolDelete",   text: "删除"}
            ]
        });

        /** -------------------------------------按钮事件方法区------------------------------------- */

        function school_selectHandler(){
            if (tree_schoolList.getSelectionModel().hasSelection()) {
                Ext.getCmp("updateButton").enable();
                Ext.getCmp("deleteButton").enable();
            }else{
                Ext.getCmp("updateButton").disable();
                Ext.getCmp("deleteButton").disable();
            }
        }
    }


});