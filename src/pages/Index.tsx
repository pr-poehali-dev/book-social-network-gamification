import { useState } from "react";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/AuthModal";

const BOOKS = [
  {
    id: 1,
    title: "Мастер и Маргарита",
    author: "М. Булгаков",
    genre: "Классика",
    rating: 4.9,
    cover: "https://cdn.poehali.dev/projects/04f32df7-a614-4ddc-8828-1355988b1c66/files/e7786069-ba88-4657-a007-13e845258200.jpg",
    pages: 480,
    progress: 68,
    bookmarked: true,
    audio: false,
  },
  {
    id: 2,
    title: "Дюна",
    author: "Ф. Герберт",
    genre: "Фантастика",
    rating: 4.8,
    cover: "https://cdn.poehali.dev/projects/04f32df7-a614-4ddc-8828-1355988b1c66/files/d74b2702-65db-4ee2-8594-f3dcfa39ae9c.jpg",
    pages: 896,
    progress: 35,
    bookmarked: false,
    audio: true,
  },
  {
    id: 3,
    title: "1984",
    author: "Дж. Оруэлл",
    genre: "Антиутопия",
    rating: 4.7,
    cover: "https://cdn.poehali.dev/projects/04f32df7-a614-4ddc-8828-1355988b1c66/files/e7786069-ba88-4657-a007-13e845258200.jpg",
    pages: 328,
    progress: 100,
    bookmarked: true,
    audio: true,
  },
  {
    id: 4,
    title: "Преступление и наказание",
    author: "Ф. Достоевский",
    genre: "Классика",
    rating: 4.6,
    cover: "https://cdn.poehali.dev/projects/04f32df7-a614-4ddc-8828-1355988b1c66/files/d74b2702-65db-4ee2-8594-f3dcfa39ae9c.jpg",
    pages: 574,
    progress: 0,
    bookmarked: false,
    audio: false,
  },
  {
    id: 5,
    title: "Солярис",
    author: "С. Лем",
    genre: "Фантастика",
    rating: 4.5,
    cover: "https://cdn.poehali.dev/projects/04f32df7-a614-4ddc-8828-1355988b1c66/files/e7786069-ba88-4657-a007-13e845258200.jpg",
    pages: 288,
    progress: 52,
    bookmarked: true,
    audio: false,
  },
  {
    id: 6,
    title: "Гарри Поттер",
    author: "Дж. Роулинг",
    genre: "Фэнтези",
    rating: 4.8,
    cover: "https://cdn.poehali.dev/projects/04f32df7-a614-4ddc-8828-1355988b1c66/files/d74b2702-65db-4ee2-8594-f3dcfa39ae9c.jpg",
    pages: 309,
    progress: 100,
    bookmarked: false,
    audio: true,
  },
];

const GENRES = [
  { name: "Фантастика", emoji: "🚀", count: 248, color: "#8B5CF6" },
  { name: "Фэнтези", emoji: "🧙", count: 193, color: "#2DD4BF" },
  { name: "Классика", emoji: "📜", count: 312, color: "#F5A623" },
  { name: "Детектив", emoji: "🔍", count: 176, color: "#F43F5E" },
  { name: "Антиутопия", emoji: "🌑", count: 89, color: "#6366F1" },
  { name: "Роман", emoji: "💌", count: 421, color: "#EC4899" },
  { name: "История", emoji: "🏛️", count: 134, color: "#10B981" },
  { name: "Психология", emoji: "🧠", count: 97, color: "#F59E0B" },
];

const TOP_READERS = [
  { rank: 1, name: "Алиса Громова", nick: "@alisa_reads", avatar: "🧑‍🦰", xp: 12480, books: 87, badge: "👑", level: 42 },
  { rank: 2, name: "Максим Волков", nick: "@max_books", avatar: "🧑‍💼", xp: 11200, books: 74, badge: "🥈", level: 38 },
  { rank: 3, name: "Елена Светова", nick: "@lena_lit", avatar: "👩", xp: 9850, books: 61, badge: "🥉", level: 34 },
  { rank: 4, name: "Денис Крылов", nick: "@denis_k", avatar: "🧔", xp: 8700, books: 55, badge: "⚡", level: 30 },
  { rank: 5, name: "Мария Белова", nick: "@masha_b", avatar: "👩‍🦱", xp: 7600, books: 48, badge: "🔥", level: 27 },
];

const ACHIEVEMENTS = [
  { icon: "📚", name: "Книжный червь", desc: "Прочитал 10 книг", earned: true },
  { icon: "⚡", name: "Спринтер", desc: "3 книги за неделю", earned: true },
  { icon: "🌟", name: "Рецензент", desc: "50 отзывов", earned: true },
  { icon: "🏆", name: "Легенда", desc: "100 книг", earned: false },
  { icon: "🎯", name: "Снайпер жанра", desc: "20 книг одного жанра", earned: false },
  { icon: "💬", name: "Оратор", desc: "200 комментариев", earned: false },
];

const SHOP_ITEMS = [
  { name: "Скидка 15% в Читай-город", cost: 500, icon: "🏪", category: "Скидки" },
  { name: "Скидка 20% в Буквоед", cost: 800, icon: "📖", category: "Скидки" },
  { name: "Стикерпак BookVerse", cost: 300, icon: "🎨", category: "Мерч" },
  { name: "Футболка с принтом", cost: 1200, icon: "👕", category: "Мерч" },
  { name: "Фирменная кружка", cost: 700, icon: "☕", category: "Мерч" },
  { name: "Эксклюзивный значок", cost: 200, icon: "🎖️", category: "Мерч" },
];

type Tab = "library" | "genres" | "ratings" | "profile";

export default function Index() {
  const { user, loading: authLoading, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("library");
  const [genreFilter, setGenreFilter] = useState<string | null>(null);
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [selectedBook, setSelectedBook] = useState<typeof BOOKS[0] | null>(null);
  const [shopTab, setShopTab] = useState("Скидки");

  const filteredBooks = BOOKS.filter((b) => {
    if (genreFilter && b.genre !== genreFilter) return false;
    if (bookmarkedOnly && !b.bookmarked) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background grid-bg font-golos">
      {/* Decorative particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="particle w-2 h-2 bg-[#F5A623] opacity-40 top-[15%] left-[10%]" style={{ animationDelay: "0s" }} />
        <div className="particle w-3 h-3 bg-[#8B5CF6] opacity-30 top-[40%] left-[90%]" style={{ animationDelay: "1s" }} />
        <div className="particle w-2 h-2 bg-[#2DD4BF] opacity-40 top-[70%] left-[20%]" style={{ animationDelay: "2s" }} />
        <div className="particle w-1.5 h-1.5 bg-[#F43F5E] opacity-50 top-[25%] left-[75%]" style={{ animationDelay: "0.5s" }} />
        <div className="particle w-2 h-2 bg-[#F5A623] opacity-30 top-[85%] left-[60%]" style={{ animationDelay: "1.5s" }} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#F5A623] to-[#8B5CF6] flex items-center justify-center text-lg xp-pulse">
              📚
            </div>
            <span className="font-cormorant font-bold text-2xl gradient-text">BookVerse</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {[
              { id: "library" as Tab, label: "Библиотека", icon: "BookOpen" },
              { id: "genres" as Tab, label: "Жанры", icon: "Layers" },
              { id: "ratings" as Tab, label: "Рейтинги", icon: "Trophy" },
              { id: "profile" as Tab, label: "Профиль", icon: "User" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`nav-link flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  activeTab === item.id ? "text-gold active" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon name={item.icon} size={15} />
                {item.label}
              </button>
            ))}
          </nav>

          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-muted rounded-full px-3 py-1.5 border border-[#F5A623]/30 glow-gold">
                <span className="text-lg">{user.avatar_emoji}</span>
                <span className="text-gold text-sm font-bold">⚡ {user.xp.toLocaleString("ru")} XP</span>
                <div className="w-px h-4 bg-border" />
                <span className="text-xs text-muted-foreground">Ур. {user.level}</span>
              </div>
              <button
                onClick={logout}
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="Выйти"
              >
                <Icon name="LogOut" size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              disabled={authLoading}
              className="bg-gradient-to-r from-[#F5A623] to-[#8B5CF6] text-white font-bold px-4 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity"
            >
              Войти
            </button>
          )}
        </div>

        <div className="md:hidden flex border-t border-border">
          {[
            { id: "library" as Tab, label: "Книги", icon: "BookOpen" },
            { id: "genres" as Tab, label: "Жанры", icon: "Layers" },
            { id: "ratings" as Tab, label: "Топ", icon: "Trophy" },
            { id: "profile" as Tab, label: "Профиль", icon: "User" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-1 py-2.5 flex flex-col items-center gap-1 text-xs transition-colors ${
                activeTab === item.id ? "text-gold" : "text-muted-foreground"
              }`}
            >
              <Icon name={item.icon} size={18} />
              {item.label}
            </button>
          ))}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">

        {/* LIBRARY */}
        {activeTab === "library" && (
          <div className="animate-fade-in">
            <div className="mb-10 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1040] via-[#0f172a] to-[#0d1f1e] border border-[#8B5CF6]/30 p-8 md:p-12">
              <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/10 to-[#2DD4BF]/10" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-[#F5A623]/15 border border-[#F5A623]/30 rounded-full px-3 py-1 text-xs text-gold mb-4">
                  ✨ Новинки недели добавлены
                </div>
                <h1 className="font-cormorant text-4xl md:text-6xl font-bold text-foreground mb-3 leading-tight">
                  Читай. Делись.<br />
                  <span className="gradient-text">Побеждай.</span>
                </h1>
                <p className="text-muted-foreground text-base md:text-lg max-w-md mb-6">
                  Бесплатная библиотека + геймификация. Зарабатывай XP за каждую прочитанную страницу.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button className="bg-gold text-[#0f0f1a] font-bold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
                    <Icon name="BookOpen" size={16} />
                    Начать читать
                  </button>
                  <button className="border border-border text-foreground px-5 py-2.5 rounded-lg hover:border-[#8B5CF6] transition-colors flex items-center gap-2">
                    <Icon name="Headphones" size={16} />
                    Аудиокниги
                  </button>
                </div>
              </div>
              <div className="absolute right-8 top-8 text-8xl opacity-10 font-cormorant select-none hidden md:block">
                📖
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <button
                onClick={() => setBookmarkedOnly(!bookmarkedOnly)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border transition-all ${
                  bookmarkedOnly
                    ? "bg-[#F5A623]/20 border-[#F5A623] text-gold"
                    : "border-border text-muted-foreground hover:border-[#F5A623]/50"
                }`}
              >
                <Icon name="Bookmark" size={14} />
                Мои закладки
              </button>
              {["Классика", "Фантастика", "Фэнтези", "Антиутопия"].map((g) => (
                <button
                  key={g}
                  onClick={() => setGenreFilter(genreFilter === g ? null : g)}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                    genreFilter === g
                      ? "bg-[#8B5CF6]/20 border-[#8B5CF6] text-[#a78bfa]"
                      : "border-border text-muted-foreground hover:border-[#8B5CF6]/50"
                  }`}
                >
                  {g}
                </button>
              ))}
              {(genreFilter || bookmarkedOnly) && (
                <button
                  onClick={() => { setGenreFilter(null); setBookmarkedOnly(false); }}
                  className="px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <Icon name="X" size={13} /> Сбросить
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {filteredBooks.map((book, i) => (
                <div
                  key={book.id}
                  className="book-card group animate-fade-in"
                  style={{ animationDelay: `${i * 0.06}s` }}
                  onClick={() => setSelectedBook(book)}
                >
                  <div className="relative aspect-[2/3] overflow-hidden rounded-t-lg">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {book.audio && (
                        <span className="bg-[#2DD4BF]/90 text-[#0f172a] text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <Icon name="Headphones" size={10} /> Аудио
                        </span>
                      )}
                      {book.progress === 100 && (
                        <span className="bg-[#10B981]/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                          ✓ Прочитана
                        </span>
                      )}
                    </div>
                    {book.bookmarked && (
                      <div className="absolute top-2 right-2 text-gold">
                        <Icon name="Bookmark" size={16} />
                      </div>
                    )}
                    {book.progress > 0 && book.progress < 100 && (
                      <div className="absolute bottom-0 left-0 right-0 px-2 pb-2 bg-gradient-to-t from-black/80 to-transparent">
                        <div className="flex justify-between text-[10px] text-white mb-1">
                          <span>Прогресс</span>
                          <span>{book.progress}%</span>
                        </div>
                        <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                          <div className="progress-bar h-full" style={{ width: `${book.progress}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-sm leading-tight mb-0.5 line-clamp-2">{book.title}</p>
                    <p className="text-xs text-muted-foreground mb-2">{book.author}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-[#F5A623]">★ {book.rating}</span>
                      <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{book.genre}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredBooks.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <div className="text-4xl mb-3">📭</div>
                <p>Ничего не найдено</p>
              </div>
            )}
          </div>
        )}

        {/* GENRES */}
        {activeTab === "genres" && (
          <div className="animate-fade-in">
            <div className="mb-8">
              <h2 className="font-cormorant text-4xl font-bold mb-2">Все жанры</h2>
              <p className="text-muted-foreground">Откройте книги по вашему любимому направлению</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {GENRES.map((genre, i) => (
                <div
                  key={genre.name}
                  className="card-hover book-card p-6 flex flex-col items-center text-center cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${i * 0.05}s`, borderColor: genre.color + "33" }}
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 badge-shine"
                    style={{ background: genre.color + "22", border: `1px solid ${genre.color}44` }}
                  >
                    {genre.emoji}
                  </div>
                  <h3 className="font-semibold text-base mb-1">{genre.name}</h3>
                  <p className="text-sm text-muted-foreground">{genre.count} книг</p>
                  <div className="mt-3 h-1 w-full rounded-full overflow-hidden bg-muted">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${Math.round((genre.count / 450) * 100)}%`, background: genre.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl overflow-hidden border border-[#8B5CF6]/30 bg-gradient-to-r from-[#1a1040] to-[#0f172a] p-8 flex items-center justify-between">
              <div>
                <div className="text-xs text-[#a78bfa] font-semibold mb-2 tracking-widest uppercase">Жанр недели</div>
                <h3 className="font-cormorant text-3xl font-bold mb-2">🚀 Фантастика</h3>
                <p className="text-muted-foreground text-sm mb-4">248 книг · +12 новинок</p>
                <button className="bg-[#8B5CF6] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#7c3aed] transition-colors">
                  Смотреть все
                </button>
              </div>
              <div className="text-7xl opacity-20 hidden md:block">🌌</div>
            </div>
          </div>
        )}

        {/* RATINGS */}
        {activeTab === "ratings" && (
          <div className="animate-fade-in">
            <div className="mb-8">
              <h2 className="font-cormorant text-4xl font-bold mb-2">Рейтинг читателей</h2>
              <p className="text-muted-foreground">Соревнуйтесь с лучшими книжными героями платформы</p>
            </div>

            <div className="flex items-end justify-center gap-4 mb-10 h-48">
              {[TOP_READERS[1], TOP_READERS[0], TOP_READERS[2]].map((reader, i) => {
                const heights = ["h-32", "h-44", "h-28"];
                const colors = ["bg-[#94a3b8]", "bg-gradient-to-t from-[#F5A623] to-[#fbbf24]", "bg-[#cd7f32]"];
                return (
                  <div key={reader.rank} className="flex flex-col items-center gap-2">
                    <div className="text-3xl animate-float" style={{ animationDelay: `${i * 0.5}s` }}>{reader.avatar}</div>
                    <div className="text-lg">{reader.badge}</div>
                    <div className="text-xs font-semibold text-center w-20 leading-tight">{reader.name.split(" ")[0]}</div>
                    <div
                      className={`w-20 ${heights[i]} ${colors[i]} rounded-t-xl flex items-start justify-center pt-3 font-cormorant font-bold text-2xl text-white`}
                    >
                      {[2, 1, 3][i]}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-3">
              {TOP_READERS.map((reader, i) => (
                <div
                  key={reader.rank}
                  className={`book-card p-4 flex items-center gap-4 animate-fade-in ${i === 0 ? "border-[#F5A623]/40 glow-gold" : ""}`}
                  style={{ animationDelay: `${i * 0.07}s` }}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    i === 0 ? "bg-[#F5A623] text-[#0f0f1a]" :
                    i === 1 ? "bg-[#94a3b8] text-white" :
                    i === 2 ? "bg-[#cd7f32] text-white" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {reader.rank}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#2DD4BF] flex items-center justify-center text-xl">
                    {reader.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm truncate">{reader.name}</span>
                      <span className="text-xs text-muted-foreground hidden sm:inline">{reader.nick}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden max-w-32">
                        <div
                          className="progress-bar h-full"
                          style={{ width: `${Math.round((reader.xp / 13000) * 100)}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-muted-foreground">Ур. {reader.level}</span>
                    </div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <div className="text-gold font-bold text-sm">⚡ {reader.xp.toLocaleString("ru")}</div>
                    <div className="text-xs text-muted-foreground">{reader.books} книг</div>
                  </div>
                  <div className="text-2xl">{reader.badge}</div>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-cormorant text-3xl font-bold">Магазин наград</h3>
                <div className="bg-[#F5A623]/15 border border-[#F5A623]/30 rounded-full px-4 py-1.5 text-gold font-bold text-sm">
                  💰 2 340 монет
                </div>
              </div>
              <div className="flex gap-2 mb-5">
                {["Скидки", "Мерч"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setShopTab(t)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      shopTab === t
                        ? "bg-[#8B5CF6] text-white"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {SHOP_ITEMS.filter((s) => s.category === shopTab).map((item, i) => (
                  <div
                    key={item.name}
                    className="book-card p-5 flex items-center gap-4 animate-fade-in"
                    style={{ animationDelay: `${i * 0.06}s` }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl flex-shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm leading-tight mb-1">{item.name}</p>
                      <p className="text-gold font-bold text-sm">💰 {item.cost} монет</p>
                    </div>
                    <button className="bg-[#8B5CF6] hover:bg-[#7c3aed] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex-shrink-0">
                      Обменять
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PROFILE */}
        {activeTab === "profile" && (
          <div className="animate-fade-in">
            {!user ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔐</div>
                <h2 className="font-cormorant text-3xl font-bold mb-3">Войди в аккаунт</h2>
                <p className="text-muted-foreground mb-6">Чтобы видеть профиль, закладки и XP — нужно войти</p>
                <button
                  onClick={() => setShowAuth(true)}
                  className="bg-gradient-to-r from-[#F5A623] to-[#8B5CF6] text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity"
                >
                  Войти или зарегистрироваться
                </button>
              </div>
            ) : (
            <>
            <div className="relative rounded-2xl overflow-hidden border border-border mb-8">
              <div className="h-32 bg-gradient-to-r from-[#1a1040] via-[#2D1B69] to-[#0d2929]" />
              <div className="px-6 pb-6">
                <div className="flex items-end gap-4 -mt-12 mb-4">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#F5A623] to-[#8B5CF6] flex items-center justify-center text-4xl border-4 border-background xp-pulse">
                    {user.avatar_emoji}
                  </div>
                  <div className="pb-1">
                    <h2 className="font-cormorant font-bold text-2xl">{user.display_name}</h2>
                    <p className="text-muted-foreground text-sm">@{user.nickname}</p>
                  </div>
                  <button className="ml-auto mb-1 border border-border px-3 py-1.5 rounded-lg text-sm hover:border-[#8B5CF6] transition-colors flex items-center gap-1.5">
                    <Icon name="Edit2" size={13} /> Изменить
                  </button>
                </div>
                {user.bio && (
                  <p className="text-muted-foreground text-sm mb-4 max-w-lg">{user.bio}</p>
                )}
                <div className="flex flex-wrap gap-3 mb-6">
                  {user.social_telegram && (
                    <a href={user.social_telegram} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-[#2DD4BF] transition-colors">
                      <Icon name="Link" size={13} /> Telegram
                    </a>
                  )}
                  {user.social_instagram && (
                    <a href={user.social_instagram} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-[#8B5CF6] transition-colors">
                      <Icon name="Instagram" size={13} /> Instagram
                    </a>
                  )}
                  {user.social_twitter && (
                    <a href={user.social_twitter} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-[#1da1f2] transition-colors">
                      <Icon name="Twitter" size={13} /> Twitter
                    </a>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Книг прочитано", value: String(user.books_read), icon: "📚" },
                    { label: "Отзывов написано", value: String(user.reviews_count), icon: "✍️" },
                    { label: "Закладок", value: String(user.bookmarks_count), icon: "🔖" },
                    { label: "Подписчиков", value: String(user.followers_count), icon: "👥" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-muted rounded-xl p-4 text-center">
                      <div className="text-2xl mb-1">{stat.icon}</div>
                      <div className="font-cormorant font-bold text-2xl text-foreground">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="book-card p-6 mb-8 border-[#F5A623]/30 glow-gold">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-cormorant text-xl font-bold">Уровень {user.level}</h3>
                  <p className="text-sm text-muted-foreground">{user.xp.toLocaleString("ru")} / {(user.level * 250).toLocaleString("ru")} XP до следующего уровня</p>
                </div>
                <div className="text-3xl">⚡</div>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div className="progress-bar h-full" style={{ width: `${Math.min(100, Math.round((user.xp % 250) / 250 * 100))}%` }} />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>{user.xp.toLocaleString("ru")} XP</span>
                <span>💰 {user.coins.toLocaleString("ru")} монет</span>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-cormorant text-2xl font-bold mb-4">Достижения</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {ACHIEVEMENTS.map((ach, i) => (
                  <div
                    key={ach.name}
                    className={`book-card p-4 text-center animate-fade-in ${ach.earned ? "border-[#F5A623]/30" : "opacity-40"}`}
                    style={{ animationDelay: `${i * 0.07}s` }}
                  >
                    <div className={`text-3xl mb-2 ${ach.earned ? "badge-shine inline-block" : ""}`}>
                      {ach.icon}
                    </div>
                    <p className="text-xs font-semibold leading-tight mb-1">{ach.name}</p>
                    <p className="text-[10px] text-muted-foreground">{ach.desc}</p>
                    {ach.earned && (
                      <div className="mt-2 text-[10px] text-[#2DD4BF] font-bold">✓ Получено</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-cormorant text-2xl font-bold mb-4">История чтения</h3>
              <div className="space-y-3">
                {BOOKS.filter((b) => b.progress > 0).map((book, i) => (
                  <div
                    key={book.id}
                    className="book-card p-4 flex items-center gap-4 animate-fade-in"
                    style={{ animationDelay: `${i * 0.06}s` }}
                  >
                    <img src={book.cover} alt={book.title} className="w-10 h-14 object-cover rounded" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{book.title}</p>
                      <p className="text-xs text-muted-foreground mb-2">{book.author}</p>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="progress-bar h-full" style={{ width: `${book.progress}%` }} />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-bold ${book.progress === 100 ? "text-[#10B981]" : "text-gold"}`}>
                        {book.progress}%
                      </div>
                      {book.bookmarked && (
                        <div className="mt-1">
                          <Icon name="Bookmark" size={12} className="text-gold" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </>
            )}
          </div>
        )}
      </main>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      {/* Book detail modal */}
      {selectedBook && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedBook(null)}
        >
          <div
            className="bg-card border border-border rounded-2xl max-w-md w-full p-6 animate-scale-in relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedBook(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <Icon name="X" size={18} />
            </button>

            <div className="flex gap-5 mb-5">
              <img
                src={selectedBook.cover}
                alt={selectedBook.title}
                className="w-24 h-36 object-cover rounded-lg flex-shrink-0"
              />
              <div>
                <div className="text-xs text-[#a78bfa] mb-1 font-semibold">{selectedBook.genre}</div>
                <h3 className="font-cormorant font-bold text-xl mb-1">{selectedBook.title}</h3>
                <p className="text-muted-foreground text-sm mb-3">{selectedBook.author}</p>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gold">★ {selectedBook.rating}</span>
                  <span className="text-muted-foreground">{selectedBook.pages} стр.</span>
                  {selectedBook.audio && (
                    <span className="flex items-center gap-1 text-[#2DD4BF]">
                      <Icon name="Headphones" size={12} /> Аудио
                    </span>
                  )}
                </div>
              </div>
            </div>

            {selectedBook.progress > 0 && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>Прогресс чтения</span>
                  <span>{selectedBook.progress}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="progress-bar h-full" style={{ width: `${selectedBook.progress}%` }} />
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3">
              <button className="bg-gold text-[#0f0f1a] font-bold py-2.5 rounded-lg text-sm flex items-center justify-center gap-1.5 col-span-2">
                <Icon name="BookOpen" size={15} />
                {selectedBook.progress > 0 && selectedBook.progress < 100 ? "Продолжить" : selectedBook.progress === 100 ? "Перечитать" : "Читать"}
              </button>
              <button className={`border py-2.5 rounded-lg text-sm flex items-center justify-center gap-1.5 transition-colors ${
                selectedBook.bookmarked
                  ? "border-gold text-gold"
                  : "border-border text-muted-foreground hover:border-gold hover:text-gold"
              }`}>
                <Icon name="Bookmark" size={15} />
              </button>
            </div>

            {selectedBook.audio && (
              <button className="w-full mt-2 border border-[#2DD4BF]/40 text-[#2DD4BF] py-2.5 rounded-lg text-sm flex items-center justify-center gap-1.5 hover:bg-[#2DD4BF]/10 transition-colors">
                <Icon name="Headphones" size={15} /> Слушать аудиоверсию
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}