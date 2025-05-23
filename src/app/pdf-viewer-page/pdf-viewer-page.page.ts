import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pdf-viewer-page',
  templateUrl: './pdf-viewer-page.page.html',
  styleUrls: ['./pdf-viewer-page.page.scss'],
  standalone:false
})
export class PdfViewerPagePage implements OnInit {
  base64Pdf: string | undefined;

  constructor(private router: Router) {}

  ngOnInit() {
    const base64 = history.state?.pdf;
    if (base64) {
      this.base64Pdf = 'data:application/pdf;base64,' + base64;
    } else {
      console.error('No PDF base64 data received.');
    }
  }
}
