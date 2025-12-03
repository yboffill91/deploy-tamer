// export interface FetchOptions extends RequestInit {
//   signal?: AbortSignal;
// }

// export async function fetchHelper<T>(
//   url: string,
//   options: FetchOptions = {}
// ): Promise<T> {
//   const controller = new AbortController();
//   const { signal, ...restOptions } = options;

//   const finalSignal = signal ?? controller.signal;

//   try {
//     const response = await fetch(url, {
//       ...restOptions,
//       signal: finalSignal,
//     });

//     if (!response.ok) {
//       const message = `Error ${response.status}: ${response.statusText}`;
//       throw new Error(message);
//     }

//     console.log('se disparop el fetching')

//     const data = (await response.json()) as T;
//     return data;
//   } catch (error: unknown) {
//     if (error instanceof DOMException && error.name === 'AbortError') {
//       throw new Error('Request was aborted by the user');
//     }

//     if (error instanceof Error) {
//       throw new Error(error.message);
//     }

//     throw new Error(String(error));
//   }
// }

export interface FetchOptions extends RequestInit {
  signal?: AbortSignal;
}

export async function fetchHelper<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T | void> {
  const controller = new AbortController();
  const { signal, ...restOptions } = options;
  const finalSignal = signal ?? controller.signal;

  try {
    const response = await fetch(url, {
      ...restOptions,
      signal: finalSignal,
    });

    if (![200, 201].includes(response.status)) {
      const message = `Error ${response.status}: ${response.statusText}`;
      throw new Error(message);
    }

    const contentLength = response.headers.get('content-length');
    if (response.status === 204 || contentLength === '0') {
      return;
    }

    const text = await response.text();
    if (!text) return;

    const contentType = response.headers.get('content-type') || '';

    // Si el content-type indica JSON, parseamos directamente
    if (contentType.includes('application/json')) {
      return JSON.parse(text) as T;
    }

    // Si el content-type no indica JSON, intentamos parsear igualmente
    try {
      const json = JSON.parse(text);
      return json as T;
    } catch {
      // No es JSON → devolver como string
      return text as unknown as T;
    }
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Request was aborted by the user');
    }

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error(String(error));
  }
}
