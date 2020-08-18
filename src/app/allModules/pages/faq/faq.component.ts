import { Component, OnInit, OnDestroy, ViewEncapsulation } from "@angular/core";
import { Subject } from "rxjs";
import { FormControl, FormGroup, FormBuilder } from "@angular/forms";
import { takeUntil, debounceTime, distinctUntilChanged } from "rxjs/operators";
import { FuseUtils } from "@fuse/utils";
import { FaqService } from "app/services/faq.service";
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: "app-faq",
    templateUrl: "./faq.component.html",
    styleUrls: ["./faq.component.scss"],
    encapsulation: ViewEncapsulation.None
})
export class FaqComponent implements OnInit {
    files: File;
    url: any;
    var_file: File;
    file: File;
    url1: URL
    objectURL: URL
    uploadForm: FormGroup;
    variable_name: SafeUrl;
    fileBlob: any;
    b64Blob: any;
    url_1: SafeUrl;
    constructor(private formBuilder: FormBuilder, private httpClient: HttpClient, private sanitizer: DomSanitizer) { }

    ngOnInit(): void {
        this.uploadForm = this.formBuilder.group({
            profile: ['']
        });
    }
    onSelect(event): void {

        console.log(event);

        this.files = event.addedFiles[0];
        console.log("hi" + this.files);
        this.changeFile(this.files).then((base64: string): any => {
            console.log(base64);
            this.url = base64;
            this.url_1 = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);

        });
    }
    onRemove(event): void {
        console.log(event);
    }
    changeFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
    onFileSelect(event): void {
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
    onSubmit(): void {
        const formData = new FormData();
        formData.append('file', this.uploadForm.get('profile').value);
    }
}