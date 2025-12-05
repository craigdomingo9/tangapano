from django.urls import path
from .views import DashboardKPIView, UserGrowthChartView, TopListingsView

urlpatterns = [
    path('kpi/', DashboardKPIView.as_view(), name='dashboard-kpi'),
    path('growth/', UserGrowthChartView.as_view(), name='dashboard-growth'),
    path('top-listings/', TopListingsView.as_view(), name='dashboard-top-listings'),
]