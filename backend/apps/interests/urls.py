from rest_framework.routers import DefaultRouter
from interests.views import InterestsViewSet

router = DefaultRouter()
router.register(r'interests', InterestsViewSet,basename='interests')

urlpatterns = [
    
] + router.urls
