import React, { useState, useEffect } from 'react';
// Import specific icons from react-icons/fa
import {
  FaUsers,
  FaUserCircle,
  FaSearch,
  FaUserTag,
  FaInfoCircle,
  FaPlusCircle,
  FaKey, // Icon for Change Password
  FaTrashAlt, // Replaces fa-trash-can
  FaSignOutAlt // Icon for Logout
} from 'react-icons/fa';

// New ResetPasswordModal Component
const ResetPasswordModal = ({ userId, onClose, onConfirm }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleReset = () => {
    if (newPassword === '') {
      setErrorMessage('Please enter a new password.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    setErrorMessage('');
    onConfirm(userId, newPassword);
  };

  const styles = {
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: '#fff',
      padding: '30px',
      borderRadius: '10px',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
      textAlign: 'center',
      maxWidth: '400px',
      width: '90%',
    },
    modalTitle: {
      fontSize: '22px',
      color: '#333',
      marginBottom: '20px',
    },
    formGroup: {
      marginBottom: '15px',
      textAlign: 'left',
    },
    formLabel: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: '500',
      color: '#555',
    },
    formInput: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      fontSize: '14px',
      outline: 'none',
    },
    errorMessage: {
      color: '#dc3545',
      fontSize: '12px',
      marginTop: '5px',
      textAlign: 'left',
    },
    modalButtons: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '10px',
      marginTop: '20px',
    },
    modalButton: {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: '500',
      transition: 'background-color 0.2s',
    },
    modalSaveButton: {
      backgroundColor: '#28a745',
      color: '#fff',
    },
    modalSaveButtonHover: {
      backgroundColor: '#218838',
    },
    modalCancelButton: {
      backgroundColor: '#e9ecef',
      color: '#333',
    },
    modalCancelButtonHover: {
      backgroundColor: '#d6d8db',
    },
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h2 style={styles.modalTitle}>Reset Password for User ID: {userId}</h2>
        <div style={styles.formGroup}>
          <label htmlFor="newPassword" style={styles.formLabel}>New Password:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={styles.formInput}
            placeholder="Enter new password"
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="confirmNewPassword" style={styles.formLabel}>Confirm New Password:</label>
          <input
            type="password"
            id="confirmNewPassword"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            style={styles.formInput}
            placeholder="Confirm new password"
          />
          {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
        </div>
        <div style={styles.modalButtons}>
          <button
            onClick={handleReset}
            style={{ ...styles.modalButton, ...styles.modalSaveButton }}
          >
            Reset Password
          </button>
          <button
            onClick={onClose}
            style={{ ...styles.modalButton, ...styles.modalCancelButton }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10); // Number of users to display per page

  // State for custom modals
  const [showInfoModal, setShowInfoModal] = useState(false); // For general info/confirmation
  const [modalMessage, setModalMessage] = useState('');
  const [modalAction, setModalAction] = useState(null); // Function to execute on confirm

  const [showAddUserModal, setShowAddUserModal] = useState(false); // For adding new user
  const [newUserData, setNewUserData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '', // Added password field
    confirmPassword: '', // Added confirm password field
    role: 'User', // Default role for new users
  });

  // State for Reset Password Modal
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [userToResetPassword, setUserToResetPassword] = useState(null);

  const [activeTab, setActiveTab] = useState('all'); // 'all', 'remove', 'block'

  // State for profile dropdown visibility
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Mock logged-in user data
  const [loggedInUser, setLoggedInUser] = useState({
    name: 'John Smith',
    role: ' Admin',
  });

  // Mock data for demonstration
  useEffect(() => {
    // Filter out 'CRM Manager' role from mock data
    const mockUsers = [
      { id: 1, fullName: 'John Smith', email: 'john.smith@gmail.com', username: 'jonny77', role: 'Super Admin', joinedDate: 'March 12, 2023', lastActive: '1 min ago', status: 'Active' },
      { id: 2, fullName: 'Olivia Bennett', email: 'oliyben69@gmail.com', username: 'oliy659', role: 'User', joinedDate: 'June 27, 2022', lastActive: '1 month ago', status: 'Inactive' },
      { id: 3, fullName: 'Daniel Warren', email: 'dwarren3@gmail.com', username: 'dwarren3', role: 'Delivery Agent', joinedDate: 'January 8, 2024', lastActive: '4 days ago', status: 'Banned' },
      { id: 4, fullName: 'Chloe Hayes', email: 'chloelhye@gmail.com', username: 'chloelh', role: 'Sub Admin', joinedDate: 'October 5, 2021', lastActive: '10 days ago', status: 'Pending' },
      { id: 5, fullName: 'Marcus Reed', email: 'reeds777@gmail.com', username: 'reeds7', role: 'Delivery Agent', joinedDate: 'February 19, 2023', lastActive: '3 min ago', status: 'Active' },
      { id: 6, fullName: 'Isabelle Clark', email: 'belleclark@gmail.com', username: 'bellecl', role: 'User', joinedDate: 'August 30, 2022', lastActive: '1 week ago', status: 'Active' },
      { id: 8, fullName: 'Mark Wilburg', email: 'markwill32@gmail.com', username: 'markwill32', role: 'User', joinedDate: 'November 14, 2020', lastActive: '2 mins ago', status: 'Inactive' },
      { id: 9, fullName: 'Nicholas Agemi', email: 'nicolass009@gmail.com', username: 'nicolass00', role: 'User', joinedDate: 'July 6, 2023', lastActive: '3 hours ago', status: 'Active' },
      { id: 10, fullName: 'Rosa Nadinn', email: 'naddlin@gmail.com', username: 'naddlin', role: 'Delivery Agent', joinedDate: 'December 31, 2021', lastActive: '4 min ago', status: 'Active' },
      { id: 11, fullName: 'Noemi Villan', email: 'noemivill99@gmail.com', username: 'noemi', role: 'Sub Admin', joinedDate: 'August 10, 2024', lastActive: '15 mins ago', status: 'Inactive' },
      { id: 12, fullName: 'Marcus Reed', email: 'reeds777@gmail.com', username: 'reeds7', role: 'User', joinedDate: 'March 12, 2023', lastActive: '1 minute ago', status: 'Banned' },
      { id: 13, fullName: 'Isabelle Clark', email: 'belleclark@gmail.com', username: 'bellecl', role: 'User', joinedDate: 'June 27, 2022', lastActive: '1 month ago', status: 'Pending' },
      { id: 14, fullName: 'Lucas Mitchell', email: 'lucamich@gmail.com', username: 'lucamich', role: 'User', joinedDate: 'January 8, 2024', lastActive: '4 days ago', status: 'Active' },
      { id: 15, fullName: 'Mark Wilburg', email: 'markwill32@gmail.com', username: 'markwill32', role: 'Delivery Agent', joinedDate: 'October 5, 2021', lastActive: '10 days ago', status: 'Active' },
      { id: 16, fullName: 'Nicholas Agemi', email: 'nicolass009@gmail.com', username: 'nicolass00', role: 'User', joinedDate: 'February 19, 2023', lastActive: '3 mins ago', status: 'Banned' },
      { id: 17, fullName: 'Sarah Connor', email: 'sarah.c@gmail.com', username: 'sconnor', role: 'Super Admin', joinedDate: 'May 1, 2023', lastActive: '2 days ago', status: 'Active' },
      { id: 18, fullName: 'David Lee', email: 'david.l@gmail.com', username: 'dlee', role: 'Sub Admin', joinedDate: 'July 15, 2024', lastActive: '1 hour ago', status: 'Active' },
    ].filter(user => user.role !== 'CRM Manager'); // Explicitly filter out CRM Manager
    setUsers(mockUsers);
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  // Function to handle opening the Reset Password modal
  const handleResetPasswordClick = (userId) => {
    setUserToResetPassword(userId);
    setShowResetPasswordModal(true);
  };

  // Function to confirm password reset (called from ResetPasswordModal)
  const confirmPasswordReset = (userId, newPassword) => {
    console.log(`Resetting password for user ID: ${userId} with new password: ${newPassword}`);
    // In a real application, you would make an API call here to reset the password
    setShowResetPasswordModal(false);
    setModalMessage(`Password for user ID: ${userId} has been reset.`);
    setModalAction(null);
    setShowInfoModal(true);
  };

  const handleDeleteUser = (userId) => {
    setModalMessage(`Are you sure you want to delete user with ID: ${userId}?`);
    setModalAction(() => () => {
      // Simulate deletion by filtering the user out of the state
      setUsers(users.filter(user => user.id !== userId));
      setShowInfoModal(false); // Close modal after action
    });
    setShowInfoModal(true);
  };

  const handleAddUserClick = () => {
    // Reset form including password fields
    setNewUserData({ fullName: '', email: '', username: '', password: '', confirmPassword: '', role: 'User' });
    setShowAddUserModal(true);
  };

  const handleNewUserInputChange = (e) => {
    const { name, value } = e.target;
    setNewUserData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleAddNewUser = () => {
    if (!newUserData.fullName || !newUserData.email || !newUserData.username || !newUserData.password || !newUserData.confirmPassword) {
      setModalMessage("Please fill in all required fields for the new user, including password.");
      setModalAction(null);
      setShowInfoModal(true);
      return;
    }

    if (newUserData.password !== newUserData.confirmPassword) {
      setModalMessage("Passwords do not match. Please re-enter.");
      setModalAction(null);
      setShowInfoModal(true);
      return;
    }

    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1, // Simple ID generation
      fullName: newUserData.fullName,
      email: newUserData.email,
      username: newUserData.username,
      // In a real app, you would hash the password before storing it
      // password: newUserData.password, // Not storing plaintext password in mock data
      role: newUserData.role,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      lastActive: 'just now',
      status: 'Active', // Default status for new users
    };
    setUsers(prevUsers => [...prevUsers, newUser]);
    setShowAddUserModal(false);
    // Clear form including password fields
    setNewUserData({ fullName: '', email: '', username: '', password: '', confirmPassword: '', role: 'User' });
    setModalMessage("User added successfully!");
    setModalAction(null);
    setShowInfoModal(true);
  };

  // Handle logout functionality
  const handleLogout = () => {
    console.log('User logged out!');
    // In a real application, you would clear authentication tokens, redirect to login, etc.
    setModalMessage('You have been successfully logged out.');
    setModalAction(null);
    setShowInfoModal(true);
    setShowProfileDropdown(false); // Close dropdown after logout
    // For a real app, you might also clear loggedInUser state and redirect
    // setLoggedInUser(null);
  };

  // Filtered and paginated users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase());
    // Ensure 'CRM Manager' is not considered in role filter
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;

    let matchesTab = true;
    if (activeTab === 'remove') {
      matchesTab = user.status === 'Inactive' || user.status === 'Banned';
    } else if (activeTab === 'block') {
      matchesTab = user.status === 'Banned';
    }
    // For 'all' tab, matchesTab remains true

    return matchesSearch && matchesRole && matchesStatus && matchesTab;
  });

  // Get current users for pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // --- Inline Styles Objects ---

  const styles = {
    container: {
      flexGrow: 1,
      padding: '20px 40px',
      backgroundColor: '#f8f9fa',
      fontFamily: 'Inter, sans-serif',
      minHeight: '100vh', // Ensure it takes full height
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
      paddingBottom: '20px',
      borderBottom: '1px solid #e0e0e0',
      position: 'relative', // For dropdown positioning
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px', // Space between icon and text
    },
    headerH1: {
      fontSize: '28px',
      color: '#333',
      marginBottom: '5px',
    },
    headerP: {
      fontSize: '14px',
      color: '#777',
    },
    headerIcon: {
      fontSize: '32px',
      color: '#007bff',
    },
    iconButton: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      color: '#666',
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '50%',
      transition: 'background-color 0.2s',
    },
    iconButtonHover: {
      backgroundColor: '#e9ecef',
    },
    profileDropdown: {
      position: 'absolute',
      top: '60px', // Adjust based on header height
      right: '0',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      minWidth: '200px',
      zIndex: 999,
      padding: '15px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      border: '1px solid #eee',
    },
    dropdownUserInfo: {
      paddingBottom: '10px',
      borderBottom: '1px solid #eee',
      marginBottom: '10px',
    },
    dropdownUserName: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#333',
    },
    dropdownUserRole: {
      fontSize: '14px',
      color: '#777',
    },
    dropdownButton: {
      width: '100%',
      padding: '10px 15px',
      border: 'none',
      borderRadius: '5px',
      backgroundColor: '#007bff',
      color: '#fff',
      fontSize: '15px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      transition: 'background-color 0.2s',
    },
    dropdownButtonHover: {
      backgroundColor: '#0056b3',
    },
    controls: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '25px',
      gap: '15px',
      flexWrap: 'wrap',
    },
    searchBar: {
      position: 'relative',
      flexGrow: 1,
      maxWidth: '600px',
    },
    searchBarIcon: {
      position: 'absolute',
      left: '15px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#999',
    },
    searchInput: {
      width: '100%',
      padding: '10px 10px 10px 40px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s',
    },
    searchInputFocus: {
      borderColor: '#007bff',
      boxShadow: '0 0 0 0.2rem rgba(0, 123, 255, 0.25)',
    },
    filters: {
      display: 'flex',
      gap: '15px',
      flexWrap: 'wrap',
    },
    filterGroup: {
      position: 'relative',
    },
    filterGroupIcon: {
      position: 'absolute',
      left: '15px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#999',
      pointerEvents: 'none',
    },
    filterSelectInput: {
      padding: '10px 10px 10px 40px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none',
      appearance: 'none',
      backgroundColor: '#fff',
      cursor: 'pointer',
      minWidth: '120px',
      transition: 'border-color 0.2s, box-shadow 0.2s',
    },
    filterSelectInputFocus: {
      borderColor: '#007bff',
      boxShadow: '0 0 0 0.2rem rgba(0, 123, 255, 0.25)',
    },
    addUserButton: {
      padding: '10px 18px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: '#007bff',
      color: '#fff',
      transition: 'background-color 0.2s',
    },
    addUserButtonHover: {
      backgroundColor: '#0056b3',
    },
    userActionsTabs: {
      display: 'flex',
      marginBottom: '25px',
      borderBottom: '1px solid #e0e0e0',
    },
    tabButton: {
      padding: '12px 20px',
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      fontSize: '15px',
      color: '#555',
      borderBottom: '3px solid transparent',
      transition: 'color 0.2s, border-bottom-color 0.2s',
    },
    tabButtonHover: {
      color: '#007bff',
    },
    tabButtonActive: {
      color: '#007bff',
      borderBottomColor: '#007bff',
      fontWeight: '500',
    },
    userTableContainer: {
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
      overflowX: 'auto',
      marginBottom: '30px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '14px',
    },
    tableTh: {
      padding: '15px',
      textAlign: 'left',
      borderBottom: '1px solid #eee',
      backgroundColor: '#f5f7fa',
      color: '#666',
      fontWeight: '600',
      textTransform: 'uppercase',
      fontSize: '12px',
    },
    tableTd: {
      padding: '15px',
      textAlign: 'left',
      borderBottom: '1px solid #eee',
      color: '#444',
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    userAvatar: {
      width: '30px',
      height: '30px',
      borderRadius: '50%',
      objectFit: 'cover',
    },
    statusBadge: {
      padding: '5px 10px',
      borderRadius: '5px',
      fontSize: '12px',
      fontWeight: '600',
      display: 'inline-block',
      minWidth: '65px',
      textAlign: 'center',
    },
    statusActive: {
      backgroundColor: '#e6ffe6',
      color: '#28a745',
    },
    statusInactive: {
      backgroundColor: '#fff3cd',
      color: '#ffc107',
    },
    statusPending: {
      backgroundColor: '#e0f2f7',
      color: '#17a2b8',
    },
    statusBanned: {
      backgroundColor: '#f8d7da',
      color: '#dc3545',
    },
    actionsColumn: {
      whiteSpace: 'nowrap', // Prevent buttons from wrapping
    },
    actionButton: {
      background: 'none',
      border: 'none',
      fontSize: '16px',
      cursor: 'pointer',
      marginRight: '10px',
      transition: 'color 0.2s',
    },
    actionButtonHover: {
      opacity: 0.8,
    },
    editButton: {
      color: '#17a2b8', // Cyan
    },
    deleteButton: {
      color: '#dc3545', // Red
    },
    noUsersFound: {
      textAlign: 'center',
      padding: '20px',
      color: '#777',
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '10px',
      padding: '15px 0',
    },
    paginationButton: {
      padding: '8px 15px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      backgroundColor: '#fff',
      cursor: 'pointer',
      fontSize: '14px',
      color: '#555',
      transition: 'background-color 0.2s, border-color 0.2s, color 0.2s',
    },
    paginationButtonHover: {
      backgroundColor: '#e9ecef',
    },
    paginationButtonActive: {
      backgroundColor: '#007bff',
      color: '#fff',
      borderColor: '#007bff',
    },
    paginationButtonDisabled: {
      cursor: 'not-allowed',
      opacity: '0.6',
      backgroundColor: '#f8f9fa',
      color: '#aaa',
    },
    pageNumbers: {
      display: 'flex',
      gap: '5px',
    },
    pageNumbersSpan: {
      padding: '8px 0',
      color: '#777',
    },
    // General Info/Confirmation Modal Styles
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: '#fff',
      padding: '30px',
      borderRadius: '10px',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
      textAlign: 'center',
      maxWidth: '400px',
      width: '90%',
    },
    modalMessage: {
      fontSize: '18px',
      marginBottom: '25px',
      color: '#333',
    },
    modalButtons: {
      display: 'flex',
      justifyContent: 'center',
      gap: '15px',
    },
    modalButton: {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '500',
      transition: 'background-color 0.2s',
    },
    modalConfirmButton: {
      backgroundColor: '#007bff',
      color: '#fff',
    },
    modalConfirmButtonHover: {
      backgroundColor: '#0056b3',
    },
    modalCancelButton: {
      backgroundColor: '#e9ecef',
      color: '#333',
    },
    modalCancelButtonHover: {
      backgroundColor: '#d6d8db',
    },
    // Add User Modal Specific Styles
    addUserModalContent: {
      backgroundColor: '#fff',
      padding: '30px',
      borderRadius: '10px',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
      maxWidth: '500px',
      width: '90%',
      textAlign: 'left', // Align text left for form fields
    },
    addUserModalTitle: {
      fontSize: '24px',
      color: '#333',
      marginBottom: '20px',
      textAlign: 'center',
    },
    formGroup: {
      marginBottom: '15px',
    },
    formLabel: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: '500',
      color: '#555',
    },
    formInput: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      fontSize: '14px',
      outline: 'none',
    },
    formSelect: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      fontSize: '14px',
      outline: 'none',
      backgroundColor: '#fff',
      appearance: 'none', // Remove default select arrow
    },
    addUserModalButtons: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '10px',
      marginTop: '20px',
    },
    addUserModalButton: {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: '500',
      transition: 'background-color 0.2s',
    },
    addUserModalSaveButton: {
      backgroundColor: '#28a745', // Green for Save
      color: '#fff',
    },
    addUserModalSaveButtonHover: {
      backgroundColor: '#218838',
    },
    addUserModalCancelButton: {
      backgroundColor: '#e9ecef',
      color: '#333',
    },
    addUserModalCancelButtonHover: {
      backgroundColor: '#d6d8db',
    },
  };

  // Helper to get status badge style
  const getStatusBadgeStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return { ...styles.statusBadge, ...styles.statusActive };
      case 'inactive':
        return { ...styles.statusBadge, ...styles.statusInactive };
      case 'pending':
        return { ...styles.statusBadge, ...styles.statusPending };
      case 'banned':
        return { ...styles.statusBadge, ...styles.statusBanned };
      default:
        return styles.statusBadge;
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          {/* React Icon for User Management */}
          <FaUsers style={styles.headerIcon} />
          <div>
            <h1 style={styles.headerH1}>User Management</h1>
            <p style={styles.headerP}>Manage all users in one place. Control access, assign roles, and monitor activity across your platform.</p>
          </div>
        </div>
        <div style={styles.headerRight}>
          {/* React Icon for User Profile - Clickable to toggle dropdown */}
          <button
            style={styles.iconButton}
            title="User Profile"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          >
            <FaUserCircle />
          </button>
          {/* Profile Dropdown */}
          {showProfileDropdown && loggedInUser && (
            <div style={styles.profileDropdown}>
              <div style={styles.dropdownUserInfo}>
                <p style={styles.dropdownUserName}>{loggedInUser.name}</p>
                <p style={styles.dropdownUserRole}>{loggedInUser.role}</p>
              </div>
              <button
                onClick={handleLogout}
                style={{ ...styles.dropdownButton, ...styles.dropdownButtonHover }}
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <div style={styles.controls}>
        <div style={styles.searchBar}>
          {/* React Icon for Search */}
          <FaSearch style={styles.searchBarIcon} />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            style={styles.searchInput}
          />
        </div>
        <div style={styles.filters}>
          <div style={styles.filterGroup}>
            {/* React Icon for Role Filter */}
            <FaUserTag style={styles.filterGroupIcon} />
            <select value={roleFilter} onChange={handleRoleFilterChange} style={styles.filterSelectInput}>
              <option value="All">Role</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Sub Admin">Sub Admin</option>
              <option value="Delivery Agent">Delivery Agent</option>
              <option value="User">User</option>
            </select>
          </div>
          <div style={styles.filterGroup}>
            {/* React Icon for Status Filter */}
            <FaInfoCircle style={styles.filterGroupIcon} />
            <select value={statusFilter} onChange={handleStatusFilterChange} style={styles.filterSelectInput}>
              <option value="All">Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
              <option value="Banned">Banned</option>
            </select>
          </div>
          {/* Removed Export Button */}
          <button style={styles.addUserButton} onClick={handleAddUserClick}>
            {/* React Icon for Add User */}
            <FaPlusCircle /> Add User
          </button>
        </div>
      </div>

      <div style={styles.userActionsTabs}>
        <button
          style={{ ...styles.tabButton, ...(activeTab === 'all' ? styles.tabButtonActive : {}) }}
          onClick={() => {
            setActiveTab('all');
            setCurrentPage(1); // Reset pagination on tab change
          }}
        >
          All Users
        </button>
        <button
          style={{ ...styles.tabButton, ...(activeTab === 'remove' ? styles.tabButtonActive : {}) }}
          onClick={() => {
            setActiveTab('remove');
            setCurrentPage(1); // Reset pagination on tab change
          }}
        >
          Remove Users
        </button>
        <button
          style={{ ...styles.tabButton, ...(activeTab === 'block' ? styles.tabButtonActive : {}) }}
          onClick={() => {
            setActiveTab('block');
            setCurrentPage(1); // Reset pagination on tab change
            setModalMessage("This tab shows 'Banned' users. Functionality to block users will be implemented here.");
            setModalAction(null);
            setShowInfoModal(true);
          }}
        >
          Block Users
        </button>
      </div>

      <div style={styles.userTableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableTh}>Full Name</th>
              <th style={styles.tableTh}>Email</th>
              <th style={styles.tableTh}>Username</th>
              <th style={styles.tableTh}>Role</th>
              <th style={styles.tableTh}>Joined Date</th>
              <th style={styles.tableTh}>Last Active</th>
              <th style={styles.tableTh}>Status</th>
              <th style={styles.tableTh}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map(user => (
                <tr key={user.id}>
                  <td style={styles.tableTd}>
                    <div style={styles.userInfo}>
                      <img src={`https://i.pravatar.cc/30?img=${user.id}`} alt="User Avatar" style={styles.userAvatar} />
                      {user.fullName}
                    </div>
                  </td>
                  <td style={styles.tableTd}>{user.email}</td>
                  <td style={styles.tableTd}>{user.username}</td>
                  <td style={styles.tableTd}>{user.role}</td>
                  <td style={styles.tableTd}>{user.joinedDate}</td>
                  <td style={styles.tableTd}>{user.lastActive}</td>
                  <td style={styles.tableTd}>
                    <span style={getStatusBadgeStyle(user.status)}>
                      {user.status}
                    </span>
                  </td>
                  <td style={{ ...styles.tableTd, ...styles.actionsColumn }}>
                    <button
                      onClick={() => handleResetPasswordClick(user.id)}
                      style={{ ...styles.actionButton, ...styles.editButton }}
                      title="Reset Password"
                    >
                      {/* React Icon for Change Password */}
                      <FaKey />
                    </button>

                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      style={{ ...styles.actionButton, ...styles.deleteButton }}
                      title="Delete User"
                    >
                      {/* React Icon for Delete */}
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={styles.noUsersFound}>No users found matching your criteria.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div style={styles.pagination}>
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          style={{ ...styles.paginationButton, ...(currentPage === 1 ? styles.paginationButtonDisabled : {}) }}
        >
          Previous
        </button>
        <div style={styles.pageNumbers}>
          {[...Array(totalPages).keys()].map(number => (
            <button
              key={number + 1}
              onClick={() => paginate(number + 1)}
              style={{
                ...styles.paginationButton,
                ...(currentPage === number + 1 ? styles.paginationButtonActive : {}),
              }}
            >
              {number + 1}
            </button>
          ))}
        </div>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{ ...styles.paginationButton, ...(currentPage === totalPages ? styles.paginationButtonDisabled : {}) }}
        >
          Next
        </button>
      </div>

      {/* General Info/Confirmation Modal */}
      {showInfoModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <p style={styles.modalMessage}>{modalMessage}</p>
            <div style={styles.modalButtons}>
              {modalAction && (
                <button
                  onClick={modalAction}
                  style={{ ...styles.modalButton, ...styles.modalConfirmButton }}
                >
                  Confirm
                </button>
              )}
              <button
                onClick={() => setShowInfoModal(false)}
                style={{ ...styles.modalButton, ...styles.modalCancelButton }}
              >
                {modalAction ? 'Cancel' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.addUserModalContent}>
            <h2 style={styles.addUserModalTitle}>Add New User</h2>
            <div style={styles.formGroup}>
              <label htmlFor="fullName" style={styles.formLabel}>Full Name:</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={newUserData.fullName}
                onChange={handleNewUserInputChange}
                style={styles.formInput}
                placeholder="Enter full name"
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.formLabel}>Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={newUserData.email}
                onChange={handleNewUserInputChange}
                style={styles.formInput}
                placeholder="Enter email address"
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="username" style={styles.formLabel}>Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={newUserData.username}
                onChange={handleNewUserInputChange}
                style={styles.formInput}
                placeholder="Enter username"
              />
            </div>
            {/* New Password Field */}
            <div style={styles.formGroup}>
              <label htmlFor="password" style={styles.formLabel}>Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={newUserData.password}
                onChange={handleNewUserInputChange}
                style={styles.formInput}
                placeholder="Set password"
              />
            </div>
            {/* New Confirm Password Field */}
            <div style={styles.formGroup}>
              <label htmlFor="confirmPassword" style={styles.formLabel}>Confirm Password:</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={newUserData.confirmPassword}
                onChange={handleNewUserInputChange}
                style={styles.formInput}
                placeholder="Confirm password"
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="role" style={styles.formLabel}>Role:</label>
              <select
                id="role"
                name="role"
                value={newUserData.role}
                onChange={handleNewUserInputChange}
                style={styles.formSelect}
              >
                <option value="User">User</option>
                <option value="Delivery Agent">Delivery Agent</option>
                <option value="Sub Admin">Sub Admin</option>
              </select>
            </div>
            <div style={styles.addUserModalButtons}>
              <button
                onClick={handleAddNewUser}
                style={{ ...styles.addUserModalButton, ...styles.addUserModalSaveButton }}
              >
                Add User
              </button>
              <button
                onClick={() => setShowAddUserModal(false)}
                style={{ ...styles.addUserModalButton, ...styles.addUserModalCancelButton }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetPasswordModal && (
        <ResetPasswordModal
          userId={userToResetPassword}
          onClose={() => setShowResetPasswordModal(false)}
          onConfirm={confirmPasswordReset}
        />
      )}
    </div>
  );
};

export default UserManagement;
