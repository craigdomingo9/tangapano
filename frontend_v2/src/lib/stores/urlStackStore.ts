// =============================================================================
// FILE: /lib/stores/urlStackStore.ts
// =============================================================================

/**
 * URL Stack Entry
 */
export interface UrlStackEntry {
  url: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

/**
 * URL Stack State
 */
export interface UrlStackState {
  stack: UrlStackEntry[];
  currentIndex: number;
}

/**
 * Initial State
 */
const initialState: UrlStackState = {
  stack: [],
  currentIndex: -1,
};

/**
 * Base URL Stack Store (using entity factory)
 */
const baseUrlStackStore = createEntityStore<UrlStackState>(initialState, {
  name: "url-navigation-stack", // Persisted to localStorage
});

/**
 * Extended URL Stack Store with navigation methods
 */
export const useUrlStack = () => {
  const { entities: state, setEntities, reset } = baseUrlStackStore();

  return {
    // State
    stack: state.stack,
    currentIndex: state.currentIndex,

    /**
     * Push a new URL to the stack
     */
    push: (url: string, metadata?: Record<string, any>) => {
      const newEntry: UrlStackEntry = {
        url,
        timestamp: Date.now(),
        metadata,
      };

      // Discard forward history if in the middle of stack
      const newStack = state.stack.slice(0, state.currentIndex + 1);
      newStack.push(newEntry);

      // Limit stack size to 50
      const limitedStack = newStack.slice(-50);

      setEntities({
        stack: limitedStack,
        currentIndex: limitedStack.length - 1,
      });
    },

    /**
     * Pop the current URL and go back
     */
    pop: (): UrlStackEntry | null => {
      if (state.currentIndex <= 0) return null;

      const currentEntry = state.stack[state.currentIndex];

      setEntities({
        ...state,
        currentIndex: Math.max(0, state.currentIndex - 1),
      });

      return currentEntry;
    },

    /**
     * Replace the current URL
     */
    replace: (url: string, metadata?: Record<string, any>) => {
      const newEntry: UrlStackEntry = {
        url,
        timestamp: Date.now(),
        metadata,
      };

      const newStack = [...state.stack];
      if (state.currentIndex >= 0) {
        newStack[state.currentIndex] = newEntry;
      } else {
        newStack.push(newEntry);
      }

      setEntities({
        stack: newStack,
        currentIndex: Math.max(0, state.currentIndex),
      });
    },

    /**
     * Check if can navigate back
     */
    canGoBack: (): boolean => {
      return state.currentIndex > 0;
    },

    /**
     * Check if can navigate forward
     */
    canGoForward: (): boolean => {
      return state.currentIndex < state.stack.length - 1;
    },

    /**
     * Peek at current URL
     */
    peek: (): UrlStackEntry | null => {
      return state.currentIndex >= 0 ? state.stack[state.currentIndex] : null;
    },

    /**
     * Peek at previous URL
     */
    peekBack: (): UrlStackEntry | null => {
      return state.currentIndex > 0
        ? state.stack[state.currentIndex - 1]
        : null;
    },

    /**
     * Peek at next URL
     */
    peekForward: (): UrlStackEntry | null => {
      return state.currentIndex < state.stack.length - 1
        ? state.stack[state.currentIndex + 1]
        : null;
    },

    /**
     * Navigate back in history
     */
    goBack: (): UrlStackEntry | null => {
      if (state.currentIndex <= 0) return null;

      const previousEntry = state.stack[state.currentIndex - 1];

      setEntities({
        ...state,
        currentIndex: state.currentIndex - 1,
      });

      return previousEntry;
    },

    /**
     * Navigate forward in history
     */
    goForward: (): UrlStackEntry | null => {
      if (state.currentIndex >= state.stack.length - 1) return null;

      const nextEntry = state.stack[state.currentIndex + 1];

      setEntities({
        ...state,
        currentIndex: state.currentIndex + 1,
      });

      return nextEntry;
    },

    /**
     * Go to specific index
     */
    goToIndex: (index: number): UrlStackEntry | null => {
      if (index < 0 || index >= state.stack.length) return null;

      const entry = state.stack[index];

      setEntities({
        ...state,
        currentIndex: index,
      });

      return entry;
    },

    /**
     * Get entire history
     */
    getHistory: (): UrlStackEntry[] => {
      return state.stack;
    },

    /**
     * Get current URL string
     */
    getCurrentUrl: (): string | null => {
      const current =
        state.currentIndex >= 0 ? state.stack[state.currentIndex] : null;
      return current ? current.url : null;
    },

    /**
     * Clear entire stack
     */
    clear: () => {
      setEntities(initialState);
    },

    /**
     * Reset to initial state
     */
    reset,
  };
};

// =============================================================================
// HOOK: Integrate with Next.js Router
// =============================================================================

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import createEntityStore from "./entityStore";

/**
 * Hook to automatically track URL changes with Next.js router
 */
export function useUrlStackSync() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { push, replace, goBack, canGoBack } = useUrlStack();

  const isInitialMount = useRef(true);
  const lastUrl = useRef<string>("");

  // Construct full URL
  const fullUrl = `${pathname}${
    searchParams.toString() ? `?${searchParams.toString()}` : ""
  }`;

  // Track URL changes
  useEffect(() => {
    // Avoid duplicate pushes
    if (lastUrl.current === fullUrl) return;

    lastUrl.current = fullUrl;

    if (isInitialMount.current) {
      isInitialMount.current = false;
      push(fullUrl, {
        pathname,
        search: searchParams.toString(),
      });
    } else {
      push(fullUrl, {
        pathname,
        search: searchParams.toString(),
      });
    }
  }, [pathname, searchParams, push]);

  return {
    /**
     * Navigate back using stack
     */
    navigateBack: () => {
      if (canGoBack()) {
        const previous = goBack();
        if (previous) {
          router.push(previous.url);
        }
      }
    },

    /**
     * Check if can go back
     */
    canNavigateBack: canGoBack(),

    /**
     * Manual navigation with stack tracking
     */
    navigateTo: (url: string, metadata?: Record<string, any>) => {
      push(url, metadata);
      router.push(url);
    },

    /**
     * Replace current URL
     */
    replaceUrl: (url: string, metadata?: Record<string, any>) => {
      replace(url, metadata);
      router.replace(url);
    },
  };
}

// =============================================================================
// HELPER: Update function for partial state updates
// =============================================================================

/**
 * Helper to update URL stack state
 * Useful when you need to update just one field
 */
export const updateUrlStack = (
  updater: (current: UrlStackState) => Partial<UrlStackState>
) => {
  const { entities, setEntities } = baseUrlStackStore.getState();
  const updates = updater(entities);
  setEntities({ ...entities, ...updates });
};

// =============================================================================
// USAGE EXAMPLES
// =============================================================================

/*
// 1. Basic Usage - Manual Control
import { useUrlStack } from '@/lib/stores/urlStackStore';

function SearchPage() {
  const { push, pop, peek, canGoBack, getHistory } = useUrlStack();

  const handleSearch = (filters: any) => {
    const url = `/search?${new URLSearchParams(filters).toString()}`;
    push(url, { 
      pageTitle: 'Search Results',
      filters 
    });
  };

  const handleBack = () => {
    if (canGoBack()) {
      const previous = pop();
      console.log('Going back to:', previous?.url);
      // Manually navigate with router
      router.push(previous.url);
    }
  };

  return (
    <div>
      <button onClick={handleBack} disabled={!canGoBack()}>
        Back
      </button>
      <p>Current URL: {peek()?.url}</p>
      <p>History: {getHistory().length} entries</p>
    </div>
  );
}

// 2. Automatic Integration with Next.js Router
import { useUrlStackSync } from '@/lib/stores/urlStackStore';

function Layout() {
  const { navigateBack, canNavigateBack } = useUrlStackSync();

  return (
    <div>
      {canNavigateBack && (
        <button onClick={navigateBack}>
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      )}
      {children}
    </div>
  );
}

// 3. View Navigation History
function NavigationHistory() {
  const { getHistory, goToIndex, currentIndex } = useUrlStack();
  const history = getHistory();

  return (
    <div className="space-y-2">
      <h3 className="font-bold">Navigation History</h3>
      {history.map((entry, index) => (
        <div 
          key={entry.timestamp}
          className={index === currentIndex ? 'font-bold' : ''}
        >
          <button onClick={() => {
            goToIndex(index);
            router.push(entry.url);
          }}>
            {entry.metadata?.pageTitle || entry.url}
          </button>
          <small className="text-gray-500 ml-2">
            {new Date(entry.timestamp).toLocaleTimeString()}
          </small>
        </div>
      ))}
    </div>
  );
}

// 4. Custom Back Button Component
import { ArrowLeft } from 'lucide-react';

function BackButton() {
  const { navigateBack, canNavigateBack } = useUrlStackSync();

  if (!canNavigateBack) return null;

  return (
    <button 
      onClick={navigateBack}
      className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-slate-50"
    >
      <ArrowLeft className="w-4 h-4" />
      Back
    </button>
  );
}

// 5. Breadcrumb Navigation
function Breadcrumbs() {
  const { getHistory, goToIndex, currentIndex } = useUrlStack();
  const router = useRouter();
  
  // Show last 3 entries as breadcrumbs
  const breadcrumbHistory = getHistory().slice(-3);

  return (
    <nav className="flex items-center gap-2 text-sm">
      {breadcrumbHistory.map((entry, index) => {
        const actualIndex = getHistory().length - breadcrumbHistory.length + index;
        const isActive = actualIndex === currentIndex;
        
        return (
          <React.Fragment key={entry.timestamp}>
            <button
              onClick={() => {
                goToIndex(actualIndex);
                router.push(entry.url);
              }}
              className={isActive ? 'font-bold' : 'text-gray-600 hover:text-gray-900'}
            >
              {entry.metadata?.pageTitle || 'Page'}
            </button>
            {index < breadcrumbHistory.length - 1 && (
              <span className="text-gray-400">/</span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

// 6. Track Filter Changes
function SearchFilters() {
  const { push } = useUrlStack();
  const router = useRouter();

  const handleFilterChange = (newFilters: any) => {
    const params = new URLSearchParams(newFilters);
    const url = `/search?${params.toString()}`;
    
    push(url, {
      pageTitle: 'Search Results',
      filters: newFilters,
      timestamp: Date.now(),
    });
    
    router.push(url);
  };

  return <div>...</div>;
}

// 7. Clear History (e.g., on logout)
function LogoutButton() {
  const { clear } = useUrlStack();

  const handleLogout = () => {
    clear(); // Clear navigation history
    // ... logout logic
  };

  return <button onClick={handleLogout}>Logout</button>;
}
*/

export default useUrlStack;
