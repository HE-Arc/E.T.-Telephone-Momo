# Generated by Django 3.1.7 on 2021-03-10 16:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ETMApp', '0002_auto_20210308_1420'),
    ]

    operations = [
        migrations.AddField(
            model_name='game',
            name='has_ended',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='game',
            name='has_started',
            field=models.BooleanField(default=False),
        ),
    ]
