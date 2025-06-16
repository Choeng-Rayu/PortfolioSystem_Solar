# 3D Universe - Interactive Solar System Explorer

A feature-rich, interactive 3D Universe website built with React and React Three Fiber. Explore our solar system with immersive 3D graphics, realistic planetary orbits, and detailed astronomical information.

## Features

### 🌟 Core Experience
- **Complete Solar System**: All 8 planets with accurate data, sizes, and orbital mechanics
- **Interactive 3D Navigation**: Orbital and free-flight camera controls with smooth transitions
- **Realistic Celestial Bodies**: Detailed planets with unique features (Saturn's rings, Jupiter's Great Red Spot, etc.)
- **Educational Content**: Comprehensive astronomical data for each celestial object

### 🎨 Visual Effects
- **Advanced Particle Systems**: Nebulae, cosmic dust, and solar wind effects
- **Dynamic Lighting**: Enhanced sun with corona, solar flares, and magnetic field visualization
- **Spectacular Comets**: Multiple comets with realistic trails and orbital mechanics
- **Wormhole Effects**: Sci-fi wormholes with particle tunnels (activated in warp mode)
- **Atmospheric Effects**: Planet atmospheres, storm systems, and ring structures

### 🎵 Audio Experience
- **Ambient Space Sounds**: Procedural ambient audio using Web Audio API
- **Interactive Sound Effects**: Unique tones for each planet selection
- **Warp Speed Audio**: Dynamic sound effects for enhanced immersion

### ⚡ Performance & Customization
- **Adaptive Quality Settings**: Low/Medium/High quality presets
- **Real-time Effect Toggles**: Enable/disable nebulae, comets, solar wind, and particles
- **Performance Monitoring**: Built-in stats and performance indicators
- **Responsive Design**: Optimized for different devices and screen sizes

## Technologies Used

- **React 19** - Modern UI library
- **React Three Fiber** - React renderer for Three.js
- **Three.js** - 3D graphics library
- **Zustand** - Lightweight state management
- **Vite** - Fast build tool and development server
- **Custom CSS** - Tailored styling for space-themed UI

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Controls

### 🖱️ Mouse Controls
- **Drag**: Rotate camera around the solar system
- **Scroll**: Zoom in and out (3x to 200x distance)
- **Click**: Select planets, sun, or other objects for detailed information

### ⌨️ Keyboard Shortcuts
- **1-8**: Focus on planets (Mercury through Neptune)
- **0**: Reset camera to default position
- **H**: Toggle HUD visibility
- **I**: Toggle info panels

### 🎛️ Interactive Controls
- **Planet Navigation**: Click planet buttons in the top navigation bar
- **Warp Speed**: Toggle for auto-rotation and wormhole effects
- **Visual Effects**: Enable/disable nebulae, comets, solar wind, and particles
- **Audio Controls**: Toggle ambient sounds and interaction effects
- **Quality Settings**: Adjust performance for your device

## Project Structure

```
src/
├── components/     # Reusable React components
├── scenes/         # 3D scene definitions
├── hooks/          # Custom React hooks
├── store/          # Global state management
├── utils/          # Helper functions and constants
└── assets/         # 3D models, textures, and media
```

## Performance Settings

The application includes adaptive performance settings:

- **High Quality**: Full shadows, anti-aliasing, maximum particles
- **Medium Quality**: Balanced performance and visual quality
- **Low Quality**: Optimized for lower-end devices

## Building for Production

```bash
npm run build
```

## License

This project is licensed under the MIT License.
