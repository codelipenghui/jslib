
/**---------------------------------------公共的------------------------------------*/



Ext.define("RegionTreeBean", {
    extend: "Ext.data.Model",
    fields: [
        { name: "id", 		  type: "string" },
        { name: "text", 	  type: "string" },
        { name: "leaf", 	  type: "boolean" },
        { name: "regionId",   type: "int" },
		{ name: "regionName", type: "string" },
		{ name: "parentId",   type: "int" },
		{ name: "parentName", type: "string" },
		{ name: "sequence",   type: "int" },
		{ name: "useFlag", 	  type: "int" },
		{ name: "useFlagName",type: "string" }
    ]
});


