# Generated by Django 5.0.3 on 2024-05-01 18:40

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('google_oauth', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='google_user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='google_oauth.googleuser'),
        ),
    ]