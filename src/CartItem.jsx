import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeItem, updateQuantity } from './CartSlice';
import './CartItem.css';

const CartItem = ({ onContinueShopping }) => {
  const cart = useSelector(state => state.cart.items);
  const dispatch = useDispatch();

  /**
   * Calculates the total amount for all products in the cart.
   * Uses useMemo to cache the result and only recalculate when the 'cart' state changes.
   * This improves performance by avoiding unnecessary calculations on every render.
   */
  const totalAmount = useMemo(() => {
    return cart.reduce((total, item) => {
      // Extract numeric value from cost string (e.g., "$15" -> 15)
      const itemCost = parseFloat(item.cost.substring(1));
      return total + itemCost * item.quantity;
    }, 0);
  }, [cart]);

  /**
   * Handles the "Continue Shopping" button click.
   * Calls the parent function passed via props to navigate back to the product list.
   */
  const handleContinueShopping = (e) => {
    if (onContinueShopping) {
      onContinueShopping(e);
    }
  };

  /**
   * Handles the checkout button click.
   * Currently acts as a placeholder for future payment gateway integration.
   */
  const handleCheckoutShopping = (e) => {
    alert('Functionality to be added for future reference');
  };

  /**
   * Increments the quantity of a specific item in the cart.
   * Dispatches the updateQuantity action to the Redux store.
   * @param {Object} item - The cart item to update.
   */
  const handleIncrement = (item) => {
    dispatch(updateQuantity({ name: item.name, quantity: item.quantity + 1 }));
  };

  /**
   * Decrements the quantity of a specific item.
   * If the quantity reaches 0, it removes the item from the cart entirely.
   * @param {Object} item - The cart item to update.
   */
  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      dispatch(updateQuantity({ name: item.name, quantity: item.quantity - 1 }));
    } else {
      dispatch(removeItem(item.name));
    }
  };

  /**
   * Removes an item entirely from the cart regardless of quantity.
   * @param {Object} item - The cart item to remove.
   */
  const handleRemove = (item) => {
    dispatch(removeItem(item.name));
  };

  /**
   * Calculates the subtotal cost for a specific item type (Unit Cost * Quantity).
   * @param {Object} item - The cart item to calculate cost for.
   * @returns {number} The subtotal cost.
   */
  const calculateTotalCost = (item) => {
    const itemCost = parseFloat(item.cost.substring(1));
    return itemCost * item.quantity;
  };

  // Handle the empty cart edge case explicitly to improve user experience
  if (cart.length === 0) {
    return (
      <div className="cart-container">
        <h2 style={{ color: 'black' }}>Your Cart is Empty</h2>
        <div className="continue_shopping_btn">
          <button className="get-started-button" onClick={(e) => handleContinueShopping(e)}>
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2 style={{ color: 'black' }}>Total Cart Amount: ${totalAmount}</h2>
      <div>
        {cart.map((item) => (
          <div className="cart-item" key={item.name}>
            <img className="cart-item-image" src={item.image} alt={item.name} />
            <div className="cart-item-details">
              <div className="cart-item-name">{item.name}</div>
              <div className="cart-item-cost">{item.cost}</div>
              <div className="cart-item-quantity">
                <button 
                  className="cart-item-button cart-item-button-dec" 
                  onClick={() => handleDecrement(item)}
                >
                  -
                </button>
                <span className="cart-item-quantity-value">{item.quantity}</span>
                <button 
                  className="cart-item-button cart-item-button-inc" 
                  onClick={() => handleIncrement(item)}
                >
                  +
                </button>
              </div>
              <div className="cart-item-total">Total: ${calculateTotalCost(item)}</div>
              <button className="cart-item-delete" onClick={() => handleRemove(item)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '20px', color: 'black' }} className='total_cart_amount'></div>
      <div className="continue_shopping_btn">
        <button className="get-started-button" onClick={(e) => handleContinueShopping(e)}>Continue Shopping</button>
        <br />
        <button className="get-started-button1" onClick={(e) => handleCheckoutShopping(e)}>Checkout</button>
      </div>
    </div>
  );
};

export default CartItem;