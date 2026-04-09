# healthbackend/settings.py

import os
from pathlib import Path
from datetime import timedelta

# Load environment variables from .env file
from dotenv import load_dotenv
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-change-me-in-production-2025'
DEBUG = True
ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'django_filters',
    'graphql_jwt',
    'graphene_django',
    'channels',
    'django_rest_passwordreset',
    'anymail',
    'core',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

CORS_ALLOW_ALL_ORIGINS = True

ROOT_URLCONF = 'healthbackend.urls'
ASGI_APPLICATION = 'healthbackend.asgi.application'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'project_templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

AUTH_USER_MODEL = 'core.User'

# ⭐ ADD THIS - CRITICAL FOR JWT TO WORK ⭐
AUTHENTICATION_BACKENDS = [
    'graphql_jwt.backends.JSONWebTokenBackend',
    'django.contrib.auth.backends.ModelBackend',
]

STATIC_URL = '/static/'
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

GRAPHENE = {
    'SCHEMA': 'core.schema.schema',
    'MIDDLEWARE': [
        'graphql_jwt.middleware.JSONWebTokenMiddleware',
    ],
}

GRAPHQL_JWT = {
    'JWT_VERIFY_EXPIRATION': True,
    'JWT_EXPIRATION_DELTA': timedelta(days=7),
    'JWT_AUTH_HEADER_PREFIX': 'Bearer',
    'JWT_ALLOW_ARGUMENT': True,
}

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels.layers.InMemoryChannelLayer"
    }
}

APPEND_SLASH = False

# Enable timezone support (MUST be True)
USE_TZ = True

# Nairobi / Kenya timezone
TIME_ZONE = 'Africa/Nairobi'

# Email configuration - Console for development (easier testing)
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'  # For development - prints to console

# Anymail configuration for Mailtrap (commented out for now)
# ANYMAIL = {
#     "MAILTRAP_API_TOKEN": os.environ.get("MAILTRAP_API_TOKEN"),
# }
# EMAIL_BACKEND = "anymail.backends.mailtrap.EmailBackend"
# DEFAULT_FROM_EMAIL = os.environ.get('DEFAULT_FROM_EMAIL', 'hello@demomailtrap.co')

# Mailtrap is now configured as the primary email service for development and testing

# Django REST Password Reset Configuration
DJANGO_REST_PASSWORDRESET = {
    'TOKEN_EXPIRY_TIME': 30,  # in minutes
    'EMAIL_SUBJECT': 'Password Reset Request - Smart Expert Mental Health Support',
    'EMAIL_HTML_PATH': 'email/user_reset_password.html',
    'EMAIL_PLAINTEXT_PATH': 'email/user_reset_password.txt',
    'EMAIL_FROM_EMAIL': os.environ.get('DEFAULT_FROM_EMAIL', 'hello@demomailtrap.co'),
    'EMAIL_REPLY_TO_EMAIL': os.environ.get('DEFAULT_FROM_EMAIL', 'hello@demomailtrap.co'),
    'PASSWORD_RESET_TOKEN_USUARIO_PATH': 'api/password_reset/token/',
    'GOOGLE_RECAPTCHA_SECRET_KEY': None,
    'PASSWORD_RESET_EMAIL_SUBJECT': 'Password Reset Request - Smart Expert Mental Health Support',
    'PASSWORD_RESET_EMAIL_HTML_PATH': 'email/user_reset_password.html',
    'PASSWORD_RESET_EMAIL_PLAINTEXT_PATH': 'email/user_reset_password.txt',
    'PASSWORD_RESET_EMAIL_FROM_EMAIL': os.environ.get('DEFAULT_FROM_EMAIL', 'hello@demomailtrap.co'),
    'PASSWORD_RESET_EMAIL_REPLY_TO_EMAIL': os.environ.get('DEFAULT_FROM_EMAIL', 'hello@demomailtrap.co'),
    'PASSWORD_RESET_EMAIL_TOKEN_GENERATOR_CLASS': 'django_rest_passwordreset.tokens.RandomNumberTokenGenerator',
    'PASSWORD_RESET_EMAIL_SALT': None,
}
