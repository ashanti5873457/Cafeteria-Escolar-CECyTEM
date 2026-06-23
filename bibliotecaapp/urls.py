from django.urls import path
from . import views

urlpatterns = [
    path("productos/", views.productos),
    path("productos/actualizar/", views.actualizar_producto),

    path("login/", views.login_user),
    path("usuarios/", views.usuarios),

    path("categorias/", views.categorias),

    path("comprar/", views.comprar),
    path("pedidos/", views.pedidos),
]