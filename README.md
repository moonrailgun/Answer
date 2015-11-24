# Answer #

## todo-list ##
- 答题详解
- 错题集
- 个人资料修改
- 二维码管理
- 我的收藏
- 上传资料
- 资料库分类下属页面美化
- 最热类型
- 数据库控制首页banner
- 取消收藏
- listContact模块实现分组

## 个人 ##
- 个人标题+二维码
- 我的红包
- 我的好友
- 我的收藏
- 我的下载
- 资料库
- 学习圈
- 错题集
- 计划

## 答题 ##
### 答题类型 ###
- 章节练习
- 考前模拟
- 真题检测

### 题目 ###
- 评分
- 分享
- 收藏
- 错题记录

## 资料 ##
- 找资料
- 资料库
	- 分类
- 上传资料
- 下载资料
- 热门类型
- 我的资料
- 最新上传

# 模块 #
## 所用APICloud模块列表 ##
- mcm
- UIScrollPicture
- UISearchBar
- FNScanner
- fs
- fileBrower
- downloadManager

# 本地数据存储结构 #
## localStorage ##
- userInfo
	- token
	- userId
	- username
	- nickname
	- avatar
		- id
		- url
		- name
		- ...
- favorite
	- id
	- questions
	- documents

# 数据库架构 #
## 数据库 ##
- _user 用户
	- username 用户名*
	- password (隐藏) 用户密码*
	- accessTokens 用户登陆凭证
	- nickname 用户昵称(显示用)*
	- avatar (文件) 用户头像，大小100*100
	- favorite (关联Favorite) 用户收藏
- QuestionBank 题库
	- title 题目标题
	- pic 题目图片
	- questionContent 题目内容*
	- answer1.2.3.4 回答选项*
	- trueanswer 正确答案*
	- solution 解决方案(题目详解)
- QuestionType 题目学科分类
	- name 学科名*
	- authenticExam (关联AuthenticExamination) 所有该学科下的真题试卷
	- simulationExam (关联SimulationExamination) 所有该学科下的模拟试卷
	- chapter (关联Chapter) 所有该学科下的章节
	- unclassifiedQuestions (关联QuestionBank) 所有该学科下所有无类别的问题
- Score 得分
	- classifyScore 该分类的得分*
	- type (QuestionType) 该分类的索引*
- Chapter 学科章节
	- chapterName 章节名*
	- questions (关联QuestionBank) 该学科下所有题目
- Examination 套题(模拟练习)
	- examinationName 套题名字*
	- questions (关联QuestionBank) 该试卷所有题目
- AuthenticExamination 真题检测(按年份排序)
	- year 真题年份*
	- examinations (关联Examination) 该试卷所有题目
- SimulationExamination 模拟测试
	- examination (关联Examination) 指向一套试卷*
- MessageBoard 留言板
	- content 留言内容*
    - userId (关联_user) 留言ID*
	- comment (关联MessageComment) 该留言评论集合
- MessageComment 留言板评论
	- content 留言内容*
	- userId (关联_user) 留言ID*
- Favorite 题目收藏
	- userId 该用户ID,用于查询*
	- questions 存放相应的数据ID数组(来自QuestionBank)
	- documents 存放相应的数据ID数组(来自Document)
- Document 资料类
	- file 上传的文件*
	- name 资料名（用于搜索和显示）*
	- uploadId 上传人ID
- DocumenType 资料分类
	- typeName 资料类型名*
	- document (关联Document) 资料
- Rank 排行榜
	- userId (关联_user) 该用户ID*
	- score 该用户积分
- Economy 经济库
	- userId 用户ID*
	- score 用户积分
- WrongSet 错题集
	- userId (关联_user) 错题用户ID*
	- wrongNumSum 累计错题总数*
	- wrongSet 错题数据的JSON数组对象*
        - id 错题ID
        - group 所属分类(自定义默认为【默认】)
        - num 累计错误次数
- UserProfile 用户个人档案
	- userId 用户唯一标识ID*
	- nickname 昵称*
	- sex 性别*
	- role 身份（学生、老师、管理员等）
	- college 学院名
	- major 专业名
	- intro 个人介绍
- PracticeRecord 做题记录
	- userId 用户ID*
	- haveDone 该用户所有做过的题目的数组

# 关于开源 #
开源协议基于[GPLv2](./LICENSE)