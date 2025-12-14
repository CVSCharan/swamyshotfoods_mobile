# Performance Optimization Checklist

This checklist helps you optimize your website's performance when implementing real-time updates.

---

## 🎯 Backend Optimizations

### Database Performance

- [ ] **Add Indexes to Menu Collection**

  ```javascript
  // In your Menu model
  menuSchema.index({ priority: 1 });
  menuSchema.index({ timingTemplate: 1 });
  menuSchema.index({ 'morningTimings.startTime': 1 });
  menuSchema.index({ 'eveningTimings.startTime': 1 });
  ```

- [ ] **Add Indexes to StoreConfig Collection**

  ```javascript
  // In your StoreConfig model
  storeConfigSchema.index({ updatedAt: -1 });
  ```

- [ ] **Enable MongoDB Query Profiling**
  ```javascript
  // Check slow queries
  db.setProfilingLevel(1, { slowms: 100 });
  db.system.profile.find().sort({ ts: -1 }).limit(5);
  ```

### API Response Optimization

- [ ] **Enable Gzip Compression**

  ```javascript
  // In your Express app
  import compression from 'compression';
  app.use(compression());
  ```

- [ ] **Add Response Caching Headers**

  ```javascript
  // For menu endpoint
  app.get('/api/menu', (req, res) => {
    res.set('Cache-Control', 'public, max-age=3600'); // 1 hour
    // ... rest of handler
  });
  ```

- [ ] **Implement API Response Compression**
  ```javascript
  // Reduce payload size
  app.use(express.json({ limit: '1mb' }));
  ```

### SSE Optimization

- [ ] **Add Heartbeat to Prevent Timeout**

  ```javascript
  // Already implemented in your SSE endpoint
  const heartbeat = setInterval(() => {
    res.write(': heartbeat\n\n');
  }, 30000); // Every 30 seconds
  ```

- [ ] **Limit SSE Connections Per User**

  ```javascript
  // Prevent connection abuse
  const connections = new Map();

  app.get('/api/store-config/sse', (req, res) => {
    const userId = req.ip;
    if (connections.get(userId) >= 3) {
      return res.status(429).send('Too many connections');
    }
    // ... rest of handler
  });
  ```

---

## 🌐 Frontend Optimizations

### Image Optimization

- [ ] **Use Lazy Loading**

  ```typescript
  <img src={menu.imgSrc} loading="lazy" alt={menu.name} />
  ```

- [ ] **Use Next.js Image Component** (if using Next.js)

  ```typescript
  import Image from 'next/image';

  <Image
    src={menu.imgSrc}
    alt={menu.name}
    width={400}
    height={300}
    loading="lazy"
  />;
  ```

- [ ] **Compress Images**

  - Use WebP format
  - Target size: < 100KB per image
  - Tools: TinyPNG, Squoosh, ImageOptim

- [ ] **Implement Progressive Image Loading**
  ```typescript
  <img
    src={menu.imgSrc}
    srcSet={`${menu.imgSrc}?w=400 400w, ${menu.imgSrc}?w=800 800w`}
    sizes="(max-width: 768px) 400px, 800px"
    loading="lazy"
  />
  ```

### Code Optimization

- [ ] **Implement Code Splitting**

  ```typescript
  import { lazy, Suspense } from 'react';

  const MenuList = lazy(() => import('./components/MenuList'));

  <Suspense fallback={<Skeleton />}>
    <MenuList />
  </Suspense>;
  ```

- [ ] **Memoize Components**

  ```typescript
  import { memo } from 'react';

  export const MenuItem = memo(({ menu }) => {
    // Component code
  });
  ```

- [ ] **Use useMemo for Expensive Calculations**

  ```typescript
  const sortedMenus = useMemo(
    () => [...menus].sort((a, b) => a.priority - b.priority),
    [menus],
  );
  ```

- [ ] **Use useCallback for Event Handlers**
  ```typescript
  const handleClick = useCallback(() => {
    // Handler code
  }, [dependencies]);
  ```

### Caching Strategy

- [ ] **Implement React Query** (Recommended)

  ```bash
  npm install @tanstack/react-query
  ```

  ```typescript
  useQuery({
    queryKey: ['menu'],
    queryFn: fetchMenu,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
  ```

- [ ] **Use Browser Cache API** (Advanced)

  ```typescript
  const cache = await caches.open('menu-v1');
  await cache.put(url, response);
  ```

- [ ] **Implement Service Worker** (PWA)
  ```javascript
  // Cache menu data offline
  self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      }),
    );
  });
  ```

### Network Optimization

- [ ] **Use CDN for Static Assets**

  - Images
  - Fonts
  - CSS/JS bundles

- [ ] **Enable HTTP/2**

  - Check server configuration
  - Multiplexing support

- [ ] **Minimize Bundle Size**

  ```bash
  # Analyze bundle
  npm run build -- --analyze

  # Remove unused dependencies
  npm prune
  ```

- [ ] **Implement Prefetching**
  ```typescript
  <link rel="prefetch" href="/api/menu" />
  ```

---

## 📊 Monitoring & Measurement

### Performance Metrics

- [ ] **Measure API Response Time**

  ```bash
  curl -w "\nTime: %{time_total}s\n" \
    -o /dev/null -s \
    https://api.swamyshotfoods.in/api/menu
  ```

  **Target**: < 500ms

- [ ] **Measure SSE Connection Time**

  ```typescript
  const startTime = performance.now();
  eventSource.onopen = () => {
    const connectionTime = performance.now() - startTime;
    console.log(`SSE connected in ${connectionTime}ms`);
  };
  ```

  **Target**: < 1000ms

- [ ] **Measure First Contentful Paint (FCP)**

  - Use Lighthouse
  - **Target**: < 1.8s

- [ ] **Measure Largest Contentful Paint (LCP)**

  - Use Lighthouse
  - **Target**: < 2.5s

- [ ] **Measure Time to Interactive (TTI)**
  - Use Lighthouse
  - **Target**: < 3.8s

### Monitoring Tools

- [ ] **Set Up Google Analytics**

  ```typescript
  // Track page load time
  window.addEventListener('load', () => {
    const loadTime = performance.now();
    gtag('event', 'timing_complete', {
      name: 'load',
      value: Math.round(loadTime),
    });
  });
  ```

- [ ] **Set Up Error Tracking** (Sentry)

  ```bash
  npm install @sentry/react
  ```

  ```typescript
  import * as Sentry from '@sentry/react';

  Sentry.init({
    dsn: 'your-dsn',
    tracesSampleRate: 1.0,
  });
  ```

- [ ] **Monitor SSE Connection Health**

  ```typescript
  let reconnectCount = 0;

  eventSource.onerror = () => {
    reconnectCount++;
    console.log(`SSE reconnect attempt: ${reconnectCount}`);
    // Send to analytics
  };
  ```

---

## 🧪 Testing Checklist

### Performance Testing

- [ ] **Test on Slow 3G Network**

  - Chrome DevTools → Network → Slow 3G
  - **Target**: Page loads in < 5s

- [ ] **Test on Mobile Devices**

  - Real device testing
  - Different screen sizes

- [ ] **Test SSE Reconnection**

  - Simulate network interruption
  - Verify auto-reconnect works

- [ ] **Load Testing**

  ```bash
  # Install Apache Bench
  brew install httpd

  # Test API endpoint
  ab -n 1000 -c 10 https://api.swamyshotfoods.in/api/menu
  ```

  **Target**: Handle 100 concurrent users

### Browser Compatibility

- [ ] **Test in Chrome**
- [ ] **Test in Safari**
- [ ] **Test in Firefox**
- [ ] **Test in Edge**
- [ ] **Test on iOS Safari**
- [ ] **Test on Android Chrome**

---

## 🚀 Deployment Checklist

### Pre-Deployment

- [ ] **Enable Production Mode**

  ```bash
  NODE_ENV=production npm run build
  ```

- [ ] **Minify Assets**

  - CSS minification
  - JS minification
  - HTML minification

- [ ] **Set Correct CORS Headers**

  ```javascript
  app.use(
    cors({
      origin: 'https://swamyshotfoods.in',
      credentials: true,
    }),
  );
  ```

- [ ] **Configure Environment Variables**
  ```env
  NEXT_PUBLIC_API_URL=https://api.swamyshotfoods.in
  ```

### Post-Deployment

- [ ] **Verify SSE Connection in Production**

  - Open browser console
  - Check for "SSE Connected" message

- [ ] **Test Real-Time Updates**

  - Update shop status from admin app
  - Verify website updates instantly

- [ ] **Monitor Error Rates**

  - Check Sentry dashboard
  - Look for SSE errors

- [ ] **Check Performance Metrics**
  - Run Lighthouse audit
  - Verify Core Web Vitals

---

## 📈 Expected Results

After implementing these optimizations:

| Metric                   | Before | After   | Target |
| ------------------------ | ------ | ------- | ------ |
| API Response Time        | ?      | < 500ms | ✅     |
| SSE Connection Time      | ?      | < 1s    | ✅     |
| First Contentful Paint   | ?      | < 1.8s  | ✅     |
| Largest Contentful Paint | ?      | < 2.5s  | ✅     |
| Time to Interactive      | ?      | < 3.8s  | ✅     |
| Bundle Size              | ?      | < 200KB | ✅     |

---

## 🔍 Debugging Slow Performance

If performance is still slow after optimizations:

### 1. Check API Response Time

```bash
curl -w "\n\nTotal Time: %{time_total}s\nDNS Lookup: %{time_namelookup}s\nConnect: %{time_connect}s\nStart Transfer: %{time_starttransfer}s\n" \
  -o /dev/null -s \
  https://api.swamyshotfoods.in/api/menu
```

### 2. Check Database Query Performance

```javascript
// Enable MongoDB slow query logging
mongoose.set('debug', true);

// Check query execution time
const start = Date.now();
const menus = await Menu.find();
console.log(`Query took ${Date.now() - start}ms`);
```

### 3. Check Network Latency

```bash
# Ping API server
ping api.swamyshotfoods.in

# Trace route
traceroute api.swamyshotfoods.in
```

### 4. Profile React Components

```typescript
import { Profiler } from 'react';

<Profiler
  id="MenuList"
  onRender={(id, phase, actualDuration) => {
    console.log(`${id} (${phase}) took ${actualDuration}ms`);
  }}
>
  <MenuList />
</Profiler>;
```

### 5. Check Bundle Size

```bash
# Analyze bundle
npm run build
npx source-map-explorer 'build/static/js/*.js'
```

---

## ✅ Quick Wins (Implement First)

1. **Enable Gzip Compression** (Backend) - 70% size reduction
2. **Add Image Lazy Loading** (Frontend) - 50% faster initial load
3. **Implement React Query** (Frontend) - Better caching
4. **Add Database Indexes** (Backend) - 10x faster queries
5. **Use Next.js Image Component** (Frontend) - Automatic optimization

---

## 📚 Resources

- [Web.dev Performance](https://web.dev/performance/)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [MongoDB Performance Best Practices](https://www.mongodb.com/docs/manual/administration/analyzing-mongodb-performance/)
- [SSE Best Practices](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)
