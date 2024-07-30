import {
  Component,
  ElementRef,
  ViewChild,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { SalesService } from './services/sales.service';
import { RouterOutlet } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import Swal from 'sweetalert2'
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export interface ProductElement {
  pro_id: string;
  pro_name: string;
  pro_sale_amount: string;
  pro_iva_percentage: string;
  pro_iva_calcualted: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    AsyncPipe,
    MatCardModule,
    RouterOutlet,
    ReactiveFormsModule,
    CommonModule,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatDialogModule,
    MatTableModule,
  ],
})
export class AppComponent {
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  sales: MatTableDataSource<ProductElement>;
  displayedColumns: string[] = [
    'pro_name',
    'pro_sale_amount',
    'pro_iva_percentage',
    'pro_id',
  ];
  salesForm: FormGroup;
  total: number = 0;
  clients: any[] = [];
  products: any[] = [];
  productsInCart: ProductElement[] = [];
  filteredClients: string[];
  filteredProducts: string[];
  readonly dialog = inject(MatDialog);

  constructor(private fb: FormBuilder, private salesService: SalesService) {
    this.salesForm = this.fb.group({
      clients: ['', Validators.required],
      products: [''],
    });
    this.filteredClients = this.clients.slice();
    this.filteredProducts = this.products.slice();

    this.sales = new MatTableDataSource(this.productsInCart);
  }
  ngOnInit(): void {
    this.salesService.getClients().subscribe((resp) => {
      this.clients = resp;
    });
    this.salesService.getProducts().subscribe((resp) => {
      this.products = resp;
    });
  }
  currencyFormatter(currency: string, value: number) {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      minimumFractionDigits: 2,
      currency,
    });
    return formatter.format(value);
  }
  openSalesList() {
    const dialogRef = this.dialog.open(DialogSalesList);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
  openAddClient() {
    const dialogRef = this.dialog.open(DialogAddClient);

    dialogRef.afterClosed().subscribe((result) => {
      this.salesService.getClients().subscribe((resp) => {
        this.clients = resp;
      });
    });
  }
  openAddProduct() {
    const dialogRef = this.dialog.open(DialogAddProduct);

    dialogRef.afterClosed().subscribe((result) => {
      this.salesService.getProducts().subscribe((resp) => {
        this.products = resp;
      });
    });
  }
  addProductToCart() {
    if (this.salesForm.get('products')?.value) {
      const prod = this.products.find(
        (product) => product.pro_name == this.salesForm.get('products')?.value
      );
      this.productsInCart.push(prod);
      this.sales = new MatTableDataSource(this.productsInCart);
      this.calculateTotal();
    }
  }
  removeProductFromCart(index: number) {
    this.productsInCart.splice(index, 1);
    this.sales = new MatTableDataSource(this.productsInCart);
    this.calculateTotal();
  }
  calculateTotal() {
    this.total = 0;
    for (const product of this.productsInCart) {
      if (product.pro_iva_percentage) {
        
        const result = parseFloat(product.pro_sale_amount) *
            (parseFloat(product.pro_iva_percentage) / 100)
        product.pro_iva_calcualted = result;
        
        this.total +=
          parseFloat(product.pro_sale_amount) +
          (result);
      } else {
        product.pro_iva_calcualted = 0;
        this.total += parseFloat(product.pro_sale_amount);
      }
    }
  }
  generateSalesInvoice() {
    const details = []
    for (const product of this.productsInCart) {
      details.push(
        {
          sal_pro_id: parseInt(product.pro_id),
          sal_product_value: product.pro_sale_amount,
          sal_calculated_iva: product.pro_iva_calcualted,
        }
      )
    }
    
    const invoice = {
      sin_cli_id: this.clients.find(client => client.cli_name == this.salesForm.get("clients")?.value).cli_id,
      sin_total_sale: this.total,
      details
    };
    this.salesService.createSales(invoice).pipe(
      catchError((error) => {
        console.log(error.toString());
        return of(null); 
      })).subscribe(result =>{
        console.log(result);
        
        if(result == null){
          Swal.fire({
            title: "Error",
            html: "No se pudo crear la factura",
            icon: "error",
            confirmButtonColor: "#00acc1",
          });

        }else{
          Swal.fire({
            title: "OK",
            text: "La factura se creó correctamente",
            icon: "success"
          }).then((result) => {
            window.location.reload()
          });
        }
    })
    
  }

  filtereClients(): void {
    const filterValue = this.input.nativeElement.value.toLowerCase();
    this.filteredClients = this.clients.filter((client) =>
      client.cli_name.toLowerCase().includes(filterValue)
    );
  }
  filtereProducts(): void {
    const filterValue = this.input.nativeElement.value.toLowerCase();
    this.filteredProducts = this.products.filter((product) =>
      product.pro_name.toLowerCase().includes(filterValue)
    );
  }
}

@Component({
  styleUrl: './dialogs/dialog.css',
  selector: 'add_client_dialog',
  templateUrl: './dialogs/add_client_dialog.html',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatGridListModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogAddClient {
  clientForm: FormGroup;

    constructor(private fb: FormBuilder, private salesService: SalesService, public dialogRef: MatDialogRef<DialogAddClient>,) {
    this.clientForm = this.fb.group({
      name: ['', Validators.required],
      document: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
    });
  }
  createClient() {
    const data = {
      cli_name: this.clientForm.get('name')?.value,
      cli_document: this.clientForm.get('document')?.value,
      cli_address: this.clientForm.get('address')?.value,
      cli_phone: this.clientForm.get('phone')?.value,
      cli_email: this.clientForm.get('email')?.value,
    };
    this.salesService.createClient(data).pipe(
      catchError((error) => {
        return of(null); 
      })).subscribe(result =>{
        if(result == null){
          
          Swal.fire({
            title: "Error",
            html: "No se pudo crear el cliente",
            icon: "error",
            confirmButtonColor: "#00acc1",
          });

        }else{
          Swal.fire({
            title: "OK",
            text: "El cliente se creó correctamente",
            icon: "success"
          }).then((result) => {
            this.dialogRef.close("OK")
          });
        }
    })
  }
}

@Component({
  styleUrl: './dialogs/dialog.css',
  selector: 'add_product_dialog',
  templateUrl: './dialogs/add_product_dialog.html',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatGridListModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogAddProduct {
  productForm: FormGroup;

  constructor(private fb: FormBuilder, private salesService: SalesService) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      value: ['', Validators.required],
      iva: [''],
    });
  }
  createProduct() {
    const data = {
      pro_name: this.productForm.get('name')?.value,
      pro_code: this.productForm.get('code')?.value,
      pro_sale_amount: this.productForm.get('value')?.value,
      pro_iva_percentage: this.productForm.get('iva')?.value
        ? this.productForm.get('iva')?.value
        : null,
    };
    this.salesService.createProduct(data).pipe(
      catchError((error) => {
        console.log(error.toString());
        return of(null); 
      })).subscribe(result =>{
        if(result == null){
          Swal.fire({
            title: "Error",
            html: "No se pudo crear el producto",
            icon: "error",
            confirmButtonColor: "#00acc1",
          });

        }else{
          Swal.fire({
            title: "OK",
            text: "El producto se creó correctamente",
            icon: "success"
          });
        }
    })
  }
}

@Component({
  styleUrl: './dialogs/dialog.css',
  selector: 'sales_list_dialog',
  templateUrl: './dialogs/sales_list_dialog.html',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogSalesList {
  sales: MatTableDataSource<any>;
  displayedColumns: string[] = [
    'sin_id',
    'sin_cli_id',
    'sin_total_sale',
    'sin_created_at',
  ];
  constructor( private salesService: SalesService) {
    this.sales = new MatTableDataSource()
    this.salesService.getSales().subscribe((resp) => {
      this.sales.data = resp
      
    })
   
  }
  currencyFormatter(currency: string, value: number) {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      minimumFractionDigits: 2,
      currency,
    });
    return formatter.format(value);
  }
}
