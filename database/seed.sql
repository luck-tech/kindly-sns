-- 初期データ
INSERT INTO users (email, password_hash, username, user_id, icon_url) VALUES
('test@example.com', '$2b$10$nHWB9o6DTQdas2ApKW3Yh.ezoRaiMzHKxmNyilYGEtovttySROfi2', 'テストユーザー', 'test_user', '/logo.png'),
('demo@example.com', '$2b$10$nHWB9o6DTQdas2ApKW3Yh.ezoRaiMzHKxmNyilYGEtovttySROfi2', 'デモユーザー', 'demo_user', '/logo.png');

INSERT INTO posts (user_id, content) VALUES
(1, 'はじめての投稿です！'),
(2, '優しいSNSへようこそ🎉'),
(1, 'みなさんよろしくお願いします');

INSERT INTO likes (user_id, post_id) VALUES
(2, 1),
(1, 2);