import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-card-update',
  templateUrl: './card-update.component.html',
  styleUrls: ['./card-update.component.scss']
})
export class CardUpdateComponent implements OnInit {

  files: File;
  files1: File;

  onSelect(event) {

    console.log(event);

    this.files = event.addedFiles[0];
    console.log("hi" + this.files);
    this.changeFile(this.files).then((base64: string): any => {
      console.log(base64);
      this.url = base64;
      this.url_1 = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);

    });
  }
  onSelect1(event) {

    console.log(event);

    this.files1 = event.addedFiles[0];
    console.log("hi" + this.files1);
    this.changeFile1(this.files1).then((base64: string): any => {
      console.log(base64);
      this.url1 = base64;
      this.url_1_new = this.sanitizer.bypassSecurityTrustResourceUrl(this.url1);

    });
  }
  onRemove(event) {
    console.log(event);
  }
  onRemove1(event) {
    console.log(event);
  }
  url: any;
  var_file: File;
  file: File;
  url1: any;
  objectURL: URL
  uploadForm: FormGroup;
  uploadForm1: FormGroup;
  variable_name: SafeUrl;
  fileBlob: any;
  b64Blob: any;
  url_1: SafeUrl;
  url_1_new: SafeUrl;

  constructor(private formBuilder: FormBuilder, private httpClient: HttpClient, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.uploadForm = this.formBuilder.group({
      profile: ['']
    });
    this.uploadForm1 = this.formBuilder.group({
      profile1: ['']
    });
  }
  changeFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
  changeFile1(file1) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file1);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
  onFileSelect(event) {
    if (event.target.value) {
      const file = event.target.files[0];
      const type = file.type;
      this.changeFile(file).then((base64: string): any => {
        console.log(base64);
        this.url = base64;
        this.url_1 = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
        // this.fileBlob = this.b64Blob([base64], type);
        const blob = new Blob([base64], { type: 'application/octet-stream' });
        console.log(blob);
        const objectURL = URL.createObjectURL(blob);
        console.log(objectURL)
        var url1 = window.URL.createObjectURL(blob);
        // reader.readAsDataURL(file);
        console.log("url1:" + url1);
        // console.log(this.fileBlob)
      });
    } else alert('Nothing')
  }
  onFileSelect1(event) {
    if (event.target.value) {
      const file1 = event.target.files[0];
      const type = file1.type;
      this.changeFile1(file1).then((base64: string): any => {
        console.log(base64);
        this.url = base64;
        this.url_1_new = this.sanitizer.bypassSecurityTrustResourceUrl(this.url1);
        // this.fileBlob = this.b64Blob([base64], type);
        const blob = new Blob([base64], { type: 'application/octet-stream' });
        console.log(blob);
        const objectURL = URL.createObjectURL(blob);
        console.log(objectURL)
        var url1 = window.URL.createObjectURL(blob);
        // reader.readAsDataURL(file);
        console.log("url1:" + url1);
        // console.log(this.fileBlob)
      });
    } else alert('Nothing')
  }
  onSubmit() {
    const formData = new FormData();
    formData.append('file', this.uploadForm.get('profile').value);
  }
  onSubmit1() {
    const formData = new FormData();
    formData.append('file', this.uploadForm1.get('profile1').value);
  }
}
