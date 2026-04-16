import logging

from django.conf import settings

logger = logging.getLogger(__name__)


class JWTDebugMiddleware:
    """Logs JWT auth details on GraphQL requests. Only active when DEBUG=True."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if settings.DEBUG and request.path == '/graphql/':
            auth_header = request.META.get('HTTP_AUTHORIZATION', '')
            logger.debug(
                "JWT Debug — %s %s | Auth: %s | User: %s",
                request.method,
                request.path,
                (auth_header[:50] + '...') if auth_header else 'NONE',
                request.user,
            )

        response = self.get_response(request)

        if settings.DEBUG and request.path == '/graphql/':
            logger.debug("JWT Debug — User after: %s", request.user)

        return response