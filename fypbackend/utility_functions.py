from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from .models import User
from .Serilizer import UserSerializer,QueryPostSerializer,QuestionSerializer,QuizSerializer,TopicSerializer,AnswersPostSerializer,ReportAnswersSerializer,ReportPostSerializer,StudyPlanSerializer,WeeklyGoalsSerializer,ChapterSerializer,BookSerializer
from .models import StudyPlan,Quiz,User,Topic,QueryPost,AnswersPost,ReportPost,ReportAnswers,WeeklyGoals,Quiz,Question,Chapter,Book
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.core.serializers import serialize
from pikepdf import Pdf
import re
from django.http import JsonResponse
import PyPDF2
import json

