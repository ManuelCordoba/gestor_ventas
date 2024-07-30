from django.db import models

class Client(models.Model):
    cli_id          = models.AutoField(primary_key=True)
    cli_document    = models.CharField(max_length=20, unique=True)
    cli_name        = models.CharField(max_length=100)
    cli_address     = models.CharField(max_length=255)
    cli_phone       = models.CharField(max_length=15)
    cli_email       = models.EmailField(unique=True)

    def __str__(self):
        return f'{self.cli_name} - {self.cli_document}'

class Product(models.Model):
    pro_id              = models.AutoField(primary_key=True)
    pro_code            = models.CharField(max_length=20, unique=True)
    pro_name            = models.CharField(max_length=100, unique=True)
    pro_sale_amount     = models.DecimalField(max_digits=10, decimal_places=2)
    pro_iva_percentage  = models.DecimalField(max_digits=4, decimal_places=2, default=None, null=True)

    def __str__(self):
        return f'{self.pro_name} - {self.pro_code}'

class SalesInvoice(models.Model):
    sin_id          = models.AutoField(primary_key=True)
    sin_created_at  = models.DateTimeField(auto_now_add=True)
    sin_cli_id      = models.ForeignKey(Client, on_delete=models.CASCADE)
    sin_total_sale  = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.sin_id

class Sale(models.Model):
    sal_id              = models.AutoField(primary_key=True)
    sal_sin_id          = models.ForeignKey(SalesInvoice, related_name='details', on_delete=models.CASCADE)
    sal_pro_id          = models.ForeignKey(Product, on_delete=models.CASCADE)
    sal_product_value   = models.DecimalField(max_digits=10, decimal_places=2)
    sal_calculated_iva  = models.DecimalField(max_digits=10, decimal_places=2)


    def __str__(self):
        return f'{self.sal_id} - {self.producto.nombre} - {self.sal_sin_id}'