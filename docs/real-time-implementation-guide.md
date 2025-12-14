# Real-Time Updates Implementation Guide

## 🎯 Optimized Strategy

### Update Frequency Analysis

| Data Type        | Update Frequency          | Real-Time Needed? | Solution                  |
| ---------------- | ------------------------- | ----------------- | ------------------------- |
| **Store Config** | High (multiple times/day) | ✅ YES            | SSE (Already implemented) |
| **Menu Items**   | Low (rarely changes)      | ❌ NO             | REST + Caching            |

---

## ✅ Current Backend Status

Your backend is **already optimal**! No changes needed.

- ✅ StoreConfig has SSE endpoint: `/api/store-config/sse`
- ✅ Menu has REST endpoints: `/api/menu`
- ✅ Event emission working correctly
- ✅ Clean architecture

**Recommendation**: Don't add Menu SSE - it's unnecessary overhead for static data.

---

## 🚀 Implementation Guide

### 1. Store Config (Real-Time via SSE) ⚡

**Backend**: Already implemented and working!

**Frontend (Website)**:

```typescript
// hooks/useStoreConfig.ts
import { useState, useEffect } from 'react';

interface StoreConfig {
  isShopOpen: boolean;
  isCooking: boolean;
  isHoliday: boolean;
  holidayMessage: string;
  isNoticeActive: boolean;
  noticeMessage: string;
  description: string;
  currentStatusMsg: string;
}

export function useStoreConfig() {
  const [config, setConfig] = useState<StoreConfig | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_API_URL}/api/store-config/sse`,
    );

    eventSource.onopen = () => {
      console.log('✅ SSE Connected');
      setIsConnected(true);
    };

    eventSource.onmessage = event => {
      const data = JSON.parse(event.data);
      setConfig(data);
    };

    eventSource.onerror = () => {
      console.error('❌ SSE Connection lost');
      setIsConnected(false);
      // EventSource automatically reconnects
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return { config, isConnected };
}
```

**Usage in Component**:

```typescript
// components/ShopStatus.tsx
import { useStoreConfig } from '@/hooks/useStoreConfig';

export function ShopStatus() {
  const { config, isConnected } = useStoreConfig();

  if (!config) return <div>Loading...</div>;

  return (
    <div className="status-banner">
      {/* Connection Indicator */}
      <div className="connection-status">
        {isConnected ? '🟢 Live' : '🔴 Offline'}
      </div>

      {/* Shop Status */}
      {config.isShopOpen && (
        <div className="open">🟢 Shop is Open! {config.currentStatusMsg}</div>
      )}

      {/* Cooking Status */}
      {config.isCooking && (
        <div className="cooking">👨‍🍳 Currently Cooking...</div>
      )}

      {/* Holiday Banner */}
      {config.isHoliday && (
        <div className="holiday">🏖️ {config.holidayMessage}</div>
      )}

      {/* Notice Board */}
      {config.isNoticeActive && (
        <div className="notice">📢 {config.noticeMessage}</div>
      )}
    </div>
  );
}
```

---

### 2. Menu Items (REST + Smart Caching) 📌

**Backend**: No changes needed! Use existing endpoints.

#### Option A: Simple Fetch (Recommended for Simple Apps)

```typescript
// hooks/useMenu.ts
import { useState, useEffect } from 'react';

interface MenuItem {
  _id: string;
  name: string;
  price: number;
  desc: string;
  imgSrc: string;
  ingredients: string[];
  // ... other fields
}

export function useMenu() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu`)
      .then(res => res.json())
      .then(data => {
        setMenus(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { menus, loading, error };
}
```

#### Option B: React Query (Better Caching & Performance)

```bash
npm install @tanstack/react-query
```

```typescript
// hooks/useMenu.ts
import { useQuery } from '@tanstack/react-query';

export function useMenu() {
  return useQuery({
    queryKey: ['menu'],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu`);
      if (!res.ok) throw new Error('Failed to fetch menu');
      return res.json();
    },
    staleTime: 1000 * 60 * 60, // 1 hour - data stays fresh
    gcTime: 1000 * 60 * 60 * 24, // 24 hours - cache retention
  });
}
```

**Setup React Query Provider**:

```typescript
// app/layout.tsx or _app.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function RootLayout({ children }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
```

#### Option C: Next.js ISR (Best Performance)

```typescript
// app/menu/page.tsx (Next.js App Router)
export const revalidate = 3600; // Revalidate every hour

async function getMenuItems() {
  const res = await fetch(`${process.env.API_URL}/api/menu`, {
    next: { revalidate: 3600 },
  });
  return res.json();
}

export default async function MenuPage() {
  const menus = await getMenuItems();

  return <MenuList menus={menus} />;
}
```

---

## 🔄 Complete Data Flow

### Admin Updates Shop Status (Frequent) ⚡

```
1. Admin opens React Native app
2. Toggles "Shop Open" switch
3. App → PUT /api/store-config
4. Backend → Updates DB + Emits SSE event
5. Website users → See update INSTANTLY (< 1 second) ✅
```

### Admin Updates Menu (Rare) 📌

```
1. Admin opens React Native app
2. Updates menu item
3. App → PUT /api/menu/:id
4. Backend → Updates DB
5. Website users → See update on NEXT PAGE LOAD ✅
   (Acceptable for rare changes)
```

---

## 📱 Admin App Implementation

Your current React Native app approach is perfect:

```typescript
// Store Config Updates (Frequent - Real-time)
const toggleShopStatus = async () => {
  await fetch(`${API_URL}/api/store-config`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ isShopOpen: !isShopOpen }),
  });
  // Website updates instantly via SSE! ⚡
};

// Menu Updates (Rare - Standard REST)
const updateMenuItem = async (id: string, data: Partial<MenuItem>) => {
  await fetch(`${API_URL}/api/menu/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  // Website sees update on next page load (acceptable) ✅
};
```

---

## 🐛 Debugging Slow Loading

If your website is currently slow, it's likely **NOT** a real-time issue. Check:

### 1. API Response Time

```bash
# Test API speed
curl -w "\nTime Total: %{time_total}s\n" \
  -o /dev/null -s \
  http://your-api.com/api/menu
```

**Expected**: < 500ms

### 2. Database Performance

Add indexes to improve query speed:

```javascript
// Backend - Menu model
menuSchema.index({ priority: 1 });
menuSchema.index({ timingTemplate: 1 });
menuSchema.index({ 'morningTimings.startTime': 1 });
```

### 3. Network Latency

- Ensure API and website are geographically close
- Use CDN for static assets
- Enable gzip compression

### 4. Frontend Optimization

```typescript
// Lazy load images
<img src={menu.imgSrc} loading="lazy" alt={menu.name} />;

// Code splitting
const MenuList = lazy(() => import('./components/MenuList'));

// Memoize components
const MenuItem = memo(({ menu }: { menu: MenuItem }) => {
  return <div>{menu.name}</div>;
});
```

### 5. Prevent Unnecessary Re-renders

```typescript
// Use React.memo for list items
const MenuList = memo(({ menus }: { menus: MenuItem[] }) => {
  return (
    <div>
      {menus.map(menu => (
        <MenuItem key={menu._id} menu={menu} />
      ))}
    </div>
  );
});
```

---

## ✅ Do This

- ✅ Keep SSE for StoreConfig (already working)
- ✅ Use simple REST fetch for Menu (no SSE needed)
- ✅ Add React Query for better caching (optional but recommended)
- ✅ Optimize images (lazy loading, compression)
- ✅ Add database indexes if not present
- ✅ Use Next.js ISR if using Next.js

## ❌ Don't Do This

- ❌ Don't add SSE for Menu (unnecessary)
- ❌ Don't use WebSockets (overkill)
- ❌ Don't use polling (inefficient)
- ❌ Don't over-engineer for rare updates

---

## 📊 Performance Expectations

| Update Type  | Current   | Expected  | Method          |
| ------------ | --------- | --------- | --------------- |
| Shop Status  | Instant   | < 1s      | SSE ✅          |
| Menu Items   | On reload | On reload | REST + Cache ✅ |
| Initial Load | ?         | < 2s      | Optimize API/DB |

---

## 🎯 Summary

**Your backend is already perfect!** 🎉

- ✅ StoreConfig SSE = Working
- ✅ Menu REST API = Working
- ✅ No changes needed to backend

**Frontend Focus**:

1. Connect to existing SSE for shop status (real-time updates)
2. Use simple fetch + caching for menu (acceptable delay)
3. Optimize performance (images, indexes, caching)

The slow loading is likely a **performance issue**, not a real-time issue. Focus on:

- Database indexes
- Image optimization
- API response time
- Frontend caching

**No need for Menu SSE or WebSockets!** 🚀

---

## 📚 Additional Resources

- [SSE Integration Guide](./sse-integration-guide.md) - Detailed SSE implementation
- [API Documentation](./api.md) - Complete API reference
- [React Query Docs](https://tanstack.com/query/latest) - Advanced caching
- [Next.js ISR](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration) - Static regeneration
