/******************************************************************************

Name - Aditya Deore
PRN - 124B1F116
ASSIGNMENT - Design a smart warehouse inventory management system

******************************************************************************/

#include <iostream>
#include <string.h> // For strcpy
#include <stdlib.h> // For exit()

using namespace std;

class Item {
public:
	int itemId; // Unique Item Identifier
	char itemName[20];
	char category[20];
	int cost;
	int stock; // Available stock quantity
	Item *next;
	Item *nextcategory;

	Item()
	{
		itemId = 0;
		strcpy(itemName,"Not Assigned");
		strcpy(category,"Not Assigned");
		cost = 0;
		stock = 0;
		next = NULL;
		nextcategory = NULL;
	}
};

class WarehouseManager {
public:
	int itemCounter = 1;
	Item *head;
	Item *nexthead;

	WarehouseManager() {
		head = NULL;
	}

	// Function to add a new item to the warehouse inventory
	void add_item()
	{
		Item *newItem = new Item();
		newItem->itemId = itemCounter;
		itemCounter++;

		cout<<"\nEnter Item Name: ";
		cin>>newItem->itemName;
		cout<<"Enter Item Category: ";
		cin>>newItem->category;
		cout<<"Enter Item Cost: ";
		cin>>newItem->cost;
		cout<<"Enter Stock Quantity: ";
		cin>>newItem->stock;

		if(head == NULL)
		{
			head = newItem;
		}
		else
		{
			Item *curr;
			curr = head;
			while(curr->next != NULL)
			{
				curr = curr->next;
			}
			curr->next = newItem;
		}
		cout << "\nItem Added Successfully with ID: " << newItem->itemId << endl;
	}

	void update_stock()
	{
		if (head == NULL) {
			cout << "\nWarehouse is empty. Cannot update anything." << endl;
			return;
		}

		int id;
		cout << "\nEnter the Item ID to update stock: ";
		cin >> id;

		Item *curr = head;
		bool found = false;
		while(curr != NULL)
		{
			if(curr->itemId == id)
			{
				cout << "Found Item: " << curr->itemName << " | Current Stock: " << curr->stock << endl;
				cout << "Enter the new stock quantity: ";
				cin >> curr->stock;
				cout << "Stock updated successfully!" << endl;
				found = true;
				break;
			}
			curr = curr->next;
		}

		if (!found) {
			cout << "\nItem with ID " << id << " not found." << endl;
		}
	}

	void display_warehouse()
	{
		if (head == NULL) {
			cout << "\nWarehouse is empty." << endl;
			return;
		}


		Item *curr = head;
		while(curr != NULL)
		{
			cout << curr->itemId << "\t" << curr->itemName << "\t\t" << curr->category << "\t\t" << curr->cost << "\t" << curr->stock << endl;
			curr = curr->next;
		}
		cout << "---------------------------------------------------------" << endl;
	}

	void calculate_total_value()
	{
		if (head == NULL) {
			cout << "\nWarehouse is empty. Total value is ₹ 0." << endl;
			return;
		}

		long long total_value = 0;
		Item *curr = head;
		while(curr != NULL)
		{
			total_value += (long long)curr->cost * curr->stock;
			curr = curr->next;
		}
		cout << "\nTotal Warehouse Value: ₹ " << total_value << endl;
	}
};

int main()
{
	WarehouseManager *wm = new WarehouseManager();
	int choice;
	do {
		cout<<"\n\t 1) Add Item";
		cout<<"\n\t 2) Update stock quantity";
		cout<<"\n\t 3) Display warehouse ";
		cout<<"\n\t 4) Calculate total value";
		cout<<"\n\t 5) Exit\n";

		cout<<"\n\t Enter your choice: ";
		cin>>choice;

		switch(choice) {
		case 1:
			wm->add_item();
			break;

		case 2:
			wm->update_stock();
			break;

		case 3:
			wm->display_warehouse();
			break;

		case 4:
			wm->calculate_total_value();
			break;
		case 5:
			cout << "\nExiting the warehouse system. Thank you Aditya!" << endl;
			exit(0);
		default:
			cout << "\nInvalid choice. Please try again." << endl;
		}

	} while(choice != 5);

	return 0;
}
/*
Sample Output - Aditya Deore's Warehouse Management System

	 1) Add Item
	 2) Update stock quantity
	 3) Display warehouse 
	 4) Calculate total value
	 5) Exit

	 Enter your choice: 1

Enter Item Name: laptop
Enter Item Category: electronics
Enter Item Cost: 45000
Enter Stock Quantity: 50

Item Added Successfully with ID: 1

	 1) Add Item
	 2) Update stock quantity
	 3) Display warehouse 
	 4) Calculate total value
	 5) Exit

	 Enter your choice: 1

Enter Item Name: smartphone
Enter Item Category: electronics
Enter Item Cost: 25000
Enter Stock Quantity: 100

Item Added Successfully with ID: 2

	 1) Add Item
	 2) Update stock quantity
	 3) Display warehouse 
	 4) Calculate total value
	 5) Exit

	 Enter your choice: 1

Enter Item Name: tablet
Enter Item Category: electronics
Enter Item Cost: 30000
Enter Stock Quantity: 75

Item Added Successfully with ID: 3

	 1) Add Item
	 2) Update stock quantity
	 3) Display warehouse 
	 4) Calculate total value
	 5) Exit

	 Enter your choice: 2

Enter the Item ID to update stock: 2
Found Item: smartphone | Current Stock: 100
Enter the new stock quantity: 150
Stock updated successfully!

	 1) Add Item
	 2) Update stock quantity
	 3) Display warehouse 
	 4) Calculate total value
	 5) Exit

	 Enter your choice: 3
1	laptop		electronics		45000	50
2	smartphone	electronics		25000	150
3	tablet		electronics		30000	75
---------------------------------------------------------

	 1) Add Item
	 2) Update stock quantity
	 3) Display warehouse 
	 4) Calculate total value
	 5) Exit

	 Enter your choice: 4

Total Warehouse Value: ₹ 8500000

	 1) Add Item
	 2) Update stock quantity
	 3) Display warehouse 
	 4) Calculate total value
	 5) Exit

	 Enter your choice: 5

Exiting the warehouse system. Thank you Aditya!
*/