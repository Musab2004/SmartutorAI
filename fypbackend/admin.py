from django.contrib import admin
from .models import StudyPlan,UserActivity,Quiz,User,Topic,QueryPost,AnswersPost,ReportPost,ReportAnswers,WeeklyGoals,Quiz,Question,Chapter,Book,QuizRoom
# Register your models here.
admin.site.register(StudyPlan)
admin.site.register(UserActivity)
admin.site.register(Quiz)
admin.site.register(User)
admin.site.register(Topic)
admin.site.register(QueryPost)
admin.site.register(AnswersPost)
admin.site.register(ReportPost)
admin.site.register(ReportAnswers)
admin.site.register(WeeklyGoals)
admin.site.register(Question)
admin.site.register(Chapter)
admin.site.register(Book)
admin.site.register(QuizRoom)
