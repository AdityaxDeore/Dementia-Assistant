import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Check if we're in static hosting mode (GitHub Pages)
const isStaticMode = typeof window !== 'undefined' && 
  (window.location.hostname.includes('github.io') || !window.location.hostname.includes('localhost'));

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  if (isStaticMode && url.includes('/api/')) {
    // Return mock response for static mode
    const mockResponse = new Response(JSON.stringify({ 
      message: 'Demo mode - no backend available', 
      data: [] 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    return mockResponse;
  }

  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    if (isStaticMode && queryKey.join("/").includes('/api/')) {
      // Return mock data for static mode
      console.log('Static mode: Returning mock data for', queryKey.join("/"));
      return { message: 'Demo mode - no backend available', data: [] };
    }

    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
