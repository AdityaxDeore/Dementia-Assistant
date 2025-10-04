# Warehouse Inventory Management System

A C++ program that implements a smart warehouse inventory management system using linked lists for efficient item storage and management.

## 📋 Project Information

- **Author**: Aditya Deore  
- **PRN**: 124B1F116
- **Assignment**: Design a smart warehouse inventory management system

## 🎯 Overview

This program demonstrates a comprehensive warehouse inventory management system built using object-oriented programming principles in C++. It uses linked lists for dynamic memory allocation and provides essential inventory operations like adding items, updating stock, displaying inventory, and calculating total warehouse value.

## ✨ Features

- **Dynamic Item Management**: Add new items to warehouse inventory
- **Stock Management**: Update stock quantities for existing items
- **Inventory Display**: View all items with their details
- **Value Calculation**: Calculate total warehouse value
- **Memory Efficient**: Uses linked lists for dynamic storage
- **User-Friendly Interface**: Interactive menu-driven system

## 🏗️ Data Structure

### Item Class Structure
```cpp
class Item {
    int itemId;           // Unique identifier
    char itemName[20];    // Item name
    char category[20];    // Item category
    int cost;            // Item cost
    int stock;           // Stock quantity
    Item *next;          // Pointer to next item
    Item *nextcategory;  // Pointer for category linking
}
```

### Warehouse Manager
- Manages the linked list of items
- Provides all inventory operations
- Maintains item counter for unique IDs

## 🚀 How to Run

### Prerequisites
- C++ compiler (GCC, Clang, or Visual Studio)
- Basic understanding of C++ and linked lists

### Compilation and Execution

1. **Compile the program**:
   ```bash
   g++ -o inventory inventory.cpp
   ```

2. **Run the executable**:
   ```bash
   ./inventory
   ```

### For Windows:
```cmd
g++ inventory.cpp -o inventory.exe
inventory.exe
```

## 📈 Program Flow

1. **Initialization**: Create warehouse manager instance
2. **Menu Display**: Show available operations
3. **User Input**: Get user choice
4. **Operation Execution**: Perform selected operation
5. **Loop**: Continue until user exits

## 🔍 Key Functions

| Function | Description |
|----------|-------------|
| `add_item()` | Add new item to warehouse |
| `update_stock()` | Update stock quantity for existing item |
| `display_warehouse()` | Display all items in warehouse |
| `calculate_total_value()` | Calculate total warehouse value |

## 📊 Menu Options

1. **Add Item**: Enter item details and add to warehouse
2. **Update Stock**: Modify stock quantity for existing items
3. **Display Warehouse**: View all items with their information
4. **Calculate Total Value**: Get total monetary value of inventory
5. **Exit**: Close the application

## 📋 Sample Operations

### Adding Items
- Enter item name, category, cost, and stock quantity
- System automatically assigns unique item ID
- Item added to linked list structure

### Updating Stock
- Enter item ID to locate item
- System displays current stock
- Enter new stock quantity to update

### Displaying Inventory
- Shows all items in tabular format
- Displays ID, name, category, cost, and stock
- Easy-to-read formatted output

### Value Calculation
- Calculates total value: cost × stock for each item
- Displays total warehouse value in Indian Rupees (₹)

## 📊 Sample Output

```
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

	 Enter your choice: 3
1	laptop		electronics		45000	50
2	smartphone	electronics		25000	150
3	tablet		electronics		30000	75
---------------------------------------------------------

	 Enter your choice: 4

Total Warehouse Value: ₹ 8500000
```

## 🎓 Educational Value

This program demonstrates:
- **Linked List Implementation**: Dynamic data structure usage
- **Object-Oriented Programming**: Classes and encapsulation
- **Menu-Driven Programming**: User interface design
- **Memory Management**: Dynamic allocation with pointers
- **Business Logic**: Real-world inventory management

## 🔧 Customization Options

1. **Add More Fields**: Extend Item class with supplier info, expiry dates
2. **Category Management**: Implement category-wise operations
3. **Search Functionality**: Add item search by name or category
4. **File Operations**: Save/load inventory from files
5. **Advanced Features**: Low stock alerts, reporting features

## 🛡️ Error Handling

- **Empty Warehouse**: Handles operations on empty inventory
- **Invalid Item ID**: Manages requests for non-existent items
- **Input Validation**: Ensures proper data entry
- **Memory Management**: Proper allocation and deallocation

## 🤝 Contributing

Suggestions for improvements:
- Database integration
- GUI implementation
- Advanced reporting features
- Multi-user support
- Barcode scanning integration

## 📚 Learning Outcomes

- Understanding linked list operations
- Implementing dynamic data structures
- Object-oriented design principles
- Memory management in C++
- Menu-driven program development

---

**Built with ❤️ for Warehouse Management and Data Structures**