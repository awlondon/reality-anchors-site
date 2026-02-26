const KEY = 'exec_session_id';

export function getSessionId() {
  if (typeof window === 'undefined') return null;

  let id = window.localStorage.getItem(KEY);
  if (!id) {
    id = window.crypto.randomUUID();
    window.localStorage.setItem(KEY, id);
  }

  return id;
}
