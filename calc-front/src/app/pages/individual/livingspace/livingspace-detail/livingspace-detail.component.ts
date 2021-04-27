import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/utils/services/auth/auth.service';
import { BackService } from 'src/app/utils/services/back/back.service';
import { LangService } from 'src/app/utils/services/language/language.service';
import { finalize } from 'rxjs/operators';
import { NotificationService } from 'src/app/utils/services/notification/notification.service';
import { User } from 'src/static-data/contents';
import icAdd from '@iconify/icons-ic/add';
import icRemove from '@iconify/icons-ic/remove';
import icInfo from '@iconify/icons-ic/twotone-info';


@Component({
  selector: 'app-livingspace-detail',
  templateUrl: './livingspace-detail.component.html',
  styleUrls: ['./livingspace-detail.component.scss']
})
export class LivingspaceDetailComponent implements OnInit {
  @Input() user: User;
  icAdd = icAdd;
  icRemove = icRemove;
  constructor(
    public objAuth: AuthService,
    public objBack: BackService,
    public objLang: LangService,
    public objNotify: NotificationService

  ) { }
  public isProcessing: boolean;
  public isResult: boolean;
  public isCalculating: boolean;
  public inputCount: number;
  public floor_1 = [
    {name: 'living_room', title: 'Living room#', room: true, single: true, val: null},
    {name: 'dinning_room', title: 'Dinning room#', room: true, single: true, val: null},
    {name: 'kitchen', title: 'Kitchen#', room: true, single: true, val: null},
    {name: 'hailways', title: 'Hailways#', room: true, single: true, val: null},
    {name: 'bathroom', title: 'Bathroom#', room: true, single: false, val: [null]},
    {name: 'lavatory', title: 'Lavatory#', room: true, single: false, val: [null]},
    {name: 'outer_room', title: 'Outer room#', room: true, single: true, val: null},
    {name: 'wardrobe', title: 'Wardrobe#', room: true, single: true, val: null},
    {name: 'storeroom', title: 'Storeroom#', room: true, single: true, val: null},
    {name: 'larder', title: 'Larder#', room: true, single: true, val: null},
    {name: 'technical_room', title: 'Technical room', room: false, single: true, val: null},
    {name: 'other_rooms', title: 'Other rooms', room: false, single: true, val: null},
    {name: 'additional_room', title: 'Additional room#', room: true, single: false, val: [null]}
  ];
  public floor_other = [
    {name: 'bedroom', title: 'Bedroom#', room: true, single: false, val: [null]},
    {name: 'children', title: "Children's room#", room: true, single: false, val: [null]},
    {name: 'bathroom', title: 'Bathroom#', room: true, single: false, val: [null]},
    {name: 'lavatory', title: 'Lavatory#', room: true, single: false, val: [null]},
    {name: 'hailways', title: 'Hailways#', room: true, single: true, val: null},
    {name: 'closet', title: 'Closet#', room: true, single: false, val: [null]},
    {name: 'storeroom', title: 'Storeroom#', room: true, single: false, val: [null]},
    {name: 'technical_room', title: 'Technical room', room: false, single: false, val: [null]},
    {name: 'other_rooms', title: 'Other rooms', room: false, single: false, val: [null]}
  ];
  public livingspaceInputs = [];
  public floor_sums = [null];
  public floor_sums_total = 0;
  public floor_rooms = 0;

  ngOnInit() {
    this.livingspaceInputs.push(this.floor_1);
    this.initData();
  }
  addRoom(floor_no, room_no){
    this.livingspaceInputs[floor_no][room_no].val.push(null);
  }
  reduceRoom(floor_no, room_no){
    this.livingspaceInputs[floor_no][room_no].val.pop();
  }
  trackByFn(index: any, item: any) {
    return index;
 }  
  addFloor(){
    this.livingspaceInputs.push([
      {name: 'bedroom', title: 'Bedroom#', room: true, single: false, val: [null]},
      {name: 'children', title: "Children's room#", room: true, single: false, val: [null]},
      {name: 'bathroom', title: 'Bathroom#', room: true, single: false, val: [null]},
      {name: 'lavatory', title: 'Lavatory#', room: true, single: false, val: [null]},
      {name: 'hailways', title: 'Hailways#', room: true, single: true, val: null},
      {name: 'closet', title: 'Closet#', room: true, single: false, val: [null]},
      {name: 'storeroom', title: 'Storeroom#', room: true, single: false, val: [null]},
      {name: 'technical_room', title: 'Technical room', room: false, single: false, val: [null]},
      {name: 'other_rooms', title: 'Other rooms', room: false, single: false, val: [null]}
    ]);
    this.floor_sums.push(null);
  }
  reduceFloor(){
    this.livingspaceInputs.pop();
    this.floor_sums.pop();

  }
  inputChanged(){
    this.calSum();
  }
  calSum(){
    let inputCount = ++this.inputCount;
    setTimeout(() => this.calSumEnabled(inputCount),100);
  }
  async calSumEnabled(inputCount){
    if(inputCount == this.inputCount){
      console.log('calculation is done');
      this.isCalculating = true;
      try {
        this.objBack.calcLivingspace(this.livingspaceInputs)
          .pipe()
          .subscribe((apiResponse) => {
            if(apiResponse.status == 'success'){
              let tempObj = apiResponse;
              this.floor_sums = JSON.parse(tempObj.floor_sums);
              this.floor_sums_total = JSON.parse(tempObj.floor_sums_total);
              this.floor_rooms = JSON.parse(tempObj.floor_rooms);
            }
            this.isResult = true;
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
  async initData(){
    this.inputCount = 0;
    this.isCalculating = true;
    // check and fetch inputs from the db
    let promise2 = new Promise((resolve, reject) => {
      try {
        this.objBack.fetchLivingspace(this.user['id'])
          .pipe(
            finalize(() => {
            }))
          .subscribe((apiResponse) => {
            if(apiResponse.length > 0){
              this.livingspaceInputs = [];
              apiResponse.forEach(floor => {
                this.livingspaceInputs.push(JSON.parse(floor.val));
              });
            }
            resolve('done');
          });
      }
      catch (err) {
        this.objAuth.isProcessing = false;
      }
    });
    let x2 = await promise2;
    this.calSum();
  }
  validateLivingspace(){
    return true;
  }
  async saveInputs(){
    this.objAuth.isProcessing = true;
    this.objAuth.isProcessText = 'Saving';
    if(this.validateLivingspace()){
      let promise1 = new Promise((resolve, reject) => {
        try {
          this.objBack.saveLivingspace(this.user['id'], this.livingspaceInputs)
            .pipe()
            .subscribe((apiResponse) => {
              if(apiResponse.status == 'success'){
                this.objNotify.success('Saved successfully!');
                this.objBack.individualStatus.livingspace = true;
              }
              else if(apiResponse.status == 'error'){
                this.objNotify.success('Failed saving!');
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
