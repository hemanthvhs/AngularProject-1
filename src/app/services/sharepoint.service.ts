import {Injectable} from '@angular/core'
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Response } from '@angular/http';
import { map } from 'rxjs/operators';



@Injectable({
  providedIn :'root'
})
export class SharepointService {

  baseUrl = "http://regsharedev.bdx.com/sites/vigilance/metro/"

  constructor(private http : HttpClient) { }

  getCurrentUserName():Observable<any> {
    console.log("Request from GetCuurentUser")
      return this.http.get<any>(this.baseUrl+"_api/web/currentUser")
      .pipe(map((response : Response) => {
        const data = response['d'].Title
        //console.log(data)
        return data
        })
      )
    }

    getColours(): Observable<Object> {
      return this.http.get<Object>(this.baseUrl+"_api/web/lists/getbytitle('Colour')/items")
      .pipe (map ((response : Response) => {
          const data = response['d'].results
          .map((key : number) => {
            return key['Title']
          })        
            return data
        })
      )
    }

    getReasonforRequest(): Observable<Object> {
      return this.http.get<Object>(this.baseUrl+"_api/web/lists/getbytitle('Reason For Request')/items")
      .pipe (map ((response : Response) => {
          const data = response['d'].results
          .map((key : number) => {
            return key['Title']
          })        
            return data
        })
      )
    }

    getProductDescription(): Observable<Object> {
      return this.http.get<Object>(this.baseUrl+ "_api/web/lists/getbytitle('Product Description')/items")
      .pipe(map ((response : Response) => {
        const data = response['d'].results
        .map((key : number) => {
          return key['Title']
        })
        return data
      })
      )
    }

    getTypeofReport(): Observable<Object> {
      return this.http.get<Object>(this.baseUrl+ "_api/web/lists/getbytitle('Type of Report')/items")
      .pipe(map ((response : Response) => {
        const data = response['d'].results
        .map((key : number) => {
          return key['Title']
        })
        return data
      })
      )
    }

    postItemDatatoSPList(itemData): Observable<Object> {
      console.log("Inside postItem")
       var body = {
          "__metadata"                        : {'type' : 'SP.Data.Metrology_x0020_ListListItem'},
          "Title"                             : itemData.requestno,
          "Metrology_x0020_Request_x0020_Nu"  : itemData.requestno,
          "Part_x0020_Description"            : itemData.partdesc,
          "Reason_x0020_for_x0020_RequestId"  : itemData.reasonforreq,
          "Part_x0020_SAP_x0020_No_x002e_"    : itemData.partsapno,
          "BD_x0020_PO_x0020_Number"          : itemData.bdpono,
          "Vendors_x0020_Name"                : itemData.vendorname,
          "Vendors_x0020_Batch_x0020_Number"  : itemData.vendorbatchno,
          "Associated_x0020_Tool_x0020_Numb"  : itemData.associatedtoolno,
          "Product_x0020_DescriptionId"       : itemData.productdesc,
          "ColourId"                          : itemData.colour,
          "Drawing_x0020_Number"              : itemData.drawingno,
          "Drawing_x0020_Revision"            : itemData.drawingrevision,
          "Steel_x0020_Specification_x0020_"  : itemData.steelspec,
          "Description"                       : itemData.measurementdesc,
          "Qty_x0020_parts_x0020_to_x0020_b"  : itemData.qtypartsmeasured,
          "Qty_x0020_of_x0020_parts_x0020_i"  : itemData.qtypartsbatch,
          "Qty_x0020_of_x0020_features_x002"  : itemData.qtyfeaturesmeasured,
          "Type_x0020_of_x0020_reportId"      : itemData.typeofreport,
          "ID_x0020_of_x0020_parts_x0020_if"  : itemData.idofparts,
          "Request_x0020_Raised_x0020_By"     : itemData.reqraisedby,
          "Date_x0020_Request_x0020_Made"     : itemData.requestdate,
          "Attachments"                       : itemData.selectedfile
         
       }
       return this.http.post(this.baseUrl+"_api/web/lists/getbytitle('Metrology List')/items",body)
      }

    

}