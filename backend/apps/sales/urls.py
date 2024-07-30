from rest_framework.routers import DefaultRouter
from .views import ClientViewSet, ProductViewSet, SalesInvoiceViewSet

router = DefaultRouter()
router.register(r'clients', ClientViewSet)
router.register(r'products', ProductViewSet)
router.register(r'sales', SalesInvoiceViewSet)

urlpatterns = router.urls