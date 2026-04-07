import { STORAGE_KEYS } from "../config";

export function getCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CART);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCart(cart) {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));
}

export function clearCart() {
  localStorage.removeItem(STORAGE_KEYS.CART);
  window.dispatchEvent(new Event("cart-updated"));
}

export function addCartItem(item) {
  const cart = getCart();
  const existingItem = cart.find((entry) => entry.menuId === item.menuId);

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }

  saveCart(cart);
  return cart;
}

export function updateCartQuantity(menuId, nextQty) {
  const nextCart = getCart()
    .map((item) => (item.menuId === menuId ? { ...item, qty: nextQty } : item))
    .filter((item) => item.qty > 0);

  saveCart(nextCart);
  return nextCart;
}
