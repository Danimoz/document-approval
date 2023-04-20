from rest_framework import serializers
from .models import (
  Memo, 
  Approval, 
  SalesMemo, 
  StaffRequestMemo, 
  RequisitionMemo,
  Refund,
  Payment,
)
from users.serializers import UserDetailSerializer
from users.models import NewUser


class SalesSerializer(serializers.ModelSerializer):
  class Meta:
    model = SalesMemo
    fields = '__all__'


class StaffRequestSerializer(serializers.ModelSerializer):
  relief_staff_name = UserDetailSerializer(read_only=True)
  class Meta:
    model = StaffRequestMemo
    fields = '__all__'
        

class RequisitionSerializer(serializers.ModelSerializer):
  class Meta:
    model = RequisitionMemo
    fields = '__all__'


class RefundSerializer(serializers.ModelSerializer):
  class Meta:
    model = Refund
    fields = '__all__'


class PaymentSerializer(serializers.ModelSerializer):
  class Meta:
    model = Payment
    fields = "__all__"


class ApprovalSerializer(serializers.ModelSerializer):
  user = UserDetailSerializer(read_only=True)

  class Meta:
    model = Approval
    fields = "__all__"


class MemoSerializer(serializers.ModelSerializer):
  staff_request = StaffRequestSerializer(read_only=True)
  sales = SalesSerializer(read_only=True)
  requisition = RequisitionSerializer(read_only=True)
  refund = RefundSerializer(read_only=True)
  payment = PaymentSerializer(read_only=True)
  user = UserDetailSerializer(read_only=True)
  approvals = serializers.SerializerMethodField()
  state = serializers.CharField(read_only=True)
  memoType = serializers.CharField(read_only=True)

  def get_approvals(self, obj):
    approvals = Approval.objects.filter(memo=obj)
    return [{'user': data.user.username, 'created_at': data.created_at} for data in approvals]
  
  class Meta:
    model = Memo
    fields = "__all__"


class FirebaseNotificationSerializer(serializers.Serializer):
  fcm_token = serializers.CharField(max_length=255)

  def validate(self, attrs):
    token = attrs.get('fcm_token', None)
    if token is None:
      raise serializers.ValidationError('Token is Empty!')
    return attrs
