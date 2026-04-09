#!/usr/bin/env python
"""Test script to trigger password reset and show the URL"""

import os
import django
from django.contrib.auth import get_user_model
from core.models import PasswordReset
from django.utils import timezone
import uuid

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'healthbackend.settings')
django.setup()

User = get_user_model()

def test_password_reset():
    """Create a password reset token and show the URL"""
    try:
        # Find user by email
        user = User.objects.get(email='titusthuo63@gmail.com')
        print(f"Found user: {user.username}")
        
        # Create reset token
        reset_token = uuid.uuid4()
        expires_at = timezone.now() + timezone.timedelta(minutes=30)
        
        # Save to database
        PasswordReset.objects.create(
            user=user,
            token=reset_token,
            expires_at=expires_at
        )
        
        # Show the URL
        reset_url = f"http://localhost:8081/reset-password/{reset_token}"
        print(f"\n=== PASSWORD RESET URL ===")
        print(f"Copy this URL: {reset_url}")
        print(f"Or copy just the token: {reset_token}")
        print(f"========================\n")
        
        return reset_token
        
    except User.DoesNotExist:
        print("User with email 'titusthuo63@gmail.com' not found!")
        return None
    except Exception as e:
        print(f"Error: {e}")
        return None

if __name__ == '__main__':
    test_password_reset()
