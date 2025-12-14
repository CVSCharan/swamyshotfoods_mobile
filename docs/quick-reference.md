# Quick Reference: Real-Time Updates

**TL;DR**: Your backend is perfect! Just implement the frontend.

---

## 🎯 The Strategy

| Data            | Update Frequency   | Solution           |
| --------------- | ------------------ | ------------------ |
| **Shop Status** | Multiple times/day | ✅ SSE (Real-time) |
| **Menu Items**  | Rarely             | ✅ REST + Cache    |

---

## 🚀 Quick Start (5 Minutes)

### 1. Create SSE Hook

```typescript
// hooks/useStoreConfig.ts
import { useState, useEffect } from 'react';

export function useStoreConfig() {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const es = new EventSource(
      'https://api.swamyshotfoods.in/api/store-config/sse',
    );
    es.onmessage = e => setConfig(JSON.parse(e.data));
    return () => es.close();
  }, []);

  return config;
}
```

### 2. Create Menu Hook

```typescript
// hooks/useMenu.ts
import { useState, useEffect } from 'react';

export function useMenu() {
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    fetch('https://api.swamyshotfoods.in/api/menu')
      .then(r => r.json())
      .then(setMenus);
  }, []);

  return menus;
}
```

### 3. Use in Component

```typescript
// pages/index.tsx
import { useStoreConfig } from '@/hooks/useStoreConfig';
import { useMenu } from '@/hooks/useMenu';

export default function Home() {
  const config = useStoreConfig();
  const menus = useMenu();

  return (
    <>
      {config?.isShopOpen && <div>🟢 Open!</div>}
      {menus.map(m => (
        <div key={m._id}>{m.name}</div>
      ))}
    </>
  );
}
```

**Done!** You now have real-time updates. 🎉

---

## 📚 Full Documentation

| Document                                                                         | Purpose                |
| -------------------------------------------------------------------------------- | ---------------------- |
| [real-time-implementation-guide.md](./real-time-implementation-guide.md)         | Strategy & approach    |
| [website-frontend-examples.md](./website-frontend-examples.md)                   | Complete code examples |
| [performance-optimization-checklist.md](./performance-optimization-checklist.md) | Optimization guide     |
| [sse-integration-guide.md](./sse-integration-guide.md)                           | SSE deep dive          |
| [api.md](./api.md)                                                               | API reference          |

---

## ✅ Backend Status

**No changes needed!** Your backend already has:

- ✅ SSE endpoint: `/api/store-config/sse`
- ✅ Menu REST API: `/api/menu`
- ✅ Event emission working
- ✅ Authentication ready

---

## 🎯 What You Need to Do

### Frontend Only:

1. **Implement SSE hook** for shop status (5 min)
2. **Implement REST hook** for menu (5 min)
3. **Create components** to display data (30 min)
4. **Optimize performance** (see checklist)

**Total Time**: ~2-3 hours for basic implementation

---

## 🐛 If Website is Slow

It's likely **NOT** a real-time issue. Check:

1. **API Response Time**

   ```bash
   curl -w "\nTime: %{time_total}s\n" https://api.swamyshotfoods.in/api/menu
   ```

   Should be < 500ms

2. **Database Indexes**

   ```javascript
   menuSchema.index({ priority: 1 });
   ```

3. **Image Optimization**

   - Compress images (< 100KB each)
   - Use lazy loading
   - Use WebP format

4. **Caching**
   - Use React Query
   - Set appropriate cache times

---

## 📊 Expected Results

After implementation:

- ✅ Shop status updates **instantly** (< 1s)
- ✅ Menu loads **fast** (< 2s)
- ✅ Auto-reconnects on network failure
- ✅ Works on all devices

---

## 🚫 Don't Do This

- ❌ Don't add SSE for menu (unnecessary)
- ❌ Don't use WebSockets (overkill)
- ❌ Don't use polling (inefficient)
- ❌ Don't change backend (already perfect)

---

## 💡 Pro Tips

1. **Start Simple**: Get it working first, optimize later
2. **Test SSE First**: Easiest to verify real-time updates
3. **Use React Query**: Better caching than manual fetch
4. **Monitor Performance**: Use Lighthouse
5. **Compress Images**: Biggest performance win

---

## 🆘 Need Help?

1. Check the full documentation (links above)
2. Review code examples in `website-frontend-examples.md`
3. Follow the checklist in `performance-optimization-checklist.md`
4. Test with the debugging commands provided

---

## 📝 Summary

**Your backend is ready!** Just implement these two hooks on the frontend:

- `useStoreConfig()` - Real-time SSE
- `useMenu()` - REST + Cache

That's it! 🚀
