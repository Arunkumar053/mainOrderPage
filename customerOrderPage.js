import { LightningElement, api, track } from 'lwc';
import getOrders from '@salesforce/apex/GroceryOrderController.getOrders';
import updateOrderDeliveryStatus from '@salesforce/apex/GroceryOrderController.updateOrderDeliveryStatus';
import createOrderPage from '@salesforce/apex/GroceryOrderController.createOrderPage';
import groceryImages from '@salesforce/resourceUrl/groceryImages';
import groceryImagesss from '@salesforce/resourceUrl/groceryImagesss';


export default class CustomerOrderPage extends LightningElement {



    @track isHome = true;
    
    @track isCategories = false;
    @track isOrders = false;

    @api orders;
    @api recordId; // Customer ID
    @track orders = []; // List of orders
    @track categories = [
        { 
            name: 'Fruits >', 
            items: [
                { name: 'Apple', price: 10, image: `${groceryImagesss}/apple.jpg`, quantity: 0,feedbackEmoji: '' }, 
                { name: 'Banana', price: 15, image: `${groceryImagesss}/banana.jpg`, quantity: 0,feedbackEmoji: '' },
                { name: 'Orange', price: 20, image: `${groceryImagesss}/orange.jpeg`, quantity: 0,feedbackEmoji: '' }, // New item
                { name: 'Grapes', price: 25, image: `${groceryImagesss}/grapes.jpg`, quantity: 0,feedbackEmoji: '' }  // New item
            ]
        },
        { 
            name: 'Vegetables >', 
            items: [
                { name: 'Carrot', price: 18, image: `${groceryImagesss}/carrot.jpg`, quantity: 0,feedbackEmoji: ''  }, 
                { name: 'Broccoli', price: 12, image: `${groceryImagesss}/broccoli.jpg`, quantity: 0,feedbackEmoji: ''  },
                { name: 'Potato', price: 10, image: `${groceryImagesss}/potato.jpg`, quantity: 0,feedbackEmoji: ''  }, // New item
                { name: 'Spinach', price: 15, image: `${groceryImagesss}/spinach.jpeg`, quantity: 0,feedbackEmoji: ''  }  // New item
            ]
        },
        { 
            name: 'Dairy >', 
            items: [
                { name: 'Milk', price: 30, image: `${groceryImagesss}/milk.jpg`, quantity: 0,feedbackEmoji: ''  }, 
                { name: 'Cheese', price: 40, image: `${groceryImagesss}/cheese.jpeg`, quantity: 0,feedbackEmoji: ''  },
                { name: 'Butter', price: 35, image: `${groceryImagesss}/butter.jpeg`, quantity: 0,feedbackEmoji: ''  }, // New item
                { name: 'Yogurt', price: 25, image: `${groceryImagesss}/yogurt.jpg`, quantity: 0,feedbackEmoji: ''  }  // New item
            ]
        },
        { 
            name: 'Beverages >', 
            items: [
                { name: 'Coffee', price: 50, image: `${groceryImagesss}/coffee.jpg`, quantity: 0,feedbackEmoji: ''  }, 
                { name: 'Tea', price: 20, image: `${groceryImagesss}/tea.jpg`, quantity: 0,feedbackEmoji: ''  },
                { name: 'Juice', price: 45, image: `${groceryImagesss}/juice.jpg`, quantity: 0,feedbackEmoji: ''  }, // New item
                { name: 'Soda', price: 25, image: `${groceryImagesss}/soda.jpg`, quantity: 0,feedbackEmoji: ''  }  // New item
            ]
        },
        { 
            name: 'Snacks >', 
            items: [
                { name: 'Chips', price: 15, image: `${groceryImagesss}/chips.jpg`, quantity: 0 }, 
                { name: 'Cookies', price: 20, image: `${groceryImagesss}/cookies.jpeg`, quantity: 0 },
                { name: 'Nuts', price: 30, image: `${groceryImagesss}/nuts.jpeg`, quantity: 0 }, // New item
                { name: 'Chocolate', price: 25, image: `${groceryImagesss}/chocolate.jpg`, quantity: 0 }  // New item
            ]
        }
    ];
    
    @track totalAmount = 0;
    @track selectedItems = [];
    isModalOpen = false;
    isOrderDetailsModalOpen = false;
    selectedOrder = null;


    get fruitCategories() {
        return this.categories.filter(category => category.name.includes('Fruits'));
    }
    
    get vegetableCategories() {
        return this.categories.filter(category => category.name.includes('Vegetables'));
    }
    
    get dairyCategories() {
        return this.categories.filter(category => category.name.includes('Dairy'));
    }
    
    get beverageCategories() {
        return this.categories.filter(category => category.name.includes('Beverages'));
    }
    
    get snackCategories() {
        return this.categories.filter(category => category.name.includes('Snacks'));
    }
    


    @track isFruits = false;
    @track isVegetables = false;
    @track isDairy = false;
    @track isBeverages = false;
    @track isSnacks = false;

    showFruits() {
        this.isHome = false;
        this.isCategories = false;
        this.isOrders = false;
        this.isFruits = true;
        this.isVegetables = false;
        this.isDairy = false;
        this.isBeverages = false;
        this.isSnacks = false;
    }

    showVegetables() {
        this.isHome = false;
        this.isCategories = false;
        this.isOrders = false;
        this.isFruits = false;
        this.isVegetables = true;
        this.isDairy = false;
        this.isBeverages = false;
        this.isSnacks = false;
    }

    showDairy() {
        this.isHome = false;
        this.isCategories = false;
        this.isOrders = false;
        this.isFruits = false;
        this.isVegetables = false;
        this.isDairy = true;
        this.isBeverages = false;
        this.isSnacks = false;
    }

    showBeverages() {
        this.isHome = false;
        this.isCategories = false;
        this.isOrders = false;
        this.isFruits = false;
        this.isVegetables = false;
        this.isDairy = false;
        this.isBeverages = true;
        this.isSnacks = false;
    }

    showSnacks() {
        this.isHome = false;
        this.isCategories = false;
        this.isOrders = false;
        this.isFruits = false;
        this.isVegetables = false;
        this.isDairy = false;
        this.isBeverages = false;
        this.isSnacks = true;
    }   
    connectedCallback() {
        this.fetchOrders();
    }

    fetchOrders() {
        getOrders({ customerId: this.recordId })
            .then(result => {
                this.orders = result.map(order => ({
                    ...order,
                    Order_Date__c: new Intl.DateTimeFormat('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        timeZone: 'Asia/Kolkata'
                    }).format(new Date(order.Order_Date__c))
                }));
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    handleCategoryClick(event) {
        const categoryName = event.currentTarget.textContent.trim();
        this.categories = this.categories.map(category => {
            if (category.name === categoryName) {
                category.isExpanded = !category.isExpanded;
            } else {
                category.isExpanded = false; // Collapse other categories
            }
            return category;
        });
    }

    handleDeliveredChange(event) {
        const orderId = event.target.dataset.orderId;
        const isDelivered = event.target.checked;
        if (window.confirm('Are you sure the order has been delivered?')) {
            updateOrderDeliveryStatus({ orderId, isDelivered })
                .then(() => {
                    this.showSuccessMessage('Order delivery status updated.');
                })
                .catch(error => {
                    console.error('Error updating status:', error);
                });
        } else {
            event.target.checked = !isDelivered;
        }
    }

    handleIncrement(event) {
        const itemName = event.target.dataset.itemName;
        const category = this.categories.find(cat => cat.items.some(item => item.name === itemName));
        const item = category.items.find(i => i.name === itemName);
        item.quantity += 1;
    
        // Set happy thumbs-up emoji for the specific item
        item.feedbackEmoji = '💕😍💕';
    
        this.updateTotalAmount();
        this.clearEmojiFeedback(item); // Clear emoji after a timeout for the specific item
    }
    
    handleDecrement(event) {
        const itemName = event.target.dataset.itemName;
        const category = this.categories.find(cat => cat.items.some(item => item.name === itemName));
        const item = category.items.find(i => i.name === itemName);
        if (item.quantity > 0) {
            item.quantity -= 1;
    
            // Set sad emoji for the specific item
            item.feedbackEmoji = '😢';
        }
    
        this.updateTotalAmount();
        this.clearEmojiFeedback(item); // Clear emoji after a timeout for the specific item
    }
    
    clearEmojiFeedback(item) {
        setTimeout(() => {
            item.feedbackEmoji = ''; // Clear emoji for the specific item
        }, 2000); // Clear emoji after 1 second
    }
    

    updateTotalAmount() {
        this.totalAmount = this.categories.reduce((sum, category) => 
            sum + category.items.reduce((itemSum, item) => itemSum + (item.quantity * item.price), 0)
        , 0);
    }

    handlePlaceOrder() {
        const selectedItems = this.categories.flatMap(category =>
            category.items.filter(item => item.quantity > 0).map(item => ({ name: item.name, quantity: item.quantity }))
        );

        if (selectedItems.length === 0) return;

        createOrderPage({
            customerId: this.recordId,
            selectedItems,
            totalAmount: this.totalAmount
        })
        .then(() => {
            this.fetchOrders();
            this.isModalOpen = true;
            this.categories.forEach(category => category.items.forEach(item => (item.quantity = 0)));
        })
        .catch(error => console.error('Error placing order:', error));
    }

    closeModal() {
        this.isModalOpen = false;
    }

    openOrderDetails(event) {
        const orderId = event.target.dataset.orderId;
        this.selectedOrder = this.orders.find(order => order.Id === orderId);
        this.isOrderDetailsModalOpen = true;
    }

    closeOrderDetailsModal() {
        this.isOrderDetailsModalOpen = false;
    }
     // Process the item lists for all orders
     get processedOrders() {
        return this.orders.map(order => {
            return {
                ...order,
                // Split the Item_List__c by commas, trim any spaces, and map to an array
                processedItems: order.Item_List__c ? order.Item_List__c.split(',').map(item => item.trim()) : []
            };
        });
    }
    
    
//This code enables the navigation to display the selected section while hiding others.

    showHome() {
        this.isHome = true;
        this.isCategories = false;
        this.isOrders = false;
        this.isFruits = false;
        this.isVegetables = false;
        this.isDairy = false;
        this.isBeverages = false;
        this.isSnacks = false;

    }

    showCategories() {
        this.isFruits = false;

        this.isHome = true;
        this.isCategories = false;
        this.isOrders = false;
    }

    showOrders() {
        this.isHome = false;
        this.isCategories = false;
        this.isOrders = true;
        this.isFruits = false;
        this.isVegetables = false;
        this.isDairy = false;
        this.isBeverages = false;
        this.isSnacks = false;
    }

}