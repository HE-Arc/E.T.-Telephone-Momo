# Generated by Django 3.1.7 on 2021-03-26 10:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ETMApp', '0003_auto_20210310_1748'),
    ]

    operations = [
        migrations.AlterField(
            model_name='message',
            name='url_drawing',
            field=models.CharField(max_length=50, null=True),
        ),
    ]
