import { Component } from '@angular/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { PDFDocument, rgb } from 'pdf-lib';
import { Capacitor } from '@capacitor/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone:false,
  providers: [FileOpener]
})
export class HomePage {
  files: string[] = [];
  appFolder = '/storage/emulated/0/Android/data/io.ionic.starter/files/';

  

  constructor(private fileOpener: FileOpener, private router: Router,private http: HttpClient) {}

  async ionViewWillEnter() {
    
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (!isLoggedIn) {
      this.router.navigate(['/login-page']);  
    } else {
      await this.requestPermissions();
      await this.listFiles();
    }
  }

  async requestPermissions() {
    if (Capacitor.isNativePlatform()) {
      const permissions = await Filesystem.requestPermissions();
      console.log('Filesystem Permissions:', permissions);
    }
  }

  async ionViewDidEnter() {
    await this.requestPermissions();
    await this.listFiles();
  }


  

  async listFiles() {
    try {
      const fileEntries = await Filesystem.readdir({
        path: '', 
        directory: Directory.External
      });

      this.files = fileEntries.files
        .filter(file => file.name.endsWith('.pdf'))
        .map(file => file.name);

      console.log('PDF Files:', this.files);
    } catch (error: any) {
      console.error('Error reading files:', error.message || error);
    }
  }

  async signPdf(filename: string) {
    const filePath = filename;
    console.log('Signing file:', filePath);
  
    try {
      // Read the PDF as a Base64 string (default encoding)
      const readFile = await Filesystem.readFile({
        path: filePath,
        directory: Directory.External
      });

      // Ensure it's a string before decoding
      if (typeof readFile.data !== 'string') {
        throw new Error('File data is not a valid string.');
      }

      // Convert Base64 to Uint8Array
      const pdfBytes = this.base64ToUint8Array(readFile.data);

      // Load and modify the PDF
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];

      firstPage.drawText('Signed by XYZ', {
        x: 40,
        y: 70,
        size: 12,
        color: rgb(1, 0, 0)
      });

      // Save modified PDF
      const modifiedPdfBytes = await pdfDoc.save();
      const modifiedPdfBase64 = this.uint8ArrayToBase64(modifiedPdfBytes);

      // Overwrite the original PDF
      await Filesystem.writeFile({
        path: filePath,
        data: modifiedPdfBase64,
        directory: Directory.External
      });

      console.log('PDF signed successfully!');
      alert('PDF signed successfully!');
    
      // NEW: Send file name to PC
      this.sendSignedFilenameToPC(filename);

      

    } catch (error: any) {
      console.error('Error signing PDF:', error.message || error);
      alert(`Error signing PDF: ${error.message || error}`);
    }
  }


  sendSignedFilenameToPC(filename: string) {
    const jsonPayload = {
      type: 'file_signed',
      data: { filename }
    };
  
    const jsonString = JSON.stringify(jsonPayload).replace(/"/g, '\\"');
    const adbCommand = `adb shell "log -t EVENT_TRIGGER \\"${jsonString}\\""`;
  
    console.log('Sending signed file JSON to PC:', adbCommand);
  }
  

  // sendSignedFilenameToPC(filename: string) {
  //   const adbCommand = `adb shell "log -t MyApp SIGNED_FILE:${filename}"`;
  //   console.log('Sending signed filename to PC:', adbCommand);
  // }

  // async openFile(filename: string) {
  //   const filePath = `${this.appFolder}${filename}`;
  //   console.log('Opening file:', filePath);

  //   try {
  //     await this.fileOpener.open(filePath, this.getMimeType(filename));
  //     console.log('File opened successfully');
  //   } catch (error: any) {
  //     console.error('Error opening file:', error.message || error);
  //     alert(`Error opening file: ${error.message || error}`);
  //   }
  // }

  // getMimeType(fileName: string): string {
  //   const extension = fileName.split('.').pop() || '';
  //   const mimeTypes: { [key: string]: string } = {
  //     'pdf': 'application/pdf'
  //   };
  //   return mimeTypes[extension] || 'application/octet-stream';
  // }
  async openFile(filename: string) {
  const filePath = filename;

  try {
    const file = await Filesystem.readFile({
      path: filePath,
      directory: Directory.External
    });

    if (typeof file.data !== 'string') {
      throw new Error('Invalid file data');
    }

    // Navigate to the viewer page and pass Base64 in query param
    this.router.navigateByUrl('/pdf-viewer-page', {
  state: { pdf: file.data }
});


  } catch (error: any) {
    console.error('Error opening file:', error.message || error);
    alert(`Error opening file: ${error.message || error}`);
  }
}
// async openFile(filename: string) {
//   const fileUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

//   this.router.navigate(['/pdf-viewer-page'], {
//     queryParams: {
//       url: fileUrl
//     }
//   });
// }





  async refreshFiles(event: any) {
    await this.listFiles();
    event.target.complete();
  }

  // Convert Base64 string to Uint8Array
  base64ToUint8Array(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  // Convert Uint8Array to Base64 string
  uint8ArrayToBase64(bytes: Uint8Array): string {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
}
