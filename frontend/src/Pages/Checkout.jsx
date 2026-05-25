import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/Checkout.css';
import { ShopContext } from '../Context/ShopContext';
import { AuthContext } from '../Context/AuthApiContext';
import { apiUrl } from '../lib/api';

const Checkout = () => {
  const navigate = useNavigate();
  const { getCartLineItems, getTotalCartAmount, clearCart } = useContext(ShopContext);
  const { currentUser, authToken } = useContext(AuthContext);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [submitError, setSubmitError] = useState('');
  const [addressOption, setAddressOption] = useState('profile'); // 'profile' or 'new'
  const [savedProfile, setSavedProfile] = useState(null);
  const [formData, setFormData] = useState({
    fullName: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  useEffect(() => {
    // Load saved profile address from localStorage
    if (currentUser) {
      const saved = JSON.parse(localStorage.getItem(`userProfile_${currentUser.id}`) || '{}');
      setSavedProfile(saved);
      
      // If profile has address, pre-fill form with it
      if (saved.address) {
        setFormData((prev) => ({
          ...prev,
          phone: saved.phone || '',
          address: saved.address || '',
          city: saved.city || '',
          state: saved.state || '',
          zip: saved.zip || '',
        }));
        setAddressOption('profile');
      }
    }
  }, [currentUser]);

  const cartItemsList = getCartLineItems();

  const subtotal = getTotalCartAmount();
  const grandTotal = subtotal;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressOptionChange = (option) => {
    setAddressOption(option);
    if (option === 'profile' && savedProfile) {
      // Revert to saved profile address
      setFormData((prev) => ({
        ...prev,
        phone: savedProfile.phone || '',
        address: savedProfile.address || '',
        city: savedProfile.city || '',
        state: savedProfile.state || '',
        zip: savedProfile.zip || '',
      }));
    } else if (option === 'new') {
      // Clear address fields for new entry
      setFormData((prev) => ({
        ...prev,
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: '',
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');

    const requiredFields = Object.values(formData).every((value) => value.trim() !== '');
    if (!requiredFields) {
      setSubmitError('Please complete the shipping form before placing your order.');
      return;
    }

    if (grandTotal <= 0) {
      navigate('/cart');
      return;
    }

    try {
      const response = await fetch(apiUrl('/orders'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          customer: formData,
          items: cartItemsList,
          total: grandTotal,
          paymentMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to place order.');
      }

      localStorage.setItem('shopperLastOrder', JSON.stringify(data.order));
      clearCart();
      navigate('/order-success', { state: { orderId: data.order.id } });
    } catch (error) {
      setSubmitError(error.message);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-hero">
        <p>Secure checkout</p>
        <h1>Complete your order</h1>
        <span>Signed in as {currentUser?.name}</span>
      </div>

      <div className="checkout-grid">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h2>Shipping details</h2>

          {savedProfile?.address && (
            <div className="address-option-section">
              <div className="address-option">
                <label className="address-label">
                  <input
                    type="radio"
                    name="addressOption"
                    value="profile"
                    checked={addressOption === 'profile'}
                    onChange={() => handleAddressOptionChange('profile')}
                  />
                  <span>Use saved address from profile</span>
                </label>
                <div className="saved-address-preview">
                  📍 {savedProfile.address}, {savedProfile.city}, {savedProfile.state} - {savedProfile.zip}
                </div>
              </div>

              <div className="address-option">
                <label className="address-label">
                  <input
                    type="radio"
                    name="addressOption"
                    value="new"
                    checked={addressOption === 'new'}
                    onChange={() => handleAddressOptionChange('new')}
                  />
                  <span>Use a different address</span>
                </label>
              </div>
            </div>
          )}

          <div className="checkout-fields">
            <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full name" />
            <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email address" />
            <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone number" />
            <input name="address" value={formData.address} onChange={handleChange} placeholder="Street address" />
            <input name="city" value={formData.city} onChange={handleChange} placeholder="City" />
            <input name="state" value={formData.state} onChange={handleChange} placeholder="State / Region" />
            <input name="zip" value={formData.zip} onChange={handleChange} placeholder="ZIP / Postal code" />
          </div>

          <h2>Payment method</h2>
          <div className="checkout-payment">
            <label>
              <input type="radio" name="payment" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
              Card
            </label>
            <label>
              <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
              Cash on delivery
            </label>
            <label>
              <input type="radio" name="payment" checked={paymentMethod === 'paypal'} onChange={() => setPaymentMethod('paypal')} />
              PayPal
            </label>
          </div>

          {submitError && <p className="checkout-error">{submitError}</p>}
          <button type="submit">Place order</button>
        </form>

        <aside className="checkout-summary">
          <h2>Order summary</h2>
          <div className="checkout-summary-items">
            {cartItemsList.map((item) => (
              <div className="checkout-summary-item" key={`${item.id}_${item.size}`}>
                <img src={item.image} alt={item.name} />
                <div>
                  <p>{item.name}</p>
                  <span>Size {item.size} • Qty {item.quantity}</span>
                </div>
                <strong>${item.new_price * item.quantity}</strong>
              </div>
            ))}
          </div>

          <div className="checkout-summary-totals">
            <div><span>Subtotal</span><strong>${subtotal}</strong></div>
            <div><span>Shipping</span><strong>Free</strong></div>
            <div className="checkout-grand-total"><span>Total</span><strong>${grandTotal}</strong></div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;