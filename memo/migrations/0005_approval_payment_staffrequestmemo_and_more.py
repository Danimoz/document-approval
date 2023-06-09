# Generated by Django 4.1.5 on 2023-03-28 15:40

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django_fsm
import memo.models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('memo', '0004_alter_salesmemo_state'),
    ]

    operations = [
        migrations.CreateModel(
            name='Approval',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('action', models.CharField(choices=[('Approved', 'Approved'), ('Rejected', 'Rejected'), ('Referred', 'Referred')], max_length=10)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('title', models.CharField(max_length=100)),
                ('message', models.TextField()),
                ('document', models.FileField(blank=True, null=True, upload_to=memo.models.upload_to)),
                ('state', django_fsm.FSMField(choices=[('Initiated', 'Initiated'), ('Line Manager', 'Line Manager'), ('ICU', 'ICU'), ('GMs', 'GMs'), ('Finance', 'Finance'), ('Okay', 'Okay'), ('Rejected', 'Rejected'), ('Referral', 'Referral')], default='Initiated', max_length=50, protected=True)),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.RESTRICT, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='StaffRequestMemo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('request_type', models.CharField(max_length=32)),
                ('start_date', models.DateField(blank=True, null=True)),
                ('end_date', models.DateField(blank=True, null=True)),
                ('expected_resumption_date', models.DateField(blank=True, null=True)),
                ('purpose', models.CharField(max_length=255)),
                ('relief_staff_designation', models.CharField(blank=True, max_length=255, null=True)),
                ('state', django_fsm.FSMField(choices=[('Initiated', 'Initiated'), ('Line Manager', 'Line Manager'), ('GMs', 'GMs'), ('HR', 'HR'), ('Granted', 'Granted'), ('Referral', 'Referral'), ('Rejected', 'Rejected')], default='Initiated', max_length=50, protected=True)),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.RESTRICT, to=settings.AUTH_USER_MODEL)),
                ('relief_staff_name', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.RESTRICT, related_name='related', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.RemoveField(
            model_name='sendmemoforapproval',
            name='created_by',
        ),
        migrations.RemoveField(
            model_name='sendmemoforapproval',
            name='memo',
        ),
        migrations.RemoveField(
            model_name='sendmemoforapproval',
            name='to',
        ),
        migrations.RemoveField(
            model_name='memo',
            name='approval_list',
        ),
        migrations.RemoveField(
            model_name='memo',
            name='created_by',
        ),
        migrations.RemoveField(
            model_name='memo',
            name='current_manager',
        ),
        migrations.RemoveField(
            model_name='memo',
            name='leave',
        ),
        migrations.RemoveField(
            model_name='memo',
            name='seen_by_gm',
        ),
        migrations.RemoveField(
            model_name='salesmemo',
            name='gm_approve_time',
        ),
        migrations.RemoveField(
            model_name='salesmemo',
            name='head_of_sales_approve_time',
        ),
        migrations.RemoveField(
            model_name='salesmemo',
            name='icu_approve_time',
        ),
        migrations.RemoveField(
            model_name='salesmemo',
            name='status',
        ),
        migrations.AddField(
            model_name='refund',
            name='state',
            field=django_fsm.FSMField(choices=[('Initiated', 'Initiated'), ('Line Manager', 'Line Manager'), ('Quality Assurance', 'Quality Assurance'), ('ICU', 'ICU'), ('GMs', 'GMs'), ('Finance', 'Finance'), ('Okay', 'Okay'), ('Referral', 'Referral'), ('Rejected', 'Rejected')], default='Initiated', max_length=50, protected=True),
        ),
        migrations.AddField(
            model_name='requisitionmemo',
            name='state',
            field=django_fsm.FSMField(choices=[('Initiated', 'Initiated'), ('Line Manager', 'Line Manager'), ('Head of Admin', 'Head of Admin'), ('Referral', 'Referral'), ('Rejected', 'Rejected'), ('Okay', 'Okay')], default='Initiated', max_length=50, protected=True),
        ),
        migrations.AlterField(
            model_name='refund',
            name='document1',
            field=models.FileField(blank=True, null=True, upload_to=memo.models.refund_upload_to),
        ),
        migrations.AlterField(
            model_name='refund',
            name='document2',
            field=models.FileField(blank=True, null=True, upload_to=memo.models.refund_upload_to),
        ),
        migrations.AlterField(
            model_name='refund',
            name='document3',
            field=models.FileField(blank=True, null=True, upload_to=memo.models.refund_upload_to),
        ),
        migrations.AlterField(
            model_name='refund',
            name='document4',
            field=models.FileField(blank=True, null=True, upload_to=memo.models.refund_upload_to),
        ),
        migrations.DeleteModel(
            name='LeaveMemo',
        ),
        migrations.DeleteModel(
            name='SendMemoForApproval',
        ),
        migrations.AddField(
            model_name='approval',
            name='memo',
            field=models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, to='memo.memo'),
        ),
        migrations.AddField(
            model_name='approval',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='memo',
            name='approvals',
            field=models.ManyToManyField(related_name='memo_approved', through='memo.Approval', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='memo',
            name='payment',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.RESTRICT, to='memo.payment'),
        ),
        migrations.AddField(
            model_name='memo',
            name='staff_request',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.RESTRICT, to='memo.staffrequestmemo'),
        ),
    ]
