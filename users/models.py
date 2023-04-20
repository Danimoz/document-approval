from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class Base(models.Model):
    class Meta:
        abstract = True

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Department(Base):
    name = models.CharField(max_length=128)
    head_of_department = models.OneToOneField('NewUser', on_delete=models.RESTRICT, related_name='hod')
    
    def __str__(self):
        return self.name


class NewUser(AbstractUser):
    email = models.EmailField(unique=True)
    department = models.ForeignKey(Department, on_delete=models.RESTRICT, null=True)
    device_token = models.CharField(max_length=255, null=True, blank=True)
    
    def __str__(self):
        return self.username


class GeneralManager(Base):
    GM_CHOICES = [
        ('GM Operations', 'GM Operations'),
        ('GM SM', 'GM SM'),
        ('MD', 'MD'),
    ]
    type = models.CharField(choices=GM_CHOICES, max_length=24)
    user = models.OneToOneField(NewUser, on_delete=models.RESTRICT, related_name='gm')
    departments = models.ManyToManyField(Department, blank=True)

    def __str__(self):
        return f'{self.type} - {self.user.username}'


class UserProfile(Base):
    user = models.OneToOneField(NewUser, on_delete=models.CASCADE, related_name='profile')
    image = models.ImageField(null=True)
    dob_month = models.IntegerField(null=True)
    dob_date = models.IntegerField(null=True)
    job_title = models.CharField(max_length=128, null=True)
    address = models.TextField(null=True)

    def __str__(self):
        return self.user.username