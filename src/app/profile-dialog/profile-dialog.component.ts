import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.css'],
})
export class ProfileDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public userData: any
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
