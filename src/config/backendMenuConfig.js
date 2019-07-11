const backendMenuList = [
    {
        title: '系统设置',// 菜单标题名称
        key: '/backend/set',// 对应的path
        icon: 'setting',// 图标名称
        hidden: false, //是否隐藏
        requireAuth: true, // 是否需要登录后访问
        children: [ // 子菜单列表
            {
                title: '基本信息',
                key: '/backend/set/info',
                hidden: false,
                requireAuth: true
            },
            {
                title: '操作日志',
                key: '/backend/set/log',
                hidden: false,
                requireAuth: true
            },
            {
                title: '平台监控',
                key: '/backend/set/dashBoard',
                hidden: false,
                requireAuth: true
            },
        ]
    },
    {
        title: '能力开放',// 菜单标题名称
        key: '/backend/api',// 对应的path
        icon: 'gift',// 图标名称
        hidden: false, //是否隐藏
        requireAuth: true, // 是否需要登录后访问
        children: [ // 子菜单列表
            {
                title: '接口管理',
                key: '/backend/api/nama',
                hidden: false,
                requireAuth: true
            },
            {
                title: '数据备份',
                key: '/backend/api/db',
                hidden: false,
                requireAuth: true
            }
        ]
    },
    {
        title: '数据存储',// 菜单标题名称
        key: '/backend/oss',// 对应的path
        icon: 'database',// 图标名称
        hidden: false, //是否隐藏
        requireAuth: true, // 是否需要登录后访问
        children: [ // 子菜单列表
            {
                title: '图片壁纸',
                key: '/backend/oss/wallpaper',
                hidden: false,
                requireAuth: true
            },
            {
                title: '文章插图',
                key: '/backend/oss/illustration',
                hidden: false,
                requireAuth: true
            },
            {
                title: '文档资料',
                key: '/backend/oss/files',
                hidden: false,
                requireAuth: true
            },
        ]
    },
    {
        title: '对外公布',// 菜单标题名称
        key: '/backend/message',// 对应的path
        icon: 'notification',// 图标名称
        hidden: false, //是否隐藏
        requireAuth: true, // 是否需要登录后访问
        children: [ // 子菜单列表
            {
                title: '平台留言',
                key: '/backend/message/guestbook',
                hidden: false,
                requireAuth: true
            },
            {
                title: '消息动态',
                key: '/backend/message/news',
                hidden: false,
                requireAuth: true
            },
            {
                title: '发布动态',
                key: '/backend/message/news/publish',
                hidden: true,
                requireAuth: true
            },
            {
                title: '编辑动态',
                key: '/backend/message/news/edit',
                hidden: true,
                requireAuth: true
            },
        ]
    },
    {
        title: '财务流水',// 菜单标题名称
        key: '/backend/financial',// 对应的path
        icon: 'transaction',// 图标名称
        hidden: false, //是否隐藏
        requireAuth: true, // 是否需要登录后访问
        children: [ // 子菜单列表
            {
                title: '财务流水',
                key: '/backend/financial/transactionlist',
                hidden: false,
                requireAuth: true
            },
            {
                title: '日度报表',
                key: '/backend/financial/financialForDay',
                hidden: false,
                requireAuth: true
            },
            {
                title: '月度报表',
                key: '/backend/financial/financialForMonth',
                hidden: false,
                requireAuth: true
            },
            {
                title: '年度报表',
                key: '/backend/financial/financialForYear',
                hidden: false,
                requireAuth: true
            },
        ]
    },
    {
        title: '成长发展',// 菜单标题名称
        key: '/backend/grow',// 对应的path
        icon: 'schedule',// 图标名称
        hidden: false, //是否隐藏
        requireAuth: true, // 是否需要登录后访问
        children: [ // 子菜单列表
            {
                title: '日程安排',
                key: '/backend/grow/plan',
                hidden: false,
                requireAuth: true
            },
            {
                title: '笔记分类',
                key: '/backend/grow/notebook',
                hidden: false,
                requireAuth: true
            },
            {
                title: '便笺笔记',
                key: '/backend/grow/notes',
                hidden: false,
                requireAuth: true
            },
            {
                title: '创建笔记',
                key: '/backend/grow/notes/publish',
                hidden: true,
                requireAuth: true
            },
            {
                title: '编辑笔记',
                key: '/backend/grow/notes/publish',
                hidden: true,
                requireAuth: true
            },
        ]
    },
]
export default backendMenuList