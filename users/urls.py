from django.urls import path
from .views import (
    ChangePasswordView,
    DepartmentView,
    LogoutView,
    PasswordTokenCheckView,
    RegisterView,
    RequestPasswordRequestView,
    SetNewPasswordAPIView,
    CookieTokenRefreshView,
    CookieTokenObtainPairView,
    GetUsers,
    UserDetailsView,
    GetGMs,
    GetAllGMView
)


urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('request-reset-email/', RequestPasswordRequestView.as_view(), name='request-reset-email'),
    path('password-reset/<uidb64>/<token>/', PasswordTokenCheckView.as_view(), name='password-reset-confirm'),
    path('password-reset-complete/', SetNewPasswordAPIView.as_view(), name='password-reset-complete'),
    path('get-department/', DepartmentView.as_view(), name='get-department'),
    path('get-all-users/', GetUsers.as_view(), name='get-all-users'),
    path('get-gms/', GetGMs.as_view(), name='get-gms'),
    path('get-all-gms/', GetAllGMView.as_view(), name='get-all-gms'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/', CookieTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('details/', UserDetailsView.as_view(), name='details'),
]