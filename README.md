# PersonAccount（个人账号管理）

本地 Web 单机版账号管理工具：主密码解锁、本地加密存储（WebCrypto + IndexedDB）、账号信息管理、平台 Key（如 AI Token）管理。

## 使用

### 安装

```bash
npm install
```

### 访问场景 1：仅限本机访问

在运行本项目的电脑启动开发服务：

```bash
npm run dev
```

然后在本机浏览器打开：
- http://localhost:5173/

### 访问场景 2：允许局域网其他设备访问

在运行本项目的电脑（作为服务端）启动开发服务，并允许局域网访问：

```bash
npm run dev:lan
```

然后在同一局域网的其他设备浏览器打开：
- http://<运行该项目电脑的局域网IP>:5173/

说明：
- 其他设备不需要执行 npm 命令，只需要浏览器访问即可
- 本项目为本地优先应用，数据保存在访问端设备的浏览器本地（IndexedDB），不同设备之间不共享同一份数据

## 语言

设置页支持中英文切换（中文 / English）。

## CI / Release

GitHub Actions：
- CI：自动执行 lint / typecheck / test / build
- Release Please：基于提交生成 Release PR 与 Release
