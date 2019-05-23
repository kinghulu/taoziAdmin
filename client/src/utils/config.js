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
        'title':'用户管理',
        'isShow':true, //是否显示在用户权限配置列表
        'child':[
            { 'name':'查看','value':'aa1' },
            { 'name':'修改','value':'aa2' },
        ]
    },
    {
        'title':'权限管理',
        'isShow':true, //是否显示在用户权限配置列表
        'child':[
            { 'name':'查看','value':'ab1' },
            { 'name':'修改','value':'ab2' },
        ]
    }
];


