import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { DataService } from '../policies/Data.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  objectKeys = Object.keys;
  productData: any[] = [];
  orgData: any[] = [];
  premiumJson: any[] = [];
  showAddProductForm: boolean = false;
  showEditProductForm: boolean = false;
  selectedProduct: any;
  addProductForm: FormGroup;
  editProductForm: FormGroup;
  searchQuery: string = '';

  constructor(
    private formBuilder: FormBuilder, 
    private snackBar: MatSnackBar, 
    private cdr: ChangeDetectorRef, 
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.loadPremiumData();
    const orgDataStr = localStorage.getItem('angular17orgs');
    if (orgDataStr) {
      this.orgData = JSON.parse(orgDataStr);
    }
    this.initializeForms();
  }

  initializeForms(): void {
    this.addProductForm = this.formBuilder.group({
      organization: ['', Validators.required],
      name: ['', Validators.required],
      type: ['', Validators.required],
      tag: ['', Validators.required],
      description: ['', Validators.required],
      config: ['', Validators.required] // New Config field
    });

    this.editProductForm = this.formBuilder.group({
      id: [''], // Add id field for tracking
      organization: ['', Validators.required],
      name: ['', Validators.required],
      type: ['', Validators.required],
      tag: ['', Validators.required],
      description: ['', Validators.required],
      config: ['', Validators.required] // New Config field
    });
  }

  get filteredProducts() {
    if (!this.searchQuery) {
      return this.productData;
    }
    return this.productData.filter(product => product.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
  }

  loadProductData(): void {
    const productDataStr = localStorage.getItem('angularProducts');
    console.log('Loading product data:', productDataStr);
    if (productDataStr) {
      this.productData = JSON.parse(productDataStr);
      this.updateProductPrices();
    }
  }

  loadPremiumData(): void {
    this.dataService.getPremiumJson().subscribe(data => {
      this.premiumJson = data.premiumJson;
      console.log('Premium JSON:', this.premiumJson);
      // Ensure premiumJson is an array
      if (!Array.isArray(this.premiumJson)) {
        console.error('Error: premiumJson is not an array.');
        return;
      }
      this.loadProductData(); // Load product data after premium data is loaded
    });
  }

  updateProductPrices(): void {
    if (this.productData && this.premiumJson) {
      this.productData.forEach(product => {
        const premium = this.premiumJson.find(p => p.name === product.name);
        if (premium) {
          product.price = {
            c: premium.C,
            s: premium.S,
            k: premium.K
          };
        }
      });
    }
  }

  addProduct(): void {
    const newProduct = { ...this.addProductForm.value, id: this.generateId() }; // Generate unique id for new product
    this.productData.push(newProduct);
    this.saveProductData();
    this.updateProductPrices(); 
    this.toggleAddProductForm();
    this.snackBar.open('Product added successfully', 'Close', { duration: 3000 });
    console.log('Updated product data:', this.productData);
  }

  updateProduct(): void {
    const updatedProduct = this.editProductForm.value;
    const index = this.productData.findIndex(product => product.id === updatedProduct.id);
    if (index !== -1) {
      this.productData[index] = { ...updatedProduct }; // Use spread operator to clone the updated product
      this.saveProductData();
      this.updateProductPrices(); 
      this.snackBar.open('Product updated successfully', 'Close', { duration: 3000 });
    } else {
      console.error('Product not found for update');
    }
    this.toggleEditProductForm();
    this.cdr.detectChanges();
  }

  saveProductData(): void {
    localStorage.setItem('angularProducts', JSON.stringify(this.productData));
  }

  toggleAddProductForm(): void {
    this.showAddProductForm = !this.showAddProductForm;
  }

  toggleEditProductForm(): void {
    this.showEditProductForm = !this.showEditProductForm;
  }

  editProduct(index: number): void {
    this.selectedProduct = { ...this.productData[index] }; // Clone the selected product to avoid direct mutation
    this.editProductForm.setValue({
      id: this.selectedProduct.id,
      organization: this.selectedProduct.organization,
      name: this.selectedProduct.name,
      type: this.selectedProduct.type,
      tag: this.selectedProduct.tag,
      description: this.selectedProduct.description,
      config: this.selectedProduct.config // Include the Config field
    });
    this.toggleEditProductForm();
  }

  closeEditProductForm(): void {
    this.showEditProductForm = false;
  }

  closeAddProductForm(): void {
    this.showAddProductForm = false;
    this.addProductForm.reset();
  }

  openAddProductForm(): void {
    this.showAddProductForm = true;
  }

  emptyProductsArray(): void {
    this.productData = [];
    this.saveProductData();
  }

  removeProduct(index: number): void {
    if (window.confirm('Are you sure you want to delete this product?')) {
      this.productData.splice(index, 1);
      this.saveProductData();
      this.snackBar.open('Product deleted successfully', 'Close', { duration: 3000 });
    }
  }

  canPerformAction(action: string): boolean {
    const userRole = localStorage.getItem('userRole');
    const privileges = JSON.parse(localStorage.getItem('privileges')) || {};
    for (const organization in privileges) {
      const organizationPrivileges = privileges[organization];
      if (organizationPrivileges.hasOwnProperty(userRole)) {
        const rolePrivileges = organizationPrivileges[userRole];
        if (rolePrivileges.hasOwnProperty('productPrivileges') && rolePrivileges.productPrivileges.hasOwnProperty(action) && rolePrivileges.productPrivileges[action] === true) {
          return true;
        }
      }
    }
    return false;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9); // Generate a simple unique id
  }
}
