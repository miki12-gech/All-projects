export const useApi = () => {
  // 1. ቶክኑን ከብሮውዘር (Client) ብቻ በደህንነት ለማምጣት
  const getHeaders = () => {
    const headers: Record<string, string> = {};

    if (process.client) {
      const token = localStorage.getItem('agazi_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return headers;
  };

  // 2. የ API ጥያቄዎችን መላክ
  return {
    get: <T>(url: string) =>
      $fetch<T>(url, {
        method: 'GET',
        headers: getHeaders(),
      }),

    post: <T>(url: string, body: any) =>
      $fetch<T>(url, {
        method: 'POST',
        body,
        headers: getHeaders(),
      }),

    patch: <T>(url: string, body: any) =>
      $fetch<T>(url, {
        method: 'PATCH',
        body,
        headers: getHeaders(),
      }),

    del: <T>(url: string) =>
      $fetch<T>(url, {
        method: 'DELETE',
        headers: getHeaders(),
      }),
  };
};