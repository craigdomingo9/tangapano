from .auth_views import LoginView, LogoutView, VerifyTokenView
from .user_views import UserRegistrationView, UserProfileView, UserListView
from .landlord_views import LandlordRetrieveUpdateView
from .lookup_user_views import UserLookupView
from .admin_views import AdminLandlordViewSet, AdminAgentViewSet, AdminChangePasswordView
from .admin_auth_views import AdminLoginView, AdminPriviledgedAuthView
from .employee_views import EmployeeViewSet, DepartmentViewSet, RoleViewSet

