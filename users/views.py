from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import smart_str, smart_bytes, DjangoUnicodeDecodeError
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from django.core.mail import send_mail
from django.conf import settings
from django.http import HttpResponsePermanentRedirect
from django.db.models import Q
from rest_framework.generics import GenericAPIView, UpdateAPIView, ListAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .serializers import (
    LogoutSerializer,
    RegisterUserSerializer,
    ResetPasswordSerializer,
    SetNewPasswordSerializer,
    ChangePasswordSerializer,
    DepartmentSerializer,
    CookieTokenRefreshSerializer,
    UserDetailSerializer,
    GMSerializer
)
from .models import NewUser, Department, GeneralManager


class CustomRedirect(HttpResponsePermanentRedirect):
    allowed_schemes = [settings.FRONTEND_URL, 'http', 'https']


class CookieTokenObtainPairView(TokenObtainPairView):        
    def finalize_response(self, request, response, *args, **kwargs):
        if response.data.get('refresh'):
            cookie_max_age = 3600 * 24 * 14
            response.set_cookie(
                key='refresh_token',
                value=response.data['refresh'], 
                max_age=cookie_max_age, 
                httponly=True
            )
            del response.data['refresh']
        return super().finalize_response(request, response, *args, **kwargs)


class CookieTokenRefreshView(TokenRefreshView):
    serializer_class = CookieTokenRefreshSerializer
    def finalize_response(self, request, response, *args, **kwargs):
        if response.data.get('refresh'):
            cookie_max_age = 3600 * 24 * 14
            response.set_cookie('refresh_token', response.data['refresh'], max_age=cookie_max_age, httponly=True)
            del response.data['refresh']
        return super().finalize_response(request, response, *args, **kwargs)


class DepartmentView(ListAPIView):
    serializer_class = DepartmentSerializer
    queryset = Department.objects.all()


class UserDetailsView(ListAPIView):
    serializer_class = UserDetailSerializer
    permission_classes = [IsAuthenticated]
    queryset = NewUser.objects.all()

    def get_queryset(self):
        return self.queryset.filter(username = self.request.user)


class GetUsers(ListAPIView):
    serializer_class = UserDetailSerializer
    queryset = NewUser.objects.all().order_by('username')


class GetAllGMView(ListAPIView):
    queryset = GeneralManager.objects.all()
    serializer_class = GMSerializer


class GetGMs(ListAPIView):
    serializer_class = GMSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_dept = NewUser.objects.get(username=self.request.user).department
        gm_types = GeneralManager.objects.filter(departments=user_dept).values_list('type', flat=True)
        q1 = GeneralManager.objects.filter(Q(type__in=gm_types) | Q(type='MD'))
        return q1.union(Department.objects.filter(name="IT"))


# Create your views here.
class RegisterView(GenericAPIView):
    serializer_class = RegisterUserSerializer
    permission_classes = [IsAdminUser,]

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ChangePasswordView(UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated, ]
    
    def get_object(self):
        obj = self.request.user
        return obj

    def update(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"status": "Password changed successfully"}, status=status.HTTP_200_OK)


class RequestPasswordRequestView(GenericAPIView):
    serializer_class = ResetPasswordSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        email = request.data.get('email', '')

        if NewUser.objects.filter(email=email).exists():
            user = NewUser.objects.get(email=email)
            uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
            token = PasswordResetTokenGenerator().make_token(user)
            current_site = get_current_site(request=request).domain
            relative_link = reverse('password-reset-confirm', kwargs={'uidb64': uidb64, 'token': token})
            redirect_url = request.data.get('redirect_url', '')
            absolute_url = 'http://'+ current_site + relative_link
            email_body = 'Hello, \n Use the link to reset your password \n' + \
                absolute_url+'?redirect_url='+ redirect_url
            send_mail(
                'Reset ypur Password',
                email_body,
                'Clearline Portal',
                [user.email],
                fail_silently=False
            )
            return Response(
                {'success': 'We have sent you a link to reset your password'}, status=status.HTTP_200_OK
            )


class PasswordTokenCheckView(GenericAPIView):
    serializer_class = SetNewPasswordSerializer

    def get(self, request, uidb64, token):
        redirect_url = request.GET.get('redirect_url')
        try:
            id = smart_str(urlsafe_base64_decode(uidb64))
            user = NewUser.objects.get(id=id)

            if not PasswordResetTokenGenerator().check_token(user, token):
                return CustomRedirect(redirect_url + '?token_valid=False')
                      
            if redirect_url and len(redirect_url) > 3:
                return CustomRedirect(redirect_url + '?token_valid=True&message=Credentials Valid&uidb64='+uidb64+'&token='+token)
            else:
                return CustomRedirect(settings.FRONTEND_URL + '?token_valid=False')

        except DjangoUnicodeDecodeError as identifier:
            try:
                if not PasswordResetTokenGenerator().check_token(user):
                    return CustomRedirect(redirect_url + '?token_valid=False')

            except UnboundLocalError as e:
                return Response({'error': 'Token is not valid, please request a new one'}, status=status.HTTP_400_BAD_REQUEST)


class SetNewPasswordAPIView(GenericAPIView):
    serializer_class = SetNewPasswordSerializer

    def patch(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'success': True, 'message': 'Password reset success'}, status=status.HTTP_200_OK)


class LogoutView(GenericAPIView):
    serializer_class = LogoutSerializer
    permission_classes = [IsAuthenticated, ]

    def post(self, request):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        res =  Response(status=status.HTTP_204_NO_CONTENT)
        res.delete_cookie('refresh_token')
        return res