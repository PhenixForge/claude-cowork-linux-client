# Security Guidelines for Claude Cowork for Linux

## Credential Management

### Protecting Your API Keys

1. **Never commit credentials to git**
   - All `.env` files are in `.gitignore`
   - The `.env` file is ignored and will never be committed
   - Verify with: `git status --ignored | grep .env`

2. **Use `.env.example` as a template**
   - Copy `.env.example` to `.env` and fill in real values
   - Share `.env.example` in version control (placeholder values only)
   - Never share `.env` itself

3. **Rotate compromised keys immediately**
   - If an API key is exposed, generate a new one at https://console.anthropic.com/account/keys
   - Revoke the compromised key
   - Update `.env` with the new key

### Local Environment Setup

```bash
# Create your local .env from template
cp .env.example .env

# Edit .env and add your real credentials
nano .env

# Verify .env is ignored by git
git check-ignore .env
# Output: .env
```

### Backend Environment (.env in backend/)

The backend also has a `.env` file in the `backend/` directory:

```bash
backend/.env              # Your local credentials (ignored)
backend/.env.example      # Template (in version control)
```

Follow the same pattern: copy `.env.example` to `.env` locally.

---

## What Gets Stored Where

| Type | Location | Committed? | Notes |
|------|----------|-----------|-------|
| API Keys | `.env`, `backend/.env` | ❌ No | Git-ignored, never committed |
| Code | `src-*/**/*.{ts,tsx,py}` | ✅ Yes | No secrets in source |
| Config Templates | `.env.example`, `backend/.env.example` | ✅ Yes | Placeholder values only |
| Database | `*.db`, `*.db-shm` | ❌ No | SQLite files, git-ignored |
| Logs | `*.log` | ❌ No | Optional, add to .gitignore if used |

---

## Git Security Checks

Verify no credentials are leaked:

```bash
# Check if any API keys match patterns
git log --all -p | grep -E "sk-ant-|ANTHROPIC_API|ghp_" || echo "✅ No secrets found"

# Check working directory
grep -r "sk-ant-\|ANTHROPIC_API\|ghp_" src-* --include="*.py" --include="*.ts" --include="*.tsx" || echo "✅ No secrets in code"

# Verify .env is truly ignored
git status --ignored | grep "\.env"
```

---

## If You've Accidentally Committed a Secret

If you discover a credential in git history:

1. **Immediately revoke the key** (e.g., delete the API key from console.anthropic.com)
2. **Rewrite git history** to remove it:
   ```bash
   git filter-branch --tree-filter 'rm -f .env' HEAD
   git push origin main --force-with-lease
   ```
3. **Generate a new credential** and update `.env` locally

---

## CI/CD & Secrets in Future Deployment

When deploying (Tauri, Docker, GitHub Actions, etc.):

1. **Use secret management**, not .env files
   - GitHub Actions: Repository Secrets
   - Docker: Docker Secrets or environment variable injection
   - Tauri: Configuration files in protected app data directory

2. **Never bake secrets into binaries**
   - Load credentials at runtime from secure storage
   - Use OS credential managers when possible

3. **Audit what's in packages**
   - Check AppImage, deb, rpm contents for .env files before distribution
   - Use `tar -tzf package.tar.gz | grep -E "\.env|credentials"`

---

## Questions to Ask When Adding New Integrations

Before integrating a new tool (Slack, Notion, Google Drive, etc.):

- Where do I store the auth token or API key?
- Is it a secret that should be in `.env`?
- Should it be added to `.gitignore`?
- Can the user rotate it without re-deploying?

Default answer: **Treat all third-party API keys like `ANTHROPIC_API_KEY`** — store in `.env`, add to `.gitignore`, document in `.env.example`.

---

## Development Best Practices

1. **Use `.env.example` as documentation**
   - Keep it up-to-date as new credentials are needed
   - Include comments explaining where to get each value

2. **Load credentials at startup**
   ```python
   # backend/app/config.py (example)
   from pydantic_settings import BaseSettings
   
   class Settings(BaseSettings):
       anthropic_api_key: str
       
       class Config:
           env_file = ".env"
   
   settings = Settings()
   ```

3. **Never log secrets**
   - Redact API keys in logs
   - Example: `api_key=sk-ant-...` (last 4 chars only)

4. **Review pull requests for credential leaks**
   - Look for any `ANTHROPIC_API_KEY=`, `ghp_`, `sk-ant-` patterns
   - Reject PRs that contain them

---

## Summary

- ✅ `.env` is in `.gitignore` — ignored by git
- ✅ `.env.example` provides a template — safe to commit
- ✅ API keys stored locally in `.env`, never in code
- ✅ If exposed, rotate immediately
- ✅ Document all credentials in `.env.example`

Questions? See GitHub: https://docs.github.com/en/actions/security-guides/encrypted-secrets
