import { Component, OnInit } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormGroup, FormBuilder} from '@angular/forms';
import { AddressService } from '../service/address.service';
import { Address } from '../class/address';
@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {
  private loading: boolean = false;
  private selectedAddress: Address = null;
  private addresses: Address[] = [];
  private addressForm: FormGroup
  private submitted: boolean = false;
  constructor(private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private addressService: AddressService) {
    this.addressForm = this.formBuilder.group({
      fullname:'',
      address:'',
      phone:''
    });
  }

  get f(){return this.addressForm.controls;}
  open(content){
    this.modalService.open(content);
  }
  onSubmit(value:any){
    this.submitted = true;
    if(this.addressForm.valid){
      this.submitted = false;
      this.addAddress(value.fullname, value.address, value.phone);
      this.addressForm.reset();
      this.modalService.dismissAll();
    }
    else{
      return false;
    }
  }
  addAddress(fullname :string, address :string, phone: number){
    this.addressService.add(fullname, address, phone).subscribe(res=>{
      this.getAddresses();
    });
  }
  getAddresses(){
    this.addressService.get().subscribe(res=>{
      this.addresses = JSON.parse(JSON.stringify(res.body));
      this.getSelectedAddress(this.addresses);
    });
  }
  getSelectedAddress(addresses:Address[]){
    this.selectedAddress = null;
    let length: number = addresses.length;
    for(let i = 0 ; i < length ; i ++){
      if(addresses[i].selected === 1){
        this.selectedAddress = addresses[i];
        this.addresses.splice(i,1);
        break;
      }
    }
  }
  selectAddress(id: number){
    this.loading = true;
    this.addressService.selectNewSelectedAddress(id).subscribe(res=>{
      this.getAddresses();
      this.loading = false;
    })
  }
  deleteAddress(id: number){
    this.addressService.delete(id).subscribe(res=>{
      this.getAddresses();
    });
  }
  ngOnInit() {
    this.getAddresses();
  }

}
