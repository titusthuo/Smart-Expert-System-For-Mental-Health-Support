# myproject/urls.py
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from core.views import CustomGraphQLView  # ⭐ Import custom view
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', TemplateView.as_view(template_name="home.html"), name="home"),
    path('*', TemplateView.as_view(template_name="not-found.html"), name="not-found"),
    path('profile-upload-test/', TemplateView.as_view(template_name="profile-upload-test.html")),
    path('admin/', admin.site.urls),
    path('graphql/', CustomGraphQLView.as_view(graphiql=True), name="graphql"),  # ⭐ Use custom view (no csrf_exempt needed, it's in the view)
    path('api/', include('core.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)