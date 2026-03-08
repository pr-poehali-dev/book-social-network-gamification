CREATE TABLE t_p83045879_book_social_network_.users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    nickname VARCHAR(100) UNIQUE NOT NULL,
    display_name VARCHAR(200) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_emoji VARCHAR(10) DEFAULT '📚',
    bio TEXT DEFAULT '',
    social_telegram VARCHAR(200) DEFAULT '',
    social_instagram VARCHAR(200) DEFAULT '',
    social_twitter VARCHAR(200) DEFAULT '',
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    coins INTEGER DEFAULT 0,
    books_read INTEGER DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    bookmarks_count INTEGER DEFAULT 0,
    followers_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE t_p83045879_book_social_network_.bookmarks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES t_p83045879_book_social_network_.users(id),
    book_id INTEGER NOT NULL,
    progress INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, book_id)
);

CREATE TABLE t_p83045879_book_social_network_.reading_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES t_p83045879_book_social_network_.users(id),
    book_id INTEGER NOT NULL,
    progress INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, book_id)
);
