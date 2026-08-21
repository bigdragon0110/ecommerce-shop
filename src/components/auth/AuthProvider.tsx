"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Customer, shopApi } from "@/lib/api/client";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import type { RootState } from "@/lib/store";
import { clearCart } from "@/lib/features/carts/cartsSlice";

type AuthContextValue = {
  user: Customer | null;
  loading: boolean;
  cartCount: number;
  wishlistCount: number;
  login(login:string,password:string):Promise<void>;
  register(input:RegistrationInput):Promise<void>;
  logout():Promise<void>;
  refreshCounts():Promise<void>;
};
export type RegistrationInput = {username:string;email:string;password:string;firstName:string;lastName:string;nickname?:string;marketingConsent:boolean;profilePublic:boolean;referralCode?:string;acceptedTerms:boolean;acceptedPrivacy:boolean;consentAcceptedAt:string};
const AuthContext=createContext<AuthContextValue|null>(null);

export function AuthProvider({children}:{children:React.ReactNode}){
  const [user,setUser]=useState<Customer|null>(null);const[loading,setLoading]=useState(true);
  const guestCart=useAppSelector((state:RootState)=>state.carts.cart);
  const dispatch=useAppDispatch();
  const[cartCount,setCartCount]=useState(0);const[wishlistCount,setWishlistCount]=useState(0);
  const refreshCounts=useCallback(async()=>{
    try{const [cart,wishlist]=await Promise.all([
      shopApi<{cart:{totalQuantity:number}}>("cart"),shopApi<{products:unknown[]}>("wishlist")]);
      setCartCount(cart.cart.totalQuantity);setWishlistCount(wishlist.products.length);
    }catch{setCartCount(0);setWishlistCount(0);}
  },[]);
  const load=useCallback(async()=>{try{const data=await shopApi<{user:Customer}>("auth/me");setUser(data.user);await refreshCounts();}catch{setUser(null);}finally{setLoading(false);}},[refreshCounts]);
  useEffect(()=>{void load();},[load]);
  const mergeGuestCart=useCallback(async()=>{if(!guestCart?.items.length)return;for(const item of guestCart.items){try{await shopApi("cart/items",{method:"POST",body:JSON.stringify({productId:item.id,variantId:item.variantId||undefined,quantity:item.quantity})});}catch{/* Unavailable legacy guest items are skipped. */}}dispatch(clearCart());},[guestCart,dispatch]);
  const login=useCallback(async(loginValue:string,password:string)=>{const data=await shopApi<{user:Customer}>("auth/login",{method:"POST",body:JSON.stringify({login:loginValue,password})});setUser(data.user);await mergeGuestCart();await refreshCounts();},[mergeGuestCart,refreshCounts]);
  const register=useCallback(async(input:RegistrationInput)=>{const data=await shopApi<{user:Customer}>("auth/register",{method:"POST",body:JSON.stringify(input)});setUser(data.user);await mergeGuestCart();await refreshCounts();},[mergeGuestCart,refreshCounts]);
  const logout=useCallback(async()=>{await shopApi("auth/logout",{method:"POST"});setUser(null);setCartCount(0);setWishlistCount(0);},[]);
  const value=useMemo(()=>({user,loading,cartCount,wishlistCount,login,register,logout,refreshCounts}),[user,loading,cartCount,wishlistCount,login,register,logout,refreshCounts]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth(){const value=useContext(AuthContext);if(!value)throw new Error("useAuth must be used inside AuthProvider");return value;}
