from django.test import TestCase, RequestFactory
from django.contrib.auth import get_user_model
from django.contrib.sessions.middleware import SessionMiddleware
from analytics.middleware.dau_middleware import UserEngagementMiddleware
from analytics.models import UserSession, ListingViewEvent, ListingStat
from listings.models import Listing, Landlord
from interests.models import Interest, Room
from django.utils import timezone
from apps.listings.views.listing_retrieve_views import ListingRetrieveAPIView
from rest_framework.test import APIRequestFactory, force_authenticate

User = get_user_model()

class AnalyticsExclusionTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.api_factory = APIRequestFactory()
        
        # Create a non-staff user
        self.user = User.objects.create_user(username='student', email='student@test.com', password='password')
        
        # Create a staff user
        self.staff_user = User.objects.create_user(username='staff', email='staff@test.com', password='password', is_staff=True)
        
        # Create a landlord and listing
        self.landlord_user = User.objects.create_user(username='landlord', email='landlord@test.com', password='password')
        self.landlord = Landlord.objects.create(user=self.landlord_user, full_name="Land Lord")
        self.listing = Listing.objects.create(landlord=self.landlord, title="Test Listing", price_per_month=1000)
        self.room = Room.objects.create(listing=self.listing, room_type="Single", price=1000, available_rooms=1)

    def _get_request_with_session(self, user=None, path='/'):
        request = self.factory.get(path)
        if user:
            request.user = user
        else:
            from django.contrib.auth.models import AnonymousUser
            request.user = AnonymousUser()
        
        middleware = SessionMiddleware(lambda r: None)
        middleware.process_request(request)
        request.session.save()
        return request

    def test_dau_middleware_excludes_staff(self):
        middleware = UserEngagementMiddleware(lambda r: None)
        
        # Staff request
        request = self._get_request_with_session(user=self.staff_user)
        middleware(request)
        self.assertFalse(UserSession.objects.filter(user=self.staff_user).exists())
        
        # Non-staff request
        request = self._get_request_with_session(user=self.user)
        middleware(request)
        self.assertTrue(UserSession.objects.filter(user=self.user).exists())

    def test_listing_view_excludes_staff(self):
        view = ListingRetrieveAPIView.as_view()
        
        # Staff view
        request = self.api_factory.get(f'/api/listings/{self.listing.id}/')
        force_authenticate(request, user=self.staff_user)
        
        # Manually add session for the view check
        middleware = SessionMiddleware(lambda r: None)
        middleware.process_request(request)
        request.session.save()
        
        view(request, pk=self.listing.id)
        
        self.assertFalse(ListingViewEvent.objects.filter(user=self.staff_user, listing=self.listing).exists())
        stat = ListingStat.objects.filter(listing=self.listing).first()
        self.assertEqual(stat.total_views if stat else 0, 0)

        # Student view
        request = self.api_factory.get(f'/api/listings/{self.listing.id}/')
        force_authenticate(request, user=self.user)
        middleware.process_request(request)
        request.session.save()
        
        view(request, pk=self.listing.id)
        self.assertTrue(ListingViewEvent.objects.filter(user=self.user, listing=self.listing).exists())
        stat.refresh_from_db()
        self.assertEqual(stat.total_views, 1)

    # test_inquiry_stat_excludes_staff removed because user field was 
    # removed from Interest model.
