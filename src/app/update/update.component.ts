import { Component, OnInit } from '@angular/core';
import { Subsc } from '../subsc';
import { SubscriptionService } from '../subscription.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {
  subscription:Subsc=new Subsc();
  platforms:any[]=[];
  duration:any[]=[];
  modeOfPayment='';
  userName='';
  id=null;
  validationStock='';
  validationUserName='';
  validationModeOfPayment='';
  validationPrice='';
  validationDuration='';
  validationProductName='';
  validationDelvType='';
  validationEmail='';
  validationPlatform='';

  constructor(private route: ActivatedRoute, private subscService:SubscriptionService, private router: Router,private toster: ToastrService) { }

  ngOnInit(): void {
    if(localStorage.getItem("check")=="yes"){
      this.subscService.getPlatform().subscribe(data=>{
        this.platforms=data.details[0];
      });

      this.subscService.getProductNames().subscribe(data=>{
        this.duration=data.details[0];
      });

      this.id = this.route.snapshot.params['id'];
      this.userName = this.route.snapshot.params['userName'];
      this.modeOfPayment = this.route.snapshot.params['modeOfPayment'];

      this.subscService.getDetailsById(this.id,this.userName,this.modeOfPayment).subscribe(data => {
          this.subscription = data.details[0];
          console.log(this.subscription);
      }, error => console.log(error))

    }else{
      this.router.navigate(['list-subsc'])
    }
  }

  removeValidator(){
    this.validationStock='';
    this.validationUserName='';
    this.validationPlatform='';
    this.validationPrice='';
    this.validationModeOfPayment='';
    this.validationProductName='';
    this.validationDelvType='';
    this.validationEmail='';
    this.validationDuration='';
  
       }
  
     goToProductList() {
        this.router.navigate(['list-subsc']);
      }
  
      onSubmit() {
      this.saveEmployee();
    }
    saveEmployee() {
      this.subscService.updateSubscription(this.subscription) .subscribe(data => {
        console.log(data);
        if(data.message == "Validation Failed"){
          data.details.forEach(element=>{
            const keys=Object.keys(element);
            const key =keys[0];
            const value = element[key];
            if(key == "platform"){
              this.validationDelvType = value;
            }
            else if(key == "productName"){
              this.validationPlatform = value;
            }
            else if(key == "duration"){
              this.validationDuration= value;
            }
            else if(key == "price"){
              this.validationPrice = value;
            }
            else if(key == "modeOfPayment"){
              this.validationModeOfPayment = value;
             }
             else if(key == "name"){
               this.validationUserName = value;
             }
             else if(key == "email"){
              this.validationEmail = value;
            }
          });
  
        }else{
          this.toster.success("Data Added Sucessfully");
        this.goToProductList();
        }
      },
      error => console.log(error));
    }
  
   

}
