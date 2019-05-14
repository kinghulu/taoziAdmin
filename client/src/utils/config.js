/**
 * 回看视频类型
 * ① 共享回看视频：发布在班次/课次上的会看视频，相关班级都会看到视频；
   ② 个别班级回看视频：发布在班级/课次上的回看视频，仅有该班级的学员可以看到 
 */
export const replayType=[
    {
        value:1,
        name:"共享回看视频",
        memo:"所有同类课程均可查看"
    },
    {
        value:2,
        name:"个别班级回看视频",
        memo:""
    },
];

/**
 * 资源模块
 * 1 课前预习
 * 2 进阶修炼
 * 3 课后复习
 */
export const moduleType={
    "1":"课前预习",
    "2":"进阶修炼",
    "3":"课后复习"
};

/**
 * 资源类型类型
 */
export const filesType = [
    {
        value:1,
        name:"视频",
        suffix:"" //文件后缀格式
    },
    {
        value:2,
        name:"PDF",
        suffix:"pdf"
    },
    {
        value:3,
        name:"链接",
        suffix:""
    },
    {
        value:4,
        name:"修炼资源包",
        suffix:"zip"
    },
];


/**
 * 权限配置
 */
export const roleArr = [
    {
        'title':'课程资源匹配（资源包）',
        'isShow':true, //是否显示在用户权限配置列表
        'code':"a", //该权限大类对应的编码，用于控制左侧菜单显示
        'child':[
            { 'name':'查看','value':'a1' },
            { 'name':'修改','value':'a2' }
        ]
    },
    {
        'title':'课件预览功能',
        'isShow':false, //是否显示在用户权限配置列表
        'code':"b",
        'child':[
            { 'name':'查看','value':'b1' },
        ]
    },
    {
        'title':'直播视频资源配置',
        'isShow':true, //是否显示在用户权限配置列表
        'code':"c", 
        'child':[
            { 'name':'查看','value':'c1' },
            { 'name':'修改','value':'c2' },
        ]
    },
    {
        'title':'资源上传匹配',
        'isShow':true, //是否显示在用户权限配置列表
        'code':"d",
        'child':[
            { 'name':'查看','value':'d1' },
            { 'name':'修改','value':'d2' },
        ]
    },
    {
        'title':'解析视频匹配',
        'isShow':true, //是否显示在用户权限配置列表
        'code':"e",
        'child':[
            { 'name':'查看','value':'e1' },
            { 'name':'修改','value':'e2' },
        ]
    },
    {
        'title':'知识点功能匹配',
        'isShow':false, //是否显示在用户权限配置列表
        'code':"f",
        'child':[
            { 'name':'查看','value':'f1' },
            { 'name':'修改','value':'f2' },
        ]
    },
    {
        'title':'用户与权限管理',
        'isShow':false, //是否显示在用户权限配置列表
        'code':"g",
        'child':[
            { 'name':'查看','value':'g1' },
            { 'name':'修改','value':'g2' },
        ]
    }
];


