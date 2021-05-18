import { LightningElement, wire, api, track } from 'lwc';
import getLeadsListWire from "@salesforce/apex/LeadsController.getLeadsListWire";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';
import TITLE_FIELD from '@salesforce/schema/Lead.Title';
import PHONE_FIELD from '@salesforce/schema/Lead.Phone';
import ID_FIELD from '@salesforce/schema/Lead.Id';

const COLUMNS_LEADS = [
    { label: 'Name', fieldName: 'IdName', type: 'url', typeAttributes: { label: { fieldName: "Name" } } },
    { label: 'Title', fieldName: 'Title', editable: true },
    { label: 'Phone', fieldName: 'Phone', type: 'phone', editable: true },
];
export default class LEADStable extends LightningElement {
    columns = COLUMNS_LEADS;
    @track data;
    @track draftValues = [];
    error;

    @wire(getLeadsListWire)
    leads(result) {
        this.refreshTable = result;
        if (result.data) {
            this.data = result.data.map(this.leadName);
            this.error = undefined;

        } else if (result.error) {
            this.error = result.error;
            this.data = undefined;
        }
    }
    leadName(row) {
        let leads = {
            ...row,
            IdName: `/${row.Id}`
        };
        return leads;
    }

    handleCellChange(event) {

        const fields = {};
        if (event.detail.draftValues[0]?.Title != undefined) {

            fields[TITLE_FIELD.fieldApiName] = event.detail.draftValues[0].Title;
        } else {

            fields[PHONE_FIELD.fieldApiName] = event.detail.draftValues[0].Phone;
        }
        fields[ID_FIELD.fieldApiName] = event.detail.draftValues[0].Id;

        console.log('fields==>   ', fields);
        const recordInput = { fields };
        console.log('recordInput===> ', recordInput);

        updateRecord(recordInput)

            .then(result => {
                //  console.log('result==>', updateRecord)
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Record updated',
                        variant: 'success'
                    })
                );
                // this.draftValues = [];
                return refreshApex(this.leads);
            })

            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error updating record',
                        message: error.message,
                        variant: 'error'
                    })
                );
            });
    }
}