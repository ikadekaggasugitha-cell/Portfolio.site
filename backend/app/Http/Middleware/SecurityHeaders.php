<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Adds baseline OWASP security response headers to every backend response
 * (JSON API, the /cdn media proxy, redirects and error pages alike).
 *
 * The API never returns framed HTML documents, so a restrictive default CSP is
 * safe here; responses that set their own CSP (e.g. the SVG branch of the media
 * proxy) are left untouched.
 */
class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set(
            'Permissions-Policy',
            'camera=(), microphone=(), geolocation=(), browsing-topics=()'
        );
        // Media is served to a different origin (the frontend), so it must stay
        // embeddable cross-origin — do not use 'same-origin' here.
        $response->headers->set('Cross-Origin-Resource-Policy', 'cross-origin');

        if ($request->secure()) {
            $response->headers->set(
                'Strict-Transport-Security',
                'max-age=31536000; includeSubDomains'
            );
        }

        if (! $response->headers->has('Content-Security-Policy')) {
            $response->headers->set(
                'Content-Security-Policy',
                "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; "
                    . "img-src 'self' data:; style-src 'unsafe-inline'"
            );
        }

        return $response;
    }
}
