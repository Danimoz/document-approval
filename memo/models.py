from django.db import models
from django.conf import settings
from django_fsm import FSMField, transition
from users.models import Base

def upload_to(instance, filename):
  return f'{instance.created_by.department}/{filename}'

def refund_upload_to(instance, filename):
  return f'refunds/{instance.created_by}/{filename}'


# Create your models here.
class SalesMemo(Base):
  WORKFLOW_STATES = (
    ('Initiated', 'Initiated'),
    ('Line Manager', 'Line Manager'),
    ('ICU', 'ICU'),
    ('GMs', 'GMs'),
    ('Underwriting', 'Underwriting'),
    ('Okay', 'Okay'),
    ('Referral', 'Referral'),
    ('Rejected', 'Rejected')
  )
  subject = models.CharField(max_length=255)
  company_name = models.CharField(max_length=255)
  company_address = models.CharField(max_length=255)
  line_of_business = models.CharField(max_length=128, null=True, blank=True)
  starting_date = models.DateField()
  policy_start = models.CharField(max_length=16)
  policy_end = models.CharField(max_length=16)
  tot_annual_premium = models.PositiveIntegerField()
  payment_made = models.PositiveIntegerField()
  payment_note = models.CharField(max_length=255)
  mode_of_payment = models.CharField(max_length=255)
  items = models.JSONField()
  total_no_of_lives = models.PositiveIntegerField()
  insured = models.CharField(max_length=255)
  contact_person = models.CharField(max_length=255)
  phone_number = models.CharField(max_length=16)
  created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.RESTRICT, null=True, blank=True)
  state = FSMField(choices=WORKFLOW_STATES, default='Initiated', protected=True)

  def __str__(self):
    return f'Account for {self.company_name}'
    
  @transition(field=state, source='Initiated', target='Line Manager')
  def submit_to_line_manager(self):
    """Submit the Memo from the Initiator to the Line Manager."""

  @transition(field=state, source='Line Manager', target='ICU')
  def approve_by_line_manager(self):
    """Approve the Memo by the Head of Sales."""

  @transition(field=state, source='Line Manager', target='Rejected')
  def reject_by_line_manager(self):
    """ Reject the Memo from the Head Of Sales """

  @transition(field=state, source='Line Manager', target='Referral')
  def refer_by_line_manager(self):
    """ Refer the Memo to the Initiator"""

  @transition(field=state, source='Referral', target='Line Manager')
  def edit_by_initiator(self):
    """ The initiator edits the Memo and it goes to the Head of Sales """

  @transition(field=state, source='ICU', target='GMs')
  def approve_by_icu(self):
    """ Approve the Memo by the ICU """

  @transition(field=state, source='ICU', target='Referral')
  def refer_by_icu(self):
    """ Refer the Memo to the Head Of Sales """

  @transition(field=state, source='Referral', target='ICU')
  def edit_by_line_manager(self):
    """ The Head of Sales edits the Memo and it goes to the ICU"""

  @transition(field=state, source='GMs', target='Underwriting')
  def approve_by_gm(self):
    """ The GM approves the Memo"""

  @transition(field=state, source='GMs', target='Rejected')
  def reject_by_gm(self):
    """ The GM rejects the Memo """

  @transition(field=state, source='GMs', target='Referral')
  def refer_by_gm(self):
    """ The GM refers the Memo to the ICU """

  @transition(field=state, source='Referral', target='GMs')
  def edit_by_icu(self):
    """ The ICU edits the memo and sends it to the GM """
  @transition(field=state, source='Underwriting', target='Okay')
  def complete(self):
    pass


class RequisitionMemo(Base):
  WORKFLOW_STATES = (
    ('Initiated', 'Initiated'),
    ('Line Manager', 'Line Manager'),
    ('Head of Admin', 'Head of Admin'),
    ('Referral', 'Referral'),
    ('Rejected', 'Rejected'),
    ('Okay', 'Okay')
  )
  created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.RESTRICT, null=True, blank=True)
  title = models.CharField(max_length=255)
  message = models.TextField()
  document = models.FileField(upload_to=upload_to, null=True, blank=True)
  state = FSMField(choices=WORKFLOW_STATES, default="Initiated", protected=True)
  
  def __str__(self):
    return self.title
  
  @transition(field=state, source='Initiated', target='Line Manager')
  def submit_to_line_manager(self):
    pass
  @transition(field=state, source='Line Manager', target='Head of Admin')
  def approve_by_line_manager(self):
    pass
  @transition(field=state, source='Line Manager', target='Referral')
  def refer_by_line_manager(self):
    pass
  @transition(field=state, source='Referral', target='Line Manager')
  def edit_by_initiator(self):
    pass
  @transition(field=state, source='Line Manager', target='Rejected')
  def reject_by_line_manager(self):
    pass
  @transition(field=state, source='Head of Admin', target='Okay')
  def complete_by_head_of_admin(self):
    pass
  @transition(field=state, source='Head of Admin', target='Rejected')
  def reject_by_head_of_admin(self):
    pass
  @transition(field=state, source='Head of Admin', target='Referral')
  def refer_by_head_of_admin(self):
    pass
  @transition(field=state, source='Referral', target='Head of Admin')
  def edit_by_line_manager(self):
    pass
    

class StaffRequestMemo(Base):
  WORKFLOW_STATES = (
    ('Initiated', 'Initiated'),
    ('Line Manager', 'Line Manager'),
    ('GMs', 'GMs'),
    ('HR', 'HR'),
    ('Granted', 'Granted'),
    ('Referral', 'Referral'),
    ('Rejected', 'Rejected')
  )
  created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.RESTRICT, null=True, blank=True)
  request_type = models.CharField(max_length=32)
  start_date = models.DateField(null=True, blank=True)
  end_date = models.DateField(null=True, blank=True)
  expected_resumption_date = models.DateField(null=True, blank=True)
  purpose = models.CharField(max_length=255)
  relief_staff_name = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.RESTRICT, null=True, blank=True, related_name='related')
  relief_staff_designation = models.CharField(max_length=255, null=True, blank=True)
  state = FSMField(choices=WORKFLOW_STATES, default='Initiated', protected=True)

  def __str__(self) -> str:
    return f'Leave by {self.created_by} on {self.created_at}'
  
  @transition(field=state, source='Initiated', target='Line Manager')
  def submit_to_line_manager(self):
    pass
  @transition(field=state, source='Line Manager', target='GMs')
  def approve_by_line_manager(self):
    pass
  @transition(field=state, source='Line Manager', target='Rejected')
  def reject_by_line_manager(self):
    pass
  @transition(field=state, source='Line Manager', target='Referral')
  def refer_by_line_manager(self):
    pass
  @transition(field=state, source='Referral', target='Line Manager')
  def edit_by_initiator(self):
    pass
  @transition(field=state, source='GMs', target='HR')
  def approve_by_gm(self):
    pass
  @transition(field=state, source='GMs', target='Referral')
  def refer_by_gm(self):
    pass
  @transition(field=state, source='GMs', target='Rejected')
  def reject_by_gm(self):
    pass
  @transition(field=state, source='Referral', target='GMs')
  def edit_by_line_manager(self):
    pass
  @transition(field=state, source='HR', target='Granted')
  def approve_by_hr(self):
    pass
  @transition(field=state, source='HR', target='Referral')
  def refer_by_hr(self):
    pass
  @transition(field=state, source='Referral', target='HR')
  def edit_by_gm(self):
    pass


class Refund(Base):
  WORKFLOW_STATES = (
    ('Initiated', 'Initiated'),
    ('Line Manager', 'Line Manager'),
    ('Quality Assurance', 'Quality Assurance'),
    ('ICU', 'ICU'),
    ('GMs', 'GMs'),
    ('Finance', 'Finance'),
    ('Okay', 'Okay'),
    ('Referral', 'Referral'),
    ('Rejected', 'Rejected')
  )
  enrollee_name = models.CharField(max_length=128)
  enrollee_address = models.CharField(max_length=255)
  enrollee_id = models.CharField(max_length=64)
  enrollee_reg_date = models.DateField()
  enrollee_birth_date = models.DateField()
  company_name = models.CharField(max_length=128)
  provider_name = models.CharField(max_length=128)
  refund_reason = models.CharField(max_length=255, null=True, blank=True)
  illness = models.TextField()
  telephone = models.CharField(max_length=16)
  email = models.EmailField()
  acct_no = models.CharField(max_length=16)
  tot_amt_claimed = models.PositiveIntegerField()
  acct_name = models.CharField(max_length=128)
  bank_name = models.CharField(max_length=128)
  document1 = models.FileField(null=True, blank=True, upload_to=refund_upload_to)
  document2 = models.FileField(null=True, blank=True, upload_to=refund_upload_to)
  document3 = models.FileField(null=True, blank=True, upload_to=refund_upload_to)
  document4 = models.FileField(null=True, blank=True, upload_to=refund_upload_to)
  created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.RESTRICT, null=True, blank=True)
  state = FSMField(choices=WORKFLOW_STATES, default='Initiated', protected=True)

  def __str__(self):
    return f'Refund for {self.enrollee_name}'
  
  @transition(field=state, source='Initiated', target='Line Manager')
  def submit_to_line_manager(self):
    pass
  @transition(field=state, source='Line Manager', target='Quality Assurance')
  def send_to_qa(self):
    pass
  @transition(field=state, source='Quality Assurance', target='ICU')
  def send_to_icu(self):
    pass
  @transition(field=state, source='ICU', target='GMs')
  def approve_by_icu(self):
    pass
  @transition(field=state, source='ICU', target='Referral')
  def refer_by_icu(self):
    pass
  @transition(field=state, source='Referral', target='ICU')
  def edit_by_qa(self):
    pass
  @transition(field=state, source='GMs', target='Finance')
  def approve_by_gms(self):
    pass
  @transition(field=state, source='GMS', target='Rejected')
  def reject_by_gms(self):
    pass
  @transition(field=state, source='GMs', target='Referrals')
  def refer_by_gms(self):
    pass
  @transition(field=state, source='Referral', target='GMs')
  def edit_by_icu(self):
    pass
  @transition(field=state, source='Finance', target='Okay')
  def complete_by_finance(self):
    pass


class Payment(Base):
  WORKFLOW_CHOICES = (
    ('Initiated', 'Initiated'),
    ('Line Manager', 'Line Manager'),
    ('ICU', 'ICU'),
    ('GMs', 'GMs'),
    ('Finance', 'Finance'),
    ('Okay', 'Okay'),
    ('Rejected', 'Rejected'),
    ('Referral', 'Referral')
  )
  title = models.CharField(max_length=100)
  message = models.TextField()
  document = models.FileField(upload_to=upload_to, null=True, blank=True)
  created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.RESTRICT, null=True, blank=True)
  state = FSMField(choices=WORKFLOW_CHOICES, default='Initiated', protected=True)

  def __str__(self):
    return f'Payment by {self.created_by} on {self.created_at}'
  
  @transition(field=state, source='Initiated', target='Line Manager')
  def submit_to_line_manager(self):
    pass
  @transition(field=state, source='Line Manager', target='ICU')
  def approve_by_line_manager(self):
    pass
  @transition(field=state, source='Line Manager', target='Rejected')
  def reject_by_line_manager(self):
    pass
  @transition(field=state, source='Line Manager', target='Referral')
  def refer_by_line_manager(self):
    pass
  @transition(field=state, source='Referral', target='Line Manager')
  def edit_by_initiator(self):
    pass
  @transition(field=state, source='ICU', target='GMs')
  def approve_by_icu(self):
    pass
  @transition(field=state, source='ICU', target='Referral')
  def refer_by_icu(self):
    pass
  @transition(field=state, source='Referral', target='ICU')
  def edit_by_line_manager(self):
    pass
  @transition(field=state, source='GMs', target='Finance')
  def approve_by_gm(self):
    pass
  @transition(field=state, source='GMs', target='Rejected')
  def reject_by_gm(self):
    pass
  @transition(field=state, source='GMs', target='Referral')
  def refer_by_gm(self):
    pass
  @transition(field=state, source='Referral', target='GMs')
  def edit_by_icu(self):
    pass
  @transition(field=state, source='Finance', target='Okay')
  def completed_by_finance(self):
    pass


class Memo(Base):
  MEMO_STATUS = [
    ('Pending', 'Pending'),
    ('Approved', 'Approved'),
    ('Rejected', 'Rejected'),
    ('Completed', 'Completed'),
  ]

  staff_request = models.ForeignKey(StaffRequestMemo, on_delete=models.RESTRICT, null=True, blank=True)
  requisition = models.ForeignKey(RequisitionMemo, on_delete=models.RESTRICT, null=True, blank=True)
  sales = models.ForeignKey(SalesMemo, on_delete=models.RESTRICT, null=True, blank=True)
  refund = models.ForeignKey(Refund, on_delete=models.RESTRICT, null=True, blank=True)
  payment = models.ForeignKey(Payment, on_delete=models.RESTRICT, null=True, blank=True)
  status = models.CharField(max_length=10, choices=MEMO_STATUS, default='Pending')
  approvals = models.ManyToManyField(settings.AUTH_USER_MODEL, through='Approval', related_name='memo_approved')

  class Meta:
    ordering = ('-id',)
   
  def __str__(self):
    return f'Memo by {self.user}'
  
  @property
  def user(self):
    memo_types = [self.staff_request, self.requisition, self.sales, self.refund, self.payment]
    owner = next((x.created_by for x in memo_types if x is not None), None)
    return owner
  
  @property
  def state(self):
    memo_types = [self.staff_request, self.requisition, self.sales, self.refund, self.payment]
    state = next((x.state for x in memo_types if x is not None), None)
    return state
  
  @property
  def memoType(self):
    memo_types = {
      'staff_request': self.staff_request,
      'requisition': self.requisition,
      'sales': self.sales,
      'refund': self.refund,
      'payment': self.payment
    }
    res = next((k for k,v in memo_types.items() if v is not None), None)
    if '_' in res:
      res.replace('_', ' ')
    return res.capitalize()


class Approval(Base):
  ACTION_CHOICES = (
    ('approve', 'Approve'),
    ('reject', 'Reject'),
    ('refer', 'Refer')
  )
  memo = models.ForeignKey(Memo, on_delete=models.RESTRICT)
  user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.RESTRICT)
  action = models.CharField(max_length=10, choices=ACTION_CHOICES)

  class Meta:
    ordering = ['-created_at', ]
  
  def __str__(self):
    return f'Memo approved by {self.user} on {self.created_at}'
    