@isTest
public class testAccountsController {
    @isTest
    static void testgetAccountListWire(){
        Account acc = new Account();
        acc.Name = 'Test1';
        insert acc;
        Test.startTest();
        AccountController.getAccountListWire();
        Test.stopTest();
        System.assert([Select id, Name from Account where Name = 'Test1'].Name=='Test1');
    }

    @isTest
    public static void testDeleteAccount(){
        Account acc = new Account();
        acc.Name = 'Test1';
        insert acc;
        Test.startTest();
        AccountController.deleteAccount(acc.id);
        Test.stopTest();
        System.assert([Select id from Account where Name = 'Test1'].isEmpty());
    }

    @isTest
    public static void testUpdateAccountTable(){
        Account acc = new Account();
        acc.Name = 'Test1';
        insert acc;
        Account updataData = new Account();
        updataData.Name = 'Test2';
        updataData.id= acc.id;
        Test.startTest();
        AccountController.updateAccountTable(updataData);
        Test.stopTest();
        System.assert([Select id from Account where Name = 'test2'].Name=='Test2');
    }
}