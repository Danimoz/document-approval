from django.contrib import admin
from .models import (
    SalesMemo,
    Memo,
    StaffRequestMemo,
    RequisitionMemo,
    Approval,
    Payment,
    Refund
)
# Register your models here.
admin.site.register(SalesMemo)
admin.site.register(RequisitionMemo)
admin.site.register(StaffRequestMemo)
admin.site.register(Memo)
admin.site.register(Refund)
admin.site.register(Payment)
admin.site.register(Approval)