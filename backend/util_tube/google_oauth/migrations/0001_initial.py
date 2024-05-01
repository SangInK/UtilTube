# Generated by Django 5.0.3 on 2024-05-01 17:50

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='GoogleUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_id', models.CharField(max_length=50, verbose_name='user_id')),
                ('user_name', models.CharField(max_length=50, verbose_name='user_name')),
                ('thumb_url', models.CharField(max_length=200, verbose_name='thumb_url')),
                ('access_token', models.CharField(max_length=300, verbose_name='token')),
                ('refresh_token', models.CharField(max_length=300, verbose_name='refresh_token')),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_token', models.UUIDField(verbose_name='user_token')),
                ('user_state', models.BooleanField()),
                ('expires_at', models.DateTimeField()),
                ('google_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='google_oauth.googleuser')),
            ],
        ),
    ]
