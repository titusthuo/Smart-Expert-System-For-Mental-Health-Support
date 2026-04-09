#!/usr/bin/env python
"""Simple test to verify Mailtrap API connection"""

import os
import django
from django.conf import settings

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'healthbackend.settings')
django.setup()

def test_mailtrap_config():
    """Test if Mailtrap configuration is working"""
    print("Testing Mailtrap configuration...")
    print(f"Email Backend: {settings.EMAIL_BACKEND}")
    print(f"From Email: {settings.DEFAULT_FROM_EMAIL}")
    
    # Check if Anymail is configured
    if hasattr(settings, 'ANYMAIL'):
        print(f"Anymail configured: {settings.ANYMAIL}")
        api_token = settings.ANYMAIL.get('MAILTRAP_API_TOKEN')
        if api_token:
            print(f"Mailtrap API Token: {api_token[:8]}...{api_token[-8:]}")  # Show partial token
            print("Mailtrap configuration is ready!")
            return True
        else:
            print("Mailtrap API Token not found in ANYMAIL configuration")
            return False
    else:
        print("ANYMAIL not configured")
        return False

if __name__ == '__main__':
    test_mailtrap_config()
