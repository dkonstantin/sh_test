from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views.generic import TemplateView
from django.views.generic.edit import FormView

from account.forms import CustomUserCreationForm


class RegisterFormView(FormView):
    form_class = CustomUserCreationForm
    success_url = "/signin/"
    template_name = "signup.html"

    def form_valid(self, form):
        form.save()
        return super(RegisterFormView, self).form_valid(form)


class HomeView(TemplateView):
    template_name = "index.html"

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HomeView, self).dispatch(request, *args, **kwargs)
