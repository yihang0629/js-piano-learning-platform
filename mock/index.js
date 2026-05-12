// 引入mockjs
let Mock = require('mockjs')

// 论坛的模拟数据
export const talk = Mock.mock({
    // 模拟20条data
    "data|20":[{
        // 留言时间
        "moment": new Date(),
        // id
        "id|+1":1,
        // userId
        "userId|+1":10,
        // 内容
        "message|24-96":"@cword",
        // 标签
        "label|0-4":0,
        // 作者
        "name":"@cname",
        // 喜欢数
        "like|0-120":0,
        // 评论
        "comment|0-120":0,
        "imgurl|0-4":0,
        // 是否撤销
        "revoke|0-20":0,
        // 是否举报
        "report|0-20":0,
        // 模拟论坛数据 type值为0则表示论坛数据
        "type": 0,
    }]
})

export const comment = Mock.mock({
    // 模拟20条data
    "data|20":[{
        // 留言时间
        "moment": new Date(),
        // id
        "id|+1":1,
        // userId
        "userId|+1":10,
        // 内容
        "message|24-96":"@cword",

        // 作者
        "name":"@cname",

        // 背景色
        "imgurl|0-14":0,
       
    }]
})
// 模拟图片
export const photo = Mock.mock({
    // 模拟20条data
    "data|20":[{
        // 留言时间
        "moment": new Date(),
        // 评论
        "comment|0-120":0,
        // photoId
        "id|+1":1,
        // userId
        "userId|+1":10,

        // 背景色
        "imgurl|0-4":0,
        // 喜欢数
        "like|0-120":0,

        "type": 1,

        // 作者
        "name":"@cname",

        // 标签
        "label|0-7":0,
    }]
})

export const photos = Mock.mock({
    // 模拟20条data
    "data|20":[{
        // photoId
        "photoId|+1":1,

        // 图片标题
        "title|1-9": "@cname",

        // // 喜欢数
        // "like|0-120":0,

        "type": 1,

        // 图片url
        "imgurl|0-4":0,

        // 标签
        "label|0-7":0,
    }]
})

export const user = Mock.mock({
    // 模拟20条data
    "data|20":[{
        // 用户id/名
        "userId|+1":1,

        // 密码
        "password|1-10": '',

        // 头像 portrait[tx]
        "tx|0-10":0,
    }]
})

export const users = Mock.mock({
    "data|50":[{
        "id|+1":1,
        "username":"@cname",
        "email":"@email",
        "phone":"@phone",
        "createTime":"@datetime",
        "status|0-1":0,
        "role|0-1":0,
        "avatar|0-10":0,
    }]
})