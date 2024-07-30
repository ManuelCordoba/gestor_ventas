from rest_framework import serializers
from .models import Client, Product, SalesInvoice, Sale

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class SaleSerializer(serializers.ModelSerializer):
    sal_sin_id = serializers.PrimaryKeyRelatedField(queryset=Sale.objects.all(), required=False)
    class Meta:
        model = Sale
        fields = '__all__'

class SalesInvoiceSerializer(serializers.ModelSerializer):
    details = SaleSerializer(many=True)

    class Meta:
        model = SalesInvoice
        fields = '__all__'

    def create(self, validated_data):

        # Extrae el array de productos del diccionario de datos validados
        products = validated_data.pop('details')

        # Crea una instancia de SalesInvoice con los datos restantes
        sales_invoice = SalesInvoice.objects.create(**validated_data)
        
        # Recorrer products para crear instancia de sale para cada uno
        for detalle_data in products:
            print("#############")
            print(detalle_data)
            print("#############")
            Sale.objects.create(sal_sin_id=sales_invoice, **detalle_data)
        return sales_invoice