# Generated by Django 4.2.3 on 2024-02-17 15:14

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("fypbackend", "0023_alter_weeklygoals_topics_covered_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="topic",
            name="book",
            field=models.ForeignKey(
                default=10,
                on_delete=django.db.models.deletion.CASCADE,
                to="fypbackend.book",
            ),
            preserve_default=False,
        ),
    ]
