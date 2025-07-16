import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const localCart = window.localStorage.getItem('cart');
      if (localCart) {
        setCartItems(JSON.parse(localCart));
      }
    } catch (error) {
      console.error('Failed to parse cart from localStorage', error);
      setCartItems([]);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    window.localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

    const addToCart = (product, quantity = 1) => {
    if (product.stock < 1) {
      // This case should ideally be handled by disabling the button, but as a fallback:
      console.error("Attempted to add an out-of-stock item.");
      return; // Or show a toast
    }

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
          // Here you should show a toast to the user
          console.warn(`Cannot add ${quantity} more. Only ${product.stock - existingItem.quantity} left in stock.`);
          // Optionally, you could add only the remaining stock instead of none.
          return prevItems; // Do not update cart
        }
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        );
      } else {
        if (quantity > product.stock) {
            console.warn(`Cannot add ${quantity}. Only ${product.stock} left in stock.`);
            return prevItems; // Do not update cart
        }
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
