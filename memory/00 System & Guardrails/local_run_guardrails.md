# 🛠️ System Guardrail: Local Execution Environment (NO LOCALHOST)

To ensure the Rajshree Learning Project remains functional and easy to debug in its target environment, all AI agents (especially Antigravity) and developers MUST follow these guardrails.

## 1. Local & GitHub Pages Compatibility
The project is optimized for direct filesystem execution (`file://` protocol) and hosting on **GitHub Pages**. It must remain fully functional in both environments without requiring a local server.

### 🚨 Rules:
- **STRICTLY NO LOCALHOST**: Do NOT attempt to run or view the project using `http://localhost:[PORT]`. This includes ports 8080, 8000, 5500, 5501, 8001, 8003, etc.
- **DIRECT FILE ACCESS ONLY**: Always open the `index.html` file path directly (e.g., `file:///C:/.../index.html`).
- **NO PAID HOSTING**: The project will always use GitHub Pages or local file access. 
- **NEVER** assume a local dev server is running (Vite, Live Server, etc.).
- **NEVER** use `fetch()` or `XMLHttpRequest` for internal project files, as these are blocked by browser security (CORS) when running via `file://`.
- **ALWAYS** use JavaScript Template Strings to modularize components (HTML/Data) if they need to be separate from the main `index.html`.
- **ALWAYS** use relative paths for CSS, JS, and image assets.

## 2. Browser Automation Guardrails (For AI Agents)
- **MANDATORY**: When using browser automation tools (like `open_browser_url`), you **MUST** use the absolute file path with the `file:///` protocol.
- **Example**: `open_browser_url("file:///c:/Users/.../index.html")`
- **NEVER** use `http://localhost` or any web server URL in browser automation tools for this project.
- If a browser tool fails to open a `file://` URL, rely on manual verification from the user or code-level testing.

## 3. UI/UX Consistency
- All new UI elements must follow the existing **Pastel/Glassmorphism** design language.
- Use `-webkit-backdrop-filter: blur(20px)` and `backdrop-filter: blur(20px)` for overlays and popups to maintain the premium look.

