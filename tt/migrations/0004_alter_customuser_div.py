# Generated by Django 4.2.3 on 2024-04-07 22:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tt', '0003_contactuser'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='div',
            field=models.CharField(blank=True, max_length=10),
        ),
    ]
