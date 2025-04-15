import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, Search, Package, BarChart3, Settings, LogOut, ChevronDown, User, Menu, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from './context/authContext'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState({
    id: '',
    name: '',
    price: '',
    quantity: '',
    productLink: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  // Use the auth context
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  // Load items from localStorage on component mount
  useEffect(() => {
    const savedItems = localStorage.getItem('inventoryItems');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
  }, []);

  // Save items to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('inventoryItems', JSON.stringify(items));
    updateDatabse(user?.username,items);
  }, [items]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem({
      ...currentItem,
      [name]: value,
    });
  };

  const resetForm = () => {
    setCurrentItem({
      id: '',
      name: '',
      price: '',
      quantity: '',
      productLink: '',
    });
    setIsEditing(false);
  };

  const openModal = (item = null) => {
    if (item) {
      setCurrentItem(item);
      setIsEditing(true);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (
      !currentItem.name || 
      !currentItem.price || 
      !currentItem.quantity || 
      !currentItem.productLink
    ) {
      alert("Please fill in all fields");
      return;
    }

    if (isEditing) {

      setItems(
        items.map((item) => 
          item.id === currentItem.id ? currentItem : item
        )
      );
    } else {
      // Add new item
      const newItem = {
        ...currentItem,
        id: Date.now().toString(),
      };
      setItems([...items, newItem]);
    }

    closeModal();
  };

  const deleteItem = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateTotalPrice = (price, quantity) => {
    return (parseFloat(price) * parseInt(quantity)).toFixed(2);
  };

  // Statistics calculations
  const totalItems = items.length;
  const totalValue = items.reduce((sum, item) => sum + parseFloat(calculateTotalPrice(item.price, item.quantity)), 0).toFixed(2);
  const lowStock = items.filter(item => parseInt(item.quantity) < 10).length;

  const updateDatabse = async (username,items) => {
    try{
      const url = "https://stockmaster-3c97.onrender.com/api/auth/update-cart"; 

      const data = {
        username,
        items,
      };

      console.log("Data to be sent:", data);
      const res = await axios.put(url, data);
      console.log("Response from server:", res.data);
      
      if(res.status === 200){
        console.log("Database updated successfully");
      } else {
        console.error("Failed to update database");
      }
    }
    catch(error){
      console.error("Error updating database:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              {/* Logo */}
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-800">StockMaster</span>
              </div>
            </div>
            
            {/* Desktop menu */}
            <div className="hidden md:flex items-center">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#" className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium">Dashboard</a>
                <a href="#" className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Inventory</a>
                <a href="#" className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Reports</a>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                {mobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
              </button>
            </div>
            
            {/* User dropdown */}
            <div className="hidden md:flex items-center">
              <div className="ml-4 relative flex-shrink-0">
                <div>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 items-center"
                  >
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <User className="h-5 w-5" />
                    </div>
                    <span className="ml-2 text-gray-700">{user ? user.username : 'User'}</span>
                    <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
                  </button>
                </div>
                
                {/* User dropdown menu */}
                {userMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1">
                      <a href="#" className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <User className="mr-2 h-5 w-5" />
                        Profile
                      </a>
                      <a href="#" className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <Settings className="mr-2 h-5 w-5" />
                        Settings
                      </a>
                      <button 
                        onClick={handleLogout}
                        className="flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="mr-2 h-5 w-5" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white shadow-md">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              <a href="#" className="bg-blue-600 text-white block px-3 py-2 rounded-md text-base font-medium">Dashboard</a>
              <a href="#" className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium">Inventory</a>
              <a href="#" className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium">Reports</a>
              <a href="#" className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium flex items-center">
                <User className="mr-2 h-5 w-5" />
                Profile
              </a>
              <a href="#" className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                Settings
              </a>
              <button 
                onClick={handleLogout}
                className="w-full text-left text-gray-600 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium flex items-center"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Sign out
              </button>
            </div>
          </div>
        )}
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome message with user data */}
        <div className="bg-white p-4 rounded-lg shadow mb-8">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Welcome, {user ? user.username : 'User'}</h2>
              {user && user.email && (
                <p className="text-gray-600">{user.email}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Page header */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Inventory Management
            </h1>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                    <dd className="text-3xl font-semibold text-gray-900">{totalItems}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Inventory Value</dt>
                    <dd className="text-3xl font-semibold text-gray-900">${totalValue}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Low Stock Alert</dt>
                    <dd className="text-3xl font-semibold text-gray-900">{lowStock}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-lg mb-8">
          <div className="max-w-full mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-6 md:mb-0">
              <h2 className="text-2xl font-bold text-white mb-2">
                Effortless Inventory Management
              </h2>
              <p className="text-blue-100 max-w-lg">
                Track your products, monitor stock levels, and generate QR codes to streamline your inventory processes.
              </p>
              <button
                onClick={() => openModal()}
                className="mt-4 bg-white text-blue-600 hover:bg-blue-50 font-medium rounded-lg text-sm px-5 py-2.5 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Product
              </button>
            </div>
            <div className="md:w-1/3">
              <img 
                src="/api/placeholder/400/320" 
                alt="Inventory Management" 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
        
        {/* Search and Add Item Row */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button
            onClick={() => openModal()}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 flex items-center justify-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Product
          </button>
        </div>
        
        {/* Table */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th scope="col" className="py-3 px-6">Name</th>
                  <th scope="col" className="py-3 px-6">Unit Price</th>
                  <th scope="col" className="py-3 px-6">Quantity</th>
                  <th scope="col" className="py-3 px-6">Total Price</th>
                  <th scope="col" className="py-3 px-6">QR Code</th>
                  <th scope="col" className="py-3 px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium text-gray-900">{item.name}</td>
                      <td className="py-4 px-6">${parseFloat(item.price).toFixed(2)}</td>
                      <td className="py-4 px-6">{item.quantity}</td>
                      <td className="py-4 px-6">${calculateTotalPrice(item.price, item.quantity)}</td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center">
                          <QRCodeSVG
                            value={item.productLink} 
                            size={80}
                          />
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openModal(item)}
                            className="font-medium text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="font-medium text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="bg-white">
                    <td colSpan="6" className="py-8 px-6 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <Package className="w-12 h-12 text-gray-300 mb-2" />
                        <p>No products found. Add some products to your inventory!</p>
                        <button
                          onClick={() => openModal()}
                          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 flex items-center"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add First Product
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white mt-12 py-6 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Package className="h-6 w-6 text-blue-600" />
              <span className="ml-2 text-lg font-medium text-gray-800">StockMaster</span>
            </div>
            <p className="text-sm text-gray-500">
              © 2025 StockMaster. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-medium text-gray-900 mb-4">
                {isEditing ? 'Edit Product' : 'Add New Product'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Product Name</label>
                    <input
                      type="text"
                      name="name"
                      value={currentItem.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        name="price"
                        value={currentItem.price}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        className="block w-full pl-7 pr-12 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      value={currentItem.quantity}
                      onChange={handleInputChange}
                      min="1"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Product Link</label>
                    <input
                      type="url"
                      name="productLink"
                      value={currentItem.productLink}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://cdn.vectorstock.com/i/500p/91/26/inventory-management-concept-man-with-clipboard-vector-55299126.jpg"
                      required
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {isEditing ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;