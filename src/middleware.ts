import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/', '/((?!api|studio|admin|mijnapp|test-dynamic|_next|favicon|.*\\..*).*)'],
};
