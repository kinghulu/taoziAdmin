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
            { path: '', component: _import('Dashboard'), name: "Index", meta: { cn: "首页", ico: "mb-shouye", role:"", hidden: false }},
            { path: 'nopermission', name: 'P403', component:_import('error/P403'), meta: { cn: "没有权限", role:"", hidden: true } },
            { path: 'system', component:_import('layout/PublicView'), meta: { cn: "系统管理", ico: "mb-xitong", role:"aa,ab", hidden: false },
                children:[
                    { path: '', component:_import('system/UserList'), name: "UserList", meta: { cn: "用户管理", role:"aa", hidden: false }},
                    { path: 'useradd', component:_import('system/UserAdd'), name: "UserAdd", meta: { cn: "新增用户", role:"aa", hidden: true }},
                    { path: 'rolelist', component:_import('system/RoleList'), name: "RoleList", meta: { cn: "权限角色管理", role:"ab", hidden: false }},
                    { path: 'roleadd', component:_import('system/RoleAdd'), name: "RoleAdd", meta: { cn: "角色权限配置新增", role:"ab", hidden: true }},
                    { path: 'roleedit/:id', component:_import('system/RoleAdd'), name: "RoleEdit", meta: { cn: "角色权限配置", role:"ab", hidden: true }}
                ]
            },
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