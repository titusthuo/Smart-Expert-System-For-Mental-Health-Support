# core/signals.py
from django.dispatch import receiver
from django_rest_passwordreset.signals import reset_password_token_created
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings


@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    """
    Handles password reset token creation and sends email with custom reset URL
    """
    # Create context for email templates
    context = {
        "current_user": reset_password_token.user,
        "username": reset_password_token.user.username,
        "email": reset_password_token.user.email,
        "reset_password_url": f"http://localhost:8081/reset-password/{reset_password_token.key}",
    }

    # Render email templates
    email_html_message = render_to_string("email/user_reset_password.html", context)
    email_plaintext_message = render_to_string("email/user_reset_password.txt", context)

    # Create and send email
    msg = EmailMultiAlternatives(
        subject="Password Reset Request - Smart Expert Mental Health Support",
        body=email_plaintext_message,
        from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@smarthealth.com'),
        to=[reset_password_token.user.email],
    )
    msg.attach_alternative(email_html_message, "text/html")
    
    try:
        msg.send()
        print(f"Password reset email sent to {reset_password_token.user.email}")
        print(f"Reset link: {context['reset_password_url']}")
    except Exception as e:
        print(f"Failed to send email to {reset_password_token.user.email}: {str(e)}")
        # The token is still created, user can get link from console if needed
