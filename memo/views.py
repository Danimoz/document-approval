from rest_framework.generics import (
  CreateAPIView, 
  ListAPIView, 
  RetrieveAPIView, 
  UpdateAPIView,
  GenericAPIView,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist
from .serializers import (
  MemoSerializer,
  RequisitionSerializer,
  PaymentSerializer,
  StaffRequestSerializer,
  SalesSerializer,
  RefundSerializer,
  FirebaseNotificationSerializer
)
from users.models import NewUser
from .pagination import MemoPagination
from .models import (
  RequisitionMemo,
  Refund,
  StaffRequestMemo,
  Memo,
  SalesMemo,
  Approval,
  Payment
)
from .notifications import mailNotifications, sendNotifications

class CreateRequisitionView(CreateAPIView):
  serializer_class = RequisitionSerializer
  parser_classes = (FormParser, MultiPartParser)
  permission_classes = [IsAuthenticated]
  queryset = RequisitionMemo.objects.all()

  def perform_create(self, serializer):
    instance = serializer.save(created_by=self.request.user)
    instance.submit_to_line_manager()
    instance.save()


class CreatePaymentView(CreateAPIView):
  serializer_class = PaymentSerializer
  parser_classes = (FormParser, MultiPartParser)
  permission_classes = [IsAuthenticated]
  queryset = Payment.objects.all()

  def perform_create(self, serializer):
    instance = serializer.save(created_by=self.request.user)
    instance.submit_to_line_manager()
    instance.save()


class CreateSalesMemoView(CreateAPIView):
  serializer_class = SalesSerializer
  permission_classes = [IsAuthenticated]
  queryset = SalesMemo.objects.all()

  def perform_create(self, serializer):
    instance = serializer.save(created_by=self.request.user)
    instance.submit_to_line_manager()
    instance.save()
  

class CreateRefundView(CreateAPIView):
  serializer_class = RefundSerializer
  parser_classes = (FormParser, MultiPartParser)
  permission_classes = [IsAuthenticated]
  queryset = Refund.objects.all()

  def perform_create(self, serializer):
    instance = serializer.save(created_by=self.request.user)
    instance.submit_to_line_manager()
    instance.save()


class CreateStaffRequestView(CreateAPIView):
  serializer_class = StaffRequestSerializer
  permission_classes = [IsAuthenticated]
  queryset = StaffRequestMemo.objects.all()

  def perform_create(self, serializer):
    instance = serializer.save(created_by=self.request.user)
    instance.submit_to_line_manager()
    instance.save()


class GetUserMemoView(ListAPIView):
  serializer_class = MemoSerializer
  pagination_class = MemoPagination
  queryset = Memo.objects.all()

  def get_queryset(self):
    return self.queryset.filter(
      Q(sales__created_by=self.request.user) |
      Q(payment__created_by=self.request.user) |
      Q(staff_request__created_by=self.request.user) |
      Q(requisition__created_by=self.request.user) |
      Q(refund__created_by=self.request.user)
    )


class GetSingleMemo(RetrieveAPIView):
  serializer_class = MemoSerializer
  queryset = Memo.objects.all()


# Approvals for Different HODs
class BaseApprovalView(UpdateAPIView):
  queryset = Memo.objects.all()
  serializer_class = MemoSerializer
  permission_classes = [IsAuthenticated]
  
  def get_object(self):
    memo_id = self.kwargs.get('memo_id')
    try:
      memo = Memo.objects.get(id=memo_id)
    except Memo.DoesNotExist:
      raise NotFound('Memo not Found')
    return memo
  
  def update(self, request, *args, **kwargs):
    memo = self.get_object()
    memo_types = {
      'sales': memo.sales, 
      'requisition':memo.requisition, 
      'refund': memo.refund, 
      'payment': memo.payment,
      'staff_request': memo.staff_request
    }
    memo_type = next((k for k,v in memo_types.items() if v is not None), None)
    if not memo_type:
      raise NotFound('Memo not Found')
    else:
      document = getattr(memo, memo_type)
      action = request.data.get('action')
      try:
        self.approve_or_reject(document, action)
        document.save()
        approval = Approval(memo=memo, user=self.request.user, action=action)
        approval.save()
      except Exception as e:
        raise ValidationError({'error': str(e)})
      memo.save()
      return Response({'message': 'Memo successfully updated'})
  
  def approve_or_reject(self, document, action):
    if action == 'approve':
      raise NotImplementedError
    elif action == 'reject':
      raise NotImplementedError
    else:
      raise NotImplementedError


class EditReferralView(UpdateAPIView):
  permission_classes = [IsAuthenticated]

  def get_object(self):
    memo_id = self.kwargs.get('memo_id')
    try:
      memo = Memo.objects.get(id=memo_id)
    except Memo.DoesNotExist:
      raise NotFound('Memo not Found')
    return memo

  def get_memo_type(self, memo):
    memo_types = {
      'sales': memo.sales, 
      'requisition':memo.requisition, 
      'refund': memo.refund, 
      'payment': memo.payment,
      'staff_request': memo.staff_request
    }
    memo_type = next((k for k,v in memo_types.items() if v is not None), None)
    return memo_type

  def get_serializer_class(self):
    memo_type = self.get_memo_type(self.get_object())
    serializer_classes = {
      'sales': SalesSerializer,
      'requisition': RequisitionSerializer,
      'refund': RefundSerializer,
      'payment': PaymentSerializer,
      'staff_request': StaffRequestSerializer,
    }
    return serializer_classes.get(memo_type)
  
  def get_queryset(self):
    memo_type = self.get_memo_type(self.get_object())
    queryset_map = {
      'sales': SalesMemo.objects.all(),
      'requisition': RequisitionMemo.objects.all(),
      'refund': Refund.objects.all(),
      'payment': Payment.objects.all(),
      'staff_request': StaffRequestMemo.objects.all(),
    }
    return queryset_map.get(memo_type)
  
  def perform_update(self, serializer):
    super().perform_update(serializer)
    memo = self.get_object()
    # Send mail after 
    


class LineManagerApprovalView(BaseApprovalView):
  def approve_or_reject(self, document, action):
    try:
      user = self.request.user
      if user.hod:
        if type(document).__name__ == 'Refund' and action == 'approve':
          document.send_to_qa()
        else:
          switcher = {
            'approve': document.approve_by_line_manager,
            'reject': document.reject_by_line_manager,
            'refer': document.refer_by_line_manager
          }
          func = switcher.get(action)
          if func:
            func()
    except Exception as e:
      raise ValidationError({'error': str(e)})


class ICUApprovalView(BaseApprovalView):
  def approve_or_reject(self, document, action):
    try:
      user = self.request.user
      if user.department == "ICU" and user.hod:
        if action == 'approve':
          document.approve_by_icu()
        elif action == 'refer':
          document.refer_by_icu()
    except Exception as e:
      raise ValidationError({'error': str(e)})


class GMApprovalView(BaseApprovalView):
  def approve_or_reject(self, document, action):
    try:
      user = self.request.user
      memo = self.get_object()
      if not user.gm:
        raise ValidationError({'error': 'User is not authorized to perform this action.'})
      if action == 'approve':
        document.approve_by_gm()
        memo.status = 'Approved'
      elif action == 'refer':
        document.refer_by_gm()
      elif action == 'reject':
        document.reject_by_gm()
        memo.status = 'Rejected'
      memo.save()
    except Exception as e:
      raise ValidationError({'error': str(e)})
  

class FinanceApprovalView(BaseApprovalView):
  def approve_or_reject(self, document, action):
    try:
      user = self.request.user
      if user.department == 'Finance' and user.hod:
        if action == 'okay':
          document.complete_by_finance()
    except Exception as e:
      raise ValidationError({'error': str(e)})


class AdminApprovalView(BaseApprovalView):
  def approve_or_reject(self, document, action):
    try:
      user = self.request.user
      if user.department == "Admin" and user.hod:
        if action == 'approve':
          document.complete_by_head_of_admin()
        elif action == 'refer':
          document.refer_by_head_of_admin()
        elif action == 'reject':
          document.reject_by_head_of_admin()
    except Exception as e:
      raise ValidationError({'error': str(e)})


class HRApprovalView(BaseApprovalView):
  def approve_or_reject(self, document, action):
    try:
      user = self.request.user
      if user.department == "HR" and user.hod:
        if action == 'approve':
          document.approve_by_hr()
        elif action == 'refer':
          document.refer_by_hr()
    except Exception as e:
      raise ValidationError({'error': str(e)})


class QAApprovalView(BaseApprovalView):
  def approve_or_reject(self, document, action):
    try:
      user = self.request.user
      if user.department == "QA" and user.hod and type(document).__name__ == "Refund":
        if action == 'approve':
          document.send_to_icu()
    except Exception as e:
      raise ValidationError({'error': str(e)})


# Different HODs Memo
class ManagersMemo(ListAPIView):
  '''Check if user is GM or HOD and return their memos'''
  serializer_class = MemoSerializer
  pagination_class = MemoPagination
  queryset = Memo.objects.all()

  def get_queryset(self):
    user = self.request.user
    try:
      if user.gm:
        return self.queryset.filter(
          Q(sales__state='GMs') |
          Q(staff_request__state='GMs') |
          Q(requisition__state='GMs') |
          Q(refund__state='GMs') |
          Q(payment__state='GMs')
        )
    except ObjectDoesNotExist:
      return self.queryset.filter(
        Q(sales__created_by__department=user.department, sales__state='Line Manager') |
        Q(staff_request__created_by__department=user.department, staff_request__state='Line Manager') |
        Q(requisition__created_by__department=user.department, requisition__state='Line Manager') |
        Q(refund__created_by__department=user.department, refund__state='Line Manager') |
        Q(payment__created_by__department=user.department, payment__state='Line Manager')
      )


class SpecificHODMemo(ListAPIView):
  '''Check the department of the HOD and return their specific memos'''
  serializer_class = MemoSerializer
  pagination_class = MemoPagination
  queryset = Memo.objects.all()

  def get_queryset(self):
    user = self.request.user
    user_dept = user.department
    if user_dept in ['ICU', 'Finance', 'HR', 'Quality Assurance', 'Admin']:
      return self.queryset.filter(
        Q(sales__state=user_dept.name) |
        Q(staff_request__state=user_dept.name) |
        Q(requisition__state=user_dept.name) |
        Q(refund__state=user_dept.name) |
        Q(payment__state=user_dept.name)
      )


class GetDeviceView(GenericAPIView):
  '''Get Firebase Device Token From Frontend'''
  serializer_class = FirebaseNotificationSerializer
  permission_classes = [IsAuthenticated]
  
  def post(self, request):
    serializer = self.serializer_class(data=request.data)
    serializer.is_valid(raise_exception=True)

    fcm_token = serializer.validated_data['fcm_token']
    try:
      user = NewUser.objects.get(username=self.request.user)
      user.device_token = fcm_token
      user.save()
      return Response('Successfully Updated Device Token!', status=status.HTTP_200_OK)
    except:
      return Response('Error! Can not process this at this time.', status=status.HTTP_400_BAD_REQUEST)


