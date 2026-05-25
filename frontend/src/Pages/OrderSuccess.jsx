import React, { useEffect, useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../Context/AuthApiContext';
import { apiUrl } from '../lib/api';
import './CSS/OrderSuccess.css';

const OrderSuccess = () => {
  const location = useLocation();
  const { authToken } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // First, try to get from localStorage
        const savedOrder = JSON.parse(localStorage.getItem('shopperLastOrder') || 'null');
        
        if (savedOrder) {
          setOrder(savedOrder);
          setLoading(false);
          return;
        }

        // If no localStorage, get orderId from state
        const orderId = location.state?.orderId;
        
        if (!orderId) {
          setError('Order ID not found. Unable to retrieve order details.');
          setLoading(false);
          return;
        }

        // Try to fetch from backend API
        if (authToken) {
          const response = await fetch(apiUrl(`/orders/${orderId}`), {
            headers: {
              'Authorization': `Bearer ${authToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setOrder(data);
            // Save to localStorage for future reference
            localStorage.setItem('shopperLastOrder', JSON.stringify(data));
          } else {
            setError('Unable to retrieve order details from server.');
          }
        } else {
          setError('Authentication token not found. Unable to retrieve order.');
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Error retrieving order details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [location.state?.orderId, authToken]);

  if (loading) {
    return (
      <div className="order-success-page">
        <div className="order-success-container">
          <div className="order-success-card">
            <p>Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-success-page">
        <div className="order-success-container">
          <div className="order-success-card error">
            <h2>Error</h2>
            <p>{error}</p>
            <Link to="/" className="btn-primary">Go Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-success-page">
      <div className="order-success-hero">
        <p>Order confirmed</p>
        <h1>Thank you for your purchase</h1>
        <span>Your order has been placed successfully.</span>
      </div>

      <div className="order-success-container">
        <div className="order-success-card">
          <h2>Order Details</h2>
          {order ? (
            <>
              <div className="order-info">
                <p><strong>Order ID:</strong> {order.id}</p>
                <p><strong>Payment Method:</strong> {order.paymentMethod.toUpperCase()}</p>
                <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                <p><strong>Total Paid:</strong> ${order.total}</p>
              </div>

              <h3>Customer Information</h3>
              <div className="customer-info">
                <p><strong>Name:</strong> {order.customer.fullName}</p>
                <p><strong>Email:</strong> {order.customer.email}</p>
                <p><strong>Phone:</strong> {order.customer.phone}</p>
                <p><strong>Address:</strong> {order.customer.address}</p>
                <p><strong>City:</strong> {order.customer.city}</p>
                <p><strong>State:</strong> {order.customer.state}</p>
                <p><strong>ZIP:</strong> {order.customer.zip}</p>
              </div>

              <h3>Ordered Items</h3>
              <div className="ordered-items">
                {order.items && order.items.length > 0 ? (
                  <table className="items-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.name}</td>
                          <td>{item.category}</td>
                          <td>${item.new_price}</td>
                          <td>{item.quantity}</td>
                          <td>${item.new_price * item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No items in this order.</p>
                )}
              </div>
            </>
          ) : (
            <p>Your order details are not available.</p>
          )}
        </div>
      </div>

      <div className="order-success-actions">
        <Link to="/" className="btn-primary">Continue Shopping</Link>
        <Link to="/profile" className="btn-secondary">View Profile</Link>
      </div>
    </div>
  );
};

export default OrderSuccess;