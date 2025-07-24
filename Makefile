.PHONY: setup install env-copy db-test db-migrate

setup: install env-copy
	@echo "🎉 セットアップが完了しました！"
	@echo "開発サーバーを起動するには: pnpm dev"

install:
	@echo "📦 依存関係をインストール中..."
	pnpm install

env-copy:
	@echo "📝 環境変数ファイルをコピー中..."
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo "✅ .env.example を .env にコピーしました"; \
	elif [ -f .env ]; then \
		echo "⚠️  .env は既に存在します"; \
	else \
		echo "❌ .env.example ファイルが見つかりません"; \
		exit 1; \
	fi

db-test:
	@echo "🔌 データベース接続をテスト中..."
	pnpm db:test
	@echo "✅ データベースのチェックが完了しました！"

db-migrate:
	@echo "🗄️ データベースマイグレーション実行中..."
	pnpm db:migrate