# 🔧 API URL Fix - May 14, 2026

## Problem Identified

**Error**: `404 Not Found - Route not found: /Nabta/api/api/v1/episodes`

**Root Cause**: Double `/api` in the URL path

### Why It Happened

**Configuration**:

- Frontend base URL: `http://localhost/Nabta/api` (from `.env`)
- Endpoint prefix: `api/v1/episodes` (in episodes.js)
- **Result**: `http://localhost/Nabta/api` + `api/v1/episodes` = `http://localhost/Nabta/api/api/v1/episodes` ❌

---

## Solution Applied ✅

### Fixed Endpoints

Changed all endpoint paths to remove the `/api` prefix since it's already included in the `VITE_APP_API_URL`.

#### Before (❌ WRONG)

```javascript
const endpoints = {
  key: 'api/v1/episodes',
  list: 'api/v1/episodes',
  create: 'api/v1/admin/episodes',
  read: (id) => `api/v1/episodes/${id}`
  // ... more endpoints
};
```

#### After (✅ CORRECT)

```javascript
const endpoints = {
  key: 'v1/episodes',
  list: 'v1/episodes',
  create: 'v1/admin/episodes',
  read: (id) => `v1/episodes/${id}`
  // ... more endpoints
};
```

---

## Updated Endpoints

### Episodes API (`src/api/episodes.js`)

```javascript
// NOW CORRECTLY RESOLVES TO:
GET    http://localhost/Nabta/api/v1/episodes
GET    http://localhost/Nabta/api/v1/episodes/{id}
POST   http://localhost/Nabta/api/v1/admin/episodes
PUT    http://localhost/Nabta/api/v1/admin/episodes/{id}
DELETE http://localhost/Nabta/api/v1/admin/episodes/{id}
```

### Categories API (`src/api/episodeCategories.js`)

```javascript
// NOW CORRECTLY RESOLVES TO:
GET    http://localhost/Nabta/api/v1/categories
GET    http://localhost/Nabta/api/v1/categories/{id}
POST   http://localhost/Nabta/api/v1/admin/categories
PUT    http://localhost/Nabta/api/v1/admin/categories/{id}
DELETE http://localhost/Nabta/api/v1/admin/categories/{id}
```

---

## How API URLs Are Constructed

```
VITE_APP_API_URL (from .env)  +  Endpoint Path  =  Full URL
────────────────────────────────────────────────────────────
http://localhost/Nabta/api     +  v1/episodes    =  http://localhost/Nabta/api/v1/episodes ✅
```

---

## Files Modified

| File                           | Change                                   |
| ------------------------------ | ---------------------------------------- |
| `src/api/episodes.js`          | Removed `api/` prefix from all endpoints |
| `src/api/episodeCategories.js` | Removed `api/` prefix from all endpoints |

---

## Testing the Fix

### 1. Clear Browser Cache

```
DevTools → Application → Clear Storage → Clear All
```

### 2. Test Episode Fetch

```
Open Console (F12) → Network Tab
Navigate to /dashboard/episodes
Should see successful requests to:
- http://localhost/Nabta/api/v1/episodes (200 OK)
```

### 3. Test Episode Creation

```
Click "Add Episode" → Fill form → Submit
Should see POST request to:
- http://localhost/Nabta/api/v1/admin/episodes (201 Created)
```

### 4. Test Category Operations

```
Navigate to /dashboard/episode-categories
Should see successful requests to:
- http://localhost/Nabta/api/v1/categories (200 OK)
```

---

## Environment Configuration Reference

### Development (.env)

```env
VITE_APP_API_URL=http://localhost/Nabta/api
```

### Production (.env.production)

```env
VITE_APP_API_URL=https://api.nabtastudio.com/api
```

---

## Related Configuration Files

### `vite.config.mjs` - Proxy Configuration

The development proxy is set up to forward `/api` requests to the backend:

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:8000',  // Backend server
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, '/api')
  }
}
```

### `src/utils/axios.js` - API Client

```javascript
const axiosServices = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL // http://localhost/Nabta/api
});
```

---

## Important Notes

1. **BaseURL**: The axios client uses `VITE_APP_API_URL` as the base
2. **Endpoint Paths**: Should be relative to the base URL (no need to include `/api`)
3. **Full URL**: Constructed automatically by axios: `baseURL + endpoint`
4. **JWT Token**: Automatically added to headers via interceptor

---

## Common Issues & Solutions

### Issue: Still Getting 404 Errors

**Solution**:

- Check .env file is loaded correctly
- Restart dev server: `npm run start`
- Clear browser cache and localStorage
- Verify backend is running

### Issue: CORS Errors

**Solution**:

- Check backend has CORS headers configured
- Verify proxy settings in vite.config.mjs

### Issue: Unauthorized (401) Errors

**Solution**:

- Login first to get JWT token
- Token is stored in localStorage
- Check browser DevTools → Application → Local Storage

---

**Status**: ✅ FIXED
**Last Updated**: May 14, 2026
**Backend Tested**: Ready for API calls
