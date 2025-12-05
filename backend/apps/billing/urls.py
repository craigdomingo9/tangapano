from rest_framework.routers import DefaultRouter
from billing.views import TierViewSet, SubscriptionViewSet

router = DefaultRouter()
router.register(r'tiers', TierViewSet, basename='tier')
router.register(r'subscriptions', SubscriptionViewSet, basename='subscription')


urlpatterns = router.urls
