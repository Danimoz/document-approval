from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Memo, RequisitionMemo, SalesMemo, Refund, Payment, StaffRequestMemo
from .notifications import sendNotifications, mailNotifications
from users.models import Department


@receiver(post_save, sender=RequisitionMemo)
def create_requisition_memo(sender, instance, created, **kwargs):
  if created:  
    Memo.objects.create(requisition=instance)

@receiver(post_save, sender=StaffRequestMemo)
def create_leave_memo(sender, instance, created, **kwargs):
  if created:
    Memo.objects.create(staff_request=instance)

@receiver(post_save, sender=SalesMemo)
def create_sales_memo(sender, instance, created, **kwargs):
  if created:
    Memo.objects.create(sales=instance)

@receiver(post_save, sender=Refund)
def create_refund_memo(sender, instance, created, **kwargs):
  if created:
    Memo.objects.create(refund=instance)

@receiver(post_save, sender=Payment)
def create_payment_memo(sender, instance, created, **kwargs):
  if created:
    Memo.objects.create(payment=instance)

@receiver(post_save, sender=Memo)
def notify_user(sender, instance, created, **kwargs):
  if created:
    user = instance.user
    user_dept = user.department
    hod = Department.objects.get(name=user_dept).head_of_department   
    
    sendNotifications(hod.device_token, 
      'You have a message for approval',
      f'Memo from {user} in your department')
    
    mailNotifications(
      hod.email,
      f'You have a Memo from {user}',
      f'Go to the portal and check out the message you have.'
    )
