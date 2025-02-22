from django.urls import path

from . import views

# urlpatterns = [
#     path('studyplans/', StudyPlanListCreateView.as_view(), name='studyplan-list'),
#     path('studyplans/<int:pk>/', StudyPlanDetailView.as_view(), name='studyplan-detail'),
#     path('quizzes/', QuizListCreateView.as_view(), name='quiz-list'),
#     path('quizzes/<int:pk>/', QuizDetailView.as_view(), name='quiz-detail'),
# ]
urlpatterns = [
    # ... (existing patterns)
    path('api/questions/', views.QuestionListCreate.as_view(), name='question-list'),
    path('api/questions/<int:pk>/', views.QuestionDetailsUpdate.as_view(), name='question-detail'),

    path('api/custom-login/', views.custom_login, name='custom_login'),
     path('api/checkusers/', views.CheckUser, name='check-user'),
    path('api/upvotecomment/', views.UpvoteComment, name='upvotecomment'),
    path('api/downvotecomment/', views.DownvoteComment, name='downvotecomment'),
    path('api/upvotepost/', views.UpvotePost, name='upvotepost'),
    path('api/downvotepost/', views.DownvotePost, name='downvotepost'),
    path('api/useractivity/', views.UserActivityListView.as_view(), name='user_activity'),
    path('api/completedstudyplans/', views.CompletedStudyPlans.as_view(), name='completed_study_plans'),
    path('api/joinedstudyplans/', views.OnlyJoinedStudyPlans, name='joined_study_plans'),
    path('api/ownedstudyplans/', views.OwnedStudyPlans, name='owned_study_plans'),
    path('api/ongoingstudyplans/', views.OngoingStudyPLans.as_view(), name='ongoing_study_plans'),
    path('api/recommendedstudyplans/', views.RecommendedStudyPlan.as_view(), name='recommended_study_plans'),
    path('api/joinstudyplans/', views.JoinStudyPlan.as_view(), name='join_study_plans'),
    path('api/getweeklygoals/', views.WeeklyGoals_all_StudyPlan.as_view(), name='weekly_goals_all_studyplan'),
    path('api/quizzes/', views.QuizListCreate.as_view(), name='quiz-list'),
    path('api/quizzes/<int:pk>/', views.QuizDetailsUpdate.as_view(), name='quiz-detail'),
    path('api/quizroom/', views.QuizRoomListCreate.as_view(), name='quizroom-list'),
    path('api/quizroom/<int:pk>/', views.QuizRoomDetailsUpdate.as_view(), name='quizroom-detail'),
    path('api/weeklygoals/', views.WeeklyGoalsListCreate.as_view(), name='weeklygoals-list'),
    path('api/leavestudyplan/', views.Leave_StudyPlan.as_view(), name='leave-studyplan'),
    path('api/completestudyplan/', views.Complete_StudyPlan.as_view(), name='complete-studyplan'),
    path('api/weeklygoals/<int:pk>/', views.WeeklyGoalsDetailsUpdate.as_view(), name='weeklygoals-detail'),
    path('api/reportanswers/', views.ReportAnswersListCreate.as_view(), name='reportanswers-list'),
    path('api/reportanswers/<int:pk>/', views.ReportAnswersDetailsUpdate.as_view(), name='reportanswers-detail'),
    path('api/reportposts/', views.ReportPostListCreate.as_view(), name='reportpost-list'),
    path('api/reportposts/<int:pk>/', views.ReportPostDetailsUpdate.as_view(), name='reportpost-detail'),
    path('api/answersposts/', views.AnswersPostListCreate.as_view(), name='answerspost-list'),
    path('api/answersposts/<int:pk>/', views.AnswersPostDetailsUpdate.as_view(), name='answerspost-detail'),
    path('api/queryposts/', views.QueryPostListCreate.as_view(), name='querypost-list'),
    path('api/queryposts/<int:pk>/', views.QueryPostDetailsUpdate.as_view(), name='querypost-detail'),
    path('api/topics/', views.TopicListCreate.as_view(), name='topic-list'),
    path('api/topics/<int:pk>/', views.TopicDetailsUpdate.as_view(), name='topic-detail'),
    path('api/chapters/', views.ChapterListCreate.as_view(), name='chapter-list'),
    path('api/chapters/<int:pk>/', views.ChapterDetailsUpdate.as_view(), name='chapter-detail'),
    path('api/books/', views.BookListCreate.as_view(), name='book-list'),
    path('api/books/<int:pk>/', views.BookDetailsUpdate.as_view(), name='book-detail'),
    path('api/studyplans/', views.StudyPlanListCreate.as_view(), name='studyplan-list'),
    path('api/weeklygoaltopiccovered/', views.WeeklyGoals_Topic_Covered.as_view(), name='studyplan-list'),
    path('api/studyplans/<int:pk>/', views.StudyPlanDetailsUpdate.as_view(), name='studyplan-detail'),
    path('api/users/', views.UserListCreate.as_view(), name='user-list'),
    path('api/users/<int:pk>/', views.UserDetailsUpdate.as_view(), name='user-detail'),
    # Add similar URL patterns for other models' views
    # Add similar URL patterns for other models' views
]
