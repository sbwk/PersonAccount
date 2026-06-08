# 个人账号管理系统｜MVP设计草案（V0.1）

## 1. 信息架构
- 解锁/登录
- 账号列表
- 账号详情（查看）
- 账号编辑（新增/编辑）
- 设置
  - 锁定/退出
  - 主密码修改（V0.2）
  - 提醒策略（V0.2）

## 2. 核心实体
### 2.1 Account
- id：UUID
- title：string
- category：string
- login：string
- passwordCiphertext：string
- url：string | null
- registeredAt：string(ISO date) | null
- level：string | null
- expiresAt：string(ISO date) | null
- billing：object | null
  - isPaid：boolean
  - cycle："monthly" | "quarterly" | "yearly" | "one_time" | "unknown"
  - amount：number | null
  - currency：string | null
  - renewAt：string(ISO date) | null
- note：string | null
- createdAt：string(ISO datetime)
- updatedAt：string(ISO datetime)

### 2.2 Vault（本地密库元数据）
- version：number
- kdf：参数对象（迭代次数/盐等）
- cipher：参数对象（算法/nonce等）
- data：加密后的账户集合（序列化后的密文）

## 3. 校验规则
- title：1~100字符，去首尾空白
- category：必填，默认“未分类”
- login：必填，1~200字符
- url：可选；若填写需为 http/https
- expiresAt / renewAt：可选；若存在需为合法日期
- 提醒计算：优先 renewAt，其次 expiresAt

## 4. 安全策略（MVP建议）
- 明文密码仅在解锁会话中短暂存在于内存
- 复制到剪贴板后不进行本地持久化记录
- 锁定条件（默认）：手动锁定；（V0.2：后台/超时自动锁定）

## 5. 存储建议（待技术选型确认）
- 单文件密库：vault.json（或 vault.dat）+ 应用配置 settings.json
- 所有 Account 内容加密后落盘；仅保存最少必要的明文元数据（如需支持锁定态搜索则另行设计）
