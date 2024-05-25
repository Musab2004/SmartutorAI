from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from datetime import timedelta
from .models import User
from django.contrib.auth.hashers import check_password
from .Serilizer import UserSerializer,UserActivitySerializer,QueryPostSerializer,QuestionSerializer,QuizSerializer,TopicSerializer,AnswersPostSerializer,ReportAnswersSerializer,ReportPostSerializer,StudyPlanSerializer,WeeklyGoalsSerializer,ChapterSerializer,BookSerializer,QuizRoomSerializer
from .models import StudyPlan,UserActivity,Quiz,User,Topic,QueryPost,AnswersPost,ReportPost,ReportAnswers,WeeklyGoals,Quiz,Question,Chapter,Book,QuizRoom
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
import numpy as np
from sentence_transformers import SentenceTransformer
from django.core.serializers import serialize
from django.contrib.auth.hashers import make_password
from datetime import date
from django.db import models
from scipy.sparse import csr_matrix
from django.shortcuts import get_object_or_404
from django.core.files.uploadedfile import TemporaryUploadedFile
from pikepdf import Pdf
from django.db.models import Q
import numpy as np
import fitz
from django.core.exceptions import ObjectDoesNotExist
import PyPDF2
from datetime import datetime
import re
from django.http import JsonResponse
import json
from django.core.files.base import ContentFile
from io import BytesIO
# from utility_functions import extract_book_outline,extract_text_from_page_range,store_text
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import pairwise_distances
from django.db.models import Count
from django.core import serializers
from django.http import JsonResponse

from celery import shared_task
from django.utils import timezone
from .models import WeeklyGoals

@shared_task
def check_completion_of_weekly_goals():
    today = timezone.localdate()
    goals_to_complete = WeeklyGoals.objects.filter(end_date__lte=today, is_completed=False)
    for goal in goals_to_complete:
        goal.is_completed = True
        goal.save()

class AnswersPostListCreate(generics.ListCreateAPIView):
    queryset = AnswersPost.objects.all()
    serializer_class = AnswersPostSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
@api_view(['POST'])
def custom_login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response({'error': 'Please provide both username and password'}, status=400)
    try:
        user = User.objects.get(email_address=email)
    except User.DoesNotExist:
        return Response({'error': 'Invalid username or password'}, status=400)

    if not check_password(password, user.password):
        return Response({'error': 'Invalid username or password'}, status=400)
    user = User.objects.get(email_address=email)
    user.is_active = True
    user.save()
    existing_record = UserActivity.objects.filter(user=user, date=date.today()).first()
    if not existing_record:
        new_activity = UserActivity.objects.create(user=user, date=date.today())
        print("New user activity created.")
    else:
        # The record already exists, do something else or simply skip
        print("User activity already exists for today.")
    print("User's 'is_active' status updated successfully.")
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)
    user_data = serialize('json', [user]) 
     # Serialize the user object to JSON
    # print("profile pi is here : ",user.profile_pic.url)
    user_dict = json.loads(user_data)[0]['fields']  # Convert serialized data to dictionary
    # print(user_dict)
    user_dict['id'] = user.pk
    # print(refresh)
    # print(access_token)
    return Response({'access_token': access_token,'user':user_dict})
@api_view(['POST'])
def CheckUser(request):
    user_id = request.data.get('email_address')
    try:
        user = User.objects.get(email_address=user_id)
        return JsonResponse({'message': 'User already exists'}, status=200)
    except ObjectDoesNotExist:
        return JsonResponse({'message': 'All good'}, status=200)
class CompletedStudyPlans(generics.ListCreateAPIView):
    queryset = StudyPlan.objects.all()
    serializer_class = StudyPlanSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        print("here")
        user_id = self.request.GET.get('user_id')  # Assuming the ID is sent via query parameters

        if user_id:
            study_plans=StudyPlan.objects.all().filter(members=user_id)
            print("studyplans", study_plans)
            study_plans = [study_plan for study_plan in study_plans if not WeeklyGoals.objects.filter(Q(user=user_id) & Q(study_plan=study_plan)).exists()]  
            print("after filter studyplans", study_plans)
            # study_plans = [study_plan for study_plan in study_plans if not WeeklyGoals.objects.filter(Q(user=user_id) & Q(study_plan=study_plan)).exists()]
            return study_plans
        else:
            # If study plan ID is not provided, return an empty queryset or handle as needed
            return None
class OngoingStudyPLans(generics.ListCreateAPIView):
    queryset = StudyPlan.objects.all()
    serializer_class = StudyPlanSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user_id = self.request.GET.get('user_id')  # Assuming the ID is sent via query parameters
        user=User.objects.get(id=user_id)
        if user_id:
            study_plans = StudyPlan.objects.filter(members=user_id)
            study_plans = [study_plan for study_plan in study_plans if WeeklyGoals.objects.filter(Q(user=user_id) & Q(study_plan=study_plan)).exists()]
            return study_plans
        else:
            # If study plan ID is not provided, return an empty queryset or handle as needed
            return None
@api_view(['POST'])
def UpvoteComment(request):
    user_id = request.data.get('user')
    comment_id = request.data.get('comment')
    user=User.objects.get(id=user_id)
    answer=AnswersPost.objects.get(id=comment_id)
    answer.is_upvoted.add(user)
    return Response({'response': 'all good baby'})         
@api_view(['POST'])
def DownvoteComment(request):
    user_id = request.data.get('user')
    comment_id = request.data.get('comment')
    answer=AnswersPost.objects.get(id=comment_id)
    answer.is_upvoted.remove(user_id) 
    return Response({'response': 'all good baby'})    
@api_view(['POST'])
def UpvotePost(request):
    user_id = request.data.get('user')
    post_id = request.data.get('post')
    post=QueryPost.objects.get(id=post_id)
    user=User.objects.get(id=user_id)
    # print(user)
    post.is_upvoted.add(user)
    # post.save()
    # print(post.author)
    # print("likes people : ",post.is_upvoted.all())
    return Response({'response': 'all good baby'})          
@api_view(['POST'])
def DownvotePost(request):
    user_id = request.data.get('user')
    post_id = request.data.get('post')
    post=QueryPost.objects.get(id=post_id)
    post.is_upvoted.remove(user_id)  
    return Response({'response': 'all good baby'})

class UserActivityListView(generics.ListCreateAPIView):
    queryset = UserActivity.objects.all()
    serializer_class = UserActivitySerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user_id = self.request.GET.get('user_id')  # Assuming the ID is sent via query parameters
        print("function call    led")
        user=User.objects.get(id=user_id)
        if user:
            # Filter QueryPost objects by study plan ID
            return UserActivity.objects.filter(user=user)
        else:
            # If study plan ID is not provided, return an empty queryset or handle as needed
            return UserActivity.objects.none()

@api_view(['POST'])
def OnlyJoinedStudyPlans(request):
    user_id = request.data.get('user_id')
    post=User.objects.get(id=user_id)
    study_plans=StudyPlan.objects.all().filter(members=user_id)
    serializer = StudyPlanSerializer(study_plans, many=True)

    return Response(serializer.data)
@api_view(['POST'])
def OwnedStudyPlans(request):
    user_id = request.data.get('user_id')
    post=User.objects.get(id=user_id)
    study_plans=StudyPlan.objects.all().filter(owner=user_id)
    serializer = StudyPlanSerializer(study_plans, many=True)

    return Response(serializer.data)             
class AnswersPostDetailsUpdate(generics.RetrieveUpdateAPIView):
    queryset = AnswersPost.objects.all()
    serializer_class = AnswersPostSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

class QuestionListCreate(generics.ListCreateAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]


class QuestionDetailsUpdate(generics.RetrieveUpdateAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]


class QuizListCreate(generics.ListCreateAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]


class QuizDetailsUpdate(generics.RetrieveUpdateAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        response = super().retrieve(request, *args, **kwargs)

        # Modify the response data to include the whole question objects
        version = instance.total_versions  # or any other way you get the version

        correct_questions = instance.correct_questions.filter(version=version)
        wrong_questions = instance.wrong_questions.filter(version=version)
        questions = instance.questions.filter(version=version)
        response.data['correct_questions'] = QuestionSerializer(correct_questions, many=True).data
        response.data['wrong_questions'] = QuestionSerializer(wrong_questions, many=True).data  
        response.data['questions'] = QuestionSerializer(questions, many=True).data

        return response
    

class QuizRoomListCreate(generics.ListCreateAPIView):
    queryset = QuizRoom.objects.all()
    serializer_class = QuizRoomSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]


class QuizRoomDetailsUpdate(generics.RetrieveUpdateAPIView):
    queryset = QuizRoom.objects.all()
    serializer_class = QuizRoomSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

class WeeklyGoalsListCreate(generics.ListCreateAPIView):
    queryset = WeeklyGoals.objects.all()
    serializer_class = WeeklyGoalsSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def create(self, request, *args, **kwargs):
    # Get the studyplan_id, chapters_id, and start_date from the request
        # WeeklyGoals.objects.all().delete()
        studyplan_id = request.data.get('studyplan_id')
        chapters_id = request.data.get('chapters_id')
        start_date = request.data.get('start_date')
        order = request.data.get('order')
        user = request.data.get('user')
        is_owner = request.data.get('owner')


        date_string = re.sub(r'\(.*\)', '', start_date)
        start_date = datetime.strptime(date_string.strip(), "%a %b %d %Y %H:%M:%S %Z%z").date()
        # start_date = datetime.strptime(start_date, "%a %b %d %Y %H:%M:%S %Z%z").date()
    # Get the StudyPlan object from the studyplan_id
        studyplan = get_object_or_404(StudyPlan, id=int(studyplan_id))
        if not is_owner:
            studyplan.members.add(user)
            
        user_id = get_object_or_404(User, id=int(user))
        prev_order=int(order)-1
        start_date=start_date+timedelta(weeks=int(prev_order))
        end_date=start_date+timedelta(weeks=int(order))
        # Get all Chapter objects from the chapters_id
        chapters_id_list = [int(id) for id in chapters_id.split(',')]
        print(chapters_id_list)
        quizes_per_week=studyplan.QuizesPerWeek
        segment_length=int(len(chapters_id_list)/quizes_per_week)
        print(chapters_id_list)
        if len(chapters_id_list)>1:
            chapter_segments = [chapters_id_list[i:i + segment_length] for i in range(0, len(chapters_id_list), segment_length)]
        else:
            chapter_segments=[chapters_id_list]
            # num_of_segments=1
        print("chapter segments : ",chapter_segments)
        chapters = Topic.objects.filter(id__in=chapters_id_list)

        # Create a new WeeklyGoals object
        weekly_goals = WeeklyGoals.objects.create(study_plan=studyplan,order=int(order),user=user_id, start_date=start_date,end_date=end_date)

        # Add the chapters to the weekly_goals
        for chapter in chapters:
            weekly_goals.all_topics.add(chapter)
            weekly_goals.topics_to_be_covered.add(chapter)
        for segment in chapter_segments:
            print("segments here : ",segment)
            quiz = Quiz.objects.create(weekid=weekly_goals)
            for topic_id in segment:
                topic=Topic.objects.get(id=topic_id)
                quiz.topics.add(topic)
            quiz.save()
        # Save the weekly_goals object
        weekly_goals.save()
        # WeeklyGoals.objects.all().delete()
        return Response({'response': 'all good baby'})

class WeeklyGoals_all_StudyPlan(generics.ListCreateAPIView):
    queryset = WeeklyGoals.objects.all()
    serializer_class = WeeklyGoalsSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def list(self, request, *args, **kwargs):
        studyplan_id = request.GET.get('studyplan_id')  # Assuming the ID is sent via query parameters
        studyplan = StudyPlan.objects.get(pk=studyplan_id)
        user_id = request.GET.get('user_id')  # Assuming the ID is sent via query parameters
        user = User.objects.get(pk=user_id)        
        # print("Study Plans : ", studyplan)
        result = []
        if studyplan:
            weeklygoals = WeeklyGoals.objects.all().filter(study_plan=studyplan,user=user)
            all_complete = all(goal.is_completed for goal in weeklygoals)
            if all_complete:
                 WeeklyGoals.objects.all().filter(study_plan=studyplan,user=user).delete()
                 return Response({'response': result,'all_complete':all_complete})
            for weeklygoal in weeklygoals:
                all_weekly_goals = {}
                all_weekly_goals['weekly_goals'] = WeeklyGoalsSerializer(weeklygoal).data
                all_weekly_goals['chapters'] = []
                quizes_per_week = studyplan.QuizesPerWeek  # replace study_plan.QuizesPerWeek with the correct field name
                all_topics = list(weeklygoal.all_topics.all())
                segment_length=int(len(all_topics)/quizes_per_week)
                if len(all_topics)>1:
                    chapter_segments = [all_topics[i:i + segment_length] for i in range(0, len(all_topics), segment_length)]
                else:
                    chapter_segments=[all_topics]
                quizzes = list(Quiz.objects.filter(weekid=weeklygoal))  # replace Quiz with your Quiz model and weekly_goal with the correct field name

                for i, segment in enumerate(chapter_segments):
                    for chapter in segment:
                        my_dict={'topics':TopicSerializer(chapter).data}
                        my_dict['topics'].pop('content', None)
                        if chapter in weeklygoal.topics_to_be_covered.all():
                            my_dict['is_covered'] = False
                        elif chapter in weeklygoal.topics_covered.all():
                            my_dict['is_covered'] = True
                        my_dict['topics']['is_quiz']=False  
                        all_weekly_goals['chapters'].append(my_dict)
                    
                    if i < len(quizzes):
                        quiz_dict = {'topics': QuizSerializer(quizzes[i]).data}
                        quiz_dict['topics']['title']='Quiz'
                        quiz_dict['topics']['is_quiz']=True  # replace QuizSerializer with your Quiz serializer
                        all_weekly_goals['chapters'].append(quiz_dict)
                if all_weekly_goals is not None:        
                    result.append(all_weekly_goals)
            # print(result)        
            return Response({'response': result,'all_complete':all_complete})
        else:
            # If study plan ID is not provided, return an empty queryset or handle as needed
            return Response([])
class Leave_StudyPlan(generics.ListCreateAPIView):
    queryset = StudyPlan.objects.all()
    serializer_class = StudyPlanSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def list(self, request, *args, **kwargs):
        studyplan_id = request.GET.get('studyplan_id')       
        user_id = request.GET.get('user_id')  
        user = User.objects.get(pk=user_id)
        studyplan = StudyPlan.objects.get(pk=studyplan_id)        
        studyplan.members.remove(user)
        if studyplan:
            WeeklyGoals.objects.filter(study_plan=studyplan, user=user).delete()
            return Response([]) 
        else:
            return Response([])
class Complete_StudyPlan(generics.ListCreateAPIView):
    queryset = WeeklyGoals.objects.all()
    serializer_class = WeeklyGoalsSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def list(self, request, *args, **kwargs):
        studyplan_id = request.GET.get('studyplan_id')       
        user_id = request.GET.get('user_id')  
        user = User.objects.get(pk=user_id)
        studyplan = StudyPlan.objects.get(pk=studyplan_id)        
        studyplan.members.remove(user)
        studyplan.is_completed=True
        studyplan.save()
        print("study plan here : ",studyplan)
        if studyplan:
            WeeklyGoals.objects.filter(study_plan=studyplan, user=user).delete() 
            return Response([])
        else:
            return Response([])               
class WeeklyGoals_Topic_Covered(generics.ListCreateAPIView):
    queryset = WeeklyGoals.objects.all()
    serializer_class = WeeklyGoalsSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def list(self, request, *args, **kwargs):
        topic_id = request.GET.get('topic_id')
        weeklygoal_id = request.GET.get('weeklygoal_id')   # Assuming the ID is sent via query parameters
        topic = Topic.objects.get(pk=topic_id)
        weeklygoal = WeeklyGoals.objects.get(pk=weeklygoal_id)
        weeklygoal.study_plan.is_completed=True
        weeklygoal.study_plan.save()
        weeklygoal.topics_covered.add(topic)
        weeklygoal.topics_to_be_covered.remove(topic)
        if  weeklygoal.topics_to_be_covered.all().count()==0:
            weeklygoal.is_completed=True 
        weeklygoal.save()

        my_dict={'topics':TopicSerializer(topic).data,'is_covered':True}    
        return Response(my_dict)
       
class WeeklyGoalsDetailsUpdate(generics.RetrieveUpdateAPIView):
    queryset = WeeklyGoals.objects.all()
    serializer_class = WeeklyGoalsSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

class ReportAnswersListCreate(generics.ListCreateAPIView):
    queryset = ReportAnswers.objects.all()
    serializer_class = ReportAnswersSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]


class ReportAnswersDetailsUpdate(generics.RetrieveUpdateAPIView):
    queryset = ReportAnswers.objects.all()
    serializer_class = ReportAnswersSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

class ReportPostListCreate(generics.ListCreateAPIView):
    queryset = ReportPost.objects.all()
    serializer_class = ReportPostSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return QueryPost.objects.filter(reported_posts__isnull=True)


class ReportPostDetailsUpdate(generics.RetrieveUpdateAPIView):
    queryset = ReportPost.objects.all()
    serializer_class = ReportPostSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
class QuizSubmission(generics.ListCreateAPIView):
    queryset = ReportPost.objects.all()
    serializer_class = ReportPostSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def create(self, request, *args, **kwargs):
        data = json.loads(request.body)
        correct = data.get('correct')
        wrong = data.get('wrong')
        quiz_id = data.get('quiz_id')
        topic_to_revisit=[]
        topic_to_revisit_ids=[]
        # Assuming you have models for Question, WeeklyGoal, and Quiz
        # weekly_goal = WeeklyGoals.objects.get(id=weekly_goal_id)
        quiz = Quiz.objects.get(id=quiz_id)
        quiz.is_completed=True
        if len(wrong)!=0:
            quiz.followup_quiz=True
        for question in correct:
            q=Question.objects.get(id=question)
            quiz.correct_questions.add(q)
        for question in wrong: 
            q=Question.objects.get(id=question)
            if q.topic.id not in topic_to_revisit_ids:
                my_dict=TopicSerializer(q.topic).data     
                topic_to_revisit.append(my_dict)
                topic_to_revisit_ids.append(q.topic.id)
            quiz.wrong_questions.add(q)
        quiz.topics_to_revisit=topic_to_revisit    
        quiz.save()    
        return JsonResponse({'status': 'success'}, status=201)        
class QuestionsView(generics.ListCreateAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def create(self, request, *args, **kwargs):
        data = json.loads(request.body)
        questions = data.get('questions')
        # weekly_goal_id = data.get('weekly_goal_id')
        quiz_id = data.get('quiz_id')

        # Assuming you have models for Question, WeeklyGoal, and Quiz
        # weekly_goal = WeeklyGoals.objects.get(id=weekly_goal_id)
        quiz = Quiz.objects.get(id=quiz_id)
        quiz.total_versions=quiz.total_versions+1
        quiz.save()
        version_number=quiz.total_versions
        print(questions)
        for question_data in questions:
            print(question_data)
            topic=Topic.objects.get(id=question_data['id'])
            q=Question.objects.create(question=question_data['question'],answer=question_data["correct_answer"],distractors=question_data['distractors'],feedback=question_data['explanation'],context=question_data["context"],topic=topic, quiz=quiz,version=version_number)
            quiz.questions.add(q)

        return JsonResponse({'status': 'success'}, status=201)
class CheckAnswer(generics.ListCreateAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def create(self, request, *args, **kwargs):
        data = json.loads(request.body)
        correct_answer = data.get('correct_answer')
        # weekly_goal_id = data.get('weekly_goal_id')
        selected_answer = data.get('selected_answer')
        if selected_answer is None:
            return JsonResponse({'status': 'success','similarity_score':0}, status=201)

        print("answer we getting : ",selected_answer)
        if selected_answer=="":
            return JsonResponse({'status': 'success','similarity_score':0}, status=201) 
        model = SentenceTransformer('all-MiniLM-L6-v2')
        def encode(text):
            return model.encode(text)
        def cosine_similarity(vec1, vec2):
            return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))
        def check_similarity(reference_answer, student_answer):
            ref_vec = encode(reference_answer)
            student_vec = encode(student_answer)
            similarity = cosine_similarity(ref_vec, student_vec)
            return similarity
        similarity_score = check_similarity(correct_answer, selected_answer)
        similarity_score=float(similarity_score)
        print(f"Similarity score: {similarity_score:.2f}")
        return JsonResponse({'status': 'success','similarity_score':similarity_score}, status=201)    
class AnswersPostListCreate(generics.ListCreateAPIView):
    queryset = AnswersPost.objects.all()
    serializer_class = AnswersPostSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        post_id = self.request.GET.get('post_id')  # Assuming the ID is sent via query parameters

        if post_id:
            # Filter QueryPost objects by study plan ID
            return AnswersPost.objects.filter(post=post_id)
        else:
            # If study plan ID is not provided, return an empty queryset or handle as needed
            return AnswersPost.objects.none()


class AnswersPostDetailsUpdate(generics.RetrieveUpdateDestroyAPIView):
    queryset = AnswersPost.objects.all()
    serializer_class = AnswersPostSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

class QueryPostListCreate(generics.ListCreateAPIView):
    queryset = QueryPost.objects.all()
    serializer_class = QueryPostSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        study_plan_id = self.request.GET.get('study_plan_id')  # Assuming the ID is sent via query parameters
        # QueryPost.objects.all().delete()
        if study_plan_id:
            query_posts = QueryPost.objects.filter(reported_posts__isnull=True).order_by('-created_at')
            print(query_posts)
            # Filter QueryPost objects by study plan ID
            return query_posts.filter(study_plan=study_plan_id)
        else:
            # If study plan ID is not provided, return an empty queryset or handle as needed
            return QueryPost.objects.none()


class QueryPostDetailsUpdate(generics.RetrieveUpdateDestroyAPIView):
    queryset = QueryPost.objects.all()
    serializer_class = QueryPostSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

class TopicListCreate(generics.ListCreateAPIView):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def list(self, request, *args, **kwargs):
        """
        Retrieve a list of topics related to a book.

        Args:
            request (HttpRequest): The HTTP request object.
            args: Variable length argument list.
            kwargs: Arbitrary keyword arguments.

        Returns:
            Response: The HTTP response containing the list of topics.
        """
        book_id = request.GET.get('book_id')
        print(book_id)  # Assuming the ID is sent via query parameters
        book = Book.objects.get(pk=book_id)
        if book:
            topics = Topic.objects.all().filter(book=book)
            serialized_topics = serializers.serialize('json', topics,fields=('id', 'title'))
            return JsonResponse(serialized_topics, safe=False)
        else:
            return JsonResponse([], safe=False)

class TopicDetailsUpdate(generics.RetrieveUpdateDestroyAPIView):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

class ChapterListCreate(generics.ListCreateAPIView):
    queryset = Chapter.objects.all()
    serializer_class = ChapterSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]


class ChapterDetailsUpdate(generics.RetrieveUpdateDestroyAPIView):
    queryset = Chapter.objects.all()
    serializer_class = ChapterSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

class BookListCreate(generics.ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]


class BookDetailsUpdate(generics.RetrieveUpdateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        try:
            # Retrieve the specific book object based on the provided ID in the URL
            print("this function is called.......................")
            book = self.get_object()
            # print(book)
            # Retrieve related chapters for the book
            chapters = Chapter.objects.filter(book=book)
            
            # Initialize an empty list to store topics data for each chapter
            chapters_with_topics = []
            
            # Iterate through each chapter to fetch related topics
            for chapter in chapters:
                # Retrieve related topics for the current chapter
                topics = Topic.objects.filter(chapter=chapter)
                serialized_topics = [{'topic_id':topic.id,'title': topic.title, 'order':topic.order} for topic in topics]
                chapters_with_topics.append({
                    'chapter_id':chapter.id,
                    'chapter_name': chapter.title,
                    'chapter_order':chapter.order,
                    'topics': serialized_topics
                })
            
            # Serialize the book object
            serializer = self.get_serializer(book)
            
            # Construct the response data including chapters and topics
            response_data = {
                'book_details': serializer.data,
                'chapters_details': chapters_with_topics
            }
            return Response(response_data)
        except Book.DoesNotExist:
            return Response(
                {"detail": "Book not found"},
                status=status.HTTP_404_NOT_FOUND
            )



from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.neighbors import NearestNeighbors

class StudyPlanRecommendation:
    def __init__(self, study_plans):
        self.study_plans = study_plans
        self.user_profiles = User.objects.all()
        self.vectorizer = TfidfVectorizer(stop_words='english')

    def collaborative_filtering(self, user):
        # Collaborative Filtering
        user_study_plans = user.joined_studyplan.all()
        other_users = User.objects.exclude(id=user.id)
        other_user_study_plans = StudyPlan.objects.filter(members__in=other_users)

        # Create user-item matrix
        user_item_matrix = other_user_study_plans.filter(is_completed=False).values('owner__id', 'id')
        user_item_matrix = user_item_matrix.values('owner__id', 'id')
        print(user_item_matrix)
        # Train Nearest Neighbors model
        nn_model = NearestNeighbors(metric='cosine', algorithm='brute', n_neighbors=5)
        nn_model.fit(user_item_matrix)
        
        # Find nearest neighbors
        user_vector = user_study_plans.filter(is_completed=True).values_list('id', flat=True)
        _, indices = nn_model.kneighbors([user_vector])
        print("Indices : ",indices)
        # Get recommended study plans from nearest neighbors
        recommended_plans = StudyPlan.objects.filter(id__in=user_item_matrix[indices][0])

        return recommended_plans

    def content_based_filtering(self, user):
        # Content-Based Filtering
        study_plan_texts = [plan.subject for plan in self.study_plans]

        # Transform study plan texts into TF-IDF vectors
        tfidf_matrix = self.vectorizer.fit_transform(study_plan_texts)

        # Calculate cosine similarity between study plans
        cosine_similarities = linear_kernel(tfidf_matrix, tfidf_matrix)

        # Get the index of the user's joined study plans
        user_study_plan_indices = user.joined_studyplan.filter(is_completed=True).values_list('id', flat=True)

        # Calculate average similarity scores for each study plan
        avg_similarities = cosine_similarities[user_study_plan_indices].mean(axis=0)

        # Get indices of recommended study plans based on content similarity
        content_based_indices = avg_similarities.argsort()[::-1]

        # Get recommended study plans
        recommended_plans = [self.study_plans[i] for i in content_based_indices if i not in user_study_plan_indices]

        return recommended_plans

    def hybrid_recommendation(self, user):
        # Hybrid Recommendation combining collaborative and content-based filtering
        collaborative_recommendations = self.collaborative_filtering(user)
        print("Collaborative Recommendations : ",collaborative_recommendations)
        content_based_recommendations = self.content_based_filtering(user)
        hybrid_recommendations = collaborative_recommendations.union(content_based_recommendations)

        return hybrid_recommendations

class RecommendedStudyPlan(generics.ListAPIView):
    queryset = StudyPlan.objects.all()
    serializer_class = StudyPlanSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def list(self, request, *args, **kwargs):
        # Assuming you want to customize the creation process
        user_id  = request.GET.get('user_id') 
        print("User id is this : ",user_id) # Assuming 'name' is a field in StudyPlan model
        user = User.objects.get(pk=user_id)  # Replace 1 with the ID of the user you want recommendations for
        all_study_plans = StudyPlan.objects.all()

        return Response(None)
  
        # return Response(study_plan_serializer.data)
# Example usage




class StudyPlanDetailsUpdate(generics.RetrieveUpdateDestroyAPIView):
    queryset = StudyPlan.objects.all()
    serializer_class = StudyPlanSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

class JoinStudyPlan(generics.ListCreateAPIView):
    queryset = StudyPlan.objects.all()
    serializer_class = StudyPlanSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def create(self, request, *args, **kwargs):
            # Assuming you want to customize the creation process
            studyplan = request.data.get('studyplan')
            user = request.data.get('user')
            study_plan = StudyPlan.objects.get(id=int(studyplan))
            study_plan.members.add(user)
            return Response(None)

class UserListCreate(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    def create(self, request, *args, **kwargs):
            email_address = request.data.get('email_address')
            name = request.data.get('name')
            current_academic_level = request.data.get('current_academic_level')
            password = request.data.get('password')
            hashed_password = make_password(password)
            user = User.objects.create(
                email_address=email_address,
                name=name,
                current_academic_level=current_academic_level,
                password=hashed_password,
            )
            user.save()
            return Response(None)



class UserDetailsUpdate(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        print("before ",instance)
        name = request.data.get('name')
        current_academic_level = request.data.get('current_academic_level')
        instance.name=name
        instance.current_academic_level=current_academic_level
        instance.save()
        print("after : ",instance)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

class UserActivityUpdateAPIView(generics.RetrieveUpdateAPIView):
    authentication_classes = []  # If using JWT, adjust accordingly
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        date_today = date.today()
        activity, created = UserActivity.objects.get_or_create(user=user, date=date_today)

        if not created:
            activity.time_spent += int(request.data.get('time_spent', 0))
            activity.save()

        return Response({'status': 'success'}, status=status.HTTP_200_OK)



     
class StudyPlanListCreate(generics.ListCreateAPIView):
    queryset = StudyPlan.objects.all()
    serializer_class = StudyPlanSerializer
    def create(self, request, *args, **kwargs):
        name = request.data.get('name')  # Assuming 'name' is a field in StudyPlan model
        subject = request.data.get('subject')
        owner = request.data.get('owner')
        duration = request.data.get('duration')  # Assuming 'description' is a field in StudyPlan model
        academic_level = request.data.get('academic_level')
        is_public = request.data.get('is_public')
        QuizesPerWeek = request.data.get('QuizesPerWeek')  # Assuming 'description' is a field in StudyPlan model
        file = request.FILES.get('books')
        if is_public=="public":
            is_public=True
        else:
            is_public=False    
        book_title=str(file)
        pdf_data = file.read()
        print(book_title)
        book = Book.objects.create(title=book_title)
        user=User.objects.get(id=owner)
        pdf_bytes = BytesIO(pdf_data)
        doc = fitz.open("pdf", pdf_bytes)
        page = doc.load_page(0)  # number of page
        pix = page.get_pixmap()
        image_bytes = pix.tobytes()
        image_content = ContentFile(image_bytes)
        try :
            book_outline=extract_outline_and_text_to_json(doc,book)
        except:
            book.delete()
            return Response(None)    
        if book_outline=="Not a structure PDF":
            return Response(None)
        doc.close()
        study_plan = StudyPlan.objects.create(
            name=name,
            owner=user,
            duration=duration,
            QuizesPerWeek=int(QuizesPerWeek),  # Replace with desired duration
            subject=subject,
            academic_level=academic_level,
            is_public=is_public,
            is_completed=False,
        )
        study_plan.image.save(f"title_page.png", image_content)
        study_plan.books.add(book)
        study_plan.members.add(user)
        study_plan.save()
        study_plan_serializer = StudyPlanSerializer(study_plan)
        return Response(study_plan_serializer.data)
    def list(self, request, *args, **kwargs):
         # Replace 1 with the ID of the user you want recommendations for
        user_id = request.GET.get('user_id')
        print("user id should be this : ",user_id)
        study_plans = StudyPlan.objects.exclude(members=user_id)
        study_plan_serializer = StudyPlanSerializer(study_plans, many=True)

        return Response(study_plan_serializer.data)     
def extract_outline_and_text_to_json(doc,book):
    chapter_order=1
    topic_order=1
    outline = doc.get_toc(simple=False)
    # print(outline)
    if not outline:
#         print("NOt a structure pdf")
        return "Not a structure PDF"
    max_level = max(entry[0] for entry in outline)
    print("max levels : ",max_level)
    if max_level >3:
        base_level=2
    else:
        base_level=1
    topics = []
    topic_id=0
    table_of_content=[]
    chapter_title=""
    chapter=None
    for i, entry in enumerate(outline):
#         print(entry)
        level, title, start_page, _ = entry
        topic_id = i  # Using the enumeration index as a simple topic ID
        my_dict={}
        if level == base_level:
            # print(title)
            if "Chapter" in title and re.search(r'\d', title):
                chapter_title=title
                chapter=Chapter.objects.create(book=book, title=chapter_title, order=chapter_order)
                chapter_order=chapter_order+1
                topic_order=1
                
        if level==base_level+1:
            if i < len(outline) - 1:
                end_page = outline[i + 1][2] - 1
            else:
                end_page = doc.page_count
            start_page -= 1
            end_page -= 1
            text = ""
            for page_num in range(start_page, end_page + 1):
                page = doc.load_page(page_num)
                text += page.get_text()
            pattern = r'^\d+\.\d+ '
            if re.match(pattern, title):
                Topic.objects.create(chapter=chapter,book=book, title=title, content=text,order=topic_order)

    return topics        
   
 