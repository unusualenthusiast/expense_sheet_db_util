module.exports = {
    FILE_NAME: 'file1.xlsx',
    FILE_PATH: 'input',
    SHEET_COLS: ['DATE', 'HH', 'MM', 'AM_PM', 'TYPE', 'AMOUNT', 'DESCRIPTION'],
    CLEAN_DB_MODE: 'CLEAN',
    NORMAL_DB_MODE: 'NORMAL',
    SYSTEM_DB_USER: 'SYSTEM',
    FIRST_DB_USER: {
        username: 'allanarul',
        firstname: 'Allan',
        lastname: 'Arul'
    },
    EXPENSE_TYPE: {
        SPENDING_TYPE: 'spending',
        SAVINGORINVESTMENT_TYPE: 'saving_investment'
    },
    EXPENSE_SUB_TYPE: {
        SPENDING_TYPE: [
            'Accomodation',
            'Book',
            'Charity',
            'Church Offering',
            'Clothing',
            'Cosmetics',
            'Education',
            'Electronics',
            'Entertainment',
            'Fast Tag',
            'Food',
            'Fruits',
            'Furniture',
            'Gift',
            'Grocery',
            'House Maintenance',
            'Insurance',
            'Internet/Phone Recharge',
            'Loan EMI',
            'Medical',
            'Medicine',
            'Movie',            
            'Offering',
            'Others',
            'Parking',
            'Petrol',
            'Rent',
            'Repair',
            'Saloon',
            'Snacks',
            'Stationery',
            'Travel',
            'Utensils',
            'Vegetables',
            'Vehicle Maintenance'
        ],
        SAVINGORINVESTMENT_TYPE: [
            'Mutual Funds',
            'FD/RD',
            'Stocks'
        ]
    }
};