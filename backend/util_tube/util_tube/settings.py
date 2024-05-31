import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# BASE_BACKEND_URL : DRF 도메인
# 개발중 https 연결을 위한 ngrok url
# BASE_BACKEND_URL = os.getenv(
#     "BASE_BACKEND_URL", "https://liberal-chigger-blindly.ngrok-free.app/"
# )

BASE_BACKEND_URL = os.getenv(
    "BASE_BACKEND_URL",
    "https://sai6272.shop/",  # gabia
)


# util_tube backend를 사용할 client 측 프로그램의 url
CLIENT_ORIGIN = "https://front.sai6272.shop"  #  gabia
# CLIENT_ORIGIN = "http://localhost:3000"   # 개발 react url


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "django-insecure-0&mgxwbd-^@uf-pje8i!&$-6+a!*1th9q0_%jeid8@u-j=e=j)"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = [
    # "liberal-chigger-blindly.ngrok-free.app", # 개발중 https 연결을 위한 ngrok url
    "sai6272.shop",  # gabia
]


# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "rest_framework",
    "google_oauth",
    "subs_folder",
]

# CORS Access-Control-Allow-Credentials 설정
CORS_ALLOW_CREDENTIALS = True

# CORS 설정 중 모든 출처에 대한 허용 여부
# CORS_ALLOW_ALL_ORIGINS = True

# CORS 설정 중 특정 출처에 대한 허용 여부
CORS_ALLOWED_ORIGINS = [  # "http://localhost:3000", # 개발 react url
    "https://front.sai6272.shop"
]

CORS_ALLOW_HEADERS = (
    "accept",
    "authorization",
    "content-type",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
    "ngrok-skip-browser-warning",
    "Set-Cookie",
)

CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SAMESITE = "None"
SESSION_COOKIE_SAMESITE = "None"

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "util_tube.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "util_tube.wsgi.application"


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = "ko-kr"

TIME_ZONE = "Asia/Seoul"

# Django의 애플리케이션에서 다국어 지원을 활성화
USE_I18N = True

# Django의 지역화된 문자열을 사용하여 애플리케이션의 다국어 지원을 활성화
USE_L10N = True

USE_TZ = False


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = "static/"

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
