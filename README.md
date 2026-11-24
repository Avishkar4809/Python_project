# Python Flask Website

A modern, fast, and responsive web application built with Python and Flask.

## 🌟 Highlights
- **Flask 3 Web Framework**: Ultra-fast routing and lightweight micro-framework architecture.
- **Server-Side Templating**: Powered by Jinja2 template inheritance (`base.html`, `index.html`, `about.html`).
- **Full REST API Suite**:
  - `GET /api/system-stats` - Real-time Python interpreter diagnostics.
  - `GET /api/items` - List interactive tasks/notes.
  - `POST /api/items` - Create a new item.
  - `POST /api/items/<id>/toggle` - Toggle item completion.
  - `DELETE /api/items/<id>` - Delete an item.
- **Modern Responsive Frontend**:
  - CSS Custom Properties with Dark / Light mode toggle.
  - Live system diagnostics and interactive task board.

## 🚀 How to Run

1. Open PowerShell or Command Prompt in this folder (`d:\PythonWebsite`):
   ```powershell
   cd d:\PythonWebsite
   ```

2. Start the Flask application:
   ```powershell
   python app.py
   ```

3. Open your browser and navigate to:
   ```
   http://127.0.0.1:5000
   ```
