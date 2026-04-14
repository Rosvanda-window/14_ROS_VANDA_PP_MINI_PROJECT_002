import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (product) => {
        const currentCart = get().cart;
        const existingItem = currentCart.find((item) => item.id === product.id);

        if (existingItem) {
          set({
            cart: currentCart.map((item) =>
              item.id === product.id 
                ? { ...item, quantity: (item.quantity || 1) + 1 } 
                : item
            ),
          });
        } else {
          set({ cart: [...currentCart, { ...product, quantity: 1 }] });
        }
      },

      // delete all pro
      removeFromCart: (productId) => 
        set({ cart: get().cart.filter((item) => item.id !== productId) }),

      // clear whole cart
      clearCart: () => set({ cart: [] }),

      // + - 
      updateQuantity: (productId, action) => {
        const currentCart = get().cart;
        set({
          cart: currentCart.map((item) => {
            if (item.id === productId) {
              const newQty = action === 'increase' ? item.quantity + 1 : item.quantity - 1;
              return { ...item, quantity: Math.max(1, newQty) };
            }
            return item;
          }),
        });
      },
    }),
    {
      name: 'purely-store-cart', 
    }
  )
);