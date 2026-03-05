# Use Case Diagram

![Use Case Diagram](file:///Users/sudipkumarprasad/Desktop/SESD_Project/diagrams/UseCaseDiagram.png)

The Use Case Diagram illustrates the primary actors and their interactions with the ShopSmart system.

```mermaid
useCaseDiagram
    actor "Customer" as Customer
    actor "Shop Owner" as ShopOwner
    actor "Delivery Partner" as DeliveryPartner
    actor "Admin" as Admin

    package "ShopSmart System" {
        usecase "Browse Shops & Products" as UC1
        usecase "Place Order" as UC2
        usecase "Track Order Status" as UC3
        usecase "Manage Shop & Inventory" as UC4
        usecase "Process Orders" as UC5
        usecase "Accept/Fulfill Deliveries" as UC6
        usecase "View Analytics" as UC7
        usecase "Manage Users & Platform" as UC8
    }

    Customer --> UC1
    Customer --> UC2
    Customer --> UC3

    ShopOwner --> UC4
    ShopOwner --> UC5
    ShopOwner --> UC7

    DeliveryPartner --> UC6
    DeliveryPartner --> UC3

    Admin --> UC8
    Admin --> UC7
```
