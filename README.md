# Hello —— 链路验证 App

这个 App 只有一个目的：**确认「代码 → 云端编译 → 装进 iPhone」这条路真的能走通。**

它就是一个页面：显示运行平台、系统版本，加一个能点的按钮。功能本身没有意义，能看到它出现在手机桌面上，这件事才有意义。

链路通了之后，往 `App.js` 里填真正的功能就行。

---

## 你需要做的五件事

### 1. 注册 GitHub

打开 https://github.com/signup ，用邮箱注册。全程免费，不需要信用卡。

### 2. 建一个仓库

登录后点右上角 `+` → `New repository`

- Repository name：随便起，比如 `hello-app`
- 选择 **Public**（重要：公开仓库的 macOS 构建额度完全免费且不限量）
- 不要勾选 "Add a README file"
- 点 `Create repository`

### 3. 上传代码

建好后页面会显示上传提示。点 **uploading an existing file** 链接。

然后把 `myapp` 文件夹里的**所有内容**拖进浏览器窗口。

⚠️ 千万不要拖 `node_modules` 文件夹（如果有的话），它有几万个文件，上传会失败白等。

拖完点 `Commit changes`。

### 4. 跑构建

- 点仓库上方的 **Actions** 标签
- 左侧选 **Build Unsigned IPA**
- 右边点 **Run workflow** → 绿色按钮确认
- 等 8～15 分钟。第一次会比较慢，要装 CocoaPods

绿勾 = 成功，红叉 = 失败（把日志发我）。

### 5. 下载并签名

构建成功后：

- 点进这次运行 → 页面底部 **Artifacts** → 下载 `unsigned-ipa`
- 得到一个 zip，解压出 **`Hello-unsigned.ipa`**
- 打开全能签，导入这个 ipa，签名，安装到手机

装好后桌面会多一个图标，点开能看到 "Hello"。

---

## 构建失败怎么办

把 Actions 里红色的步骤日志复制给我，我改 workflow。常见原因是 Xcode 版本变动导致 scheme 名对不上，我已经做了动态读取，但仍有概率踩到。

---

## 本地预览（可选，不装也能做）

不想等构建、只想改代码实时看效果：

1. 手机 App Store 搜 **Expo Go** 装上
2. 电脑上在项目目录跑 `npx expo start`
3. 手机扫终端里的二维码

改 `App.js` 保存，手机立刻刷新。**开发期用这个，只有要装进手机时才走云构建。**

---

## 目录说明

```
App.js                        页面代码，功能都写这里
app.json                      应用名、包名 com.xiaoye.hello、图标配置
.github/workflows/build-ios.yml   云端编译配置，一般不用动
package.json                  依赖清单
```
