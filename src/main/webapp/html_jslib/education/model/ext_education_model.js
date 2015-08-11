Ext.define("SchoolBean", {
    extend: "Ext.data.Model",
    fields: [
        { name: "schoolId", 		type: "int" },
        { name: "shortName", 		type: "string" },
        { name: "schoolName",  	    type: "string" },
        { name: "schoolType",  	    type: "int" },
        { name: "schoolLevel", 	    type: "int" },
        { name: "parentId",  	    type: "int" },
        { name: "regionId",  	    type: "int" },
        { name: "description", 		type: "string" },
        { name: "address", 			type: "string" },
        { name: "longitude", 		type: "number" },
        { name: "latitude", 		type: "number" },
        { name: "leaf", 			type: "boolean" }
    ]
});

Ext.define("OrganizationBean", {
    extend: "Ext.data.Model",
    fields: [
        { name: "id",   type: "int"},
        { name: "organizationName", type: "string"},
        { name: "organizationType", type: "int"},
        { name: "schoolId",         type: "int"},
        { name: "schoolName",       type: "string"},
        { name: "parentId",  	    type: "int" },
        { name: "leaf", 			type: "boolean" },
        { name: "description", 		type: "string" }
    ]
})

Ext.define("BuildBean", {
    extend: "Ext.data.Model",
    fields: [
        { name: "buildId", 		    type: "int" },
        { name: "buildName", 		type: "string" },
        { name: "name",  	        type: "string" },
        { name: "floorNumber",  	type: "int" },
        { name: "floorTotal", 	    type: "int" },
        { name: "schoolId",         type: "int"},
        { name: "leaf", 			type: "boolean" },
        { name: "description", 		type: "string" },
        //{ name: "children",         type: "list"}
    ]
});

Ext.define("RoomBean", {
    extend: "Ext.data.Model",
    fields: [
        { name: "roomId", 		    type: "int" },
        { name: "roomName", 		type: "string" },
        { name: "roomCode",  	    type: "string" },
        { name: "buildId",  	    type: "int" },
        { name: "floorNumber", 	    type: "int" },
        { name: "description",      type: "string"},
        { name: "buildName",        type: "string"}
    ]
});

Ext.define("GradeBean", {
    extend: "Ext.data.Model",
    fields: [
        { name: "gradeId", 		    type: "int" },
        { name: "gradeName", 		type: "string" },
        { name: "stage",  	        type: "string" },
        { name: "startYear",  	    type: "int" },
        { name: "duration", 	    type: "int" },
        { name: "schoolId",         type: "int"}
    ]
});

Ext.define("ClassBean", {
    extend: "Ext.data.Model",
    fields: [
        { name: "gradeId", 		    type: "int" },
        { name: "classId", 		    type: "int" },
        { name: "buildId",  	    type: "int" },
        { name: "className",  	    type: "string" },
        { name: "classType", 	    type: "int" },
        { name: "roomId",           type: "int"}
    ]
});

Ext.define("GradeTreeBean", {
    extend: "Ext.data.Model",
    fields: [
        { name: "gradeId", 		    type: "int" },
        { name: "gradeName", 		type: "string" },
        { name: "stage",  	        type: "string" },
        { name: "startYear",  	    type: "int" },
        { name: "duration", 	    type: "int" },
        { name: "schoolId",         type: "int"},
        { name: "name",             type: "string"},
        { name: "type",             type: "int"},
        { name: "leaf",             type: "boolean"},
    ]
});

/** Int类型枚举 */
Ext.define("IntTypeBean", {
    extend: "Ext.data.Model",
    fields: [
        {name: "value", type: "int"},
        {name: "display", type: "string"}
    ]
});

/** ------------------------------枚举---------------------------------*/
/** 学校类型 */
var store_school_type = Ext.create('Ext.data.Store',{
    model: "IntTypeBean",
    data: [
        {value:-1,      display:"取消选择"},
        {value:0,       display:"未定义"},
        {value:1,       display:"普通学校"},
        {value:2,       display:"区县级重点"},
        {value:3,       display:"市级重点"},
        {value:4,       display:"省重点"},
        {value:5,       display:"国家重点"},
        {value:6,       display:"国际学校"}
    ]
});

/** 学校级别 */
var store_school_level = Ext.create('Ext.data.Store',{
    model: "IntTypeBean",
    data: [
        {value:-1,      display:"取消选择"},
        {value:0,       display:"未定义"},
        {value:1,       display:"幼儿园"},
        {value:2,       display:"小学"},
        {value:3,       display:"中学"},
        {value:4,       display:"大学"},
        {value:5,       display:"小学+中学"}
    ]
});

/** 学校类型 - 表单选择*/
var store_school_type_edit = Ext.create('Ext.data.Store',{
    model: "IntTypeBean",
    data: [
        {value:0,       display:"未定义"},
        {value:1,       display:"普通学校"},
        {value:2,       display:"区县级重点"},
        {value:3,       display:"市级重点"},
        {value:4,       display:"省重点"},
        {value:5,       display:"国家重点"},
        {value:6,       display:"国际学校"}
    ]
});

/** 学校级别 - 表单选择*/
var store_school_level_edit = Ext.create('Ext.data.Store',{
    model: "IntTypeBean",
    data: [
        {value:-1,      display:"取消选择"},
        {value:0,       display:"未定义"},
        {value:1,       display:"幼儿园"},
        {value:2,       display:"小学"},
        {value:3,       display:"中学"},
        {value:4,       display:"大学"},
        {value:5,       display:"小学+中学"}
    ]
});

/** 班级类型 */
var store_class_type_edit = Ext.create('Ext.data.Store',{
    model: "IntTypeBean",
    data: [
        {value:-1,      display:"取消选择"},
        {value:0,       display:"未定义"},
        {value:1,       display:"普通班"},
        {value:2,       display:"重点班"},
        {value:3,       display:"快班"},
        {value:4,       display:"慢班"}
    ]
})

/** 组织结构类型 */
var store_organization_type_edit = Ext.create('Ext.data.Store',{
    model: "IntTypeBean",
    data: [
        {value:0,       display:"未定义"}
    ]
})
