"use client";
import { useCartStore } from "../../../store/useCardStore";
import { Button } from "@heroui/react";

export default function CartPage() {

  const { cart, updateQuantity, removeFromCart, clearCart } = useCartStore();
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return <div className="p-20 text-center">Your cart is empty.</div>;
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold mb-6">Your cart</h1>
      
      <div className="space-y-4">
        {cart.map((item) => (
          <div key={item.id} className="flex items-center justify-between border p-4 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-gray-500 rounded-lg" />
                
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center border rounded-full px-2">
                <button onClick={() => updateQuantity(item.id, 'decrease')} className="px-2">-</button>
                <span className="px-4 font-medium">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 'increase')} className="px-2">+</button>
              </div>
              <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
              <button onClick={() => removeFromCart(item.id)} className="text-xs text-red-500 ">Remove</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t pt-6">
        <div className="flex justify-between text-xl font-bold">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <Button className="w-full mt-6 bg-slate-900 text-white py-6 rounded-xl">Checkout</Button>
        <Button variant="light" onPress={clearCart} className="w-full mt-2 text-gray-500">Clear cart</Button>
      </div>
    </div>
  );
}