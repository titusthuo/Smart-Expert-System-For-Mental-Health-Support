# core/middleware.py (create this file)
import logging

logger = logging.getLogger(__name__)

class JWTDebugMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path == '/graphql/':
            print("=" * 60)
            print("🔍 JWT DEBUG MIDDLEWARE")
            print(f"📍 Path: {request.path}")
            print(f"📋 Method: {request.method}")
            
            # Check Authorization header
            auth_header = request.META.get('HTTP_AUTHORIZATION', '')
            print(f"🔑 Authorization header: {auth_header[:50]}..." if auth_header else "❌ NO Authorization header")
            
            # Check all headers
            print("📦 All HTTP headers:")
            for key, value in request.META.items():
                if key.startswith('HTTP_'):
                    print(f"   {key}: {value[:50]}..." if len(str(value)) > 50 else f"   {key}: {value}")
            
            print(f"👤 User BEFORE middleware: {request.user}")
            print("=" * 60)
        
        response = self.get_response(request)
        
        if request.path == '/graphql/':
            print(f"👤 User AFTER middleware: {request.user}")
            print("=" * 60)
        
        return response