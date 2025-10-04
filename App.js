import React, { useState } from 'react';

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

const ExpenseList = ({ expenses, users, title, onAction, currentUserRole, showUserFilter = false }) => {
  const [filterUserId, setFilterUserId] = useState('all');
  
  const getUserName = (userId) => users.find(u => u.id === userId)?.name || 'Unknown User';
  const getUserRole = (userId) => users.find(u => u.id === userId)?.role || 'Unknown';

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Approved': return { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' };
      case 'Pending': return { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' };
      case 'Rejected': return { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' };
      default: return { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' };
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Travel': '#3b82f6',
      'Food': '#10b981',
      'Office Supplies': '#8b5cf6',
      'Other': '#f59e0b'
    };
    return colors[category] || '#6b7280';
  };

  const filteredExpenses = filterUserId === 'all' 
    ? expenses 
    : expenses.filter(e => e.userId === parseInt(filterUserId));

  const uniqueUserIds = [...new Set(expenses.map(e => e.userId))];

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{
          background: '#1f2937',
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid #374151',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{
            margin: 0,
            color: '#fff',
            fontSize: '1.25rem',
            fontWeight: '700',
            letterSpacing: '-0.025em'
          }}>{title}</h3>
          
          {showUserFilter && uniqueUserIds.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <label style={{ color: '#fff', fontSize: '0.875rem', fontWeight: '500' }}>
                Filter by User:
              </label>
              <select
                value={filterUserId}
                onChange={(e) => setFilterUserId(e.target.value)}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  border: '1px solid #374151',
                  borderRadius: '6px',
                  background: '#374151',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                <option value="all">All Users</option>
                {uniqueUserIds.map(userId => {
                  const user = users.find(u => u.id === userId);
                  return (
                    <option key={userId} value={userId}>
                      {user?.name} ({user?.role})
                    </option>
                  );
                })}
              </select>
            </div>
          )}
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                <th style={thStyle}>DATE</th>
                {currentUserRole !== 'Employee' && <th style={thStyle}>EMPLOYEE</th>}
                {currentUserRole !== 'Employee' && <th style={thStyle}>ROLE</th>}
                <th style={thStyle}>CATEGORY</th>
                <th style={thStyle}>DESCRIPTION</th>
                <th style={{...thStyle, textAlign: 'right'}}>AMOUNT</th>
                <th style={{...thStyle, textAlign: 'center'}}>STATUS</th>
                {onAction && <th style={{...thStyle, textAlign: 'center'}}>ACTIONS</th>}
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length > 0 ? filteredExpenses.map((expense, idx) => (
                <tr key={expense.id} style={{
                  borderBottom: '1px solid #f3f4f6',
                  background: idx % 2 === 0 ? '#fff' : '#fafafa'
                }}>
                  <td style={tdStyle}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{expense.date}</span>
                  </td>
                  {currentUserRole !== 'Employee' && (
                    <td style={tdStyle}>
                      <div style={{ fontWeight: '600', color: '#111827' }}>{getUserName(expense.userId)}</div>
                    </td>
                  )}
                  {currentUserRole !== 'Employee' && (
                    <td style={tdStyle}>
                      <span style={{
                        background: '#f3f4f6',
                        color: '#374151',
                        padding: '0.3rem 0.6rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        display: 'inline-block'
                      }}>{getUserRole(expense.userId)}</span>
                    </td>
                  )}
                  <td style={tdStyle}>
                    <span style={{
                      background: getCategoryColor(expense.category),
                      color: '#fff',
                      padding: '0.4rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.8125rem',
                      fontWeight: '600',
                      display: 'inline-block'
                    }}>{expense.category}</span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ color: '#6b7280', fontSize: '0.9375rem' }}>{expense.description}</span>
                  </td>
                  <td style={{...tdStyle, textAlign: 'right'}}>
                    <strong style={{ fontSize: '1rem', color: '#111827' }}>
                      {expense.amount.toFixed(2)} {expense.currency}
                    </strong>
                  </td>
                  <td style={{...tdStyle, textAlign: 'center'}}>
                    <span style={{
                      ...getStatusStyle(expense.status),
                      background: getStatusStyle(expense.status).bg,
                      color: getStatusStyle(expense.status).text,
                      padding: '0.4rem 0.875rem',
                      borderRadius: '20px',
                      fontSize: '0.8125rem',
                      fontWeight: '600',
                      display: 'inline-block',
                      border: `1px solid ${getStatusStyle(expense.status).border}`
                    }}>{expense.status}</span>
                  </td>
                  {onAction && (
                    <td style={{...tdStyle, textAlign: 'center'}}>
                      {expense.status === 'Pending' && (
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                          <button onClick={() => onAction(expense.id, 'Approved')} style={{
                            background: '#10b981',
                            color: '#fff',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            fontSize: '0.8125rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }} onMouseOver={e => e.target.style.background = '#059669'} 
                             onMouseOut={e => e.target.style.background = '#10b981'}>
                            Approve
                          </button>
                          <button onClick={() => onAction(expense.id, 'Rejected')} style={{
                            background: '#ef4444',
                            color: '#fff',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            fontSize: '0.8125rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }} onMouseOver={e => e.target.style.background = '#dc2626'} 
                             onMouseOut={e => e.target.style.background = '#ef4444'}>
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              )) : (
                <tr>
                  <td colSpan={onAction ? (currentUserRole !== 'Employee' ? 8 : 6) : (currentUserRole !== 'Employee' ? 7 : 5)} style={{
                    textAlign: 'center',
                    padding: '4rem 2rem',
                    color: '#9ca3af',
                    fontSize: '1rem'
                  }}>
                    No expenses to display
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const thStyle = {
  padding: '1rem 1.25rem',
  textAlign: 'left',
  fontSize: '0.75rem',
  fontWeight: '700',
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
};

const tdStyle = {
  padding: '1.125rem 1.25rem',
  verticalAlign: 'middle'
};

const ExpenseForm = ({ onSave, onCancel }) => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !category || !description || !date) {
      alert('Please fill all fields');
      return;
    }
    onSave({ amount: parseFloat(amount), currency, category, description, date });
  };

  const inputStyles = {
    width: '100%',
    padding: '0.75rem 1rem',
    fontSize: '0.9375rem',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
    background: '#fff'
  };

  const labelStyles = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '0.5rem'
  };

  return (
    <div style={{ padding: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
        <div>
          <label style={labelStyles}>Amount</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            style={inputStyles}
            placeholder="0.00"
          />
        </div>
        <div>
          <label style={labelStyles}>Currency</label>
          <input
            type="text"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            required
            style={inputStyles}
          />
        </div>
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <label style={labelStyles}>Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          style={inputStyles}
        >
          <option value="">Select Category</option>
          <option value="Travel">Travel</option>
          <option value="Food">Food</option>
          <option value="Office Supplies">Office Supplies</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <label style={labelStyles}>Description</label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={inputStyles}
          placeholder="Enter expense details..."
        />
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <label style={labelStyles}>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          style={inputStyles}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '2rem' }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '0.9375rem',
            fontWeight: '600',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            background: '#fff',
            color: '#374151',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={e => e.target.style.background = '#f9fafb'}
          onMouseOut={e => e.target.style.background = '#fff'}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          style={{
            padding: '0.75rem 2rem',
            fontSize: '0.9375rem',
            fontWeight: '600',
            border: 'none',
            borderRadius: '8px',
            background: '#1f2937',
            color: '#fff',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={e => e.target.style.background = '#111827'}
          onMouseOut={e => e.target.style.background = '#1f2937'}
        >
          Submit Expense
        </button>
      </div>
    </div>
  );
};

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const user = initialUsers.find((u) => u.email === email && u.password === password);
    if (user) {
      onLogin(user);
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div style={{
      minHeight: '90vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f3f4f6',
      padding: '2rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        background: '#fff',
        borderRadius: '12px',
        padding: '2.5rem 2rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.07), 0 10px 15px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '800',
            color: '#111827',
            marginBottom: '0.5rem',
            letterSpacing: '-0.025em'
          }}>ExpensePro</h1>
          <p style={{ color: '#6b7280', fontSize: '0.9375rem', margin: 0 }}>
            Sign in to your account
          </p>
        </div>

        {error && (
          <div style={{
            padding: '0.875rem 1rem',
            marginBottom: '1.5rem',
            background: '#fee2e2',
            border: '1px solid #fca5a5',
            borderRadius: '8px',
            color: '#991b1b',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            {error}
          </div>
        )}

        <div>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>Email Address</label>
            <input
              type="email"
              placeholder="your.email@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                fontSize: '0.9375rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                fontSize: '0.9375rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <button
            onClick={handleSubmit}
            style={{
              width: '100%',
              padding: '0.875rem',
              fontSize: '1rem',
              fontWeight: '700',
              border: 'none',
              borderRadius: '8px',
              background: '#1f2937',
              color: '#fff',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={e => e.target.style.background = '#111827'}
            onMouseOut={e => e.target.style.background = '#1f2937'}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ children, currentUser, onAddExpense }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = (newExpense) => {
    onAddExpense(newExpense);
    setIsModalOpen(false);
  };

  return (
    <>
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '1.75rem 2rem',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: '800',
            color: '#111827',
            margin: '0 0 0.25rem 0',
            letterSpacing: '-0.025em'
          }}>
            {currentUser.role} Dashboard
          </h1>
          <p style={{
            fontSize: '1rem',
            color: '#6b7280',
            margin: 0
          }}>
            Hello, {currentUser.name}!
          </p>
        </div>
        {currentUser.role !== 'Admin' && (
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              background: '#1f2937',
              color: '#fff',
              border: 'none',
              padding: '0.75rem 1.5rem',
              fontSize: '0.9375rem',
              fontWeight: '600',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={e => e.target.style.background = '#111827'}
            onMouseOut={e => e.target.style.background = '#1f2937'}
          >
            + New Expense
          </button>
        )}
      </div>

      {children}

      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(17, 24, 39, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: '12px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)'
            }}
          >
            <div style={{
              background: '#1f2937',
              color: '#fff',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>
                Create New Expense
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontSize: '1.75rem',
                  cursor: 'pointer',
                  lineHeight: 1,
                  padding: '0.25rem'
                }}
              >
                ×
              </button>
            </div>
            <ExpenseForm onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
};

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [users] = useState(initialUsers);

  const handleLogin = (user) => setCurrentUser(user);
  const handleLogout = () => setCurrentUser(null);

  const handleAddExpense = (newExpenseData) => {
    const newExpense = {
      ...newExpenseData,
      id: Date.now(),
      userId: currentUser.id,
      status: 'Pending',
    };
    setExpenses([...expenses, newExpense]);
  };

  const canApproveExpense = (approverId, expenseUserId) => {
    const approver = users.find(u => u.id === approverId);
    const expenseUser = users.find(u => u.id === expenseUserId);
    
    if (!approver || !expenseUser) return false;
    
    // Admin can approve all
    if (approver.role === 'Admin') return true;
    
    // Director can approve CFO, Manager, and Employee
    if (approver.role === 'Director') {
      return ['CFO', 'Manager', 'Employee'].includes(expenseUser.role);
    }
    
    // CFO can approve Manager and Employee
    if (approver.role === 'CFO') {
      return ['Manager', 'Employee'].includes(expenseUser.role);
    }
    
    // Manager can approve only Employee
    if (approver.role === 'Manager') {
      return expenseUser.role === 'Employee';
    }
    
    return false;
  };

  const handleUpdateExpense = (expenseId, status) => {
    const expense = expenses.find(e => e.id === expenseId);
    if (!expense) return;
    
    if (!canApproveExpense(currentUser.id, expense.userId)) {
      alert('You do not have permission to approve/reject this expense.');
      return;
    }
    
    let reason = '';
    if (status === 'Rejected') {
      reason = prompt('Please provide a reason for rejection:');
      if (reason === null) return;
    }
    setExpenses(expenses.map(exp => exp.id === expenseId ? { ...exp, status, comments: reason } : exp));
  };

  const getApprovalExpenses = () => {
    if (!currentUser) return [];
    
    return expenses.filter(expense => {
      if (expense.status !== 'Pending') return false;
      return canApproveExpense(currentUser.id, expense.userId);
    });
  };

  const renderDashboardContent = () => {
    if (!currentUser) return null;
    
    const myExpenses = expenses.filter(e => e.userId === currentUser.id);
    const approvableExpenses = getApprovalExpenses();
    
    // Group expenses by role for better organization
    const employeeExpenses = approvableExpenses.filter(e => users.find(u => u.id === e.userId)?.role === 'Employee');
    const managerExpenses = approvableExpenses.filter(e => users.find(u => u.id === e.userId)?.role === 'Manager');
    const cfoExpenses = approvableExpenses.filter(e => users.find(u => u.id === e.userId)?.role === 'CFO');
    const directorExpenses = approvableExpenses.filter(e => users.find(u => u.id === e.userId)?.role === 'Director');

    return (
      <Dashboard currentUser={currentUser} onAddExpense={handleAddExpense}>
        {/* Show approval sections based on role hierarchy */}
        {currentUser.role === 'Manager' && employeeExpenses.length > 0 && (
          <ExpenseList
            expenses={employeeExpenses}
            users={users}
            title="Employee Expenses (Pending Your Approval)"
            onAction={handleUpdateExpense}
            currentUserRole={currentUser.role}
            showUserFilter={true}
          />
        )}
        
        {currentUser.role === 'CFO' && (
          <>
            {managerExpenses.length > 0 && (
              <ExpenseList
                expenses={managerExpenses}
                users={users}
                title="Manager Expenses (Pending Your Approval)"
                onAction={handleUpdateExpense}
                currentUserRole={currentUser.role}
                showUserFilter={true}
              />
            )}
            {employeeExpenses.length > 0 && (
              <ExpenseList
                expenses={employeeExpenses}
                users={users}
                title="Employee Expenses (Pending Your Approval)"
                onAction={handleUpdateExpense}
                currentUserRole={currentUser.role}
                showUserFilter={true}
              />
            )}
          </>
        )}
        
        {currentUser.role === 'Director' && (
          <>
            {cfoExpenses.length > 0 && (
              <ExpenseList
                expenses={cfoExpenses}
                users={users}
                title="CFO Expenses (Pending Your Approval)"
                onAction={handleUpdateExpense}
                currentUserRole={currentUser.role}
                showUserFilter={true}
              />
            )}
            {managerExpenses.length > 0 && (
              <ExpenseList
                expenses={managerExpenses}
                users={users}
                title="Manager Expenses (Pending Your Approval)"
                onAction={handleUpdateExpense}
                currentUserRole={currentUser.role}
                showUserFilter={true}
              />
            )}
            {employeeExpenses.length > 0 && (
              <ExpenseList
                expenses={employeeExpenses}
                users={users}
                title="Employee Expenses (Pending Your Approval)"
                onAction={handleUpdateExpense}
                currentUserRole={currentUser.role}
                showUserFilter={true}
              />
            )}
          </>
        )}
        
        {currentUser.role === 'Admin' && (
          <>
            {directorExpenses.length > 0 && (
              <ExpenseList
                expenses={directorExpenses}
                users={users}
                title="Director Expenses (Pending Your Approval)"
                onAction={handleUpdateExpense}
                currentUserRole={currentUser.role}
                showUserFilter={true}
              />
            )}
            {cfoExpenses.length > 0 && (
              <ExpenseList
                expenses={cfoExpenses}
                users={users}
                title="CFO Expenses (Pending Your Approval)"
                onAction={handleUpdateExpense}
                currentUserRole={currentUser.role}
                showUserFilter={true}
              />
            )}
            {managerExpenses.length > 0 && (
              <ExpenseList
                expenses={managerExpenses}
                users={users}
                title="Manager Expenses (Pending Your Approval)"
                onAction={handleUpdateExpense}
                currentUserRole={currentUser.role}
                showUserFilter={true}
              />
            )}
            {employeeExpenses.length > 0 && (
              <ExpenseList
                expenses={employeeExpenses}
                users={users}
                title="Employee Expenses (Pending Your Approval)"
                onAction={handleUpdateExpense}
                currentUserRole={currentUser.role}
                showUserFilter={true}
              />
            )}
          </>
        )}

        {/* Show user's own expenses */}
        {currentUser.role !== 'Admin' && (
          <ExpenseList 
            expenses={myExpenses} 
            users={users} 
            title="My Submitted Expenses" 
            currentUserRole="Employee" 
          />
        )}
        
        {/* Admin overview of all expenses */}
        {currentUser.role === 'Admin' && (
          <ExpenseList 
            expenses={expenses} 
            users={users} 
            title="All Company Expenses (Complete Overview)" 
            currentUserRole="Admin"
            showUserFilter={true}
          />
        )}
      </Dashboard>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <nav style={{
        background: '#1f2937',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '64px'
        }}>
          <h2 style={{
            color: '#fff',
            fontSize: '1.5rem',
            fontWeight: '800',
            margin: 0,
            letterSpacing: '-0.025em'
          }}>
            ExpensePro
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {currentUser && (
              <>
                <div style={{ color: '#fff', fontSize: '0.9375rem' }}>
                  {currentUser.name}
                  <span style={{
                    background: '#374151',
                    padding: '0.25rem 0.625rem',
                    borderRadius: '6px',
                    marginLeft: '0.5rem',
                    fontSize: '0.8125rem',
                    fontWeight: '600'
                  }}>
                    {currentUser.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    background: '#fff',
                    color: '#1f2937',
                    border: 'none',
                    padding: '0.5rem 1.25rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={e => e.target.style.background = '#f3f4f6'}
                  onMouseOut={e => e.target.style.background = '#fff'}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '2rem'
      }}>
        {!currentUser ? <LoginPage onLogin={handleLogin} /> : renderDashboardContent()}
      </div>
    </div>
  );
}

export default App;