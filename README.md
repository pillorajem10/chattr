# <h1 align="center">Chattr Frontend – Setup and Configuration Guide</h1>

<p align="center">
A React-based frontend powered by Vite, built with Node.js 20.19.0 and npm 10.8.2.  
This client connects with the Laravel 10 API backend and supports real-time features via Laravel WebSockets.
</p>

<hr/>

## Table of Contents
- [1. System Requirements](#1-system-requirements)
- [2. Installation Procedure](#2-installation-procedure)
- [3. Running the Application](#3-running-the-application)
- [4. Environment Configuration](#4-environment-configuration)
- [5. Backend & WebSocket Setup](#5-backend--websocket-setup)
- [6. Quick Command Summary](#6-quick-command-summary)
- [7. Completion](#7-completion)

<hr/>

## <h2 id="1-system-requirements">1. System Requirements</h2>

Ensure your system meets the following requirements:

- Node.js **v20.19.0**  
- npm **v10.8.2**  
- Modern web browser (Chrome, Firefox, or Edge)

<hr/>

## <h2 id="2-installation-procedure">2. Installation Procedure</h2>

### Step 1 – Clone the Repository
```bash
git clone https://github.com/pillorajem10/chattr.git
cd chattr
```

### Step 2 – Install Dependencies
```bash
npm install
```

### Step 3 – Configure Environment File
Copy the example environment file provided:
```bash
cp .env.example .env
```

> **Note:** The `.env.example` already includes the correct values for local setup — no further edits required.

<hr/>

## <h2 id="3-running-the-application">3. Running the Application</h2>

Start the frontend in development mode:
```bash
npm run dev
```

Default URL: [http://127.0.0.1:5173](http://127.0.0.1:5173)

Once started, the app will automatically connect to the backend API and WebSocket server if they are running locally.

<hr/>

## <h2 id="4-environment-configuration">4. Environment Configuration</h2>

The `.env.example` file includes the following variables:

```bash
VITE_PUSHER_APP_KEY=local
VITE_PUSHER_HOST=127.0.0.1
VITE_PUSHER_PORT=6001
VITE_PUSHER_CLUSTER=mt1

```

> These values ensure seamless communication with the local Laravel backend and WebSocket instance.

<hr/>

## <h2 id="5-backend--websocket-setup">5. Backend & WebSocket Setup</h2>

Make sure the **Laravel API** and **WebSocket server** are running locally.

### Laravel API
```bash
php artisan serve
```
Accessible at [http://127.0.0.1:8000](http://127.0.0.1:8000)

### Laravel WebSocket Server
```bash
php artisan websockets:serve
```

Dashboard: [http://127.0.0.1:8000/laravel-websockets](http://127.0.0.1:8000/laravel-websockets)

<hr/>

## <h2 id="6-quick-command-summary">6. Quick Command Summary</h2>

| Command | Description |
|:--|:--|
| `npm install` | Install project dependencies |
| `cp .env.example .env` | Copy default environment configuration |
| `npm run dev` | Run the local development server |

<hr/>

## <h2 id="7-completion">7. Completion</h2>

Your **Chattr Frontend** is now ready for local use.  
Access it via [http://127.0.0.1:5173](http://127.0.0.1:5173) while your Laravel API runs on [http://127.0.0.1:8000](http://127.0.0.1:8000).  

For deployment:
- You may host on **Netlify**, **Vercel**, or any static hosting platform.  
- Simply run `npm run build` and deploy the generated `/dist` folder.

<hr/>
<p align="center" style="color:gray">React 18 • Vite • Node.js 20.19.0 • WebSockets</p>
