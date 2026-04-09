#!/usr/bin/env python
"""Test email configuration"""

import os
import django
from django.core.mail import send_mail
from django.conf import settings

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'healthbackend.settings')
django.setup()

def test_email_config():
    """Test if email configuration is working"""
    print("Testing email configuration...")
    print(f"Email Backend: {settings.EMAIL_BACKEND}")
    print(f"Email Host: {settings.EMAIL_HOST}")
    print(f"Email Port: {settings.EMAIL_PORT}")
    print(f"Email Use TLS: {settings.EMAIL_USE_TLS}")
    print(f"Email User: {settings.EMAIL_HOST_USER}")
    print(f"From Email: {settings.DEFAULT_FROM_EMAIL}")
    
    # Check if credentials are set
    if not hasattr(settings, 'ANYMAIL') or not settings.ANYMAIL.get('MAILTRAP_API_TOKEN'):
        print("\nWARNING: Mailtrap API token is not configured!")
        print("Please update the .env file with your Mailtrap API token.")
        print("\nThe API token should be set as MAILTRAP_API_TOKEN in your .env file")
        return False
    
    # Try to send a test email
    try:
        print("\nAttempting to send test email...")
        # For testing, send to the account owner's email address
        # With demo domains, you can only send to your own email address
        test_email = 'titusthuo63@gmail.com'  # Your actual email address
        
        result = send_mail(
            subject='Test Email - Smart Expert Mental Health Support',
            message='This is a test email to verify the Mailtrap email configuration is working. You should receive this in your Mailtrap dashboard.',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[test_email],
            fail_silently=False,
        )
        print(f"Email sent successfully! Result: {result}")
        return True
    except Exception as e:
        print(f"Failed to send email: {str(e)}")
        return False

if __name__ == '__main__':
    test_email_config()
