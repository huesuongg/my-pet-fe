import React, { createContext, useReducer, useContext, ReactNode } from 'react';

// Define Product interface (simplified for cart context)
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  brand?: string;
  weight?: string;
  color?: string;
  size?: string;
}

// Define CartItem interface
interface CartItem {
  id: number; // Unique ID for the cart item itself
  product: Product;
  quantity: number;
}

// Define CartState interface
interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

// Define CartAction types
type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'UPDATE_ITEM_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'CLEAR_CART' };

// Initial state for the cart
const initialCartState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

// Cart Reducer function
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
  case 'ADD_ITEM': {
    const { product, quantity } = action.payload;
    const existingItemIndex = state.items.findIndex(
      (item) => item.product.id === product.id && 
        item.product.color === product.color && 
        item.product.size === product.size
    );

    if (existingItemIndex > -1) {
      const updatedItems = state.items.map((item, index) =>
        index === existingItemIndex
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      return { ...state, items: updatedItems, ...calculateTotals(updatedItems) };
    } else {
      const newItem: CartItem = {
        id: Date.now(),
        product,
        quantity,
      };
      const updatedItems = [...state.items, newItem];
      return { ...state, items: updatedItems, ...calculateTotals(updatedItems) };
    }
  }
  case 'UPDATE_ITEM_QUANTITY': {
    const { id, quantity } = action.payload;
    const updatedItems = state.items.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
    );
    return { ...state, items: updatedItems, ...calculateTotals(updatedItems) };
  }
  case 'REMOVE_ITEM': {
    const updatedItems = state.items.filter((item) => item.id !== action.payload);
    return { ...state, items: updatedItems, ...calculateTotals(updatedItems) };
  }
  case 'CLEAR_CART':
    return initialCartState;
  default:
    return state;
  }
};

// Helper function to calculate total items and price
const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  return { totalItems, totalPrice };
};

// Create the Cart Context
interface CartContextType {
  cartState: CartState;
  dispatch: React.Dispatch<CartAction>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart Provider component
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartState, dispatch] = useReducer(cartReducer, initialCartState);

  return (
    <CartContext.Provider value={{ cartState, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the Cart Context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
