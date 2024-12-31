import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { SubscriptionService } from '../subscription.service';
import { User } from '../user';
import { Subsc } from '../subsc';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  user:User[];
  users:User=new User();
  platforms:any[]=[];
  durations:any[]=[];
  selectedSubsc:Subsc;
  loading: boolean = false;
  intervalid:any;
  showDateFields = false;
  searchName='';
  searchproductName='';
  searchPaymentMode='';
  searchPlatform='';
  searchUserName='';
  searchDate='';
  searchStatus='';
  searchId=null;
  searchStartDate='';
  searchEndDate='';
  searchEmail='';
  constructor(private subscService: SubscriptionService,
    private router:Router,private http:HttpClient,private jwtservice:JwtHelperService,private toster: ToastrService) { }

    ngOnInit(): void {
      localStorage.setItem("check","no");
      this.initializeDataTable();
      this.subscService.getPlatform().subscribe(data=>{
        this.platforms=data.details[0];
      });

      this.subscService.getProductNames().subscribe(data=>{
        this.durations=data.details[0];
      })
     this.intervalid= setInterval(()=>{
        if((localStorage.getItem("accesstoken")!=null) && (this.jwtservice.isTokenExpired(localStorage.getItem("accesstoken"))))  {
           alert('Your Session Expired!!please Login Again!!')
           localStorage.removeItem("accesstoken")
          this.router.navigateByUrl('log-in');
        }
      },500)
    }
    ngOnDestroy(){
      clearInterval(this.intervalid);
    }

    initializeDataTable(): void {
      const table = $('#myTable').DataTable({
        serverSide: true,
        processing: false,
        searching:false,
        ordering:false,
        lengthMenu:[5,10,15,20,25],
        ajax: (data: any, callback: any) => {
          this.http.get('http://localhost:2627/sub-scribe/search', {
            params: {
              iDisplayStart:( data.start/data.length).toString(),
              iDisplayLength: data.length.toString(),
             searchParam:JSON.stringify({ userName: this.searchName,
              status:this.searchStatus,
              fromDate:this.searchStartDate,
              toDate:this.searchEndDate,
              duration:this.searchPlatform,
              id:this.searchId,
              userNames:this.searchUserName,
              modeOfPayment:this.searchPaymentMode,
              date:this.searchDate,
              email:this.searchEmail
  
             })
  
            }
           
          }).subscribe((response: any) => {
            console.log(response);
            callback({
              draw: data.draw,
              recordsTotal: response.details[0].iTotalRecords,
              recordsFiltered: response.details[0].iTotalDisplayRecords,
              data: response.details[0].aaData,
            });
          });
        },
        columns: [
          { data:'id' },
          { data: 'userName' },
          { data: 'modeOfPayment' },
          { data: 'name' },
          { data: 'email' },
          {data: 'platform'},
          { data: 'price' },
          { data: 'duration'},
          { data: 'subscribedDate'},
          {data:'endSubscribtion'},
          {
            data: "status",
            // render: function (data) {
            //   if (data === "SUBSCRIBED") {
            //     return '<span style="color: green; font-weight: 500;">';
            //   } else if (data === "UNSUBSCRIBED") {
            //     return '<span style="color: red; font-weight: 500;">';
            //   } else {
            //     return data;
            //   }
            // }
         
          }
        ],
        rowCallback: (row: Node, data: any) => {
          $(row).off('click').on('click', () => {
            if ($(row).hasClass('selected')) {
              $(row).removeClass("selected");
              this.selectedSubsc = null;
            } else {
              $("#myTable tr.selected").removeClass("selected");
   
              $(row).addClass('selected');
              this.selectedSubsc = data; // Set the selected data
            }
            this.selectSubscription(this.selectedSubsc);
          });
        }
        
      })
    };
  
    selectSubscription(subsc: Subsc) {
      this.selectedSubsc = subsc;
      console.log(this.selectedSubsc);
    }

    create(){
      this.router.navigate(['create-subsc']);
    }
  
    update(){
  
      if(this.selectedSubsc==undefined){
        alert('Please select row!!')
      } else if(this.selectedSubsc.status=='UNSUBSCRIBED'){
        this.toster.warning('This Subscription plan is already Unsubscrided');
        this.selectedSubsc===null;
      }else{
        localStorage.setItem("check","yes");
      this.router.navigate(['update-subsc',this.selectedSubsc.id,this.selectedSubsc.userName,this.selectedSubsc.modeOfPayment]);
    }
    }
  
    deleteEmp() {
      if (this.selectedSubsc === undefined) {
        alert('Please select a row !!');
      } else if (this.selectedSubsc.status === 'UNSUBSCRIBED') {
       this.toster.warning('This Subscription plan is already Unsubscrided');
      } else {
        const confirmDelete = window.confirm('Are you sure to unsubscribe this plan..?');
    
        if (confirmDelete) {
          this.subscService.deletesubscription(this.selectedSubsc).subscribe(response => {
            console.log(response);
            $('#myTable').DataTable().ajax.reload();
          }, error => {
            console.error('Error updating status:', error);
          });
        }
      }
    }
    
    onCancel(){
  
      this.searchName='';
      this.searchPaymentMode='';
      this.searchEndDate='';
      this.searchStartDate='';
      this.searchPlatform='';
      this.searchStatus='';
      this.searchPlatform='',
      this.searchId=null,
      this.showDateFields=false;
      this.searchEmail='',
      $('#myTable').DataTable().draw();
    
  
    } 
  
    onEnter(){
      // this.showDateFields=false;
  
      $('#myTable').DataTable().draw();
    }
  
    refresh(){
     
        $('#myTable').DataTable().draw();
    }
    logOut() {
      this.loading = true; // Set loading to true
    
      // Simulate a delay for the loading screen
      setTimeout(() => {
        localStorage.removeItem("accesstoken");
        this.router.navigate(['log-in']);
         //this.toster.success("LogOut Successful");
        this.loading = false; // Reset loading state after delay
      }, 1000); // Adjust the delay time as needed (2000 ms = 2 seconds)
    }
    toggleDropDown() {
      this.showDateFields = !this.showDateFields;
    }
    onChange(){
  
    }

}
