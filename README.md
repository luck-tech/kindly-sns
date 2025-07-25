# 優しいSNS

## 概要

入力した文字が**優しい言葉**に変換されるSNS。

## 主な機能

- ユーザーが入力した文字を優しい言葉に変換
- 投稿
- いいね
- プロフィール編集
- ログイン・ユーザー登録

## 追加予定の機能

- 投稿の削除
- コミュニティ機能
- リツイート
- ハッシュタグ
- 検索

## 使用技術

- **フロントエンド** : Next.js（App Router） TypeScript TailwindCss
- **バックエンド** : Next.js（Route Handlers）

## ディレクトリ構成

```
.
├── app/                        # Next.js App Routerのページ・APIルート
│   ├── api/                    # APIエンドポイント(Route Handlers)
│   │   ├── auth/               # 認証関連API（login, registerなど）
│   │   ├── posts/              # 投稿関連API
│   │   └── ...                 # その他API
│   ├── (auth)/                 # 認証画面（ログイン・新規登録などのUI）
│   ├── (main)/                 # メインアプリ画面（タイムライン、プロフィールなど）
├── components/                 # 再利用可能なReactコンポーネント
├── hooks/                      # カスタムReactフック
├── lib/                        # サーバー/クライアント共通のライブラリ・ユーティリティ
│   ├── auth.ts                 # JWT認証・ユーザー情報取得のヘルパー関数
│   ├── db.ts                   # PostgreSQL接続・クエリ実行のユーティリティ
│   └── utils.ts                # 汎用ユーティリティ関数
├── database/                   # DBスキーマやマイグレーション、接続設定
│   ├── seed.sql                # 初期データ投入用SQL（モックユーザーやサンプル投稿など）
│   └── schema.sql              # PostgreSQL用テーブル定義（ユーザー・投稿・いいね等の構造）
├── public/                     # 静的ファイル（画像、フォントなど）
├── scripts/                    # 開発・運用用スクリプト
├── types/                      # 型定義（TypeScript用）
├── .env.example                # 環境変数サンプル
├── Makefile                    # makeコマンド用タスク定義
├── middleware.ts               # Next.js用ミドルウェア（認証やリダイレクト等の共通処理）
└── ...
```

## セットアップと実行方法

1. リポジトリをクローン

githubからリポジトリのURLをコピーし、ローカルにクローン。

```
git clone <リポジトリのURL>
cd <リポジトリ名>
```

2. セットアップコードを実行

```
make setup
```

3. DB接続チェックを実行

`.env`の中に設定する環境変数をチームの人からもらう。

```
make db-test
```

成功を確認する。

4. 開発サーバーの起動

ローカルサーバーを起動する。

```
pnpm run dev
```

起動後、ブラウザで http://localhost:3000 にアクセスすると、アプリケーションが表示されます。

## 認証情報

- email: "test@example.com"
- password: "password123"
  がモックユーザーです。

CLIで認証情報がいるAPIをテストしたい時は、

1. クッキーから認証情報を取得する

```
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt
```

2. 認証情報を含めてAPIを叩く

```
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"content":"今日は良い天気ですね！"}'
```
