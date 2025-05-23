const k = "jwt";

export const getToken = () => localStorage.getItem(k);
export const setToken = (t: string) => localStorage.setItem(k, t);
export const clearToken = () => localStorage.removeItem(k);
