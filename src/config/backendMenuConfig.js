/**
 * 后台菜单路由配置清单
 * 注意：仅支持 " 二 "级菜单
 * @type {*[]}
 * 重要说明！！！
 * 页面路由绝对禁止出现/backend、/frontend、/files（远景包括map）
 * 在定义接口代理时，上述的路由单词已经被定义，如果使用，刷新页面将出现404，
 */

const backstageMenuList = [
    {
        title: '系统设置',// 菜单标题名称
        key: '/backstage/set',// 对应的path
        icon: 'setting',// 图标名称
        hidden: false, //是否隐藏
        requireAuth: true, // 是否需要登录后访问
        children: [ // 子菜单列表
            {
                title: '基本信息',
                key: '/backstage/set/info',
                hidden: false,
                requireAuth: true
            },
            {
                title: '操作日志',
                key: '/backstage/set/log',
                hidden: false,
                requireAuth: true
            },
            {
                title: '平台监控',
                key: '/backstage/set/dashBoard',
                hidden: false,
                requireAuth: true
            },
        ]
    },
    {
        title: '能力开放',// 菜单标题名称
        key: '/backstage/api',// 对应的path
        icon: 'gift',// 图标名称
        hidden: false, //是否隐藏
        requireAuth: true, // 是否需要登录后访问
        children: [ // 子菜单列表
            {
                title: '接口管理',
                key: '/backstage/api/mana',
                hidden: false,
                requireAuth: true
            },
            {
                title: '数据备份',
                key: '/backstage/api/db',
                hidden: false,
                requireAuth: true
            }
        ]
    },
    {
        title: '数据存储',// 菜单标题名称
        key: '/backstage/oss',// 对应的path
        icon: 'database',// 图标名称
        hidden: false, //是否隐藏
        requireAuth: true, // 是否需要登录后访问
        children: [ // 子菜单列表
            {
                title: '图片壁纸',
                key: '/backstage/oss/wallpaper',
                hidden: false,
                requireAuth: true
            },
            {
                title: '文章插图',
                key: '/backstage/oss/illustration',
                hidden: false,
                requireAuth: true
            },
            {
                title: '文档资料',
                key: '/backstage/oss/files',
                hidden: false,
                requireAuth: true
            },
        ]
    },
    {
        title: '对外公布',// 菜单标题名称
        key: '/backstage/message',// 对应的path
        icon: 'notification',// 图标名称
        hidden: false, //是否隐藏
        requireAuth: true, // 是否需要登录后访问
        children: [ // 子菜单列表
            {
                title: '平台留言',
                key: '/backstage/message/guestbook',
                hidden: false,
                requireAuth: true
            },
            {
                title: '消息动态',
                key: '/backstage/message/news',
                hidden: false,
                requireAuth: true
            }
        ]
    },
    {
        title: '财务流水',// 菜单标题名称
        key: '/backstage/financial',// 对应的path
        icon: 'transaction',// 图标名称
        hidden: false, //是否隐藏
        requireAuth: true, // 是否需要登录后访问
        children: [ // 子菜单列表
            {
                title: '财务流水',
                key: '/backstage/financial/transactionlist',
                hidden: false,
                requireAuth: true
            },
            {
                title: '日度报表',
                key: '/backstage/financial/financialForDay',
                hidden: false,
                requireAuth: true
            },
            {
                title: '月度报表',
                key: '/backstage/financial/financialForMonth',
                hidden: false,
                requireAuth: true
            },
            {
                title: '年度报表',
                key: '/backstage/financial/financialForYear',
                hidden: false,
                requireAuth: true
            },
        ]
    },
    {
        title: '远景发展',// 菜单标题名称
        key: '/backstage/grow',// 对应的path
        icon: 'schedule',// 图标名称
        hidden: false, //是否隐藏
        requireAuth: true, // 是否需要登录后访问
        children: [ // 子菜单列表
            {
                title: '日程安排',
                key: '/backstage/grow/plan',
                hidden: false,
                requireAuth: true
            },
            {
                title: '笔记分类',
                key: '/backstage/grow/notebook',
                hidden: false,
                requireAuth: true
            },
            {
                title: '便笺笔记',
                key: '/backstage/grow/notes',
                hidden: false,
                requireAuth: true
            },
            {
                title: '创建笔记',
                key: '/backstage/grow/notes/publish',
                hidden: true,
                requireAuth: true
            },
            {
                title: '编辑笔记',
                key: '/backstage/grow/notes/publish',
                hidden: true,
                requireAuth: true
            },
        ]
    },
]
export default backstageMenuList