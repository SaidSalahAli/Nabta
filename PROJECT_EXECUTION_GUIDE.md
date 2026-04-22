# Nabta Project - Complete Execution Guide

## 📋 Project Overview

**Nabta** is a React-based web application built with:

- **Framework**: React 18.3.1
- **Build Tool**: Vite 5.4.11
- **UI Library**: Material-UI (MUI) 6.4.0
- **Routing**: React Router 7.1.1
- **State Management**: React Context API + JWT Authentication
- **Styling**: Emotion (CSS-in-JS)
- **i18n**: React Intl (for multi-language support)

---

## 🚀 Getting Started

### 1. **Installation**

```bash
# Install all dependencies
npm install
```

### 2. **Development Server**

```bash
# Start the development server (opens browser on port 3000)
npm start
```

### 3. **Production Build**

```bash
# Build for production
npm run build
```

### 4. **Preview Build**

```bash
# Preview the production build
npm run preview
```

---

## 📁 Project Structure & Execution Flow

### **Entry Point: `index.html`**

```
index.html
  ↓
  • Contains a root div: `<div id="root"></div>`
  • Loads the main React entry point: `/src/index.jsx`
  • Static HTML template that React mounts to
```

### **React Entry Point: `src/index.jsx`**

```jsx
// Step 1: Import React DOM
import { createRoot } from 'react-dom/client';

// Step 2: Get the root element from HTML
const container = document.getElementById('root');
const root = createRoot(container);

// Step 3: Render App component with ConfigProvider
root.render(
  <ConfigProvider>
    <App />
  </ConfigProvider>
);
```

**What happens:**

1. Creates a React root at the #root element
2. Wraps the App with ConfigProvider (global configuration context)
3. Renders everything to the DOM

---

## 🎯 Application Flow

### **Phase 1: App Component (`src/App.jsx`)**

```
App.jsx
  ├─ ThemeCustomization (applies MUI theme)
  ├─ RTLLayout (handles right-to-left layout for Arabic)
  ├─ Locales (handles language/i18n setup)
  ├─ ScrollTop (smooth scroll to top on route change)
  ├─ AuthProvider (JWT authentication context)
  ├─ RouterProvider (React Router setup)
  └─ Snackbar (global notifications)
```

**Key Providers:**

- **ThemeCustomization**: Applies theme from `src/themes/`
- **RTLLayout**: Supports Arabic right-to-left text direction
- **Locales**: Multi-language support via React Intl
- **AuthProvider (JWTContext)**: Manages user authentication state
- **RouterProvider**: Enables client-side routing

---

### **Phase 2: Routing (`src/routes/index.jsx`)**

```
router (createBrowserRouter)
  ├─ LoginRoutes (authentication routes)
  │   ├─ /login
  │   ├─ /register
  │   ├─ /forgot-password
  │   └─ /reset-password
  │
  └─ MainRoutes (protected application routes)
      ├─ /dashboard
      ├─ /feature/gest/home (Guest features)
      ├─ /extra-pages
      ├─ /contact-us
      └─ /maintenance pages
```

**How Routing Works:**

1. User navigates to a URL
2. React Router matches it against the route definitions
3. Appropriate component/layout is rendered
4. Page content updates without full reload (SPA behavior)

---

## 📂 File Execution Flow (Detailed)

### **When User Visits Home Page:**

```
1. Browser loads: http://localhost:3000/
   ↓
2. Vite dev server serves index.html
   ↓
3. index.html loads <script type="module" src="/src/index.jsx"></script>
   ↓
4. src/index.jsx:
   - Imports ConfigProvider from src/contexts/ConfigContext.jsx
   - Creates React root
   - Renders App wrapped in ConfigProvider
   ↓
5. src/App.jsx:
   - Initializes all provider layers:
     * ThemeCustomization (from src/themes/index.jsx)
     * RTLLayout (from src/components/RTLLayout.jsx)
     * Locales (from src/components/Locales.jsx)
     * AuthProvider/JWTContext (from src/contexts/JWTContext.jsx)
   - Renders RouterProvider with router from src/routes/index.jsx
   ↓
6. src/routes/index.jsx:
   - Matches current URL against route definitions
   - Renders MainRoutes or LoginRoutes
   ↓
7. For /feature/gest/home path:
   - Renders layout from src/layout/Dashboard/
   - Renders page from src/pages/feature/gest/home/
   - Renders components like src/pages/feature/gest/home/components/work-sheets.jsx
   ↓
8. Browser displays rendered HTML/CSS to user
```

---

## 🔧 Key Directories & Their Purpose

### **`src/components/`** - Reusable Components

- Small, reusable UI pieces
- Examples: `Button`, `Avatar`, `Breadcrumbs`, `Snackbar`
- Used across multiple pages
- Location: `src/components/@extended/`

### **`src/pages/`** - Page Components

- Full page components for specific routes
- Examples: `contact-us.jsx`, `error.jsx`, `sample-page.jsx`
- Usually combine multiple components
- Path: `src/pages/feature/gest/home/components/work-sheets.jsx`

### **`src/layout/`** - Layout Components

- Page structure/templates
- Includes: Header, Footer, Drawer/Navigation, Sidebar
- Examples: `Dashboard`, `Auth`, `Simple` layouts
- Applied to multiple pages consistently

### **`src/routes/`** - Route Definitions

- `index.jsx`: Main router setup
- `MainRoutes.jsx`: Application routes (after login)
- `LoginRoutes.jsx`: Authentication routes (before login)

### **`src/contexts/`** - Global State

- `ConfigContext.jsx`: Global config/settings
- `JWTContext.jsx`: Authentication context
- Accessed via hooks: `useAuth()`, `useConfig()`

### **`src/hooks/`** - Custom React Hooks

- `useAuth()`: Access authentication state
- `useConfig()`: Access global config
- `useLocalStorage()`: Persist data to localStorage

### **`src/themes/`** - Styling & Theming

- `index.jsx`: Theme provider
- `palette.js`: Color definitions
- `typography.js`: Font settings
- `overrides/`: MUI component customizations

### **`src/sections/`** - Feature Sections

- Organized feature components
- Examples: `auth/`, `extra-pages/contact/`
- More complex than simple components

### **`src/menu-items/`** - Navigation Menu

- Menu definitions for sidebar/navigation
- `pages.jsx`: Feature pages menu items
- `support.js`: Support menu items

### **`src/utils/`** - Utility Functions

- `axios.js`: API client configuration
- `getColors.js`: Theme color helpers
- `password-strength.js`: Password validation

### **`src/api/`** - API Endpoints

- `menu.js`: Menu API calls
- `snackbar.js`: Notification functions

---

## 🔄 Component Execution Lifecycle

### **Example: `work-sheets.jsx` Component**

```jsx
export default function Worksheets({ shouldAnimate = false }) {
  // 1. Initialize state
  const [checked, setChecked] = useState(false);

  // 2. Effect hook - runs when shouldAnimate prop changes
  useEffect(() => {
    if (shouldAnimate) setChecked(true);
  }, [shouldAnimate]);

  // 3. Return JSX that renders to screen
  return (
    <Fade in={checked} timeout={800}>
      {/* Component UI */}
    </Fade>
  );
}
```

**When a component renders:**

1. Function is called
2. State is initialized
3. Effects are registered
4. JSX is evaluated
5. Virtual DOM is created
6. React compares with previous render
7. Only changed elements are updated in real DOM
8. Component appears on screen

---

## 🌐 Build & Deployment Process

### **Development Mode (`npm start`)**

```
Vite dev server
  ↓
  • Fast refresh (HMR - Hot Module Replacement)
  • No optimization
  • Source maps for debugging
  • Watches file changes
  • Rebuilds instantly
  ↓
Browser displays unoptimized app
```

### **Production Build (`npm run build`)**

```
Vite build process
  ↓
  1. Bundle all JS/CSS
  2. Minify (reduce size)
  3. Code splitting (lazy load routes)
  4. Optimize images
  5. Generate source maps (optional)
  ↓
Output in: dist/ folder
  ├─ index.html (main entry point)
  ├─ assets/
  │   ├─ main-[hash].js (main bundle)
  │   ├─ vendor-[hash].js (dependencies)
  │   └─ style-[hash].css (combined styles)
  └─ favicon.png
```

---

## 🔐 Authentication Flow

### **JWT Authentication (src/contexts/JWTContext.jsx)**

```
1. User logs in via /login
   ↓
2. Credentials sent to API
   ↓
3. API returns JWT token
   ↓
4. Token stored in localStorage
   ↓
5. Token added to all future API requests (axios.js)
   ↓
6. Protected routes check token validity
   ↓
7. User accesses protected pages
```

**Accessing Auth in Components:**

```jsx
import { useAuth } from 'hooks/useAuth';

function MyComponent() {
  const { user, isLoggedIn, login, logout } = useAuth();
  // Use auth state...
}
```

---

## 🎨 Theming System

### **How Theming Works (src/themes/index.jsx)**

```
1. Theme provider wraps entire app
   ↓
2. Defines colors in palette.js:
   primary, secondary, success, warning, error
   ↓
3. Typography.js defines fonts:
   headings, body, button styles
   ↓
4. Components use theme colors:
   sx={{ color: theme.palette.primary.main }}
   ↓
5. Can toggle between light/dark modes
   ↓
6. All colors update globally
```

**RTL Support (Arabic):**

- `RTLLayout.jsx` detects language
- If Arabic: Flips layout direction to RTL
- Margins/padding automatically reversed
- Text alignment adjusted

---

## 📡 API Communication

### **Axios Setup (src/utils/axios.js)**

```
1. Configuration:
   - Base URL from environment variable
   - Default headers (Authorization token)
   - Request/response interceptors

2. API Client Usage:
   import axiosServices from 'utils/axios';
   axiosServices.get('/endpoint')
   axiosServices.post('/endpoint', data)

3. Interceptors:
   - Add JWT token to requests
   - Handle errors globally
   - Refresh tokens if expired
   - Redirect to login if unauthorized
```

---

## 🔍 File Execution Checklist

### **For a New Page Request:**

- [ ] Browser sends request to `/new-page`
- [ ] React Router matches route in `MainRoutes.jsx`
- [ ] Appropriate layout is selected
- [ ] Page component is loaded from `src/pages/`
- [ ] Page components load child components
- [ ] Theme from `themes/` is applied
- [ ] Language/localization from `Locales` is set
- [ ] Auth state from `JWTContext` is available
- [ ] Page renders to screen

### **For a Component Update:**

- [ ] User interacts with component (click, input, etc.)
- [ ] Event handler triggers state change via `useState()`
- [ ] `useEffect()` hooks may execute
- [ ] Component re-renders with new state
- [ ] Only changed elements update in DOM
- [ ] UI reflects new state

### **For an API Call:**

- [ ] Component calls API via `axiosServices`
- [ ] JWT token added automatically by interceptor
- [ ] Request sent to backend
- [ ] Response received and processed
- [ ] State updated with response data
- [ ] Component re-renders with new data

---

## 🛠️ Development Commands

| Command               | Purpose                       |
| --------------------- | ----------------------------- |
| `npm start`           | Start dev server on port 3000 |
| `npm run build`       | Create production bundle      |
| `npm run preview`     | Preview production build      |
| `npm run lint`        | Check code for errors         |
| `npm run build-stage` | Build for staging environment |

---

## 📊 Environment Variables

Create a `.env` file in root:

```
VITE_APP_BASE_NAME=/            # Base path for routing
VITE_API_BASE_URL=http://...    # Backend API URL
```

Access in code:

```jsx
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

---

## 🎯 Key Takeaways

1. **Entry Point**: `index.html` → `src/index.jsx` → `App.jsx`
2. **Routing**: URL → React Router → Component/Layout
3. **State**: Context API for global state (Config, Auth)
4. **Styling**: MUI + Emotion CSS-in-JS + RTL support
5. **Components**: Reusable in `components/`, pages in `pages/`
6. **API**: Axios with JWT authentication
7. **Build**: Vite for fast dev, optimized production build

---

## 🔗 Important Files to Know

```
d:\Nabta\
├── index.html                  ← HTML entry point
├── package.json                ← Dependencies & scripts
├── vite.config.mjs             ← Build configuration
│
├── src/
│   ├── index.jsx              ← React entry point
│   ├── App.jsx                ← Main app component with providers
│   ├── index.css              ← Global styles
│   │
│   ├── routes/
│   │   ├── index.jsx          ← Main router setup
│   │   ├── MainRoutes.jsx      ← App routes
│   │   └── LoginRoutes.jsx     ← Auth routes
│   │
│   ├── pages/                 ← Page components
│   ├── components/            ← Reusable components
│   ├── layout/                ← Layout templates
│   ├── themes/                ← Theming system
│   ├── contexts/              ← Global state
│   ├── hooks/                 ← Custom hooks
│   ├── utils/                 ← Utility functions
│   └── api/                   ← API endpoints
│
└── dist/                       ← Production build (after npm run build)
```

---

## ❓ Common Questions

**Q: Where do I add a new page?**
A: Create component in `src/pages/`, add route in `MainRoutes.jsx`

**Q: How do I use a new API endpoint?**
A: Create function in `src/api/`, call with `axiosServices`

**Q: How do I create a reusable component?**
A: Add to `src/components/`, export and import where needed

**Q: How does authentication work?**
A: JWT token stored in localStorage, added to all API requests by axios interceptor

**Q: How do I change colors/theme?**
A: Edit `src/themes/palette.js`, changes apply everywhere

**Q: How do I add another language?**
A: Update language files in `src/utils/locales/`, use React Intl

---

Generated: April 2026
Project: Nabta (Able Pro Material React Dashboard Template)
