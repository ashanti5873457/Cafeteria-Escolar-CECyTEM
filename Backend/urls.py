from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from bibliotecaapp.views import (
    ProductoViewSet,
    CategoriaViewSet,
    UsuarioViewSet,
    PedidoViewSet,
    comprar
)

router = DefaultRouter()
router.register(r'productos', ProductoViewSet)
router.register(r'categorias', CategoriaViewSet)
router.register(r'usuarios', UsuarioViewSet)
router.register(r'pedidos', PedidoViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/comprar/', comprar),
]