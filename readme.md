NodeCGで動作する配信画面と管理ツールです。

# 導入方法
## 初期条件
* Windows 11（10以降はおそらくOK）
* Powershell 7以降
* Node.jsインストール済み

## NodeCGの導入・プロジェクト構築
[https://qiita.com/nanana08/items/73e3dcb33676c93eddac]

このリポジトリを *クローンせずに* 以下を実行

```powershell
# cliをインストール
npm install --global nodecg-cli@latest

# プロジェクトを作成
nodecg setup

# bundles配下にこのリポジトリをクローン
nodecg install makochan1209/2024-rikoten-conf-layouts
```

## トラブルシューティング
### Windows Powershell (Ver. 5以下)でnodecg setupに失敗する
```nodecg setup```を行おうとすると、「このシステムではスクリプトの実行が無効になっているため…」と出る。

* Powershell (Ver. 7以降)をインストールする。
    * ターミナルを開いて一番上に出てくるリンクからPowershellをインストール。
* ターミナルを再度開いて、既定のターミナルを```Windows Powershell```から```Powershell```に変更。
* VSCodeなどでターミナルを動かしている場合は一度元のターミナルを閉じて新しくターミナルを開き、```Powershell```に切り替える。

# 起動
```powershell
npm start
```

```localhost:9090```にアクセス。