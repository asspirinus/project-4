import { LightningElement, track, api } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import deleteContact from "@salesforce/apex/ContactController.deleteContact";
export default class ContactDel extends LightningElement {

    @track DeleteContactModal = false;
    @api currentRow;
    @track currentRecord ;
    //Open modal box
    @api deleteRow() {
        this.DeleteContactModal = true;

        }

    //closing modal box
    closeModal() {
        this.DeleteContactModal = false;
               }
    
    //delete row
    deleteContactRow(){
       // console.log('deleteContactRow  '+ event.detal)
       //this.currentRecord = this.currentRow;
      console.log('id contact ' + this.currentRow);
        deleteContact({contactIds: this.currentRow})
        .then(result => {
            window.console.log('result ====> ' + result);
            this.closeModal();
            const selectedEvent = new CustomEvent("successdelchange");        
            this.dispatchEvent(selectedEvent); 
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success!!!',
                message: ' Contact deleted.',
                variant: 'success'
            }));
        })
        .catch(error => {
            window.console.log('Error ====> '+error);
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error!!', 
                message: error.message, 
                variant: 'error'
            }));
        });

    
    }
}