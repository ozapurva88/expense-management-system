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

const ExpenseCard = ({ expense, users, onAction, currentUserRole }) => {
  const getUserName = (userId) => users.find(u => u.id === userId)?.name || 'Unknown';
  const getUserRole = (userId) => users.find(u => u.id === userId)?.role || 'Unknown';
  const statusColors = {
    'Approved': { bg: '#d1f4e0', color: '#0d8a54', icon: '✓' },
    'Pending': { bg: '#fff4cc', color: '#997404', icon: '⏱' },
    'Rejected': { bg: '#ffd6d6', color: '#c92a2a', icon: '✗' }
  };
  const status = statusColors[expense.status] || statusColors['Pending'];

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '1.75rem',
      marginBottom: '1.25rem',
      boxShadow: '0 4px 20px rgba(13, 202, 240, 0.15)',
      border: '2px solid #e3f4fd',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    }} onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 8px 30px rgba(13, 202, 240, 0.25)';
    }} onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 20px rgba(13, 202, 240, 0.15)';
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.9rem', color: '#0dcaf0', fontWeight: '700', marginBottom: '0.3rem' }}>
            {expense.date}
          </div>
          {currentUserRole !== 'Employee' && (
            <>
              <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#212529' }}>
                {getUserName(expense.userId)}
              </div>
              <span style={{
                background: '#f3f4f6',
                color: '#374151',
                padding: '0.3rem 0.7rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: '700',
                display: 'inline-block',
                marginTop: '0.4rem'
              }}>{getUserRole(expense.userId)}</span>
            </>
          )}
        </div>
        <span style={{
          ...status,
          padding: '0.5rem 1.2rem',
          borderRadius: '25px',
          fontSize: '0.85rem',
          fontWeight: '700',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem'
        }}>
          {status.icon} {expense.status}
        </span>
      </div>
      <div style={{
        background: 'linear-gradient(135deg, #0dcaf0 0%, #0aa2c0 100%)',
        padding: '0.5rem 1rem',
        borderRadius: '10px',
        display: 'inline-block',
        marginBottom: '0.8rem'
      }}>
        <span style={{ color: 'white', fontWeight: '700', fontSize: '0.9rem' }}>
          {expense.category}
        </span>
      </div>
      <p style={{ color: '#6c757d', fontSize: '1rem', margin: '0.8rem 0 1rem 0', lineHeight: '1.6' }}>
        {expense.description}
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0dcaf0' }}>
          {expense.amount.toFixed(2)} <span style={{ fontSize: '1.2rem', fontWeight: '600' }}>{expense.currency}</span>
        </div>
        {onAction && expense.status === 'Pending' && (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => onAction(expense.id, 'Approved')} style={{
              background: 'linear-gradient(135deg, #20c997 0%, #17a2b8 100%)',
              color: 'white',
              border: 'none',
              padding: '0.6rem 1.4rem',
              borderRadius: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '0.95rem',
              boxShadow: '0 4px 15px rgba(32, 201, 151, 0.3)'
            }}>✓ Approve</button>
            <button onClick={() => onAction(expense.id, 'Rejected')} style={{
              background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
              color: 'white',
              border: 'none',
              padding: '0.6rem 1.4rem',
              borderRadius: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '0.95rem',
              boxShadow: '0 4px 15px rgba(220, 53, 69, 0.3)'
            }}>✗ Reject</button>
          </div>
        )}
      </div>
    </div>
  );
};

const ExpenseList = ({ expenses, users, title, onAction, currentUserRole, showUserFilter = false }) => {
  const [filterUserId, setFilterUserId] = useState('all');
  
  const filteredExpenses = filterUserId === 'all' 
    ? expenses 
    : expenses.filter(e => e.userId === parseInt(filterUserId));

  const uniqueUserIds = [...new Set(expenses.map(e => e.userId))];

  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{
        background: 'linear-gradient(135deg, #0dcaf0 0%, #0aa2c0 100%)',
        padding: '1.5rem 2rem',
        borderRadius: '16px 16px 0 0',
        boxShadow: '0 4px 20px rgba(13, 202, 240, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <h3 style={{ color: 'white', margin: 0, fontWeight: '800', fontSize: '1.6rem', letterSpacing: '0.3px' }}>
          {title}
        </h3>
        {/* {showUserFilter && uniqueUserIds.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <label style={{ color: 'white', fontSize: '0.9rem', fontWeight: '600' }}>
              Filter by User:
            </label>
            <select
              value={filterUserId}
              onChange={(e) => setFilterUserId(e.target.value)}
              style={{
                padding: '0.6rem 1rem',
                fontSize: '0.9rem',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              <option value="all" style={{ color: '#212529' }}>All Users</option>
              {uniqueUserIds.map(userId => {
                const user = users.find(u => u.id === userId);
                return (
                  <option key={userId} value={userId} style={{ color: '#212529' }}>
                    {user?.name} ({user?.role})
                  </option>
                );
              })}
            </select>
          </div>
        )} */}
      </div>
      <div style={{ background: '#f8fbfd', padding: '1.5rem', borderRadius: '0 0 16px 16px' }}>
        {filteredExpenses.length > 0 ? filteredExpenses.map(expense => (
          <ExpenseCard key={expense.id} expense={expense} users={users} onAction={onAction} currentUserRole={currentUserRole} />
        )) : (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            color: '#6c757d',
            fontSize: '1.2rem',
            background: 'white',
            borderRadius: '12px'
          }}>
            No expenses to display
          </div>
        )}
      </div>
    </div>
  );
};

const AccordionSection = ({ title, children, isOpen, onToggle }) => (
  <div style={{ marginBottom: '1rem', border: '2px solid #d4edfa', borderRadius: '12px', overflow: 'hidden' }}>
    <div onClick={onToggle} style={{
      background: isOpen ? 'linear-gradient(135deg, #0dcaf0 0%, #0aa2c0 100%)' : '#f0f9ff',
      padding: '1.2rem 1.5rem',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      transition: 'all 0.3s ease'
    }}>
      <span style={{ fontWeight: '700', fontSize: '1.1rem', color: isOpen ? 'white' : '#0dcaf0' }}>{title}</span>
      <span style={{ fontSize: '1.5rem', color: isOpen ? 'white' : '#0dcaf0', fontWeight: 'bold' }}>
        {isOpen ? '−' : '+'}
      </span>
    </div>
    {isOpen && (
      <div style={{ padding: '1.5rem', background: 'white' }}>
        {children}
      </div>
    )}
  </div>
);

const ExpenseForm = ({ onSave, onCancel }) => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [openSection, setOpenSection] = useState('basic');

  const handleSubmit = () => {
    if (!amount || !category || !description || !date) {
      alert('Please fill all fields');
      return;
    }
    onSave({ amount: parseFloat(amount), currency, category, description, date });
  };

  const inputStyle = {
    width: '100%',
    padding: '0.9rem 1.2rem',
    borderRadius: '10px',
    border: '2px solid #b3e5fc',
    fontSize: '1rem',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease'
  };

  return (
    <div style={{ padding: '1rem' }}>
      <AccordionSection title="💰 Basic Information" isOpen={openSection === 'basic'} onToggle={() => setOpenSection(openSection === 'basic' ? '' : 'basic')}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.2rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '700', color: '#0dcaf0', marginBottom: '0.6rem' }}>Amount</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} style={inputStyle} placeholder="0.00" />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '700', color: '#0dcaf0', marginBottom: '0.6rem' }}>Currency</label>
            <input type="text" value={currency} onChange={(e) => setCurrency(e.target.value)} style={inputStyle} />
          </div>
        </div>
      </AccordionSection>

      <AccordionSection title="📁 Category & Details" isOpen={openSection === 'category'} onToggle={() => setOpenSection(openSection === 'category' ? '' : 'category')}>
        <div style={{ marginBottom: '1.2rem' }}>
          <label style={{ display: 'block', fontWeight: '700', color: '#0dcaf0', marginBottom: '0.6rem' }}>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
            <option value="">Choose Category</option>
            <option value="Travel">✈️ Travel</option>
            <option value="Food">🍽️ Food</option>
            <option value="Office Supplies">📎 Office Supplies</option>
            <option value="Other">📦 Other</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '700', color: '#0dcaf0', marginBottom: '0.6rem' }}>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} style={inputStyle} placeholder="Enter expense details..." />
        </div>
      </AccordionSection>

      <AccordionSection title="📅 Date" isOpen={openSection === 'date'} onToggle={() => setOpenSection(openSection === 'date' ? '' : 'date')}>
        <label style={{ display: 'block', fontWeight: '700', color: '#0dcaf0', marginBottom: '0.6rem' }}>Expense Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />
      </AccordionSection>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <button onClick={onCancel} style={{
          flex: 1,
          padding: '1rem',
          borderRadius: '12px',
          border: '2px solid #d4edfa',
          background: 'white',
          color: '#0dcaf0',
          fontWeight: '700',
          fontSize: '1.05rem',
          cursor: 'pointer'
        }}>Cancel</button>
        <button onClick={handleSubmit} style={{
          flex: 2,
          padding: '1rem',
          borderRadius: '12px',
          border: 'none',
          background: 'linear-gradient(135deg, #0dcaf0 0%, #0aa2c0 100%)',
          color: 'white',
          fontWeight: '700',
          fontSize: '1.05rem',
          cursor: 'pointer',
          boxShadow: '0 6px 25px rgba(13, 202, 240, 0.4)'
        }}>Submit Expense</button>
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
      setError('Invalid credentials');
    }
  };

  return (
    <div style={{
      minHeight: '90vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #e0f7ff 0%, #b3e5fc 50%, #81d4fa 100%)',
      padding: '2rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '3rem',
        width: '100%',
        maxWidth: '450px',
        boxShadow: '0 25px 70px rgba(13, 202, 240, 0.35)',
        border: '3px solid #b3e5fc'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #0dcaf0 0%, #0aa2c0 100%)',
            borderRadius: '50%',
            margin: '0 auto 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            boxShadow: '0 8px 25px rgba(13, 202, 240, 0.4)'
          }}>💼</div>
          <h1 style={{
            fontSize: '2.8rem',
            fontWeight: '900',
            color: '#0dcaf0',
            margin: '0 0 0.5rem 0',
            letterSpacing: '1px'
          }}>ExpensePro</h1>
          <p style={{ color: '#6c757d', fontSize: '1.1rem', margin: 0, fontWeight: '500' }}>Manage your expenses smartly</p>
        </div>
        {error && (
          <div style={{
            background: '#ffe0e0',
            color: '#c92a2a',
            padding: '1rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            fontWeight: '600',
            border: '2px solid #ffa0a0'
          }}>{error}</div>
        )}
        <div style={{ width: '100%' }}>
          <div style={{ marginBottom: '1.5rem', width: '100%' }}>
            <label style={{ display: 'block', fontWeight: '700', color: '#0dcaf0', marginBottom: '0.6rem', fontSize: '1.05rem' }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@company.com"
              style={{
                width: '100%',
                padding: '1rem 1.2rem',
                borderRadius: '12px',
                border: '2px solid #b3e5fc',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{ marginBottom: '2rem', width: '100%' }}>
            <label style={{ display: 'block', fontWeight: '700', color: '#0dcaf0', marginBottom: '0.6rem', fontSize: '1.05rem' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{
                width: '100%',
                padding: '1rem 1.2rem',
                borderRadius: '12px',
                border: '2px solid #b3e5fc',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <button onClick={handleSubmit} style={{
            width: '100%',
            padding: '1.2rem',
            borderRadius: '14px',
            border: 'none',
            background: 'linear-gradient(135deg, #0dcaf0 0%, #0aa2c0 100%)',
            color: 'white',
            fontSize: '1.2rem',
            fontWeight: '800',
            cursor: 'pointer',
            boxShadow: '0 8px 30px rgba(13, 202, 240, 0.4)',
            letterSpacing: '0.5px'
          }}>LOGIN</button>
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ children, currentUser, onAddExpense }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div style={{
        background: 'linear-gradient(135deg, #e0f7ff 0%, #f0f9ff 100%)',
        padding: '2.5rem 2rem',
        borderRadius: '20px',
        marginBottom: '2rem',
        boxShadow: '0 4px 20px rgba(13, 202, 240, 0.15)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{
              background: 'linear-gradient(135deg, #0dcaf0 0%, #0aa2c0 100%)',
              color: 'white',
              padding: '0.4rem 1rem',
              borderRadius: '20px',
              fontSize: '0.9rem',
              fontWeight: '700',
              marginBottom: '0.8rem',
              display: 'inline-block'
            }}>{currentUser.role}</span>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#0dcaf0', margin: '0.5rem 0', letterSpacing: '0.5px' }}>
              Dashboard
            </h1>
            <p style={{ fontSize: '1.15rem', color: '#6c757d', margin: 0, fontWeight: '500' }}>
              Hello, {currentUser.name}! 👋
            </p>
          </div>
          {currentUser.role !== 'Admin' && (
            <button onClick={() => setIsModalOpen(true)} style={{
              background: 'linear-gradient(135deg, #0dcaf0 0%, #0aa2c0 100%)',
              color: 'white',
              border: 'none',
              padding: '1rem 2.5rem',
              borderRadius: '14px',
              fontSize: '1.1rem',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: '0 6px 25px rgba(13, 202, 240, 0.4)',
              letterSpacing: '0.3px'
            }}>+ New Expense</button>
          )}
        </div>
      </div>
      {children}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(13, 202, 240, 0.15)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }} onClick={() => setIsModalOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{
            background: 'white',
            borderRadius: '24px',
            maxWidth: '700px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 25px 70px rgba(13, 202, 240, 0.35)',
            border: '3px solid #b3e5fc'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #0dcaf0 0%, #0aa2c0 100%)',
              padding: '2rem',
              borderRadius: '21px 21px 0 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ color: 'white', margin: 0, fontWeight: '800', fontSize: '1.8rem' }}>Create New Expense</h2>
              <button onClick={() => setIsModalOpen(false)} style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: 'white',
                fontSize: '2rem',
                cursor: 'pointer',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>×</button>
            </div>
            <ExpenseForm onSave={(data) => { onAddExpense(data); setIsModalOpen(false); }} onCancel={() => setIsModalOpen(false)} />
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

  const handleAddExpense = (newExpenseData) => {
    setExpenses([...expenses, {
      ...newExpenseData,
      id: Date.now(),
      userId: currentUser.id,
      status: 'Pending',
    }]);
  };

  const canApproveExpense = (approverId, expenseUserId) => {
    const approver = users.find(u => u.id === approverId);
    const expenseUser = users.find(u => u.id === expenseUserId);
    
    if (!approver || !expenseUser) return false;
    
    if (approver.role === 'Admin') return true;
    if (approver.role === 'Director') {
      return ['CFO', 'Manager', 'Employee'].includes(expenseUser.role);
    }
    if (approver.role === 'CFO') {
      return ['Manager', 'Employee'].includes(expenseUser.role);
    }
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
      reason = prompt('Reason for rejection:');
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

  const renderDashboard = () => {
    if (!currentUser) return null;
    
    const myExpenses = expenses.filter(e => e.userId === currentUser.id);
    const approvableExpenses = getApprovalExpenses();
    
    const employeeExpenses = approvableExpenses.filter(e => users.find(u => u.id === e.userId)?.role === 'Employee');
    const managerExpenses = approvableExpenses.filter(e => users.find(u => u.id === e.userId)?.role === 'Manager');
    const cfoExpenses = approvableExpenses.filter(e => users.find(u => u.id === e.userId)?.role === 'CFO');
    const directorExpenses = approvableExpenses.filter(e => users.find(u => u.id === e.userId)?.role === 'Director');

    return (
      <Dashboard currentUser={currentUser} onAddExpense={handleAddExpense}>
        {currentUser.role === 'Manager' && employeeExpenses.length > 0 && (
          <ExpenseList
            expenses={employeeExpenses}
            users={users}
            title="📋 Employee Expenses (Pending Your Approval)"
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
                title="📋 Manager Expenses (Pending Your Approval)"
                onAction={handleUpdateExpense}
                currentUserRole={currentUser.role}
                showUserFilter={true}
              />
            )}
            {employeeExpenses.length > 0 && (
              <ExpenseList
                expenses={employeeExpenses}
                users={users}
                title="📋 Employee Expenses (Pending Your Approval)"
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
                title="📋 CFO Expenses (Pending Your Approval)"
                onAction={handleUpdateExpense}
                currentUserRole={currentUser.role}
                showUserFilter={true}
              />
            )}
            {managerExpenses.length > 0 && (
              <ExpenseList
                expenses={managerExpenses}
                users={users}
                title="📋 Manager Expenses (Pending Your Approval)"
                onAction={handleUpdateExpense}
                currentUserRole={currentUser.role}
                showUserFilter={true}
              />
            )}
            {employeeExpenses.length > 0 && (
              <ExpenseList
                expenses={employeeExpenses}
                users={users}
                title="📋 Employee Expenses (Pending Your Approval)"
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
                title="⏳ Director Expenses (Pending Your Approval)"
                onAction={handleUpdateExpense}
                currentUserRole={currentUser.role}
                showUserFilter={true}
              />
            )}
            {cfoExpenses.length > 0 && (
              <ExpenseList
                expenses={cfoExpenses}
                users={users}
                title="⏳ CFO Expenses (Pending Your Approval)"
                onAction={handleUpdateExpense}
                currentUserRole={currentUser.role}
                showUserFilter={true}
              />
            )}
            {managerExpenses.length > 0 && (
              <ExpenseList
                expenses={managerExpenses}
                users={users}
                title="⏳ Manager Expenses (Pending Your Approval)"
                onAction={handleUpdateExpense}
                currentUserRole={currentUser.role}
                showUserFilter={true}
              />
            )}
            {employeeExpenses.length > 0 && (
              <ExpenseList
                expenses={employeeExpenses}
                users={users}
                title="⏳ Employee Expenses (Pending Your Approval)"
                onAction={handleUpdateExpense}
                currentUserRole={currentUser.role}
                showUserFilter={true}
              />
            )}
          </>
        )}

        {currentUser.role !== 'Admin' && (
          <ExpenseList 
            expenses={myExpenses} 
            users={users} 
            title="📝 My Submitted Expenses" 
            currentUserRole="Employee" 
          />
        )}
        
        {currentUser.role === 'Admin' && (
          <ExpenseList 
            expenses={expenses} 
            users={users} 
            title="📊 All Company Expenses (Complete Overview)" 
            currentUserRole="Admin"
            showUserFilter={true}
          />
        )}
      </Dashboard>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f9ff' }}>
      <nav style={{
        background: 'linear-gradient(135deg, #0dcaf0 0%, #0aa2c0 100%)',
        padding: '1.2rem 0',
        boxShadow: '0 4px 25px rgba(13, 202, 240, 0.3)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1300px',
          margin: '0 auto',
          padding: '0 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ color: 'white', fontSize: '2rem', fontWeight: '900', margin: 0, letterSpacing: '1px' }}>
            💼 ExpensePro
          </h2>
          {currentUser && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <span style={{
                background: 'rgba(255, 255, 255, 0.25)',
                color: 'white',
                padding: '0.6rem 1.5rem',
                borderRadius: '20px',
                fontWeight: '700',
                fontSize: '1rem'
              }}>{currentUser.name}</span>
              <button onClick={() => setCurrentUser(null)} style={{
                background: 'white',
                color: '#0dcaf0',
                border: 'none',
                padding: '0.7rem 1.8rem',
                borderRadius: '12px',
                fontWeight: '800',
                cursor: 'pointer',
                fontSize: '1rem',
                boxShadow: '0 4px 15px rgba(255, 255, 255, 0.3)'
              }}>Logout</button>
            </div>
          )}
        </div>
      </nav>
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '2rem' }}>
        {!currentUser ? <LoginPage onLogin={setCurrentUser} /> : renderDashboard()}
      </div>
    </div>
  );
}

export default App;