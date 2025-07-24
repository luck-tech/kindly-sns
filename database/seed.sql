-- 初期データ
INSERT INTO users (email, password_hash, username, user_id, icon_url) VALUES
('test@example.com', '$2a$10$example_hash', 'テストユーザー', 'test_user', '/logo.png'),
('demo@example.com', '$2a$10$example_hash', 'デモユーザー', 'demo_user', '/logo.png');

INSERT INTO posts (user_id, content) VALUES
(1, 'はじめての投稿です！'),
(2, '優しいSNSへようこそ🎉'),
(1, 'みなさんよろしくお願いします');

INSERT INTO likes (user_id, post_id) VALUES
(2, 1),
(1, 2);