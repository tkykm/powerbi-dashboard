# PowerBi Viewer

https://app.powerbi.comのdashbaord, reportを埋め込んで表示。
dashboardのタイルをクリックするとリンクされているレポートに遷移する。

## usage
AADに以下からpowerbiアプリの登録を行う。
https://dev.powerbi.com/apps

```
export PB_CLIENT_ID=your
export PB_CLIENT_SECRET=your
export PB_DASHBOARD_ID=your
export PB_REDIRECT_URL=your
export TITLE=your
npm install
npm start
```

## token
webサーバ起動後、PowerBiからデリゲートされているアカウントでログインする必要があります。
トークンは1時間有効。トークンの有効期限が切れた場合はrefresh tokenを用いて再取得します。
refresh tokenは14日使用可能で、再取得することで、さらに14日間使用できます。(最大で 90 日まで延長できます。)
画面をロードしたタイミングでトークンの再取得が行われます。

## 画面サンプル
![画面サンプル](http://i.imgur.com/roQMm2j.png)
