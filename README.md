


I started by creating the out folder, and I worked on the layout. After working on the layout, I defined each screen header as I wanted. Now I am on the sign-in page, trying to set up the form UI so they can sign in. 


I just finished up the authentication logic using Supabase, and I also created a listener that listens for whether she's just signed in or not. I also added the verify OTP. It was just mainly documentation that I used to add these codes, and I think I'm good from there. 

## React Query (learning log)

`@tanstack/react-query` caches server data (our Supabase data) and handles loading, error and refetching for us, so screens don't need hand-rolled `useEffect` + `useState` fetching.

### Step 1: QueryClient and provider

- **Where:** `src/app/_layout.tsx`, the root layout, so every screen shares one cache.
- **What:** created a single `QueryClient` and wrapped the `Stack` in `<QueryClientProvider client={queryClient}>`.
- **Why the client is outside the component:** `RootLayout` re-renders on every auth change. A client created inside it would be recreated each time and the cache would be lost.
- **Result:** no visible change yet. Query hooks (`useQuery`, `useMutation`) now work anywhere in the app.

```tsx
const queryClient = new QueryClient();

export default function RootLayout() {
  // ...
  return (
    <QueryClientProvider client={queryClient}>
      <Stack>{/* screens */}</Stack>
    </QueryClientProvider>
  );
}
```

### Step 2: The fetch function (`fetchTrips`)

- **Idea:** React Query doesn't fetch data itself. We give it a plain async function that returns data or throws, and it manages caching, loading/error state and refetching around it.
- **Where:** `src/lib/trips.ts`, next to `supabase.ts`, so any screen can reuse it.
- **What:** `fetchTrips()` selects every row from the `trips` table (Supabase RLS limits it to the signed-in user's trips).
- **Why `if (error) throw error`:** Supabase returns `{ data, error }` instead of throwing. React Query only treats a request as failed when the function throws, so without this line a failure would look like a success with `data: null`.
- **Type change:** `Trip` in `src/types.ts` now mirrors the `trips` table: `id` (uuid string), `name`, `start_date`, `end_date`, `owner_id`. Fields like members, places and todos live in other tables and will be added later.

```ts
export async function fetchTrips() {
  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return data;
}
```

### Step 3: Reading data with `useQuery`

- **Where:** `src/components/TripHome.tsx`. The hardcoded trips array is gone; the list now comes from Supabase.
- **What:** `useQuery({ queryKey: ["trips"], queryFn: fetchTrips })` returns `data`, `isPending` and `error`.
  - `queryFn` is the function itself (`fetchTrips`, not `fetchTrips()`), so React Query decides when to run it.
  - `queryKey` is the cache label. Any screen using `["trips"]` shares the same cached data, and we'll invalidate this key after creating a trip.
- **Handling states:** `if (isPending)` and `if (error)` return early, so after them `data` is guaranteed to exist and we can `.map` over it.
- **Card fields:** now use the table's columns (`name`, `start_date`, `end_date`). The members/places/price/todo lines are commented out until we add real counts from `trip_members` and `items`.

```tsx
const { data, isPending, error } = useQuery({
  queryKey: ["trips"],
  queryFn: fetchTrips,
});

if (isPending) return <Text>Loading...</Text>;
if (error) return <Text>Something went wrong...{error.message}</Text>;
```

### Step 4: One trip with its own query key

- **Where:** `src/lib/trips.ts` (`fetchTrip`) and `src/app/trip/[id].tsx`.
- **Pattern:** list under `["trips"]`, detail under `["trips", id]`. Each trip gets its own cache entry, and invalidating `["trips"]` later refreshes both.
- **`fetchTrip(id)`:** filters with `.eq("id", id)` and uses `.single()` to return one object instead of an array. It throws on error, like `fetchTrips`.
- **`queryFn: () => fetchTrip(id)`:** it must be a function that React Query can call later. Writing `fetchTrip(id)` without the arrow runs it immediately and passes the resulting Promise instead of a function.
- **Typing the param:** `useLocalSearchParams<{ id: string }>()`. Without the generic, `id` is `string | string[]` and `fetchTrip` rejects it.
- **Promises, in short:** an `async` function always returns a Promise (a placeholder for a value that isn't ready yet). `await` pauses that function until the Promise is settled. `throw` inside an async function turns it into a rejected Promise, which is how React Query learns a request failed.

```tsx
const { id } = useLocalSearchParams<{ id: string }>();

const { data, isPending, error } = useQuery({
  queryKey: ["trips", id],
  queryFn: () => fetchTrip(id),
});
```

### Step 5: Items for a trip (places, cost, to-dos)

- **Where:** `src/lib/tripItems.ts` (`fetchTripItems`), `src/app/trip/[id].tsx`, and the new `src/components/places.tsx`, `cost.tsx` and `todo.tsx`.
- **One table, three kinds:** places, costs and to-dos all live in the `items` table, told apart by a `type` column (`"place" | "cost" | "todo"`). The `Item` type in `src/types.ts` mirrors it: `id`, `trip_id`, `type`, `title`, `notes`, `amount`, `paid_by`, `split_between`, `is_done`, `created_by`, `created_at`, `updated_at`.
- **`fetchTripItems(tripId)`:** selects from `items`, filters with `.eq("trip_id", tripId)`, orders by `created_at`, and throws on error like the other fetchers.
- **Query key:** `["trips", id, "items"]`. It sits under the trip's key, so invalidating `["trips", id]` refreshes the trip and its items together.
- **One fetch, then filter:** the board fetches all of a trip's items once and splits them on the client with `.filter((item) => item.type === "place")` (and the same for `cost` and `todo`). That's one request instead of three.
- **Tabs:** `TripBoard` keeps a `tab` state (`places`, `cost`, `todos`). Three `Pressable`s switch it, and the matching component renders: `<Places places={places} />`, `<Cost costs={costs} />`, `<Todos todos={todos} />`.
- **Loading/error:** both queries are checked before rendering, so `data` and `tripItems` exist by the time the tabs show.
- **Where it stands:** each tab only lists item titles for now. Amount, paid-by, split and the done checkbox come next.

```tsx
const { data: tripItems } = useQuery({
  queryKey: ["trips", id, "items"],
  queryFn: () => fetchTripItems(id),
});

const places = tripItems?.filter((item) => item.type === "place");
```
