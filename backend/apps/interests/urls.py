from rest_framework.routers import DefaultRouter
from django.urls import path
from interests.views import generate_receipt_pdf
from interests.views import InterestsViewSet

router = DefaultRouter()
router.register(r'inquiries', InterestsViewSet, basename='inquiries')

urlpatterns = [
    path('receipt/<int:pk>/', generate_receipt_pdf, name='generate_receipt'),
] + router.urls