// Install: npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { 
    DynamoDBDocumentClient, 
    GetCommand, 
    PutCommand, 
    UpdateCommand, 
    QueryCommand, 
    ScanCommand 
} from "@aws-sdk/lib-dynamodb";

// --- Configuration ---
const REGION = "ap-south-1";
const USERS_TABLE = "ExpenseProUsers";
const EXPENSES_TABLE = "ExpenseProExpenses";

// IMPORTANT: Do NOT hardcode your keys here. 
// Use IAM roles if deploying to AWS services (Lambda, EC2) 
// or environment variables if deploying elsewhere.

const client = new DynamoDBClient({ 
    region: REGION, 
    // Example using environment variables (standard secure practice):
    // credentials: {
    //     accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
    //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY 
    // }

    // If you MUST use the keys provided (temporarily for testing ONLY), 
    // replace the credentials block above with:
    credentials: {
        accessKeyId: "ACCESS_KEY", 
        secretAccessKey: "SECRET_ACCESS_KEY"
    }
});

const ddbDocClient = DynamoDBDocumentClient.from(client);


// -----------------------------------------------------------------
// A. INITIAL SETUP / USER OPERATIONS (INSERT, LOGIN)
// -----------------------------------------------------------------

/**
 * Inserts the initial user data. Run this once after table creation.
 * @param {object} userData - {id, name, role, email, password, managerId}
 */
export async function insertUser(userData) {
    console.log("DynamoDB: Inserting user:", userData.email);
    const command = new PutCommand({
        TableName: USERS_TABLE,
        Item: userData
    });
    return ddbDocClient.send(command);
}

/**
 * Retrieves a user by email for login validation.
 * @param {string} email 
 */
export async function getUserByEmail(email) {
    console.log("DynamoDB: Attempting login for:", email);
    const command = new QueryCommand({
        TableName: USERS_TABLE,
        IndexName: 'EmailIndex',
        KeyConditionExpression: "email = :e",
        ExpressionAttributeValues: { ":e": email },
    });

    const { Items } = await ddbDocClient.send(command);
    return Items ? Items[0] : null; 
}

/**
 * Retrieves all users.
 */
export async function getAllUsers() {
    console.log("DynamoDB: Fetching all users.");
    const command = new ScanCommand({
        TableName: USERS_TABLE
    });
    const { Items } = await ddbDocClient.send(command);
    return Items || [];
}

// -----------------------------------------------------------------
// B. EXPENSE OPERATIONS (CRUD)
// -----------------------------------------------------------------

/**
 * Adds a new expense item.
 * @param {object} expenseData - New expense data.
 */
export async function addExpense(expenseData) {
    console.log("DynamoDB: Adding new expense for user:", expenseData.userId);
    // Note: DynamoDB supports string, number, boolean, object, array, set
    const item = { id: Date.now(), ...expenseData }; 
    const command = new PutCommand({
        TableName: EXPENSES_TABLE,
        Item: item
    });
    await ddbDocClient.send(command);
    return item;
}

/**
 * Updates the status of an expense.
 * @param {number} expenseId 
 * @param {string} status - 'Approved' or 'Rejected'
 * @param {string} comments - Rejection reason (optional)
 */
export async function updateExpenseStatus(expenseId, status, comments) {
    console.log(`DynamoDB: Updating expense ID ${expenseId} to ${status}`);
    const command = new UpdateCommand({
        TableName: EXPENSES_TABLE,
        Key: { id: expenseId },
        UpdateExpression: "set #status = :s, #comments = :c",
        ExpressionAttributeNames: { "#status": "status", "#comments": "comments" },
        ExpressionAttributeValues: { ":s": status, ":c": comments || null },
        ReturnValues: "ALL_NEW",
    });
    const { Attributes } = await ddbDocClient.send(command);
    return Attributes;
}

/**
 * Retrieves expenses submitted by a specific user.
 * @param {number} userId 
 */
export async function getExpensesByUserId(userId) {
    console.log("DynamoDB: Fetching expenses for user ID:", userId);
    const command = new QueryCommand({
        TableName: EXPENSES_TABLE,
        IndexName: 'UserIndex',
        KeyConditionExpression: "userId = :u",
        ExpressionAttributeValues: { ":u": userId },
        ScanIndexForward: false // Latest first
    });
    const { Items } = await ddbDocClient.send(command);
    return Items || [];
}

/**
 * Retrieves all expenses (used for Admin overview or fetching all pending).
 */
export async function getAllExpenses() {
    console.log("DynamoDB: Scanning all expenses.");
    const command = new ScanCommand({
        TableName: EXPENSES_TABLE
    });
    const { Items } = await ddbDocClient.send(command);
    return Items || [];
}

// -----------------------------------------------------------------
// C. UTILITY: SEEDING DYNAMODB (Run this once)
// -----------------------------------------------------------------

const initialUsers = [
    { id: 1, name: 'Admin User', role: 'Admin', email: 'admin@company.com', password: 'password123', managerId: null },
    { id: 2, name: 'Diana Director', role: 'Director', email: 'director@company.com', password: 'password123', managerId: 1 },
    { id: 3, name: 'Charles CFO', role: 'CFO', email: 'cfo@company.com', password: 'password123', managerId: 2 },
    { id: 4, name: 'John Manager', role: 'Manager', email: 'manager@company.com', password: 'password123', managerId: 3 },
    { id: 5, name: 'Alice Employee', role: 'Employee', email: 'employee@company.com', password: 'password123', managerId: 4 },
    { id: 6, name: 'Bob Employee', role: 'Employee', email: 'employee2@company.com', password: 'password123', managerId: 4 },
];

const initialExpenses = [
    { id: 1, userId: 5, date: '2025-10-03', category: 'Food', description: 'Client Lunch', amount: 55.50, currency: 'USD', status: 'Approved' },
    { id: 2, userId: 5, date: '2025-10-02', category: 'Travel', description: 'Taxi to Airport', amount: 40.00, currency: 'USD', status: 'Rejected', comments: 'Receipt was not clear.' },
    { id: 3, userId: 6, date: '2025-10-04', category: 'Office Supplies', description: 'New Keyboard', amount: 75.00, currency: 'USD', status: 'Pending' },
    { id: 4, userId: 4, date: '2025-10-05', category: 'Travel', description: 'Flight to Conference', amount: 450.00, currency: 'EUR', status: 'Pending' },
    { id: 5, userId: 3, date: '2025-10-06', category: 'Other', description: 'Industry Subscription', amount: 1200.00, currency: 'USD', status: 'Pending' },
];

/**
 * Seeds the DynamoDB tables with initial data. Run this function once.
 */
export async function seedDatabase() {
    console.log("Seeding Users table...");
    for (const user of initialUsers) {
        await insertUser(user);
    }
    console.log("Users seeding complete.");

    console.log("Seeding Expenses table...");
    for (const expense of initialExpenses) {
        await addExpense(expense);
    }
    console.log("Expenses seeding complete.");
}

// To run the seed function (e.g., in a separate Node.js script):
// seedDatabase().catch(err => console.error("Database seeding failed:", err));
// 
// --- End of dynamoApi.js ---