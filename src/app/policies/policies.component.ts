import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from './Data.service';

interface PremiumJsonType {
  premiumJson: {
    name: string;
    C: number;
    S?: number;
    K?: number;
  }[];
}


@Component({
 selector: 'app-policies',
 templateUrl: './policies.component.html',
 styleUrls: ['./policies.component.css']
})
export class PoliciesComponent implements OnInit {
  form: FormGroup;
  isProductSectionVisible = true;
  isSelfSectionVisible = false;
  isFormVisible = false;
  isSpouseSectionVisible = false;
  isDependentsSectionVisible = false;
  orgData: any[] = [];
  productNames: string[] = [];
  branchNames: string[] = [];
  productData: any[] = []; 
  selfData: any[] = []; 
  spouseData: any[] = [];
  dependentsData: any[] = [];
  isDependentFieldsVisible = false;
  angularProducts: any[] = [];
  editMode = false;
  editId: string | null = null;

  constructor(private snackBar: MatSnackBar, private cdr: ChangeDetectorRef, private dataService: DataService) {
    this.form = new FormGroup({
      organization: new FormControl('', { validators: [Validators.required], updateOn: 'change' }),
      productName: new FormControl('', { validators: [Validators.required], updateOn: 'change' }),
      premium: new FormControl('', { validators: [Validators.required], updateOn: 'change' }),
      state: new FormControl('', { validators: [Validators.required], updateOn: 'change' }),
      branch: new FormControl('', { validators: [Validators.required], updateOn: 'change' }),
      name: new FormControl('', { validators: [Validators.required], updateOn: 'change' }),
      mobile: new FormControl('', { validators: [Validators.required], updateOn: 'change' }),
      gender: new FormControl('', { validators: [Validators.required], updateOn: 'change' }),
      cstate: new FormControl('', { validators: [Validators.required], updateOn: 'change' }),
      email: new FormControl('', { validators: [Validators.required, Validators.email], updateOn: 'change' }),
      address: new FormControl('', { validators: [Validators.required], updateOn: 'change' }),
      language: new FormControl('', { validators: [Validators.required], updateOn: 'change' }),
      spouseName: new FormControl('', { validators: [Validators.required], updateOn: 'change' }),
      spouseMobile: new FormControl('', { validators: [Validators.required], updateOn: 'change' }),
      spouseGender: new FormControl('', { validators: [Validators.required], updateOn: 'change' }),
      dependentsName: new FormControl('', { validators: [Validators.required], updateOn: 'change' }),
      dependentsGender: new FormControl('', { validators: [Validators.required], updateOn: 'change' }),
      dependentsRelation: new FormControl('', { validators: [Validators.required], updateOn: 'change' }),
      newDependentsName: new FormControl(''),
      newDependentsGender: new FormControl(''),
      newDependentsRelation: new FormControl('')
    });
  }

  ngOnInit() {
    const orgDataStr = localStorage.getItem('angular17orgs');
    if (orgDataStr) {
      this.orgData = JSON.parse(orgDataStr);
    }
    const angularProductsStr = localStorage.getItem('angularProducts');
    if (angularProductsStr) {
      this.angularProducts = JSON.parse(angularProductsStr);
      this.productNames = this.angularProducts.map(product => product.name);
    } else {
      console.error('No angularProducts found in local storage.');
    }

    const branchDataStr = localStorage.getItem('branchData');
    if (branchDataStr) {
      this.branchNames = JSON.parse(branchDataStr).map(branch => branch.name);
    }
    
    this.form.get('productName').valueChanges.subscribe(productName => {
      this.updatePremium();
    });

    this.form.get('spouseName').valueChanges.subscribe(spouseName => {
      if (spouseName) {
        this.updatePremium();
      } else {
        this.updatePremium();
      }
    });

    this.loadSavedData();
  }

  updatePremium() {
    const productName = this.form.get('productName').value;
    console.log('Selected product name:', productName);
    const product = this.angularProducts.find(p => p.name === productName);
    console.log('Found product:', product);
  
    if (product && product.config) {
      const config = JSON.parse(product.config);
      const premiumJson = config.premiumJson;
      let premium = parseFloat(premiumJson.C) || 0;
  
      if (this.form.get('spouseName').value) {
        premium += parseFloat(premiumJson.S) || 0;
      }
  
      this.dependentsData.forEach(dependent => {
        const relation = dependent.dependentsRelation.toLowerCase();
        if (relation === 'son') {
          premium += parseFloat(premiumJson.A) || 0;
        } else if (relation === 'daughter') {
          premium += parseFloat(premiumJson.D) || 0;
        } else if (relation === 'mother') {
          premium += parseFloat(premiumJson.M) || 0;
        } else if (relation === 'father') {
          premium += parseFloat(premiumJson.F) || 0;
        }
      });
  
      this.form.get('premium').setValue(premium);
    } else {
      this.form.get('premium').setValue(0);
    }
  }

 
 toggleDependentFields() {
   this.isDependentFieldsVisible = !this.isDependentFieldsVisible;
}

 toggleProductSection() {
    this.isProductSectionVisible = true;
    this.isSelfSectionVisible = false;
    this.isSpouseSectionVisible= false;
    this.isDependentsSectionVisible= false;
 }

 toggleSelfSection() {
    this.isSelfSectionVisible = true;
    this.isProductSectionVisible = false;
    this.isSpouseSectionVisible= false;

    this.isDependentsSectionVisible= false;
 }
 toggleSpouseSection() {
   this.isSpouseSectionVisible = true;
   this.isProductSectionVisible = true;
   this.isSelfSectionVisible = true;
   this.isDependentsSectionVisible= false;
    
  }
  toggleDependentSection() {
   this.isDependentsSectionVisible = true; 
   this.isProductSectionVisible = true;
   this.isSelfSectionVisible = true;
   this.isSpouseSectionVisible = false;
 }
  
 onSubmit() {
   console.log('Form Value:', this.form.value);
   console.log('Form Valid:', this.form.valid);
   console.log('Form Errors:', this.form.errors);
  
   if (
      this.form.get('spouseName').value!= '' &&
      this.form.get('spouseMobile').value!= '' &&
      this.form.get('spouseGender').value!= '' ||  this.form.get('spouseName').value === '' && this.form.get('spouseMobile').value === '' && this.form.get('spouseGender').value === '' ) {
      this.saveDataToLocalStorage();
      this.isFormVisible = false;
    this.editMode = false;
    this.editId = null;
    this.form.reset();
      this.loadSavedData();
      this.closeForm();
      
      this.snackBar.open('Data saved successfully', 'Close', {
       
      });
      
      setTimeout(() => {
         location.reload();
       }, 2000);
   } else {
      this.snackBar.open('Please fill out all required fields', 'Close', {
        duration: 3000,
      });
   }
   
  }
  toggleFormVisibility() {
   this.isFormVisible = !this.isFormVisible; 
   if (this.isFormVisible) {
      this.isProductSectionVisible = true; 
      this.isSelfSectionVisible = false; 
      this.isSpouseSectionVisible = false; 
      this.isDependentsSectionVisible= false;
   }
  }
  
 
  openForm(): void {
   this.isFormVisible = true;
}

closeForm(): void {
  this.isFormVisible = false;
  setTimeout(() => {
    location.reload();
  }, 500); // Adjust the delay time as needed
}

generateUniqueId(): string {
   return 'id-' + new Date().getTime() + '-' + Math.floor(Math.random() * 1000);
 }
saveDataToLocalStorage(): void {
   let productDataStr = localStorage.getItem('productData');
   let productData = productDataStr ? JSON.parse(productDataStr) : [];
  

   const newProductData = {
      id: this.generateUniqueId(),
      organization: this.form.get('organization').value || '', 
      productName: this.form.get('productName').value || '', 
      premium: this.form.get('premium').value || '', 
      state: this.form.get('state').value || '', 
      branch: this.form.get('branch').value || '', 
      selfData: { 
        name: this.form.get('name').value || '', 
        mobile: this.form.get('mobile').value || '',
        gender: this.form.get('gender').value || '',
        email: this.form.get('email').value || '', 
        cstate: this.form.get('cstate').value || '',
        address: this.form.get('address').value || '', 
        language: this.form.get('language').value || ''
      },
      spouseData:{
         spouseName:this.form.get('spouseName').value || '',
         spouseMobile:this.form.get('spouseMobile').value || '',
         spouseGender:this.form.get('spouseGender').value || ''
      },
      dependentsData: this.dependentsData  // Save dependentsData array
       };
      
   
       if (Object.values(newProductData).every(value => value !== '')) {
        if (this.editMode) {
          const index = productData.findIndex(product => product.id === this.editId);
          if (index !== -1) {
            productData[index] = newProductData;
          }
        } else {
          productData.push(newProductData);
        }
        localStorage.setItem('productData', JSON.stringify(productData));
        this.snackBar.open('Data saved successfully', 'Close', { duration: 3000 });
        this.form.reset();
        this.editMode = false;
        this.editId = null;
      }
    }
  
  
  loadSavedData(): void {
   const savedProductData = localStorage.getItem('productData');
   if (savedProductData) {
      this.productData = JSON.parse(savedProductData);
     
   } else {
      this.productData = []; 
   }
  }
  addNewDependent() {
    const newDependent = {
      dependentsName: this.form.get('newDependentsName').value || '',
      dependentsGender: this.form.get('newDependentsGender').value || '',
      dependentsRelation: this.form.get('newDependentsRelation').value || ''
    };

    if (Object.values(newDependent).every(value => value !== '')) {
      this.dependentsData.push(newDependent);
      this.updatePremium();

      const index = this.dependentsData.length - 1;
      this.form.addControl('dependentsName' + index, new FormControl(newDependent.dependentsName, Validators.required));
      this.form.addControl('dependentsGender' + index, new FormControl(newDependent.dependentsGender, Validators.required));
      this.form.addControl('dependentsRelation' + index, new FormControl(newDependent.dependentsRelation, Validators.required));

      this.form.get('newDependentsName').reset();
      this.form.get('newDependentsGender').reset();
      this.form.get('newDependentsRelation').reset();
    }
  }



  removeDependent(index: number) {
    this.dependentsData.splice(index, 1);
    this.updatePremium();
  }
deleteRecord(id: string): void {
    this.productData = this.productData.filter(record => record.id !== id);

    localStorage.setItem('productData', JSON.stringify(this.productData));

    this.snackBar.open('Record deleted successfully', 'Close', {
      duration: 3000,
    });

    this.cdr.detectChanges();
  }



  
  editRecord(record: any): void {
    this.editMode = true;
    this.editId = record.id;
    this.isFormVisible = true;
  
    this.form.patchValue({
      organization: record.organization,
      productName: record.productName,
      premium: record.premium,
      state: record.state,
      branch: record.branch,
      name: record.selfData.name,
      mobile: record.selfData.mobile,
      gender: record.selfData.gender,
      email: record.selfData.email,
      cstate: record.selfData.cstate,
      address: record.selfData.address,
      language: record.selfData.language,
      spouseName: record.spouseData.spouseName,
      spouseMobile: record.spouseData.spouseMobile,
      spouseGender: record.spouseData.spouseGender
    });
  
    // Set dependents data
    this.dependentsData = record.dependentsData || [];
  
    // Dynamically add form controls for each dependent
    this.dependentsData.forEach((dependent, index) => {
      this.form.addControl('dependentsName' + index, new FormControl(dependent.dependentsName, Validators.required));
      this.form.addControl('dependentsGender' + index, new FormControl(dependent.dependentsGender, Validators.required));
      this.form.addControl('dependentsRelation' + index, new FormControl(dependent.dependentsRelation, Validators.required));
    });
    this.updatePremium();
  }
  
  
}

