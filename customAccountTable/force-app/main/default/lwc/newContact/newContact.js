import { LightningElement,api,track } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
export default class NewContact extends LightningElement {
    
    @track NewContactModal = false;
    

    closeModal() {
        this.NewContactModal = false;
               }
    
    @api handleNewContact(){
        this.NewContactModal = true;
    }

    handleSubmit(event) {
        console.log('onsubmit event recordEditForm'+ event.detail.fields);    
    }

    handleSuccess(event) {
        console.log('onsuccess event recordEditForm',event.detail.id);
        this.closeModal();
        this.dispatchEvent(new ShowToastEvent({
            title: 'Success!!!',
            message: ' Contact created',
            variant: 'success'
        }));
        // Creates the event with the data.
        const selectedEvent = new CustomEvent("refreshtablechange");
    
        // Dispatches the event.
        this.dispatchEvent(selectedEvent);
    }
      
}