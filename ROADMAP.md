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
| Desktop Notifications | ~700 | ✅ Done |
| Dark mode & responsive design | ~400 | ✅ Done |
| Error Handling & retry logic | ~400 | ✅ Done |
| Tauri basic config | ~300 | ✅ Done |
| **SUBTOTAL COMPLETED** | **~6,350** | ✅ |

---

## ⏳ Remaining Features (Priority Order)

### Phase 1: UX & Stability (~200 tokens) — 95% COMPLETE! 🎉

| # | Feature | Tokens | Status | Rationale |
|---|---|---:|---|---|
| 1️⃣ | **Desktop Notifications** | ~700 | ✅ Done | 🎯 Core feature: alert when task completes/fails |
| 2️⃣ | **Complete CSS Styling** | ~400 | ✅ Done | 👁️ Polish UI (dark mode, responsive layout) |
| 3️⃣ | **Enhanced Error Handling** | ~400 | ✅ Done | 🛡️ Retry logic, timeouts, user-friendly error messages |
| 4️⃣ | **Form Validation + Input Sanitization** | ~200 | ⏳ Last! | 🔒 Basic security |

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

✅ **Initial project setup** — Backend (FastAPI), Frontend (React), Desktop (Tauri)
✅ **Auto-refresh polling** — Tasks update live every 2 seconds  
✅ **Complete English translation** — All code, docs, and UI strings
✅ **Design refactor** — Neutral palette (brown, gray, white, black)
✅ **GitHub repository** — Published to PhenixForge/cowork-linux
✅ **Desktop Notifications** — Alert users when tasks complete/fail
✅ **API Strategy documented** — Three options in API-OPTIONS.md

**Tokens Used This Session**: ~5,550 of 10,000+ estimated total

## Next Steps Available

**Continue Phase 1 UX & Stability:**
1. **CSS Styling Enhancements** (~400 tokens) — Responsive, dark mode support
2. **Error Handling** (~400 tokens) — Retry logic, better error messages
3. **Form Validation** (~200 tokens) — Input sanitization, user guidance

**Or Jump to Phase 2:**
- **Tauri Desktop Integration** — Auto-launch backend from app (~800 tokens)

---

## Notes
- WebSockets can wait until Phase 2+ (polling is sufficient for now)
- Tests can be partial initially
- Build/packaging is last priority
