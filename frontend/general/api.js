// Public Strapi origin only. Never put database credentials or API secrets here.
export const BASE_URL = 'https://book-ducks-5vz8.vercel.app';

export function mediaUrl(path) {
  return path ? new URL(path, BASE_URL).href : '';
}
