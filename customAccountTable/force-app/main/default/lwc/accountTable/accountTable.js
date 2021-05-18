import { LightningElement, track, wire } from 'lwc';
import {refreshApex} from '@salesforce/apex';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import deleteAccount from '@salesforce/apex/AccountController.deleteAccount';
//import { deleteRecord } from 'lightning/uiRecordApi';
// import { updateRecord } from 'lightning/uiRecordApi';
// import NAME_FIELD from '@salesforce/schema/Account.Name';
// import RATING_FIELD from '@salesforce/schema/Account.Rating';
// import ID_FIELD from '@salesforce/schema/Account.Id';
import getAccountListWire from '@salesforce/apex/AccountController.getAccountListWire';

export default class AccountTable extends LightningElement {
    @track data;
    error;
    // @track draftValues = [];
    @track refreshTable;
    @wire(getAccountListWire)
    
    acconts(result) {
        this.refreshTable = result;
        const {data, error} = result;
        if (data) {
            this.data = data;
            this.error = undefined;

        } else if (error) {
            this.error = error;
            this.data = undefined;
        }
    }
    handleRowAction(event) {

        // let buttonName = event.detail.action.name;
        // console.log('buttonName ====> ' + buttonName);
        let row = event.detail.row;
         console.log('row ====> ' + row);
        // switch (buttonName) {
        //     case 'delete':
        //         this.deleteRow(row);
        //         break;
        // }
    }
    
    handleDeleteRow(event) {

        let row = event.detail.id;
       console.log('row ====> ' + row);
        // currentRecord = acc.id;
        // window.console.log('currentRecord ====> ', currentRecord);
        //window.console.log('Error ====> '+error);
        deleteAccount({accountIds: currentRecord})
        .then(result => {
           
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success!!!',
                message: ' Account deleted.',
                variant: 'success'
            }),);

             return refreshApex(this.refreshTable);

        })
        .catch(error => {
            window.console.log('Error ====> '+error);
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error!!', 
                message: error.message, 
                variant: 'error'
            }),);
        });
    }
    
    // //updata Accounts
    // handleCellChange(event) {
    //     const fields = {};
    //     if(event.detail.draftValues[0]?.Rating){
    //     this.openCombox = rtue;
    //     }

    //     fields[ID_FIELD.fieldApiName] = event.detail.draftValues[0].Id;
    //     fields[NAME_FIELD.fieldApiName] = event.detail.draftValues[0].Name;
    //     //fields[RATING_FIELD.fieldApiName] = event.detail.draftValues[0].Rating;
    //     const recordInput = {fields};

    //     updateRecord(recordInput)
    //     .then(() => {
    //         this.dispatchEvent(
    //             new ShowToastEvent({
    //                 title: 'Success',
    //                 message: 'Accounts updated',
    //                 variant: 'success'
    //             })
    //         );
    //         return refreshApex(this.refreshTable);
    //     })
    //     .catch(error => {
    //         this.dispatchEvent(
    //             new ShowToastEvent({
    //                 title: 'Error updating or reloading record',
    //                 message: error.body.message,
    //                 variant: 'error'
    //             })
    //         );
    //     });
    // }

}