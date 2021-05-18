import { LightningElement, track, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getAccountListWire from '@salesforce/apex/AccountController.getAccountListWire';
import updateAccountTable from '@salesforce/apex/AccountController.updateAccountTable'
import deleteAccount from '@salesforce/apex/AccountController.deleteAccount'


const button_Delete = [
    { label: 'Delete', name: 'delete' }
];

const COLUMNS = [
    {
        label: 'Name',
        fieldName: 'Name',
        type: 'Text',
        editable: true,
    },
    {
        label: 'Rating',
        fieldName: 'Rating',
        type: 'picklist',
        editable: true,
        typeAttributes: {
            placeholder: 'Choose Rating',
            options: [
                { label: '-None-', value: ' ' },
                { label: 'Hot', value: 'Hot' },
                { label: 'Warm', value: 'Warm' },
                { label: 'Cold', value: 'Cold' },
            ],
            value: { fieldName: 'Rating' },
            context: { fieldName: 'Id' },
            variant: 'label-hidden',
            name: 'Rating',
            label: 'Rating'
        },
        cellAttributes: {
            class: { fieldName: 'RatingClass' }
        }
    },
    {
        label: "Delete", class: 'delbutton', type: 'button-icon',initialWidth:100, cellAttributes: { position: 'center', width: "40px" }, typeAttributes: {
            RowAction: button_Delete, variant: "container", alternativeText: "Delete", title: "Delete",
            name: 'delete', iconName: "utility:delete", class: "slds-m-left_medium"
        }
    }
];

export default class CustomAccountTable extends LightningElement {
    columns = COLUMNS;
    records;
    foterButtonBar = false;
    error;
    lastSavedData;
    accountId;
    draftValues = [];
    privateChildren = {};
    @track refreshTable;

    @wire(getAccountListWire)
    accounts(result) {
        this.refreshTable = result;
        const { data, error } = result;
        if (data) {
            this.records = JSON.parse(JSON.stringify(data));
            this.records.forEach(record => {
                record.RatingClass = 'slds-cell-edit';
            });
            this.error = undefined;

        } else if (error) {
            this.records = undefined;
            this.error = error;
        } else {
            this.error = undefined;
            this.records = undefined;
        }
        this.lastSavedData = this.records;
    }

    handleWindowOnclick(context) {
        this.resetPopups('c-datatable-picklist', context);
        this.resetPopups('c-datatable-lookup', context);
    }

    resetPopups(markup, context) {
        let elementMarkup = this.privateChildren[markup];
        if (elementMarkup) {
            Object.values(elementMarkup).forEach((element) => {
                element.callbacks.reset(context);
            });
        }
    }

    handleItemRegister(event) {
        event.stopPropagation();
        const item = event.detail;
        if (!this.privateChildren.hasOwnProperty(item.name))
            this.privateChildren[item.name] = {};
        this.privateChildren[item.name][item.guid] = item;
    }

    

    handleCellChange(event) {
        console.log('==> ', event.detail);
        event.preventDefault();
        this.updateDraftValues(event.detail.draftValues[0]);
        this.foterButtonBar = true;
        this.template.querySelector('.content').classList.add("ghost");
    }

    handleValueChange(event) {
        console.log('==> ', event.detail);
        event.stopPropagation();
        let dataRecieved = event.detail.data;
        let updatedItem;
        switch (dataRecieved.label) {
            case 'Rating':
                updatedItem = {
                    Id: dataRecieved.context,
                    Rating: dataRecieved.value
                };
                this.setClassesOnData(
                    dataRecieved.context,
                    'RatingClass',
                    'slds-cell-edit slds-is-edited'
                );
                break;
            default:
                this.setClassesOnData(dataRecieved.context, '', '');
                break;
        }
        this.updateDraftValues(updatedItem);
        this.updateDataValues(updatedItem);
        this.foterButtonBar = true;
        this.template.querySelector('.content').classList.add("ghost");
    }

    updateDataValues(updateItem) {
        let copyData = JSON.parse(JSON.stringify(this.records));
        copyData.forEach((item) => {
            if (item.Id === updateItem.Id) {
                for (let field in updateItem) {
                    item[field] = updateItem[field];
                }
            }
        });
        this.records = [...copyData];
    }

    updateDraftValues(updateItem) {
        let draftValueChanged = false;
        let copyDraftValues = JSON.parse(JSON.stringify(this.draftValues));
        copyDraftValues.forEach((item) => {
            if (item.Id === updateItem.Id) {
                for (let field in updateItem) {
                    item[field] = updateItem[field];
                }
                draftValueChanged = true;
            }
        });
        if (draftValueChanged) {
            this.draftValues = [...copyDraftValues];
        } else {
            this.draftValues = [...copyDraftValues, updateItem];
        }
    }

    handleEdit(event) {
        event.preventDefault();
        let dataRecieved = event.detail.data;
        this.handleWindowOnclick(dataRecieved.context);
        switch (dataRecieved.label) {
            case 'Rating':
                this.setClassesOnData(
                    dataRecieved.context,
                    'RatingClass',
                    'slds-cell-edit'
                );
                break;
            default:
                this.setClassesOnData(dataRecieved.context, '', '');
                break;
        };
    }

    setClassesOnData(id, fieldName, fieldValue) {
        this.records = JSON.parse(JSON.stringify(this.records));
        this.records.forEach((detail) => {
            if (detail.Id === id) {
                detail[fieldName] = fieldValue;
            }
        });
    }

    handleSave(event) {
        event.preventDefault();
        updateAccountTable({ data: this.draftValues })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Account updated successfully',
                        variant: 'success'
                    })
                );
                refreshApex(this.refreshTable).then(() => {
                    // this.records.forEach(record => {
                    //     record.RatingClass = 'slds-cell-edit';
                    // });
                    this.draftValues = [];
                });
                this.foterButtonBar = false;
                this.template.querySelector('.content').classList.remove("ghost");
            })
            .catch(error => {
                console.log('error : ' + JSON.stringify(error));
            });
    }

    handleCancel(event) {
        event.preventDefault();
        this.records = JSON.parse(JSON.stringify(this.lastSavedData));
        this.draftValues = [];
        this.handleWindowOnclick();
        this.foterButtonBar = false;
        this.template.querySelector('.content').classList.remove("ghost");
    }



    handleRowAction(event) {
        let buttonName = event.detail.action.name;
        console.log('buttonName ====> ' + buttonName);
        let row = event.detail.row;
        console.log('row ====> ' + row);
        switch (buttonName) {
            case 'delete':
                this.deleteRow(row);
                break;
        }
    }

    deleteRow(currentRow) {
        
        let currentRecord ;
        currentRecord.push(currentRow.Id);
        console.log('currentRecord ====> ', currentRecord);
        
        deleteAccount({ accountIds: currentRecord })

            .then(result => {
                console.log('result ====> ', result);

                refreshApex(this.refreshTable);

                this.dispatchEvent(new ShowToastEvent({
                    title: 'Success!!!',
                    message: ' Account deleted.',
                    variant: 'success'
                }));
            })
            .catch(error => {
                window.console.log('Error ====> ' + error);
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error!!',
                    message: error.message,
                    variant: 'error'
                }));
            });
    }

}
