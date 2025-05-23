import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PdfViewerPagePage } from './pdf-viewer-page.page';

describe('PdfViewerPagePage', () => {
  let component: PdfViewerPagePage;
  let fixture: ComponentFixture<PdfViewerPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfViewerPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
