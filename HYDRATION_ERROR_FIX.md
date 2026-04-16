# 🔧 Fix: React Hydration Error

## Problem

**Error:**
```
Unhandled Runtime Error
Error: Text content does not match server-rendered HTML.
Warning: Text content did not match. Server: "4" Client: "3"
```

**Root Cause:**
The hydration error occurred because stats cards were rendered with initial state values (`0`) on the server, but then fetched data from the API updated the state on the client, causing a mismatch between server and client HTML.

### Timeline of the Issue:
1. **Server render**: Component initializes state with `{ all: 0, pending: 0, approved: 0, rejected: 0 }`
2. HTML is sent to browser with stats showing "0"
3. **Client hydration**: React tries to match server HTML with client-rendered HTML
4. **API fetch**: `useEffect` fetches actual data from API (e.g., `{ all: 4, pending: 1, approved: 2, rejected: 1 }`)
5. State updates, client renders "4" instead of "0"
6. **Mismatch**: Server said "0" but client says "4" → Hydration error! ❌

---

## Solution

Created a `useHydration` hook that ensures stats are only rendered after client-side hydration is complete.

### Files Created:
- `admin/hooks/useHydration.ts` - Custom hook with `ClientOnly` component

### Files Modified:
- `admin/pages/comments.tsx` - Wrapped stats cards with `ClientOnly`
- `admin/pages/analytics.tsx` - Wrapped stats cards with `ClientOnly`

---

## Implementation Details

### Step 1: Create useHydration Hook

```typescript
// admin/hooks/useHydration.ts
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}

export function ClientOnly({ children }: { children: React.ReactNode }) {
  const isHydrated = useHydration();
  return isHydrated ? <>{children}</> : null;
}
```

### Step 2: Wrap Stats Components

**Before:**
```jsx
<Row gutter={[16, 16]}>
  <Col>
    <Statistic value={stats.all} />  {/* Server: 0, Client: 4 = ERROR */}
  </Col>
</Row>
```

**After:**
```jsx
<ClientOnly>
  <Row gutter={[16, 16]}>
    <Col>
      <Statistic value={stats.all} />  {/* Only renders on client */}
    </Col>
  </Row>
</ClientOnly>
```

---

## How It Works

1. **Initial Render (Server):**
   - Server renders the page
   - `ClientOnly` returns `null` (because `isHydrated = false`)
   - Stats cards are NOT rendered on the server

2. **Hydration (Client):**
   - React hydrates the page
   - Browser matches server HTML (which didn't include stats)

3. **After Hydration (Client):**
   - `useEffect` sets `isHydrated = true`
   - Component re-renders
   - `ClientOnly` now returns children
   - Stats cards render with current state (which may have been updated by API)

4. **No Mismatch:**
   - Server: stats cards not present
   - Client before hydration: stats cards not present
   - Client after hydration: stats cards present with correct data ✅

---

## Pages Fixed

### 1. `admin/pages/comments.tsx`
- Wrapped stats cards (Tất cả, Chờ duyệt, Đã duyệt, Từ chối)
- Wrapped header with total comment count

### 2. `admin/pages/analytics.tsx`
- Wrapped 6 stats cards (Tổng số phim, Người dùng, etc.)

---

## Testing

To verify the fix:

1. **Start the admin panel:**
   ```bash
   cd admin
   npm run dev
   ```

2. **Navigate to:**
   - http://localhost:3002/comments
   - http://localhost:3002/analytics

3. **Check console:**
   - Should see NO hydration errors
   - Stats should display correctly after loading

4. **Expected behavior:**
   - Stats cards appear after a slight delay (after data fetches)
   - No console warnings about text mismatch

---

## Why This Is the Best Solution

| Approach | Pros | Cons |
|----------|------|------|
| **ClientOnly (Used)** | ✅ Proper React practice | requires wrapping |
|  | ✅ No suppressHydrationWarning abuse | slight layout shift |
| suppressHydrationWarning | Quick fix | ❌ Hides real issues |
| | | ❌ Doesn't solve the problem |
| Dynamic import with ssr:false | Prevents server render | ❌ Disable SSR benefits |
| | | ❌ Can hurt SEO |

---

## Future Prevention

To avoid this issue in the future:

1. **Use `ClientOnly` for dynamic data:**
   ```jsx
   // Always wrap components that fetch data
   <ClientOnly>
     <StatsCards data={dynamicData} />
   </ClientOnly>
   ```

2. **Separate concerns:**
   ```jsx
   // Server-rendered (always same on both)
   <HeaderInfo />
   
   // Client-only (only after hydration)
   <ClientOnly>
     <DynamicStats />
   </ClientOnly>
   ```

3. **Consider using `getServerSideProps` or `getStaticProps`:**
   ```typescript
   // Fetch data at build/request time, not in component
   export const getServerSideProps = async () => {
     const stats = await fetchStats();
     return { props: { stats } };
   }
   ```

---

## Related Resources

- [Next.js Hydration Error Docs](https://nextjs.org/docs/messages/react-hydration-error)
- [React Hydration Best Practices](https://github.com/vercel/next.js/discussions/14322)
- [useEffect for Client-Only Logic](https://beta.reactjs.org/reference/react/useEffect#connecting-to-an-external-system)

---

## Summary

✅ **Issue:** Hydration mismatch from dynamic stats
✅ **Root Cause:** Server and client rendering different values
✅ **Solution:** Use `ClientOnly` to defer rendering until after hydration
✅ **Result:** No more hydration errors, stats display correctly
