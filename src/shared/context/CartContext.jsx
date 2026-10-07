import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext();

const STORAGE_KEY = 'flyen_cart_items_v1';

/**
 * Extracts clean numeric amount from diverse price formats:
 * e.g. "₹1,499" -> 1499, "2499.00" -> 2499, 1499 -> 1499
 */
export const parseNumericPrice = (priceVal) => {
  if (typeof priceVal === 'number') return isNaN(priceVal) ? 0 : priceVal;
  if (!priceVal) return 0;
  const cleaned = String(priceVal).replace(/[^\d.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Formats a number to Indian Rupee currency format (₹X,XXX)
 */
export const formatCurrency = (amount) => {
  const num = typeof amount === 'number' ? amount : parseNumericPrice(amount);
  return `₹${num.toLocaleString('en-IN')}`;
};

export const CartProvider = ({ children }) => {
  const { showToast } = useToast();
  const [items, setItems] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error('Error loading cart from localStorage:', err);
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync to localStorage whenever items change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error('Error saving cart to localStorage:', err);
    }
  }, [items]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen(prev => !prev), []);

  /**
   * Generates a deterministic unique key for each item variation
   */
  const getCartItemId = (product, options = {}) => {
    const rawId = product.id || product.slug || product.idNum || product.title;
    const type = product.type || (product.slug ? 'project' : '3d_print');
    const optStr = Object.keys(options).length > 0 ? JSON.stringify(options) : '';
    return `${type}_${rawId}_${optStr}`;
  };

  /**
   * Adds an item to the cart or increments its quantity
   */
  const addToCart = useCallback((product, quantity = 1, options = {}, shouldOpenDrawer = false) => {
    if (!product) return;
    const numPrice = parseNumericPrice(product.price);
    const cartItemId = getCartItemId(product, options);
    const itemType = product.type || (product.slug ? 'project' : '3d_print');
    const itemTitle = product.title || product.name || 'Flyen Product';
    const itemImage = product.image || product.images?.main || product.primary_image_url || (Array.isArray(product.images) ? product.images[0]?.image_url : '') || '';

    setItems(prevItems => {
      const existingIdx = prevItems.findIndex(i => i.cartItemId === cartItemId);
      if (existingIdx > -1) {
        const updated = [...prevItems];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: Math.min(99, updated[existingIdx].quantity + quantity),
          price: product.price || updated[existingIdx].price,
          numericPrice: numPrice || updated[existingIdx].numericPrice
        };
        return updated;
      }

      const newItem = {
        cartItemId,
        id: product.id || product.slug || product.idNum,
        slug: product.slug || null,
        idNum: product.idNum || product.id || null,
        title: itemTitle,
        price: product.price ? String(product.price) : formatCurrency(numPrice),
        numericPrice: numPrice,
        image: itemImage,
        category: product.category || (itemType === 'project' ? 'Project Kit' : '3D Print'),
        type: itemType,
        quantity: Math.max(1, quantity),
        options: options || {}
      };

      return [...prevItems, newItem];
    });

    if (showToast) {
      showToast(`🛒 "${itemTitle}" added to cart!`, 'success');
    }

    if (shouldOpenDrawer) {
      setIsCartOpen(true);
    }
  }, [showToast]);

  /**
   * Removes an item from the cart
   */
  const removeFromCart = useCallback((cartItemId) => {
    setItems(prev => {
      const target = prev.find(i => i.cartItemId === cartItemId);
      if (target && showToast) {
        showToast(`"${target.title}" removed from cart.`, 'info');
      }
      return prev.filter(i => i.cartItemId !== cartItemId);
    });
  }, [showToast]);

  /**
   * Updates quantity of an item
   */
  const updateQuantity = useCallback((cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    const safeQty = Math.min(99, Math.max(1, newQty));
    setItems(prev => prev.map(item => {
      if (item.cartItemId === cartItemId) {
        return { ...item, quantity: safeQty };
      }
      return item;
    }));
  }, [removeFromCart]);

  /**
   * Clears the entire cart
   */
  const clearCart = useCallback(() => {
    setItems([]);
    if (showToast) {
      showToast('Cart cleared.', 'info');
    }
  }, [showToast]);

  /**
   * Checks if a product is already in the cart
   */
  const isItemInCart = useCallback((productId) => {
    if (!productId) return false;
    return items.some(i => i.id === productId || i.slug === productId || i.idNum === productId);
  }, [items]);

  // Derived Totals
  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const price = item.numericPrice || parseNumericPrice(item.price);
      return sum + (price * (item.quantity || 1));
    }, 0);
  }, [items]);

  const contextValue = useMemo(() => ({
    items,
    totalItems,
    subtotal,
    formattedSubtotal: formatCurrency(subtotal),
    isCartOpen,
    openCart,
    closeCart,
    toggleCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isItemInCart
  }), [
    items,
    totalItems,
    subtotal,
    isCartOpen,
    openCart,
    closeCart,
    toggleCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isItemInCart
  ]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
