from django.conf.urls import include, url
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.views.generic import TemplateView

from account.views import RegisterFormView, HomeView

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),

    url(r'^$', HomeView.as_view(), name='home'),

    url(r'^signin/', auth_views.login, {'template_name': 'signin.html'}, name='signin'),
    url(r'^logout/', auth_views.logout, {'next_page': '/'}, name='logout'),
    url(r'^signup/', RegisterFormView.as_view(), name='signup'),
]
