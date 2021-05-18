public with sharing class ContactController {

    @AuraEnabled(Cacheable=true)
    public static List<Contact> getContactListWire() {
        return[SELECT id, FirstName, LastName, Email,AccountId, Account.Name, Phone, CreatedDate
            FROM Contact
        ];
    }

    @AuraEnabled(Cacheable=true)
    public static List<Contact> getContactList(String searchKey) {
        string Keyword = '%' + searchKey + '%';

        List<contact> contacts = [
            SELECT id, FirstName, LastName, Email,AccountId, Account.Name, Phone, CreatedDate
            FROM Contact
            WHERE FirstName LIKE :Keyword
        ];
        if(contacts.size() == 0){
             throw new AuraHandledException ('No Record Found...');
        }
        return contacts;
    }

    @AuraEnabled
    public static void deleteContact(Id contactIds){
        delete [SELECT Id FROM Contact where Id = :contactIds];
    }
}