# Generated by Django 3.1.7 on 2021-04-02 13:54

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ETMApp', '0004_auto_20210326_1110'),
    ]

    operations = [
        migrations.RenameField(
            model_name='useranonyme',
            old_name='pseudo',
            new_name='username',
        ),
    ]
