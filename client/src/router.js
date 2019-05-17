import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const _import = file  => () => import('@/views/' + file + '.vue');

//meta:{role:角色名字，用于控制菜单显示}
export const constantRouterMap = [
    { path: '/login', name: 'Login', component:_import('Login') },
    // { path: '/nopermission', name: 'P403', component:_import('error/P403') }, 
    { path: '/', component:_import('layout/Main'), meta: { title: "main", cn: "首页" },
        children:[
            { path: '', component: _import('Dashboard'), name: "Index", meta: { cn: "首页", ico: "mb-shouye", id: "n1", role:"", hidden: false }},
            { path: 'nopermission', name: 'P403', component:_import('error/P403'), meta: { cn: "没有权限", role:"", hidden: true } },
            { path: 'coursematch', component:_import('layout/PublicView'), meta: { cn: "课程资源配置", ico: "mb-kechengbiao", id: "n2", role:"a,d,c,e", hidden: false },
            children:[
                {path: '', component: _import('course/CourseMatch'), name: "CourseMatch", meta: { cn: "课程资源匹配", id: "n2-1", role:"a", hidden: false }},
                {path: 'matchdetail', component:_import('course/MatchDetail'), name: "MatchDetail", meta: { cn: "具体课次配置", role:"a", id: "n2-1", hidden: true }},
                { path: 'matchedlist', component:_import('course/MatchedList'), name: "MatchedList", meta: { cn: "模块资源上传", role:"a", id: "n2-1", hidden: true }},
                { path: 'matchupload', component:_import('course/MatchUpload'), name: "MatchUpload", meta: { cn: "资源新增", role:"a", id: "n2-1", hidden: true }},

                { path: 'fileslist', component:_import('course/FilesList'), name: "FilesList", meta: { cn: "资源上传匹配", role:"d", id: "n2-2", hidden: false }},
                { path: 'filesupload', component:_import('course/FilesUpload'), name: "FilesUpload", meta: { cn: "资源新增", role:"d", id: "n2-2", hidden: true }},               
                { path: 'filesedit/:fid', component:_import('course/FilesUpload'), name: "FilesEdit", meta: { cn: "资源编辑", role:"d", id: "n2-2", hidden: true }},
                { path: 'filesmatch/:fid', component:_import('course/FilesMatch'), name: "FilesMatch", meta: { cn: "资源匹配", role:"d", id: "n2-2", hidden: true }},

                { path: 'livesmatch', component:_import('course/LivesMatch'), name: "LivesMatch", meta: { cn: "直播回看视频匹配", role:"c", id: "n2-3", hidden: false }},
                { path: 'livesadd', component:_import('course/LivesAdd'), name: "LivesAdd", meta: { cn: "新增直播回看视频", id: "n2-3", role:"c", hidden: true }},
                { path: 'livesdetail/:id', component:_import('course/LivesDetail'), name: "LivesDetail", meta: { cn: "直播回看详情", id: "n2-3", role:"c", hidden: true }}, 

                { path: 'parsematch', component:_import('course/ParseMatch'), name: "ParseMatch", meta: { cn: "解析视频匹配", id: "n2-4", role:"e", hidden: false }},
                { path: 'parseadd', component:_import('course/ParseAdd'), name: "ParseAdd", meta: { cn: "新增解析视频", id: "n2-4", role:"e", hidden: true }},
                { path: 'parseedit', component:_import('course/ParseEdit'), name: "ParseEdit", meta: { cn: "编辑解析视频", id: "n2-4", role:"e", hidden: true }}
            ]},
            { path: 'system', component:_import('layout/PublicView'), meta: { cn: "系统管理", ico: "mb-xitong", id: "n5", role:"g", hidden: false },
                children:[
                    { path: '', component:_import('system/UserList'), name: "UserList", meta: { cn: "用户管理", role:"g", id: "n5-1", hidden: false }},
                    { path: 'useradd', component:_import('system/UserAdd'), name: "UserAdd", meta: { cn: "新增用户", role:"g", id: "n5-1", hidden: true }},
                    { path: 'rolelist', component:_import('system/RoleList'), name: "RoleList", meta: { cn: "权限角色维护", role:"g", id: "n5-2", hidden: false }},
                    { path: 'roleadd', component:_import('system/RoleAdd'), name: "RoleAdd", meta: { cn: "角色权限配置新增", role:"g", id: "n5-2", hidden: true }},
                    { path: 'roleedit/:id/:type', component:_import('system/RoleAdd'), name: "RoleEdit", meta: { cn: "角色权限配置", role:"g", id: "n5-2", hidden: true }}
                ]
            },
            { path: 'editpwd', component:_import('system/EditPwd'), name: "EditPwd", meta: { cn: "个人密码修改", hidden: true }},
            { path: '*', component: _import('error/P404'), meta: { cn: "页面不见了", hidden: true,role:'' }}
        ]
    },
    { path: '/p404', component: _import('error/P404')},
    { path: '*', component: _import('error/P404')}
]

export default new Router({
  mode: 'hash', //hash,history
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})