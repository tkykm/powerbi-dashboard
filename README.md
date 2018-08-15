# PowerBi Viewer

[PowerBI](https://app.powerbi.comdashbaord)のdashboard埋め込みwebアプリ。  
PowerBIで作ったダッシュボードはPower BI Proのサブスクリプション(1090円/人月)が無いと作成者以外は閲覧することができません。  
このアプリを使うことで作成者のユーザクレデンシャルを共通して使用することで複数人で閲覧することが可能となります。  

## usage
- https://dev.powerbi.com/appsからPowerBI用のアプリケーションをAADに登録  
- 生成されたclientid, clientsecretをメモ
- 表示したいPowerBIのdashboard idを取得
  - dashboardのurlの末尾
- 環境変数 or config.jsonに上記とユーザクレデンシャルを設定
- npm start

### local test
```
export PB_CLIENT_ID=上記
export PB_CLIENT_SECRET=上記
export PB_DASHBOARD_ID=上記
export PB_USERNAME=ユーザ名
export PB_PASSWORD=パスワード
export PB_AUTHMETHOD='direct'
export TITLE=site title
npm install
npm start
```

## 認可コードフローモード
PB_AUTHMETHODに'code'を指定することで、認可コードを使った認証、つまり手動で認証するモードになる。
2段階認証を設定している場合はこちらを使う。    
AADに登録したアプリのredirect urlに/getATokenを指定する。  

トークンは1時間有効。トークンの有効期限が切れた場合はrefresh tokenを用いて再取得します。
refresh tokenは14日使用可能で、再取得することでさらに14日間使用できます。(最大で 90 日まで延長できます。)
画面をロードしたタイミングでトークンの再取得が行われます。

/logoutに行くとトークンを削除します。  

### local test
```
export PB_CLIENT_ID=上記
export PB_CLIENT_SECRET=上記
export PB_DASHBOARD_ID=上記
export PB_USERNAME=ユーザ名
export PB_PASSWORD=パスワード
export PB_REDIRECT_URL=<site domein>/getAToken
export PB_AUTHMETHOD='direct'
export TITLE=site title
npm install
npm start
```
![画面サンプル](http://i.imgur.com/roQMm2j.png)
