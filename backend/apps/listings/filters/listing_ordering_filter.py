from rest_framework.filters import OrderingFilter

class AliasedOrderingFilter(OrderingFilter):
    ordering_field_aliases = {
        'price': 'rooms__rent_per_month',
        'distance': 'distance_from_campus'
    }

    def get_ordering(self, request, queryset, view):
        ordering = super().get_ordering(request, queryset, view) or []
        translated = []

        for field in ordering:
            prefix = '-' if field.startswith('-') else ''
            clean_field = field.lstrip('-')
            actual = self.ordering_field_aliases.get(clean_field, clean_field)
            translated.append(prefix + actual)

        return translated