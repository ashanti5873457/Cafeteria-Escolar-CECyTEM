from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.http import HttpResponse
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from bibliotecaapp.views import (
    ProductoViewSet,
    CategoriaViewSet,
    UsuarioViewSet,
    PedidoViewSet,
    comprar
)

def home(request):
    return HttpResponse("API funcionando 🚀")

router = DefaultRouter()
router.register(r'productos', ProductoViewSet)
router.register(r'categorias', CategoriaViewSet)
router.register(r'usuarios', UsuarioViewSet)
router.register(r'pedidos', PedidoViewSet)

urlpatterns = [
    path('', home),

    path('admin/', admin.site.urls),

    path('api/', include(router.urls)),

    path('api/comprar/', comprar),

    # LOGIN JWT
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),

    # REFRESH TOKEN
    path('api/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]