from rest_framework.routers import DefaultRouter
from interests.views import InterestsViewSet

router = DefaultRouter()
router.register(r'inquiries', InterestsViewSet, basename='inquiries')

urlpatterns = router.urls