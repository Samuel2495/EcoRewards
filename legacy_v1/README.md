# EcoRewards

EcoRewards is a web-based platform designed to incentivize eco-friendly behaviors through a gamified reward system.

## How to Run

Since this is a static web application (HTML/CSS/JS), you do not need to install any complex dependencies.

### Option 1: Direct Open
Simply double-click `index.html` to open it in your default web browser.

### Option 2: Local Server (Recommended)
For the best experience (and to avoid potential browser security restrictions with local files), run a simple local HTTP server.

**Using Python:**
```bash
python3 -m http.server
```
Then open [http://localhost:8000](http://localhost:8000) in your browser.

**Using Node.js (if installed):**
```bash
npx serve .
```

## Default Credentials

The application uses `localStorage` to manage users. The following default accounts are available:

### Admin Account
- **Username:** `admin_123`
- **Password:** `admin123`

### User Accounts
- **Username:** `Sharaun_2006`
- **Password:** `sharaun2006`

- **Username:** `samuel_2005`
- **Password:** `samuel2005`

- **Username:** `sreeraj_2005`
- **Password:** `sreeraj2005`

> **Note:** If you cannot log in, try clearing your browser's Application/Local Storage for this site, as the default users are only initialized if the storage is empty.
