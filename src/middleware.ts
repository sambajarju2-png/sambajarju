import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all paths EXCEPT: /api, /studio, /admin, /landing, /_next, static files
  matcher: ['/', '/(nl|en)/:path*', '/((?!api|studio|admin|landing|_next|favicon|.*\\..*).*)'],
};
