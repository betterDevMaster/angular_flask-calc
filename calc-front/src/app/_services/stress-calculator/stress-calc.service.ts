import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { NewStress } from "src/app/pages/loan-details/index/loan-details.component";
import { environment } from "src/environments/environment";

export class StressCalcRes {
  constructor()
  {
    this.rates = [];
  }
  'id': number;
  'userId': number;  
  'startDate': string;
  'endDate': string;
  'interest': number;
  'rates': number[];
  'high': number;
  'low': number;
  'totalAddition': number;
  'annuity': number;
  'remarks': string;
}

export class StressBasis {
  'remainingsp': number;
  'remaininghorizon': number;
  'lendingrate': number;
  'sp': number;
  'horizon': number;
  'repaymentregular': number;
}


@Injectable()
  export class StressCalculatorService {

    constructor(private http:HttpClient) {}

    getAll(data: NewStress):Observable<StressCalcRes> {
        return this.http.get<StressCalcRes>(`${environment.baseUrl}/v1/individual/individual/stressScenario`,{
          params: new HttpParams()
          .append('startDate',!data.start ? '' : data.start)
          .append('endDate',!data.end ? '' : data.end)
          .append('lendingratestress',!data.interest ? '' : data.interest.toString())
        })
    }
  }