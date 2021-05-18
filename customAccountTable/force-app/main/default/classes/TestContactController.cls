@isTest
public class TestContactController{
    @isTest
    static void testGetContactList(){
        Contact cont = new contact();
        cont.FirstName = 'Test';
        cont.LastName = 'Test';
        insert cont;
        Test.startTest();
        ContactController.getContactList('T');
        Test.stopTest();
        System.assert([Select id from contact where FirstName = 'Test'].isEmpty());
    }
    @isTest
    static void testEmptyContactList(){
        Contact cont = new contact();
        cont.FirstName = 'Test';
        cont.LastName = 'Test';
        insert cont;
        Test.startTest();
        ContactController.getContactList('');
        Test.stopTest();
        System.assert([Select id from contact where FirstName = 'Test'].isEmpty());
    }
    @isTest
    static void testDontGetContactList(){
        Contact cont = new contact();
        cont.FirstName = 'Test';
        cont.LastName = 'Test';
        insert cont;
        Test.startTest();
        ContactController.getContactList('Ooo');
        Test.stopTest();
        System.assert([Select id from contact where FirstName = 'Test'].isEmpty());
    }
    @isTest
    static void testGetContactListWire(){
        List<Contact> contacts;
        Test.startTest();
        Contacts = ContactController.getContactListWire();
        Test.stopTest();
        System.assert(contacts.size()>0);
    }
    @isTest
    public static void testDeleteContact(){
        Contact cont = new contact();
        cont.FirstName = 'Test';
        cont.LastName = 'Test';
        insert cont;
        Test.startTest();
        ContactController.deleteContact(cont.id);
        Test.stopTest();
        System.assert([Select id from contact where FirstName = 'Test'].isEmpty());
    }
}