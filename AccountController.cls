public with sharing class AccountController {
    @AuraEnabled(Cacheable=true)
    public static List<Account> getAccountListWire() {
        return[SELECT id, Name, Rating FROM Account
        ];
    }
    
    @AuraEnabled
    public static void deleteAccount(Id accountIds){
        delete [SELECT Id FROM Account where Id = :accountIds];
    }

    @AuraEnabled
    public static void updateAccountTable(Object data) {
        List<Account> listOfAccounts = (List<Account>) JSON.deserialize(
            JSON.serialize(data),
            List<Account>.class
        );
        update listOfAccounts;
    }
}