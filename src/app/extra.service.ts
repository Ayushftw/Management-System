import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExtraService {
  private orgData: any[] = [];

  constructor() {
    this.fetchOrgData(); // Call the fetchOrgData method in the constructor
  }

  fetchOrgData(): void {
    const orgDataStr = localStorage.getItem('angular17orgs');
    if (orgDataStr) {
      this.orgData = JSON.parse(orgDataStr);
    }
  }

  setOrgData(data: any[]): void {
    this.orgData = data;
  }

  getOrgData(): any[] {
    return this.orgData;
  }

  addOrganization(org: any): void {
    this.orgData.push(org);
    localStorage.setItem('angular17orgs', JSON.stringify(this.orgData));
  }

  updateOrganization(org: any): void {
    const index = this.orgData.findIndex(o => o.id === org.id);
    if (index !== -1) {
      this.orgData[index] = org;
      localStorage.setItem('angular17orgs', JSON.stringify(this.orgData));
    }
  }
}