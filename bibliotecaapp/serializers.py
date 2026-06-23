from rest_framework import serializers
from django.utils.timezone import localtime
from .models import Pedido


class PedidoSerializer(serializers.ModelSerializer):

    fecha = serializers.SerializerMethodField()

    def get_fecha(self, obj):
        return localtime(obj.fecha).strftime("%Y-%m-%d %H:%M:%S")

    class Meta:
        model = Pedido
        fields = "__all__"