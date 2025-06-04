"use client";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import Image from "next/image";


import { useSelector, useDispatch } from 'react-redux';
import { addToCart, updateQuantity, removeToCart, setCartItems } from "../store/slices/basketSlice";

import { productsData } from '../data/productsData';
import { reviewsData } from '../data/reviewsData';

export default function Home() {
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const cartItems = useSelector((state: any) => state.basket.items);

  const dispatch = useDispatch();
  useEffect(() => {

    const stored = localStorage.getItem('product');
    if (stored) {
      dispatch(setCartItems(JSON.parse(stored)));
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'cart') {
        const newCart = event.newValue ? JSON.parse(event.newValue) : [];
        dispatch(setCartItems(newCart));
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [dispatch]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value.replace(/\D/g, '');

    if (input.length > 11) return;

    let formattedInputValue = '+7';

    if (input.length > 1) {
      formattedInputValue += ' (' + input.substring(1, 4);
    }
    if (input.length > 4) {
      formattedInputValue += ') ' + input.substring(4, 7);
    }
    if (input.length > 7) {
      formattedInputValue += '-' + input.substring(7, 9);
    }
    if (input.length > 9) {
      formattedInputValue += '-' + input.substring(9, 11);
    }

    setCustomerPhone(formattedInputValue);
  };

  const handleQuantityChange = (productId: number, delta: number): void => {
    const item = cartItems.find((i: any) => i.id === productId);
    if (!item) return;

    const newQuantity = item.quantity + delta;
    if (newQuantity < 1) {
      dispatch(removeToCart({ productId }));
    } else {
      dispatch(updateQuantity({ productId, newQuantity }));
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerPhone || customerPhone.length < 16) {
      alert("Пожалуйста, введите корректный номер телефона");
      return;
    }

    // Очистка после отправки
    dispatch(setCartItems([]));
    setCustomerPhone("");
  };

  return (
    <main className={styles.home}>
      <div className={styles.home_container}>
        <h1 className={styles.home_title}>тестовое задание</h1>
        <section className={styles.reviews}>
          {reviewsData.map(review => (
            <article key={review.id} className={styles.reviews_block}>
              <header className={styles.reviews_block_header}>
                <p>{review.title}</p>
                <p>{review.source}</p>
                <p>{review.format}</p>
              </header>
              {review.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </article>
          ))}
        </section>
        <section className={styles.basket}>
          <h2 className={styles.basket_title}>Добавленные товары</h2>
          {cartItems.length === 0 ? (
            <p>Корзина пуста</p>
          ) : (
            <div className={styles.basket_products}>
              {cartItems.map(item => (
                <div key={item.id} className={styles.basket_product}>
                  <p>{item.name}</p>
                  <p>x{item.quantity}</p>
                  <p>{item.price * item.quantity}₽</p>
                </div>
              ))}
              <form className={styles.basket_form} onSubmit={handleSubmitOrder}>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={handleChange}
                  placeholder="+7 (___) ___ __-__"
                  required />
                <button type="submit">Заказать</button>
              </form>
            </div>
          )}
        </section>
        <section className={styles.products}>
          {productsData.map(product => (
            <div key={product.id} className={styles.product}>
              <Image src={product.image} alt={product.name} width={280} height={366} />
              <h3>{product.name}</h3>
              <p className={styles.product_description}>{product.description}</p>
              <p className={styles.product_ptice}>Цена: {product.price}₽</p>
              {cartItems.find(item => item.id === product.id) ? (
                <div className={styles.card_product_in_cart}>
                  <button onClick={() => handleQuantityChange(product.id, -1)}>-</button>
                  <span>{cartItems.find(item => item.id === product.id).quantity}</span>
                  <button onClick={() => handleQuantityChange(product.id, +1)}>+</button>
                </div>
              ) : (
                <button type="button" className={styles.buy_button} onClick={() => dispatch(addToCart({ product, quantity: 1 }))}>
                  Купить
                </button>
              )}
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
