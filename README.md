# PersonAccount（个人账号管理）

本地 Web 单机版账号管理工具：主密码解锁、本地加密存储（WebCrypto + IndexedDB）、账号信息管理、平台 Key（如 AI Token）管理。

## 使用

```bash
npm install
npm run dev
```

打开：
- http://localhost:5173/

### 局域网访问

同一局域网内的其他设备（手机/另一台电脑）访问本机开发服务：

```bash
npm run dev:lan
```

然后在其他设备浏览器打开：
- http://<本机局域网IP>:5173/

## 语言

设置页支持中英文切换（中文 / English）。

## CI / Release

GitHub Actions：
- CI：自动执行 lint / typecheck / test / build
- Release Please：基于提交生成 Release PR 与 Release
