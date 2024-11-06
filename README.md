# Yoles
UTS 2023 Autumn Internet Programming Assignment 1 - Online Grocery Store ([Coles](https://www.coles.com.au/) clone coding)
## Features (Requirements)
- Customers can view a hierarchy of item categories and a collection of items with images as soon as they enter the shop.
- Customers can check the details of chosen products and add items to a virtual shopping cart.
- Customers can edit the quantify of items in the cart or remove items from the cart.
- Customers can check out by filling an online order form, where they provide delivery details and email addresses.
- Once the order is placed, a confirmation email is sent to the customer’s email address.
### Functional Specification for Visual Components:
#### 📌 Website Logo
The website should have a logo either in a separate frame or as part of a frame that also contains other elements.
#### 📌 Category Hierarchy
1. Initially, a separate frame should show only the top-level categories of items available in the shop.
2. When the mouse moves over or clicks a particular category node, the node expands to show the second-level categories of items.
3. Whenever a second-level category is clicked, it shows a list of items in the category in the main information area (most likely in a different frame).
#### 📌 Main Information Area
1. Initially, the main information area (i.e., a separate frame) should show a collection of items. Each item has an image and an Add button beside it. User can click the button to add the item to the shopping cart only when the item is “in stock”.
2. When a customer clicks on a particular item, a new page (most likely in a different frame) or a popup window shows more details about that item, where the customer can still add the item to the shopping cart.
#### 📌 Search Box
1. There should be a search box (either in the main information area or a separate frame) that customers can use to look for items by name, or filter items by price (or price range).
2. The search results will show in the main information area.
#### 📌 Shopping Cart
1. There should be separate frame or pop-up window showing the content of a virtual shopping cart. Customers may use a scroll bar if there are too many items to show in the shopping cart.
2. The shopping cart shows not only the items inside the cart but also the number and total price of the items in the cart.
3. Customers can clear the shopping cart by clicking on a Clear button on the shopping cart page.
4. Customers can also complete their shopping by clicking a Checkout button on the shopping cart page.
5. The Checkout button should be in grey color and non-clickable when the shopping cart is empty.
6. Once the Checkout button is clicked, an online order form shows up (either on the same page or on a new page), requesting the customer to fill in delivery details (name, address, suburb, state, country, phone number) and email address.
7. A customer can click the Place Order button to place the order. Note that all the fields in the form must be completed before an order can be placed successfully.
8. Once an order is placed successfully, a confirmation email will be sent to the customer’s email address, with the order and deliver details attached.
## Main Technologies Used
- **TypeScript** (v4.9.5): Programming language
- **Next.js** (v13.2.3): For page routing, middleware and API routes
- **React** (v18.2.0): For front-end development
- **Tailwind CSS** (v3.2.7): For styling
- **SWR** (v2.1.0): For data fetching and caching
- **MongoDB** (v5.2.0): For database
- **Zod** (v3.14.4): For data validation
- **Sendgrid** (v7.7.0): Email API
## How to Install and Run the Project
### 1. Clone the Repository
#### Using `git` command
```
git clone https://github.com/ysyoo11/yoles.git
cd yoles
```
#### Using GitHub CLI
```
gh repo clone ysyoo11/yoles
cd yoles
```
### 2. Install Dependencies
```
yarn install
```
### 3. Set up Environment Variables
```
MONGODB_URI=your_mongodb_uri
MONGODB_NAME=your_mongodb_name

SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_SENDER=your_sendgrid_sender
```
### 4. Start the Development Server
```
yarn dev
```
## Usage
#### Web View
https://github.com/user-attachments/assets/773d94f4-e56e-4e94-ac79-4f0ad850a060
#### Mobile View
https://github.com/user-attachments/assets/83a22a65-b5fc-4918-800b-14e53880c17b
#### Mobile View - Infinite Scrolling
https://github.com/user-attachments/assets/c6fc872c-0b02-42af-884d-34bfb54953a6
#### Order Details Email Sent via Sendgrid API
<img src="https://github.com/user-attachments/assets/80a3b2ab-1d07-4c6d-aa9c-e54a06cbf637" width="300" />

## License
This project is open-source and available under the MIT License.
