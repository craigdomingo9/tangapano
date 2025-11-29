Welcome to the team. You are here because we do routing differently.

Most React apps use **Path-Based Routing** (`/users/settings`). We use **State-Based Strategy Routing** (`/?view=users&mode=settings`).

Why? because our application is a complex dashboard, not a blog. We need to preserve filters, modal states, and active tabs in the URL without creating a deep, messy folder structure.

I am going to walk you through the entire architecture, from the database call on the server to the pixel moving on the client screen.

----------

### I. The 10,000-Foot View

Our routing system is built on **Four Pillars**:

1.  **The Source of Truth:** The URL Query String (browser bar).
    
2.  **The Brain (Store):** A Zustand store that calculates _what_ should be shown.
    
3.  **The Rules (Registry):** A prioritized list of conditions (Matchers).
    
4.  **The Engine (Renderer):** A component that syncs the URL to the Rules and handles animations.
    

----------

### II. The Deep Dive

#### Layer 1: The Brain (`store.ts`)

This is the logic center. It is a "singleton," meaning there is only one instance of the router logic for the whole app.

-   **The State:** It holds `activeRoute`. This is the _result_ of the calculation.
    
-   **The Resolve Function:** This is the critical engine.
    
    1.  It takes the current `params` (from the URL).
        
    2.  It iterates through our list of `routes`.
        
    3.  It runs `.find()`. The **first** route that says "Yes, I match these params" wins.
        
    4.  **Optimization:** It checks `if (currentId !== newId)`. If you are just changing a page number (`?page=1` to `?page=2`) but staying on the "Grid View", we do _not_ want to trigger a full layout transition. This check prevents that.
        

#### Layer 2: The Rules (`routes.ts`)

This is where we define the application structure. It replaces the traditional `react-router` configuration.

Key Concept: Priority via Order

In a traditional router, /users/new must come before /users/:id.

In our router, the array order dictates priority.

1.  **Top:** Specific "Edge Cases" (e.g., `view=users` AND `mode=edit`).
    
2.  **Middle:** General Views (e.g., `view=users`).
    
3.  **Bottom:** Fallbacks (e.g., `view=dashboard` or `empty`).
    

Key Concept: The Matcher

A matcher is just a function: (params) => boolean.

-   We use `when.params({ tab: 'settings' })` for exact matches.
    
-   We use `(p) => !!p.userId` for "existence" checks.
    

Key Concept: Lazy Loading (Code Splitting)

Notice we use next/dynamic or React.lazy.

-   **Why?** If we didn't do this, a user loading the "Home" page would also download the code for the "Settings" page (and its heavy libraries).
    
-   **How:** `dynamic(() => import('./Settings'))`. This creates a separate JavaScript "chunk" that is only requested from the network when the matcher returns `true`.
    

#### Layer 3: The Engine (`RouteRenderer.tsx`)

This is the visual component that sits in your layout.

**The Sync Cycle:**

1.  **Hook:** `useSearchParams()` reads the browser URL.
    
2.  **Memo:** We convert that messy URL map into a clean JSON object (`currentParams`).
    
3.  **Effect:** `useEffect` fires. It calls `resolve(currentParams)`.
    
4.  **Render:** The store updates `activeRoute`. The Renderer sees this change.
    

The Animation (AnimatePresence):

We wrap the component in Framer Motion.

-   `mode="wait"`: This is crucial. It means "Wait for the old route to fade out completely before rendering the new one." This prevents the layout from jumping around (layout thrashing).
    
-   `key={activeRoute.id}`: This tells React "These are different components." Even if we switch from `UserView` (id: 1) to `UserView` (id: 2), changing the key forces a full unmount/remount, triggering the fade animation.
    

#### Layer 4: The Input (`RouterLink.tsx`)

Never use a standard `<a>` tag or Next.js `<Link>` directly. Use `<RouterLink>`.

Why? Type Safety.

If you try to type to={{ tab: "settngs" }} (typo), TypeScript will yell at you. This prevents broken links before they happen.

Feature: preserveParams

Imagine you are on ?view=users&sort=asc. You want to go to Page 2.

-   If you use standard links, you might accidentally overwrite `sort`.
    
-   With `<RouterLink to={{ page: 2 }} preserveParams>`, the router merges the new param with the existing URL, resulting in `?view=users&sort=asc&page=2`.
    

----------

### III. The Server Integration (Next.js Context)

This is the hardest part to grasp for new devs. We are mixing **Server Components** (Node.js) with **Client Components** (Browser).

1.  **The Server (`page.tsx`):**
    
    -   This runs _once_ on the server.
        
    -   It calls `getUserContext()` (Database).
        
    -   It renders the skeleton HTML.
        
    -   **The Suspense Boundary:** You see `<Suspense fallback={...}>`. This is a blast shield. Because `RouteRenderer` needs to talk to the browser URL (which the server doesn't have yet), we must wrap it in Suspense. If we forget this, Next.js de-optimizes the whole page into Client-Side Rendering (slow).
        
2.  **The Handoff:**
    
    -   The Server passes `userContext` (JSON) into `<RouteRenderer userContext={...} />`.
        
    -   The `RouteRenderer` passes that data down to whatever component matched.
        
    -   _Result:_ The Dashboard component receives user data immediately without needing a `useEffect` or a loading spinner.
        

----------

### IV. The Lifecycle of a "Click"

Here is exactly what happens when a user clicks "Settings":

1.  **User Click:** User clicks `<RouterLink to={{ tab: 'settings' }}>`.
    
2.  **URL Update:** The browser URL changes to `/?tab=settings`. No page reload happens.
    
3.  **Detection:** `useSearchParams` inside `RouteRenderer` notices the change.
    
4.  **Calculation:** The `resolve` function runs. It checks the routes array.
    
    -   Route 1 (User)? No.
        
    -   Route 2 (Settings)? **Yes.** Matcher returns true.
        
5.  **State Update:** The Zustand store sets `activeRoute = SettingsRoute`.
    
6.  **Transition:**
    
    -   `RouteRenderer` sees the ID changed.
        
    -   Framer Motion triggers `exit` animation on the old component (Dashboard).
        
    -   Old component disappears.
        
7.  **Loading (Network):** Since "Settings" is lazy loaded, the browser requests `settings-chunk.js`.
    
    -   While downloading, the user sees the `loading` skeleton defined in `dynamic()`.
        
8.  **Mount:** The script arrives. The `Settings` component mounts. Framer Motion triggers `enter` animation.
    
9.  **View:** User sees the Settings panel.
    

----------

### V. Common Intern Mistakes (Don't do these)

1.  **The Infinite Loop:**
    
    -   _Bad:_ Calling `resolve()` directly in the component body.
        
    -   _Good:_ Always put `resolve()` inside a `useEffect`.
        
2.  **The "Undefined" URL:**
    
    -   _Bad:_ Passing `userId: undefined` to the link. This creates `?userId=undefined` (string).
        
    -   _Good:_ Our `RouterLink` component automatically filters out undefined values. Trust it.
        
3.  **Forgetting `shrink-0`:**
    
    -   If you add a Sidebar and it looks squashed, it's because Flexbox is trying to help you fit everything. Add `shrink-0` to the sidebar so it holds its width.
        
4.  **Using `href`:**
    
    -   Do not use `href="/?tab=settings"`.
        
    -   Use `to={{ tab: 'settings' }}`. It’s type-safe and handles the query string formatting for you.
        

Welcome to the team. You now understand the nervous system of our application. Go build something.
