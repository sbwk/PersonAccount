# PersonAccount（个人账号管理）

本地 Web 单机版账号管理工具：主密码解锁、本地加密存储（WebCrypto + IndexedDB）、账号信息管理、平台 Key（如 AI Token）管理。

## 使用

```bash
npm install
npm run dev
```

打开：
- http://localhost:5173/

## 语言

设置页支持中英文切换（中文 / English）。

## CI / Release

GitHub Actions：
- CI：自动执行 lint / typecheck / test / build
- Release Please：基于提交生成 Release PR 与 Release
