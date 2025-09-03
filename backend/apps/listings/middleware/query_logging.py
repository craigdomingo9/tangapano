import time
from django.db import connection
from django.conf import settings
import logging

logger = logging.getLogger('django.db.backends')

class QueryLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        
    def __call__(self, request):
        # Reset query count and time before processing the request
        connection.queries_logged = []
        connection.total_query_time = 0
        
        response = self.get_response(request)
        
        # Check for slow queries after processing
        self._check_slow_queries(request)
        
        return response
    
    def _check_slow_queries(self, request):
        threshold = getattr(settings, 'SLOW_QUERY_THRESHOLD', 1.0)
        slow_queries = []
        
        for query in connection.queries:
            duration = float(query.get('time', 0))
            if duration > threshold:
                slow_queries.append({
                    'sql': query['sql'],
                    'time': duration,
                    'stacktrace': self._get_simplified_stacktrace()
                })
        
        if slow_queries:
            self._log_slow_queries(request, slow_queries)
    
    def _get_simplified_stacktrace(self):
        """Get a simplified stacktrace to identify where slow query originated"""
        import traceback
        stack = traceback.extract_stack()
        # Filter to only show application code (not Django internals)
        app_stack = [frame for frame in stack if 'site-packages' not in frame[0] and 'django' not in frame[0]]
        return ''.join(traceback.format_list(app_stack[-5:])) if app_stack else 'Stack trace not available'
    
    def _log_slow_queries(self, request, slow_queries):
        logger.warning(
            f"Slow queries detected for {request.path}:\n" +
            "\n".join([f"Query: {q['sql']}\nTime: {q['time']}s\nOrigin: {q['stacktrace']}\n" 
                      for q in slow_queries])
        )