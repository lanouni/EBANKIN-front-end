import { Component, OnInit } from '@angular/core';
import {Form, FormBuilder, FormGroup} from "@angular/forms";
import {AccountsService} from "../services/accounts.service";
import {catchError, Observable, throwError} from "rxjs";
import {AccountDetails} from "../../model/accounts.model";

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  accountFormGroup!: FormGroup;
  currentPage : number = 0;
  pageSize : number = 5;
  accountObservable! : Observable<AccountDetails>;
  operationFormGroup! : FormGroup;
  errorMessage! :string;

  constructor(private fb:FormBuilder,private accountService: AccountsService) { }

  ngOnInit(): void {
    this.accountFormGroup = this.fb.group({
      accountId : this.fb.control('')
    });
    this.operationFormGroup= this.fb.group({
      operationType : this.fb.control(''),
      amount: this.fb.control(0),
      description : this.fb.control(null),
      accountDestination : this.fb.control(null)
    })
  }

  handleSearchAccount() {
    let accountId : string = this.accountFormGroup.value.accountId;
    this.accountObservable = this.accountService.getAccount(accountId,this.currentPage,this.pageSize).pipe(
      catchError(err => {
        this.errorMessage = err.error.message;
        return throwError(err);
      })
    );
  }

  gotoPage(page: number) {
    this.currentPage = page;
    this.handleSearchAccount();
  }

  handleAccountOperation() {
    let amount : number = this.operationFormGroup.value.amount;
    let description : string = this.operationFormGroup.value.description;
    let accountId : string = this.accountFormGroup.value.accountId;
    let operationType = this.operationFormGroup.value.operationType;
    let accountDestination = this.operationFormGroup.value.accountDestination;
    if (operationType == 'DEBIT'){
      this.accountService.debit(accountId,amount,description).subscribe({
        next : (data)=>{
          alert("success Debit");
          this.handleSearchAccount();
        },
          error : (err)=>{
            console.log(err);

        }
      });
    }
    else if (operationType == 'CREDIT'){
      this.accountService.credit(accountId,amount,description).subscribe({
        next : (data)=>{
          alert("success Credit");
          this.handleSearchAccount();
        },
        error : (err)=>{
          console.log(err);
        }
      });
    }
    else if (operationType == 'TRANSFER'){

      this.accountService.transfer(accountId,accountDestination,amount,description).subscribe({
        next : (data)=>{
          alert("success Transfer");
          this.handleSearchAccount();
        },
        error : (err)=>{
          console.log(err);
        }
      });
    }
  }
}
