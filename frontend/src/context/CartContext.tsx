import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  shopId?: string;
}

interface CartContextType {
  cart: CartItem[];
  cartShopId: string | null;
  addToCart: (product: any) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('kirana_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [cartShopId, setCartShopId] = useState<string | null>(() => {
    return localStorage.getItem('kirana_cart_shop_id');
  });

  useEffect(() => {
    localStorage.setItem('kirana_cart', JSON.stringify(cart));
    if (cart.length === 0) {
      localStorage.removeItem('kirana_cart_shop_id');
      setCartShopId(null);
    } else if (cartShopId) {
      localStorage.setItem('kirana_cart_shop_id', cartShopId);
    }
  }, [cart, cartShopId]);

  const addToCart = (product: any) => {
    const productShopId = product.shop?._id || product.shop || product.shopId;
    
    if (cart.length > 0 && cartShopId && productShopId && cartShopId !== productShopId) {
      if (window.confirm('Adding items from a different shop will clear your current cart. Proceed?')) {
        setCart([{ 
          _id: product._id, 
          name: product.name, 
          price: product.price, 
          quantity: 1, 
          imageUrl: product.imageUrl || product.img,
          shopId: productShopId
        }]);
        setCartShopId(productShopId);
      }
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        return prev.map(item => 
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      if (cart.length === 0) setCartShopId(productShopId);
      return [...prev, { 
        _id: product._id, 
        name: product.name, 
        price: product.price, 
        quantity: 1, 
        imageUrl: product.imageUrl || product.img,
        shopId: productShopId
      }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item._id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item._id === productId) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, cartShopId, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
