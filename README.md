# FurnishAR - Interactive 3D Furniture Design & Visualization Studio 🪑✨

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r128+-black?logo=three.js&logoColor=white)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Electron](https://img.shields.io/badge/Electron-Cross--Platform-47848F?logo=electron&logoColor=white)](https://www.electronjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**FurnishAR** is an advanced 3D furniture customizer and interactive web/desktop application built with **React**, **Three.js / React Three Fiber**, and **Tailwind CSS**. It enables users, designers, and customers to visualize, customize, and inspect furniture models in real time with high-fidelity 3D rendering and physics-based lighting.

---

## 🌟 Key Features

- **🎮 Real-Time 3D Rendering:** Powered by Three.js and `@react-three/fiber` for realistic textures, lighting, and orbit controls.
- **🎨 Interactive Customization:** Customize furniture colors, materials, dimensions, and configurations on the fly.
- **🖥️ Cross-Platform Support:** Runs as a responsive modern web app and as a native desktop application using **Electron**.
- **⚡ Fast State Management:** Powered by custom React hooks (`useDesignState`) for zero-lag 3D canvas interaction.
- **🔐 User Management & Access Control:** Role-based access with custom login and designer access request flows.
- **💾 Backend Persistence:** Built-in Express.js API connected to SQLite / MySQL for catalog and user state storage.

---

## 🛠️ Tech Stack

### Frontend & 3D Engine
- **Core:** [React](https://react.dev/) & [Vite](https://vitejs.dev/)
- **3D Graphics:** [Three.js](https://threejs.org/), [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber), [@react-three/drei](https://github.com/pmndrs/drei)
- **Styling & Animations:** [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/), [Lucide React](https://lucide.dev/)

### Backend & Desktop
- **Server:** Node.js & [Express.js](https://expressjs.com/)
- **Database:** SQLite3 (`furniture.db`) / MySQL2
- **Desktop Runtime:** [Electron](https://www.electronjs.org/) with Electron Forge

---

## 📁 Project Structure

```bash
furniture_web_application/
├── public/                 # Static assets and 3D model files
├── server.js               # Express API server for catalog & auth
├── furniture.db            # SQLite database file
├── src/
│   ├── assets/             # Brand logos & icons
│   ├── components/
│   │   ├── DesignCanvas.jsx    # Interactive workspace for design adjustments
│   │   ├── Sidebar.jsx         # Controls for materials, colors & parts
│   │   └── ThreeDViewer.jsx    # 3D Canvas with Three.js camera & lighting
│   ├── hooks/
│   │   └── useDesignState.js   # State management hook for 3D customization
│   ├── pages/
│   │   ├── Login.jsx           # User authentication page
│   │   └── RequestAccess.jsx   # Access request form for designers
│   ├── App.jsx             # Root application router & layout
│   └── main.jsx            # Application entry point
├── electron/               # Electron main & preload configuration
├── vite.config.js          # Vite configuration
└── package.json            # Project dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or newer recommended)
- `npm` or `pnpm`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/prageethgihan/furniture_web_application.git
   cd furniture_web_application
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp ".env example" .env
   ```

4. **Start the development server:**
   ```bash
   # Runs both the React Vite frontend and the backend server concurrently
   npm run dev
   ```

5. **Open in browser:**
   Navigate to `http://localhost:5173`

---

## 🖥️ Running as a Desktop App (Electron)

To run FurnishAR as an Electron desktop app:

```bash
npm run electron:dev
```

To build installable packages for Windows / macOS:
```bash
npm run make
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/prageethgihan/furniture_web_application/issues).

---

## 📝 License

This project is licensed under the MIT License.

