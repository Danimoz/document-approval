# Generated by Django 4.1.5 on 2023-03-07 14:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('managers', '0003_remove_discussion_author_delete_announcement_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='attendance',
            name='date',
            field=models.DateField(auto_now_add=True),
        ),
    ]
