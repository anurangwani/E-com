import React, { useEffect, useState } from 'react';
import API from '../api';
import CartView from '../components/CartView';

export default function CartPage({ onCartChange }) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  async function load(){
    setLoading(true);
    try{
      const res = await API.get('/cart');
      setItems(res.data.items || []);
      setTotal(res.data.total || 0);
    }catch(e){ console.error(e); }
    setLoading(false);
  }

  useEffect(()=>{ load(); }, []);

  if (loading) return <div>Loading cart...</div>;

  return <CartView initialItems={items} initialTotal={total} onCartUpdate={onCartChange} />;
}
