# Website Frontend Implementation Examples

This document provides ready-to-use code examples for implementing real-time updates on your customer-facing website.

---

## 🏗️ Project Structure

```
website/
├── src/
│   ├── hooks/
│   │   ├── useStoreConfig.ts    # Real-time SSE hook
│   │   └── useMenu.ts           # REST API hook
│   ├── components/
│   │   ├── ShopStatus.tsx       # Real-time status banner
│   │   ├── MenuList.tsx         # Menu display
│   │   └── MenuItem.tsx         # Individual menu item
│   ├── lib/
│   │   └── api.ts               # API configuration
│   └── types/
│       └── index.ts             # TypeScript types
```

---

## 📦 Installation

### Option 1: Simple React (No Extra Dependencies)

No installation needed! Use built-in `fetch` and `EventSource`.

### Option 2: With React Query (Recommended)

```bash
npm install @tanstack/react-query
```

---

## 🔧 Configuration

### Environment Variables

```env
# .env.local
NEXT_PUBLIC_API_URL=https://api.swamyshotfoods.in
```

### API Configuration

```typescript
// src/lib/api.ts
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export const API_ENDPOINTS = {
  MENU: `${API_URL}/api/menu`,
  STORE_CONFIG: `${API_URL}/api/store-config`,
  STORE_CONFIG_SSE: `${API_URL}/api/store-config/sse`,
} as const;
```

---

## 📝 TypeScript Types

```typescript
// src/types/index.ts

export interface StoreConfig {
  _id: string;
  isShopOpen: boolean;
  isCooking: boolean;
  isHoliday: boolean;
  holidayMessage: string;
  isNoticeActive: boolean;
  noticeMessage: string;
  description: string;
  currentStatusMsg: string;
  updatedAt: string;
}

export interface MenuItem {
  _id: string;
  name: string;
  price: number;
  desc: string;
  timingTemplate?: string;
  morningTimings?: {
    startTime: string;
    endTime: string;
  };
  eveningTimings?: {
    startTime: string;
    endTime: string;
  };
  ingredients: string[];
  allergens?: string[];
  dietaryLabels: string[];
  priority: number;
  imgSrc: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## 🎣 Custom Hooks

### 1. Store Config Hook (Real-Time SSE)

```typescript
// src/hooks/useStoreConfig.ts
import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '@/lib/api';
import type { StoreConfig } from '@/types';

export function useStoreConfig() {
  const [config, setConfig] = useState<StoreConfig | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let eventSource: EventSource | null = null;

    const connect = () => {
      try {
        eventSource = new EventSource(API_ENDPOINTS.STORE_CONFIG_SSE);

        eventSource.onopen = () => {
          console.log('✅ SSE Connected');
          setIsConnected(true);
          setError(null);
        };

        eventSource.onmessage = event => {
          try {
            const data = JSON.parse(event.data);
            setConfig(data);
          } catch (err) {
            console.error('Failed to parse SSE data:', err);
            setError('Failed to parse server data');
          }
        };

        eventSource.onerror = () => {
          console.error('❌ SSE Connection error');
          setIsConnected(false);
          setError('Connection lost. Reconnecting...');
          // EventSource automatically reconnects
        };
      } catch (err) {
        console.error('Failed to create EventSource:', err);
        setError('Failed to connect to server');
      }
    };

    connect();

    return () => {
      if (eventSource) {
        eventSource.close();
        setIsConnected(false);
      }
    };
  }, []);

  return { config, isConnected, error };
}
```

### 2. Menu Hook - Simple Version

```typescript
// src/hooks/useMenu.ts
import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '@/lib/api';
import type { MenuItem } from '@/types';

export function useMenu() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.MENU);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMenus(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch menu');
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  return { menus, loading, error };
}
```

### 3. Menu Hook - React Query Version

```typescript
// src/hooks/useMenu.ts
import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/lib/api';
import type { MenuItem } from '@/types';

async function fetchMenu(): Promise<MenuItem[]> {
  const response = await fetch(API_ENDPOINTS.MENU);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export function useMenu() {
  return useQuery({
    queryKey: ['menu'],
    queryFn: fetchMenu,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
```

---

## 🎨 Components

### Shop Status Banner (Real-Time)

```typescript
// src/components/ShopStatus.tsx
import { useStoreConfig } from '@/hooks/useStoreConfig';

export function ShopStatus() {
  const { config, isConnected, error } = useStoreConfig();

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">⚠️ {error}</p>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 animate-pulse">
        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Connection Indicator */}
      <div className="flex items-center gap-2 text-sm">
        <span className={isConnected ? 'text-green-600' : 'text-red-600'}>
          {isConnected ? '🟢 Live Updates' : '🔴 Offline'}
        </span>
      </div>

      {/* Shop Open/Closed */}
      {config.isShopOpen ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-green-800 font-semibold text-lg">
            🟢 We're Open!
          </h3>
          <p className="text-green-700">{config.currentStatusMsg}</p>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-semibold text-lg">
            🔴 Currently Closed
          </h3>
          <p className="text-red-700">Please check back later</p>
        </div>
      )}

      {/* Cooking Status */}
      {config.isCooking && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-orange-800">
            👨‍🍳 Currently preparing fresh food...
          </p>
        </div>
      )}

      {/* Holiday Banner */}
      {config.isHoliday && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">🏖️ {config.holidayMessage}</p>
        </div>
      )}

      {/* Notice Board */}
      {config.isNoticeActive && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800">📢 {config.noticeMessage}</p>
        </div>
      )}
    </div>
  );
}
```

### Menu List Component

```typescript
// src/components/MenuList.tsx
import { useMenu } from '@/hooks/useMenu';
import { MenuItem } from './MenuItem';

export function MenuList() {
  const { menus, loading, error } = useMenu();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-lg p-6 animate-pulse">
            <div className="h-48 bg-gray-300 rounded mb-4"></div>
            <div className="h-6 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800">Failed to load menu: {error}</p>
      </div>
    );
  }

  if (menus.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No menu items available</p>
      </div>
    );
  }

  // Sort by priority
  const sortedMenus = [...menus].sort((a, b) => a.priority - b.priority);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedMenus.map(menu => (
        <MenuItem key={menu._id} menu={menu} />
      ))}
    </div>
  );
}
```

### Menu Item Component

```typescript
// src/components/MenuItem.tsx
import { memo } from 'react';
import type { MenuItem as MenuItemType } from '@/types';

interface MenuItemProps {
  menu: MenuItemType;
}

export const MenuItem = memo(({ menu }: MenuItemProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        <img
          src={menu.imgSrc}
          alt={menu.name}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        {/* Dietary Labels */}
        <div className="absolute top-2 right-2 flex gap-1">
          {menu.dietaryLabels.includes('vegetarian') && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
              🌱 Veg
            </span>
          )}
          {menu.dietaryLabels.includes('vegan') && (
            <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
              Vegan
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{menu.name}</h3>
          <span className="text-lg font-bold text-orange-600">
            ₹{menu.price}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-3">{menu.desc}</p>

        {/* Ingredients */}
        {menu.ingredients.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-semibold text-gray-700 mb-1">
              Ingredients:
            </p>
            <p className="text-xs text-gray-600">
              {menu.ingredients.join(', ')}
            </p>
          </div>
        )}

        {/* Timings */}
        {(menu.morningTimings || menu.eveningTimings) && (
          <div className="text-xs text-gray-500 border-t pt-2">
            {menu.morningTimings && (
              <div>
                🌅 Morning: {menu.morningTimings.startTime} -{' '}
                {menu.morningTimings.endTime}
              </div>
            )}
            {menu.eveningTimings && (
              <div>
                🌆 Evening: {menu.eveningTimings.startTime} -{' '}
                {menu.eveningTimings.endTime}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

MenuItem.displayName = 'MenuItem';
```

---

## 📄 Page Implementation

### Next.js App Router

```typescript
// app/page.tsx
import { ShopStatus } from '@/components/ShopStatus';
import { MenuList } from '@/components/MenuList';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Swamy's Hot Foods
          </h1>
          <p className="text-gray-600">Pure Vegetarian Delights</p>
        </header>

        {/* Real-time Shop Status */}
        <section className="mb-8">
          <ShopStatus />
        </section>

        {/* Menu */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Menu</h2>
          <MenuList />
        </section>
      </div>
    </main>
  );
}
```

### With React Query Provider

```typescript
// app/layout.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 60, // 1 hour
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

---

## 🚀 Performance Optimizations

### 1. Image Optimization

```typescript
// Next.js Image component
import Image from 'next/image';

<Image
  src={menu.imgSrc}
  alt={menu.name}
  width={400}
  height={300}
  loading="lazy"
  className="w-full h-full object-cover"
/>;
```

### 2. Code Splitting

```typescript
import { lazy, Suspense } from 'react';

const MenuList = lazy(() => import('@/components/MenuList'));

export default function HomePage() {
  return (
    <Suspense fallback={<MenuListSkeleton />}>
      <MenuList />
    </Suspense>
  );
}
```

### 3. Memoization

```typescript
import { useMemo } from 'react';

export function MenuList() {
  const { menus } = useMenu();

  const sortedMenus = useMemo(
    () => [...menus].sort((a, b) => a.priority - b.priority),
    [menus],
  );

  return (
    <div>
      {sortedMenus.map(menu => (
        <MenuItem key={menu._id} menu={menu} />
      ))}
    </div>
  );
}
```

---

## 🧪 Testing

### Test SSE Connection

```typescript
// __tests__/useStoreConfig.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useStoreConfig } from '@/hooks/useStoreConfig';

// Mock EventSource
global.EventSource = jest.fn(() => ({
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  close: jest.fn(),
})) as any;

test('connects to SSE and receives data', async () => {
  const { result } = renderHook(() => useStoreConfig());

  await waitFor(() => {
    expect(result.current.isConnected).toBe(true);
  });
});
```

---

## 📊 Monitoring

### Add Performance Tracking

```typescript
// src/hooks/useStoreConfig.ts
useEffect(() => {
  const startTime = performance.now();

  eventSource.onmessage = event => {
    const latency = performance.now() - startTime;
    console.log(`SSE latency: ${latency}ms`);

    // Send to analytics
    // analytics.track('sse_message_received', { latency });
  };
}, []);
```

---

## 🎯 Summary

This implementation provides:

- ✅ **Real-time updates** for shop status via SSE
- ✅ **Efficient caching** for menu items via REST
- ✅ **Type safety** with TypeScript
- ✅ **Performance optimizations** (lazy loading, memoization)
- ✅ **Error handling** and loading states
- ✅ **Responsive design** ready

**No backend changes needed!** Just implement the frontend hooks and components.
