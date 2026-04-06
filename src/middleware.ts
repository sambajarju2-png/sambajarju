import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/', '/(nl|en)/:path*', '/((?!api|studio|admin|_next|favicon|.*\\..*).*)'],
};
