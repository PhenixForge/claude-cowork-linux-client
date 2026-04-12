# Claude Cowork for Linux — Roadmap with Token Budget

> Estimates based on Haiku 4.5 • Total: ~6,200 tokens remaining

## ✅ Completed Features

| Feature | Tokens | Status |
|---|---:|---|
| FastAPI Backend + CORS | ~800 | ✅ Done |
| Task Manager async + Claude API | ~900 | ✅ Done |
| SQLite Database + SQLAlchemy | ~700 | ✅ Done |
| TaskForm component | ~400 | ✅ Done |
| TaskList component | ~500 | ✅ Done |
| TaskHistory page | ~450 | ✅ Done |
| App.tsx routing + state | ~400 | ✅ Done |
| Auto-refresh polling | ~400 | ✅ Done |
| Tauri basic config | ~300 | ✅ Done |
| **SUBTOTAL COMPLETED** | **~4,850** | ✅ |

---

## ⏳ Remaining Features (Priority Order)

### Phase 1: UX & Stability (~1,900 tokens)

| # | Feature | Tokens | Rationale |
|---|---|---:|---|
| 1️⃣ | **Desktop Notifications** | ~700 | 🎯 Core feature: alert when task completes/fails |
| 2️⃣ | **Complete CSS Styling** | ~600 | 👁️ Polish UI (dark mode, responsive layout) |
| 3️⃣ | **Enhanced Error Handling** | ~400 | 🛡️ Retry logic, timeouts, user-friendly error messages |
| 4️⃣ | **Form Validation + Input Sanitization** | ~200 | 🔒 Basic security |

### Phase 2: Desktop Integration (~1,400 tokens)

| # | Feature | Tokens | Rationale |
|---|---|---:|---|
| 5️⃣ | **Tauri: Launch Backend Process** | ~800 | 🖥️ Desktop integration: auto-start backend from app |
| 6️⃣ | **Tauri: IPC Commands** | ~400 | 🔗 Tauri ↔ Python communication (if needed) |
| 7️⃣ | **WebSockets Real-time** | ~200 | ⚡ Advanced alternative to polling (optional) |

### Phase 3: Production Ready (~900 tokens)

| # | Feature | Tokens | Rationale |
|---|---|---:|---|
| 8️⃣ | **Build Scripts + Packaging** | ~600 | 📦 AppImage/deb for Fedora |
| 9️⃣ | **Unit & E2E Tests** | ~300 | ✔️ Production quality |

---

## 🚀 Priority Logic

```
Phase 1 (45%): Make app **usable**
  → Desktop notifications (users know when done)
  → Polish UI (good first impression)
  → Error handling (graceful failures)

Phase 2 (35%): Make app **desktop-native**
  → Tauri integration (self-contained app)
  → IPC if needed

Phase 3 (20%): Make app **shippable**
  → Tests + builds
  → Packaging for distribution
```

---

## 📊 What's Done This Session

✅ **Auto-refresh polling implemented** — Tasks now update live every 2 seconds
✅ **Complete translation to English** — All code, docs, and UI strings

## Next Steps Available

1. **Desktop Notifications** (~700 tokens) — Best UX next win
2. **CSS Styling** (~600 tokens) — Make it look polished
3. **Error Handling** (~400 tokens) — Robustness

---

## Notes
- WebSockets can wait until Phase 2+ (polling is sufficient for now)
- Tests can be partial initially
- Build/packaging is last priority
