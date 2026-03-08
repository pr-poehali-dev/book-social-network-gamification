"""
Авторизация пользователей BookVerse: регистрация, вход, получение профиля.
action=register | login | me через query string.
"""
import json
import os
import hashlib
import hmac
import base64
import time
import psycopg2

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "t_p83045879_book_social_network_")
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Authorization",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def make_token(user_id: int) -> str:
    secret = os.environ.get("JWT_SECRET", "fallback-secret-key")
    payload = base64.b64encode(
        json.dumps({"uid": user_id, "ts": int(time.time())}).encode()
    ).decode()
    sig = hmac.new(secret.encode(), payload.encode(), hashlib.sha256).hexdigest()
    return f"{payload}.{sig}"


def verify_token(token: str):
    secret = os.environ.get("JWT_SECRET", "fallback-secret-key")
    parts = token.split(".")
    if len(parts) != 2:
        return None
    payload, sig = parts
    expected = hmac.new(secret.encode(), payload.encode(), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(sig, expected):
        return None
    data = json.loads(base64.b64decode(payload + "==").decode())
    return data.get("uid")


def ok(data: dict, status: int = 200):
    return {
        "statusCode": status,
        "headers": {**CORS, "Content-Type": "application/json"},
        "body": json.dumps(data, ensure_ascii=False),
    }


def err(msg: str, status: int = 400):
    return {
        "statusCode": status,
        "headers": {**CORS, "Content-Type": "application/json"},
        "body": json.dumps({"error": msg}, ensure_ascii=False),
    }


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    qs = event.get("queryStringParameters") or {}
    action = qs.get("action", "")

    body = {}
    raw = event.get("body") or ""
    if raw:
        body = json.loads(raw)

    # --- REGISTER ---
    if action == "register" and method == "POST":
        email = body.get("email", "").strip().lower()
        nickname = body.get("nickname", "").strip()
        display_name = body.get("display_name", "").strip()
        password = body.get("password", "")

        if not email or not nickname or not display_name or not password:
            return err("Все поля обязательны")
        if len(password) < 6:
            return err("Пароль минимум 6 символов")

        pw_hash = hash_password(password)
        conn = get_conn()
        cur = conn.cursor()
        try:
            cur.execute(
                f"INSERT INTO {SCHEMA}.users (email, nickname, display_name, password_hash) VALUES (%s, %s, %s, %s) RETURNING id",
                (email, nickname, display_name, pw_hash),
            )
            user_id = cur.fetchone()[0]
            conn.commit()
        except Exception as e:
            conn.rollback()
            if "unique" in str(e).lower():
                return err("Email или никнейм уже заняты")
            raise
        finally:
            cur.close()
            conn.close()

        token = make_token(user_id)
        return ok({
            "token": token,
            "user": {
                "id": user_id,
                "display_name": display_name,
                "nickname": nickname,
                "xp": 0,
                "level": 1,
                "coins": 0,
                "books_read": 0,
                "reviews_count": 0,
                "bookmarks_count": 0,
                "followers_count": 0,
                "avatar_emoji": "📚",
                "bio": "",
                "social_telegram": "",
                "social_instagram": "",
                "social_twitter": "",
            },
        })

    # --- LOGIN ---
    if action == "login" and method == "POST":
        email = body.get("email", "").strip().lower()
        password = body.get("password", "")

        if not email or not password:
            return err("Email и пароль обязательны")

        pw_hash = hash_password(password)
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, display_name, nickname, xp, level, coins, books_read, reviews_count, bookmarks_count, followers_count, avatar_emoji, bio, social_telegram, social_instagram, social_twitter FROM {SCHEMA}.users WHERE email=%s AND password_hash=%s",
            (email, pw_hash),
        )
        row = cur.fetchone()
        cur.close()
        conn.close()

        if not row:
            return err("Неверный email или пароль", 401)

        uid, display_name, nickname, xp, level, coins, books_read, reviews_count, bookmarks_count, followers_count, avatar_emoji, bio, tg, ig, tw = row
        token = make_token(uid)
        return ok({
            "token": token,
            "user": {
                "id": uid,
                "display_name": display_name,
                "nickname": nickname,
                "xp": xp,
                "level": level,
                "coins": coins,
                "books_read": books_read,
                "reviews_count": reviews_count,
                "bookmarks_count": bookmarks_count,
                "followers_count": followers_count,
                "avatar_emoji": avatar_emoji,
                "bio": bio,
                "social_telegram": tg or "",
                "social_instagram": ig or "",
                "social_twitter": tw or "",
            },
        })

    # --- ME ---
    if action == "me" and method == "GET":
        auth = event.get("headers", {}).get("X-Authorization", "")
        token = auth.replace("Bearer ", "").strip()
        user_id = verify_token(token)
        if not user_id:
            return err("Не авторизован", 401)

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, display_name, nickname, xp, level, coins, books_read, reviews_count, bookmarks_count, followers_count, avatar_emoji, bio, social_telegram, social_instagram, social_twitter FROM {SCHEMA}.users WHERE id=%s",
            (user_id,),
        )
        row = cur.fetchone()
        cur.close()
        conn.close()

        if not row:
            return err("Пользователь не найден", 404)

        uid, display_name, nickname, xp, level, coins, books_read, reviews_count, bookmarks_count, followers_count, avatar_emoji, bio, tg, ig, tw = row
        return ok({
            "id": uid,
            "display_name": display_name,
            "nickname": nickname,
            "xp": xp,
            "level": level,
            "coins": coins,
            "books_read": books_read,
            "reviews_count": reviews_count,
            "bookmarks_count": bookmarks_count,
            "followers_count": followers_count,
            "avatar_emoji": avatar_emoji,
            "bio": bio,
            "social_telegram": tg or "",
            "social_instagram": ig or "",
            "social_twitter": tw or "",
        })

    return err("Неизвестное действие", 404)
