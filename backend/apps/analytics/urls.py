from django.urls import path
from .views import (
    DashboardKPIView, 
    UserGrowthChartView, 
    TopListingsView, 
    SessionTrafficView, 
    DemographicsView, 
    DAUTrendChartView,
    RegionalInterestView
)

urlpatterns = [
    path('kpi/', DashboardKPIView.as_view(), name='dashboard-kpi'),
    path('growth/', UserGrowthChartView.as_view(), name='dashboard-growth'),
    path('traffic/', SessionTrafficView.as_view(), name='dashboard-traffic'),
    path('charts/dau/', DAUTrendChartView.as_view(), name='chart-dau'),
    path('top-listings/', TopListingsView.as_view(), name='dashboard-top-listings'),
    path('demographics/', DemographicsView.as_view(), name='dashboard-demographics'),
    path('regional-interest/', RegionalInterestView.as_view(), name='dashboard-regional-interest'),
]
