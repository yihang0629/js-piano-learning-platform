import service from '@/utils/axios';

// 获取访问者的ip
export const signIpApi = () => service.post('/signIP');

// 新建wall data是将要传给后端的数据
export const insertWallApi = (data) => service.post('/insertWall', data);

// findWallPage
export const findWallPageApi = (data) => service.post('/findWallPage', data);

// 反馈
export const insertFeedback = (data) => service.post('/insertFeedback', data);

// insertCommentApi 新增 评论
export const insertCommentApi = (data) => service.post('/insertComment', data);

// 分页查询 某个帖子的评论
export const findCommentPageApi = (data) => service.post('/findCommentPage', data);

//  insertPhotoComment 新增图片评论
export const insertPhotoCommentApi = (data) => service.post('/insertPhotoComment', data);

// findPhotoPageApi
export const findPhotoPageApi = (data) => service.post('/findPhotoPage', data);

// profile 上传图片到后端
export const profileApi = (data) => service.post('/profile', data);

// insertPhoto 提交图片数据到数据库
export const insertPhotoApi = (data) => service.post('/insertPhoto', data);

// findPhotoCommentPage
export const findPhotoCommentPageApi = (data) => service.post('/findPhotoCommentPage', data);

// photofeedbackCount 图片反馈
export const insertphotoFeedbackApi = (data) => service.post('/insertphotoFeedback', data);

// 新增用户注册
export const reguserApi = (data) => service.post('/reguser', data);

// 新增用户登录
export const loginApi = (data) => service.post('/login', data);

// 删除图片
export const deletePhotoApi = (data) => service.post('/deletePhoto', data);

// 删除帖子 deleteWall
export const deleteWallApi = (data) => service.post('/deleteWall', data);

// 分页查询用户列表
export const findUserPageApi = (data) => service.post('/findUserPage', data);
