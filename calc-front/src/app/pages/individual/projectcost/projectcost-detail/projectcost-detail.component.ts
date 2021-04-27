import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/utils/services/auth/auth.service';
import { BackService } from 'src/app/utils/services/back/back.service';
import { LangService } from 'src/app/utils/services/language/language.service';
import { finalize } from 'rxjs/operators';
import { NotificationService } from 'src/app/utils/services/notification/notification.service';
import { User, AdditionalProject } from 'src/static-data/contents';
import { Location } from '@angular/common';

@Component({
  selector: 'app-projectcost-detail',
  templateUrl: './projectcost-detail.component.html',
  styleUrls: ['./projectcost-detail.component.scss']
})
export class ProjectcostDetailComponent implements OnInit {
  @Input() user: User;
  constructor(
    public objAuth: AuthService,
    public objBack: BackService,
    public objLang: LangService,
    private objNotify: NotificationService,
    private location: Location,
  ) { }
  public isProcessing: boolean;
  public isCalculating: boolean;
  public inputCount: number;
  public additional_data: AdditionalProject;
  public projectHeadings = [
    {name: 'housebuilding', title: 'Housebuilding', costs: null},
    {name: 'basement', title: 'Basement', costs: null},
    {name: 'ground', title: 'Ground(Building area, etc.)', costs: null},
    {name: 'exterior', title: 'Exterior costs#', costs: null},
    {name: 'independent', title: 'Independent', costs: null}
  ];
  public projectHeadingResults = [
    {name: 'exterior', title: 'Exterior costs#', costs: null},
    {name: 'independent', title: 'Independent', costs: null}
  ];
  public projectInputs = {
    housebuilding: [
      {name: 'offered_purchasing', title: 'Offered purchasing price', level: 1, val: null},
      {name: 'painting_hours', title: 'Painting incl. working hours', level: 2, val: null},
      {name: 'floor_assemb', title: 'Floor incl. assembling#', level: 2, val: null},
      {name: 'bathroom_assemb', title: 'Bathroom incl. assembling#', level: 2, val: null},
      {name: 'kitchen', title: 'Kitchen', level: 2, val: null},
      {name: 'other_permanently', title: 'Other permanently installed costs', level: 2, val: null},
      {name: 'other_interior', title: 'Other interior costs#', level: 2, val: null},
      {name: 'turnkey_ready', title: 'Turnkey ready#', level: 1, val: null},
    ],
    basement: [
      {name: 'cellar_additionals', title: 'Cellar/foundation incl. additionals', val: null}
    ],
    ground: [
      {name: 'ground', title: 'Ground(Building area, etc.)'}
    ],
    exterior: [
      {name: 'garage_carport', title: 'Garage/Carport', val: null},
      {name: 'terrace_balcony', title: 'Terrace/balcony', val: null},
      {name: 'roofing', title: 'Roofing(terrace etc.)', val: null},
      {name: 'swimming_pool', title: 'Swimming pool/pond', val: null},
      {name: 'fence', title: 'Fence', val: null},
      {name: 'landscaping', title: 'Landscaping', val: null},
      {name: 'roads_etc', title: 'Roads, paths, paving stones etc', val: null},
      {name: 'other_exterior_costs', title: 'Other exterior costs#', val: null}
    ],
    independent: [
      {name: 'road_charges', title: 'Road/connection charges(1)', val: null},
      {name: 'land_registry', title: 'Land registry', val: null},      
      {name: 'land_bank', title: 'Land registry Bank', val: null},
      {name: 'stamp_duty', title: 'Stamp duty', val: null},
      {name: 'handling_fee', title: 'Handling fee', val: null},
      {name: 'external_etc', title: 'External notary, lawyer etc.', val: null},
      {name: 'survayor', title: 'Survayor', val: null},
      {name: 'other_independent_costs', title: 'Other independent costs#', val: null},
    ]
  };
  public projectOutputs = [
    {name: 'project_sum', title: 'Project costs', val: 0},
    {name: 'fundable_sum', title: 'Fundable costs', val: 0},
  ];
  public type_property = '';
  ngOnInit() {
    this.initData();
  }
  isEnable(){
    if(!this.objBack.individualStatus['basis']){
      this.objNotify.warning('Please analyse potential on Loan data page.');
      this.location.back();
      return false;
    }
    return true;
  }
  async initData(){
    this.inputCount = 0;
    this.isCalculating = true;
    if(this.isEnable()){
      this.isProcessing = true;
      try {
        this.objBack.fetchProjectcost(this.user['id'])
          .pipe(
            finalize(() => {
            }))
          .subscribe((apiResponse) => {
            this.additional_data = apiResponse.additional_data;
            if(apiResponse.project_data.length > 0){
              let project_data = apiResponse.project_data[0];
              this.projectHeadings.forEach(projectHeading => {
                let projectInputsDB = JSON.parse(project_data[projectHeading.name]);
                for(let i=0; i< this.projectInputs[projectHeading.name].length; i++){
                  this.projectInputs[projectHeading.name][i].val = projectInputsDB[i].val;
                }
              });
            }
            this.calSum();          
          });
          this.isProcessing = false;
      }
      catch (err) {
        this.objAuth.isProcessing = false;
      }
    }
      
  }
  changeTurnkey(turnkey){
    let inputCount = ++this.inputCount;
    setTimeout(() => this.changeTurnkeyEnabled(turnkey, inputCount),100); // 100 is millisecond
  }
  async changeTurnkeyEnabled(turnkey, inputCount){
    if(inputCount == this.inputCount){
      try {
        this.objBack.calcProjectcostTurnkey(this.projectInputs, turnkey)
          .pipe()
          .subscribe((apiResponse) => {
            if(apiResponse.status == 'success'){
              // get each project costs
              for(let i=0;i<this.projectHeadings.length;i++){
                this.projectHeadings[i].costs = JSON.parse(apiResponse.project_costs)[i];
              }
              // get total project costs
              for (let projectOutput of this.projectOutputs){
                projectOutput.val = apiResponse[projectOutput.name];
              }
              this.projectInputs.housebuilding[0].val = apiResponse['offered_purchasing'];
              this.isProcessing = false;
            }
          },
          error => {
            console.log('invalid')
            this.objAuth.isProcessing = false;
          });
      }
      catch (err) {
        this.objAuth.isProcessing = false;
      }
    }
  }
  calSum(){ 
    let inputCount = ++this.inputCount;
    setTimeout(() => this.calSumEnabled(inputCount),100); // 100 is millisecond
  }

  async calSumEnabled(inputCount: number){
    if(inputCount == this.inputCount){
      console.log('calculation is done');
      this.isCalculating = true;
      try {
        // this.isProcessing = true;
        this.objBack.calcProjectcost(this.projectInputs)
          .pipe()
          .subscribe((apiResponse) => {
            if(apiResponse.status == 'success'){
              // get each project costs
              for(let i=0;i<this.projectHeadings.length;i++){
                this.projectHeadings[i].costs = JSON.parse(apiResponse.project_costs)[i];
              }
              // get total project costs
              for (let projectOutput of this.projectOutputs){
                projectOutput.val = apiResponse[projectOutput.name];
              }
              let tempObj = apiResponse;
              this.isCalculating = false;
            }
            this.isCalculating = false;
          },
          error => {
            console.log('invalid')
            this.isCalculating = false;
          });
      }
      catch (err) {
        this.isCalculating = false;
      }
    }
  }

  validateProjectcost(){
    return true;
  }
  async saveInputs(){
    this.objAuth.isProcessText = 'Saving';
    this.objAuth.isProcessing = true;
    if(this.validateProjectcost()){
      let promise1 = new Promise((resolve, reject) => {
        try {
          this.objBack.saveProjectcost(this.user['id'], this.projectInputs)
            .pipe()
            .subscribe((apiResponse) => {
              if(apiResponse.status == 'success'){
                this.objNotify.success('Saved successfully!');
                this.objBack.individualStatus.projectcost = true;
              }
              else if(apiResponse.status == 'error'){
                this.objNotify.error('Failed saving!');
              }
              this.objAuth.isProcessing = false;
              resolve('done');
            },
            error => {
              console.log('invalid')
              this.objAuth.isProcessing = false;
            });
        }
        catch (err) {
          this.objAuth.isProcessing = false;
        }
      });
      let x = await promise1;
    }
  }

}
