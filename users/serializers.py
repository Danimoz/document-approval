from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from .models import NewUser, Department, GeneralManager


class CookieTokenRefreshSerializer(TokenRefreshSerializer):
    refresh = None
    def validate(self, attrs):
        attrs['refresh'] = self.context['request'].COOKIES.get('refresh_token')
        if attrs['refresh']:
            return super().validate(attrs)
        else:
            raise InvalidToken('No valid token found in cookie \'refresh_token\'')


class RegisterUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewUser
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 'department']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)

        instance.save()
        return instance


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'


class GMSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneralManager
        fields = '__all__'


class UserDetailSerializer(serializers.ModelSerializer):
    is_hod = serializers.SerializerMethodField()
    is_gm = serializers.SerializerMethodField()
    department = DepartmentSerializer()
    
    class Meta:
        model = NewUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'department', 'is_gm', 'is_hod']

    def get_is_hod(self, obj):
        try:
            if obj.hod:
                return True
        except:
            return False

    def get_is_gm(self, obj):
        try:
            if obj.gm:
                return True
        except:
            return False


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate(self, attrs):
        old_password = attrs.get('old_password', '')
        new_password = attrs.get('new_password', '')

        if not self.context['request'].user.check_password(old_password):
            raise serializers.ValidationError('Old Password is Incorrect.')
        
        if new_password == old_password:
            raise serializers.ValidationError('New password must be different from Old password.')
        
        return attrs

    def update(self, instance, validated_data):
        instance.set_password(validated_data['new_password'])
        instance.save()

        return instance


class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(min_length=2)
    redirect_url = serializers.CharField(max_length=500, required=False)

    class Meta:
        fields = ['email']


class SetNewPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(min_length=6, max_length=68, write_only=True)
    token = serializers.CharField(min_length=1, write_only=True)
    uidb64 = serializers.CharField(min_length=1, write_only=True)

    class Meta:
        fields = ['password', 'token', 'uidb64']

    def validate(self, attrs):
        try:
            password = attrs.get('password')
            token = attrs.get('token')
            uidb64 = attrs.get('uidb64')

            id = force_str(urlsafe_base64_decode(uidb64))
            user = NewUser.objects.get(id=id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise AuthenticationFailed('The reset link is invalid', 401)

            user.set_password(password)
            user.save()

            return (user)
        except Exception as e:
            raise AuthenticationFailed('The reset link is invalid', 401)


class LogoutSerializer(serializers.Serializer):
    refresh = None

    default_error_message = {
        'bad_token': ('Token is expired or invalid')
    }

    def validate(self, attrs):
        attrs['refresh'] = self.context['request'].COOKIES.get('refresh_token')
        self.refresh = attrs['refresh']
        print(self.refresh)
        return attrs

    def save(self, **kwargs):
        try:
            RefreshToken(self.refresh).blacklist()

        except TokenError:
            self.fail('bad_token')
