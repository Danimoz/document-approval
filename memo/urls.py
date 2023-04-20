from django.urls import path
from .views import (
    CreateRequisitionView,
    CreateRefundView,
    CreateSalesMemoView,
    CreateStaffRequestView,
    CreatePaymentView,
    GetUserMemoView,
    GetSingleMemo,
    LineManagerApprovalView,
    ICUApprovalView,
    GMApprovalView,
    FinanceApprovalView,
    AdminApprovalView,
    HRApprovalView,
    QAApprovalView,
    EditReferralView,
    ManagersMemo,
    SpecificHODMemo,
    GetDeviceView
)

urlpatterns = [
    # Create Memo's URLs
    path('create-acct-for-one/', CreateSalesMemoView.as_view(), name='create-acct-for-one'),
    path('create-requisition/', CreateRequisitionView.as_view(), name='create-requisition'),
    path('create-refund/', CreateRefundView.as_view(), name='create-refund'),
    path('create-payment/', CreatePaymentView.as_view(), name='create-payment'),
    path('create-staff-request/', CreateStaffRequestView.as_view(), name='create-staff-request'),
    # Approval URLs
    path('hod/<int:memo_id>/approve_or_reject/', LineManagerApprovalView.as_view(), name='line-manager-approval'),
    path('gm/<int:memo_id>/approve_or_reject/', GMApprovalView.as_view(), name='gm-manager-approval'),
    path('icu/<int:memo_id>/approve_or_reject/', ICUApprovalView.as_view(), name='icu-manager-approval'),
    path('finance/<int:memo_id>/approve_or_reject/', FinanceApprovalView.as_view(), name='finance-manager-approval'),
    path('admin/<int:memo_id>/approve_or_reject/', AdminApprovalView.as_view(), name='admin-manager-approval'),
    path('hr/<int:memo_id>/approve_or_reject/', HRApprovalView.as_view(), name='hr-manager-approval'),
    path('qa/<int:memo_id>/approve_or_reject/', QAApprovalView.as_view(), name='qa-manager-approval'),
    # Edit URLS
    path('edit/<int:memo_id>/', EditReferralView.as_view(), name='edit-memo'),
    # View Memo URLs
    path('manager-memo/', ManagersMemo.as_view(), name='manager-memo'),
    path('specific-hod-memo/', SpecificHODMemo.as_view(), name='specific-hod-memo'),
    path('get-single-memo/<int:pk>/', GetSingleMemo.as_view(), name='get-single-memo'),
    path('get-user-memo/', GetUserMemoView.as_view(), name='get-user-memo'),
    path('get-device-token/', GetDeviceView.as_view(), name='get-device-token'),
]