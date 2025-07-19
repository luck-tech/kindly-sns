# 優しいSNS

## 概要

入力した文字が**優しい言葉**に変換されるSNS。

## 主な機能

- ユーザーが入力した文字を優しい言葉に変換
- 投稿／削除
- コミュニティ参加
- いいね
- リツイート
- ハッシュタグ
- 検索
- プロフィール編集
- ログイン

## 使用技術

- **フロントエンド** : Next.js TypeScript TailwindCss
- **バックエンド** : Next.js

## ディレクトリ構成

```
.
├──.next/
├── app/
│   ├── api/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
├── hooks/
├── lib/
│   └── utils.ts
├── node_modules/
├── public/
└── ... (その他設定ファイル)
```

## セットアップと実行方法

1. リポジトリをクローン  
   githubからリポジトリのURLをコピーし、ローカルにクローン。

```
git clone <リポジトリのURL>
cd <リポジトリ名>
```

2. 依存パッケージのインストール  
   プロジェクトに必要なライブラリをpnpmでインストール。

```
pnpm install
```

3. 環境変数ファイルを作成  
   githubにアップロードされていない **.env.local**を手動で作成。  
   プロジェクトの一番上の階層に **.env.local**という名前でファイルを作り、以下の内容をペーストする。

```
DATABASE_URL=
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=
```

4. 開発サーバーの起動
   ローカルサーバーを起動する。

```
pnpm run dev
```

起動後、ブラウザで http://localhost:3000 にアクセスすると、アプリケーションが表示されます。
