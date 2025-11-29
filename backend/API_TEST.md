# RentHub API Testing Guide

## Base URL
`http://localhost:5000`

## 1. Test Health Check
GET /health

## 2. User APIs

### Register User
POST /api/users/register
{
"name": "Prabal Thool",
"email": "prabal@example.com",
"password": "secure123",
"phone": "9876543210",
"address": {
"city": "Mumbai",
"state": "Maharashtra",
"zipCode": "400001"
}
}


### Get User
GET /api/users/{userId}

### Update User
PUT /api/users/{userId}

{
"name": "Prabal Updated",
"phone": "9999999999"
}


## 3. Item APIs

### Create Item
POST /api/items

{
"title": "Canon EOS R6 Camera",
"description": "Professional mirrorless camera with 20MP sensor",
"category": "Electronics",
"pricePerDay": 1500,
"deposit": 10000,
"ownerId": "USER_ID_HERE",
"location": {
"city": "Mumbai",
"state": "Maharashtra"
},
"condition": "like-new",
"tags": ["camera", "photography", "canon"]
}


### Get All Items (with filters)
GET /api/items?category=Electronics&city=Mumbai&minPrice=500&maxPrice=2000

### Search Items
GET /api/items?search=camera

### Get Single Item
GET /api/items/{itemId}

## 4. Rental APIs

### Create Rental
POST /api/rentals


{
"itemId": "ITEM_ID_HERE",
"renterId": "RENTER_USER_ID",
"startDate": "2025-12-01",
"endDate": "2025-12-05"
}


### Get User Rentals
GET /api/rentals/user/{userId}

### Update Rental Status
PUT /api/rentals/{rentalId}


{
"status": "active",
"paymentStatus": "paid"
}

