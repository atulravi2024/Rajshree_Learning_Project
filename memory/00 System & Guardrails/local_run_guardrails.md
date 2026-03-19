# 🛠️ System Guardrail: Local Execution Environment

To ensure the Rajshree Learning Project remains functional and easy to debug in its target environment, all AI agents and developers MUST follow these guardrails.

## 1. Local & GitHub Pages Compatibility
The project is optimized for direct filesystem execution (`file://` protocol) and hosting on **GitHub Pages**. It must remain fully functional in both environments without requiring a local server.

### 🚨 Rules:
- **NO PAID HOSTING**: The project will always use GitHub Pages or local file access. 
- **NEVER** assume a local dev server is running (Vite, Live Server, etc.).
- **NEVER** use `fetch()` or `XMLHttpRequest` for internal project files, as these are blocked by browser security (CORS) when running via `file://`.
- **ALWAYS** use JavaScript Template Strings to modularize components (HTML/Data) if they need to be separate from the main `index.html`.
- **ALWAYS** use relative paths for CSS, JS, and image assets.

## 2. Debugging Guardrails
- When using browser automation tools, attempt to directly open the `index.html` file path.
- If a browser tool fails to open a `file://` URL, rely on manual verification from the user or code-level testing.

## 3. UI/UX Consistency
- All new UI elements must follow the existing **Pastel/Glassmorphism** design language.
- Use `-webkit-backdrop-filter: blur(20px)` and `backdrop-filter: blur(20px)` for overlays and popups to maintain the premium look.
