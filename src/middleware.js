// middleware.js
import { NextResponse } from 'next/server';

// Daftar rute yang dilindungi (hanya bisa diakses setelah login)
const protectedRoutes = ['/'];
// Daftar rute publik (bisa diakses tanpa login)
const publicRoutes = ['/login'];

export function middleware(request) {
  // Ganti cara mendapatkan token sesuai dengan cara Anda menyimpannya (misalnya dari Cookies)
  // const token = request.cookies.get('auth_token') || (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null);
  const token = request.cookies.get('auth_token');
  const path = request.nextUrl.pathname;
  console.log("request.cookies.get('auth_token'):", request.cookies.get('auth_token'));


  // 1. Jika rute adalah dashboard (dilindungi) TAPI tidak ada token
  if (protectedRoutes.includes(path) && !token) {
    // Redirect ke halaman login
    const url = new URL('/login', request.url);
    console.log("request.cookies.get('auth_token'):", request.cookies.get('auth_token'));

    return NextResponse.redirect(url);
  }

  // 2. Jika rute adalah login TAPI sudah ada token
  if (publicRoutes.includes(path) && token) {
    // Redirect ke dashboard
    const url = new URL('/', request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Konfigurasi untuk memberitahu Middleware rute mana yang harus diperiksa
export const config = {
  matcher: ['/', '/login'], // Middleware akan berjalan pada rute-rute ini
};