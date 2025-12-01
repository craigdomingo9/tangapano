This comprehensive documentation covers the architecture, usage, and best practices for our custom **State-Based Strategy Router**.

---

# 📖 System Architecture: The Strategy Router

## 1\. Overview

Unlike standard Next.js routing which uses file paths (`/dashboard/settings`), our application uses a **State-Based Strategy Router**. We drive the entire UI using URL Search Parameters (e.g., `?page=settings&mode=edit`).

### Why do we do this?

1.  **SPA Feel:** It eliminates full page reloads, providing a "Native App" experience.
2.  **State Preservation:** We can switch tabs or open modals without losing context in the background.
3.  **Portal Isolation:** We can run distinct applications (Partner Portal, Student Portal, Admin) using the exact same engine but different configurations.

---

## 2\. Core Concepts

### 🧠 The Registry (`src/routing/registries/`)

This is the "Configuration." It maps URL parameters to React Components.

- **Partner Registry:** `registries/partner.ts`
- **Student Registry:** `registries/student.ts`

### ⚙️ The Engine (`RouteRenderer.tsx`)

This is the "Brain." It watches the URL parameters, looks up the correct component in the **Registry**, and renders it with a smooth transition animation.

### 🔌 The Wrapper (`PartnerRouter.tsx` / `StudentRouter.tsx`)

This is the "Bridge." It sits between the Server (Page) and the Client (Engine). It prevents server-side serialization errors by ensuring route definitions stay on the client.

---

## 3\. Directory Structure

```text
src/
├── app/
│   └── partner/dashboard/
│       ├── page.tsx            <-- Server: Fetches Data, wraps in Suspense
│       └── PartnerRouter.tsx   <-- Client: Imports Registry, renders Engine
├── routing/
│   ├── RouteRenderer.tsx       <-- The Generic Engine
│   ├── RouterLink.tsx          <-- The Navigation Component
│   ├── utils.ts                <-- Lazy Loader Utility
│   └── registries/             <-- Route Definitions
│       ├── partner.ts
│       └── student.ts
├── lib/
│   └── types/
│       └── partner.ts          <-- Type Definitions (Params & Context)
```

---

## 4\. How to Add a New Page

### Step 1: Create the Component

Create your page component. **Crucial:** It must start with `"use client"` because it will be rendered dynamically.

**File:** `src/components/partner/dashboard/pages/MyNewPage.tsx`

```tsx
"use client";

import { PartnerComponentProps } from "@/lib/types/partner";
import { FullScreenView } from "@/components/ui/FullScreenView";

// 1. Use the specific Props type for your portal
export default function MyNewPage({
  params,
  serverData,
}: PartnerComponentProps) {
  return (
    <FullScreenView title="My New Page">
      <h1>Hello {serverData.user.first_name}</h1>
    </FullScreenView>
  );
}
```

### Step 2: Register the Route

Add it to the registry. Order matters\! Specific routes (with IDs) go first; generic routes go last.

**File:** `src/routing/registries/partner.ts`

```typescript
// 1. Lazy load it
const MyNewPage = lazyLoad(
  () => import("@/components/partner/dashboard/pages/MyNewPage")
);

export const partnerRoutes = [
  // ... other routes
  {
    id: "my-new-page",
    matcher: (p) => p.page === "new-feature", // ?page=new-feature
    component: MyNewPage,
  },
  // ... fallback overview route
];
```

### Step 3: Link to it

Use our custom `RouterLink` or `useRouterPush`. **Do not use Next.js `<Link>` directly.**

```tsx
import { RouterLink } from "@/routing/RouterLink";

<RouterLink to={{ page: "new-feature" }}>Go to Feature</RouterLink>;
```

---

## 5\. Navigation & Data Fetching

### Navigating Programmatically

Use the `useRouterPush` hook. It handles the React Transition (non-blocking UI) and URL construction automatically.

```tsx
import { useRouterPush } from "@/hooks/use-router-push";
import { PartnerParams } from "@/lib/types/partner";

export function MyButton() {
  // Pass the generic type for autocomplete magic ✨
  const { push, isPending } = useRouterPush<PartnerParams>();

  return (
    <button
      onClick={() => push({ page: "listings", listingId: "123" })}
      disabled={isPending}
    >
      Edit Listing
    </button>
  );
}
```

### Accessing Data

Your page component receives two props automatically:

1.  **`params`**: The URL Search Params (e.g., `{ page: "listings", listingId: "55" }`).
2.  **`serverData`**: The Global Context fetched on the server (User, Token, etc.).

---

## 6\. ⚠️ Critical Rules (The "Do Not Break" List)

### 1\. The "Use Client" Rule

Every Page Component imported into a Registry **MUST** have `"use client"` at the top.

- _Why?_ The Registry is loaded on the client. If you import a Server Component, Next.js will crash because Server Components cannot be imported into Client boundaries dynamically in this manner.

### 2\. The Animation Rule

In `RouteRenderer`, we only animate **Opacity**.

- _Why?_ Animating `transform` (x, y, scale) creates a new CSS Stacking Context. This breaks `position: fixed` elements (like Modals or FullScreenViews), trapping them inside the animation container.

### 3\. The Serialization Rule

Never pass the `routes` array from `page.tsx` (Server) to `RouteRenderer` (Client).

- _Why?_ React cannot serialize Functions (Components) from Server to Client.
- _Fix:_ Use the **Client Wrapper** pattern (`PartnerRouter.tsx`) to import the routes on the client side.

### 4\. The Suspense Rule

The Server Page (`page.tsx`) must wrap the Router in `<Suspense>`.

- _Why?_ `useSearchParams` requires a Suspense boundary. Without it, the router will not detect URL changes, and navigation will silently fail.

---

## 7\. Performance Features

Our router includes several optimizations "out of the box":

1.  **Lazy Loading:** Pages are only downloaded when needed.
2.  **Non-Blocking Navigation:** We use `useTransition()`. When you click a link, the current page stays interactive until the new one is ready. You will see the **Global Loading Bar** at the top.
3.  **Hardware Acceleration:** Transitions use `will-change: opacity` to offload rendering to the GPU.

---

## 8\. Troubleshooting

| Issue                           | Cause                           | Solution                                                                                          |
| :------------------------------ | :------------------------------ | :------------------------------------------------------------------------------------------------ |
| **Blank Screen / White Page**   | CSS Height Collapse             | Ensure `RouteRenderer` container has `min-h-screen`, NOT `h-full`.                                |
| **"Static Flag Missing" Error** | Using Hooks in Helper Functions | Convert helper functions (e.g., `renderInput`) into proper React Components (`<ProfileInput />`). |
| **Modals are cut off / hidden** | CSS Stacking Context            | Ensure animations in `RouteRenderer` do NOT use `transform`, only `opacity`.                      |
| **Navigation doesn't work**     | Missing Suspense                | Wrap `<PartnerRouter>` in `<Suspense>` in `page.tsx`.                                             |
| **Server Error (Digest...)**    | Serialization                   | Ensure `routes` array is imported in the Client Wrapper, not the Server Page.                     |
