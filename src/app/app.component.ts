import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharepointService } from './services/sharepoint.service';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {SubSink} from './sub-sink';
import { ItemDataModel } from './shared/models/item-data';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  subscriptions       = new SubSink()
  itemData            = new ItemDataModel()
  date                = new Date()
  metrologyForm       : FormGroup
  currentUserName     : string
  colour$             : Observable<any>
  reasonforRequest$   : Observable<any>
  productDescription$ : Observable<any>
  typeofReport$       : Observable<any>
  selectedFile        : {fileName : string , fileData : File}[] = []




constructor(private sharepointService : SharepointService,
            private formBuilder : FormBuilder) {}
  
ngOnInit() {

  

 this.metrologyForm = this.formBuilder.group({
  requestno           :[{value: '', disabled :'true'},[Validators.required]],
  partdesc            :['',Validators.required], 
  reasonforreq        :['',Validators.required],
  partsapno           :['',Validators.required],
  bdpono              :['',Validators.required],
  vendorname          :['',Validators.required],
  vendorbatchno       :['',Validators.required],
  associatedtoolno    :['',Validators.required],
  productdesc         :['',Validators.required],
  colour              :['',Validators.required],
  drawingno           :['',Validators.required],
  drawingrevision     :['',Validators.required],
  attachments         :[''],
  steelspec           :['',Validators.required],
  measurementdesc     :['',Validators.required],
  qtypartsmeasured    :['',Validators.required],
  qtypartsbatch       :['',Validators.required],
  qtyfeaturesmeasured :['',Validators.required],
  typeofreport        :['',Validators.required],
  idofparts           :['',Validators.required],
  reqraisedby         :[{value : '',disabled : 'true'}],
  requestdate         :[{value : '',disabled : 'true'},Validators.required],
    
 })

 this.subscriptions.add(this.sharepointService.getCurrentUserName()
 .subscribe( (userName : string) => {
   this.currentUserName = userName
   this.metrologyForm.get('reqraisedby').patchValue(this.currentUserName)
   this.metrologyForm.get('requestno').patchValue(this.generateRequestNo())
 }))

 this.colour$             = this.sharepointService.getColours()
 this.reasonforRequest$   = this.sharepointService.getReasonforRequest()
 this.productDescription$ = this.sharepointService.getProductDescription()
 this.typeofReport$       = this.sharepointService.getTypeofReport()

 this.subscriptions.add(this.metrologyForm.valueChanges
 .subscribe( (data : any) => this.logValidationMessagestoformErrors(this.metrologyForm)))



}  // End of ngOnInit

generateRequestNo() { 
  let year = this.date.getFullYear().toString().substring(2)
  let  requestno = "EURE" + "-" + year + this.currentUserName.substr(0,1) 
                  + this.currentUserName.substr(this.currentUserName.lastIndexOf(' ')+1,1) 
                  + Math.floor(Math.random() * 11);
  return requestno
}

validationMessages = {
  requestno           : {'required' : 'Request No is required'},
  partdesc            : {'required' : 'Part Description is required'}, 
  reasonforreq        : {'required' : 'Reason for Request is required'},
  partsapno           : {'required' : 'Part SAP Number is required'},
  bdpono              : {'required' : 'BD PO Number is required'},
  vendorname          : {'required' : 'Vendor Name is required'},
  vendorbatchno       : {'required' : 'Vendor Batch Number is required'},
  associatedtoolno    : {'required' : 'Associated Tool Number is required'},
  productdesc         : {'required' : 'Product Description is required'},
  colour              : {'required' : 'Colour is required'},
  drawingno           : {'required' : 'Drawing Number is required'},
  drawingrevision     : {'required' : 'Drawing Revision is required'},
  steelspec           : {'required' : 'Steel Specification is required'},
  measurementdesc     : {'required' : 'Description of Measurement is required'},
  qtypartsmeasured    : {'required' : 'Qty Parts to be Measured is required'},
  qtypartsbatch       : {'required' : 'Qty Parts of Batch is required'},
  qtyfeaturesmeasured : {'required' : 'Qty of Features to be Measured is required'},
  typeofreport        : {'required' : 'Type of Report is required'},
  idofparts           : {'required' : 'ID of parts is required'},
  requestdate         : {'required' : 'Request Date is required'},
}

formErrors = {
  requestno           :'',
  partdesc            :'', 
  reasonforreq        :'',
  partsapno           :'',
  bdpono              :'',
  vendorname          :'',
  vendorbatchno       :'',
  associatedtoolno    :'',
  productdesc         :'',
  colour              :'',
  drawingno           :'',
  drawingrevision     :'',
  steelspec           :'',
  measurementdesc     :'',
  qtypartsmeasured    :'',
  qtypartsbatch       :'',
  qtyfeaturesmeasured :'',
  typeofreport        :'',
  idofparts           :'',
  requestdate         :'',
}

logValidationMessagestoformErrors(group: FormGroup) {
  Object.keys(group.controls).forEach((key: string) => {
    const abstractControl = group.get(key);
    this.formErrors[key] = '';
    if (!abstractControl.valid && (abstractControl.touched || abstractControl.dirty)) {
      const messages = this.validationMessages[key]
      for (const errorkey in abstractControl.errors) {
        this.formErrors[key] += messages[errorkey] + ''
      }
    }
 })
}

onFileSelected(event : any) {

  Object.keys(event.target.files)
  .forEach( (key) => {
    const file : File = event.target.files[key]
    this.selectedFile.push({'fileName' : file.name,'fileData' : file})
  })
}

removeSelectedFile(index) {
  this.selectedFile.splice(index)
}

formatDate(date : Date) {
   let month = '' + (date.getMonth() + 1)
   let day   = '' + (date.getDate())
   let year  = date.getFullYear()

   if(month.length < 2) month = '0' + month
   if(day.length   < 2) day   = '0' + day
   
   return [year,month,day].join('-')

}

onSubmit() {

  if(!this.metrologyForm.valid) {

      this.itemData.selectedfile = this.selectedFile
      .map((key) => {
        return key.fileData
      })

      this.metrologyForm.get('requestdate').patchValue(this.formatDate(this.date))

      Object.keys(this.metrologyForm.controls).forEach( (key : string) => {
        const abstractControlValue = this.metrologyForm.get(key).value
        this.itemData[key] = abstractControlValue     
      })

      this.subscriptions.add(
        this.sharepointService.postItemDatatoSPList(this.itemData).subscribe())
  }
}



ngOnDestroy() {
  this.subscriptions.unsubscribe()
}



}  // End of App Component  
