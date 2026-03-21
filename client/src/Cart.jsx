import './Cart.css';
import { useState, useContext, useRef, useEffect } from 'react';
import { LanguageContext } from './App';
import { IMaskInput } from 'react-imask';

function Cart({ 
  setIsSearchActive,
  isNavigationVisible,
  setNavigationVisible,
  isCartFull,
  setCartFull,
  cart,
  setCart,
}) {
  const API_URL = 'https://veira.kz/api';
  const { language } = useContext(LanguageContext);
  const [isPaymentActive, setPaymentActive] = useState(false);
  const [isDeliveryTypeActive, setDeliveryTypeActive] = useState(true);
  const [isPickupTypeActive, setPickupTypeActive] = useState(false);
  const [formData, setFormData] = useState({
    user_name: '',
    user_surname: '',
    phone: '',
    address_level1: '',
    address_level2: '',
    postal_code: '',
  });
  const [errors, setErrors] = useState({
    user_name: '',
    user_surname: '',
    phone: '',
    address_level1: '',
    address_level2: '',
    postal_code: '',
  });
    const cartContainerRef = useRef(null);

  const handleCart = () => {
    window.history.back();
    setNavigationVisible(!isNavigationVisible);
  };

  const handlePayment = () => {
    if (cart.length > 0) {
      setPaymentActive(!isPaymentActive);
      setErrors({});
    }
  };

  const handleDeliveryType = () => {
    setDeliveryTypeActive(true);
    setPickupTypeActive(false);
  };

  const handlePickupType = () => {
    setPickupTypeActive(true);
    setDeliveryTypeActive(false);
  };

  const increaseQuantity = (productId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (productId) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (productId) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productId)
    );
  };

  const calculateTotal = () => {
    return cart.reduce(
      (total, item) => total + item.product.trade_price * item.quantity,
      0
    );
  };

  const validateForm = () => {
    const newErrors = {};
    const nameRegex = /^[A-Za-zА-Яа-я\s-]{2,}$/;
    const surnameRegex = /^[A-Za-zА-Яа-я\s-]{2,}$/;
    const phoneRegex = /^\+7\s*\(\d{3}\)\s*\d{3}-\d{2}-\d{2}$/;
    const addressRegex = /^[A-Za-zА-Яа-я0-9\s-]{2,}$/;
    const postalCodeRegex = /^\d{6}$/;

    if (!formData.user_name) {
      newErrors.user_name =
        language === 'rus' ? 'Введите имя' : 'Атыңызды енгізіңіз';
    } else if (!nameRegex.test(formData.user_name)) {
      newErrors.user_name =
        language === 'rus'
          ? 'Имя должно содержать минимум 2 буквы, только буквы, пробелы и дефисы'
          : 'Аты кемінде 2 әріптен тұруы керек, тек әріптер, бос орындар және сызықшалар';
    }

    if (!formData.user_surname) {
      newErrors.user_surname =
        language === 'rus' ? 'Введите фамилию' : 'Тегінізді енгізіңіз';
    } else if (!surnameRegex.test(formData.user_surname)) {
      newErrors.user_surname =
        language === 'rus'
          ? 'Фамилия должна содержать минимум 2 буквы, только буквы, пробелы и дефисы'
          : 'Тегі кемінде 2 әріптен тұруы керек, тек әріптер, бос орындар және сызықшалар';
    }

    if (!formData.phone) {
      newErrors.phone =
        language === 'rus' ? 'Введите телефон' : 'Телефонды енгізіңіз';
    } else if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone =
        language === 'rus'
          ? 'Телефон должен быть в формате +7 (XXX) XXX-XX-XX'
          : 'Телефон +7 (XXX) XXX-XX-XX форматында болуы керек';
    }

    if (isDeliveryTypeActive) {
      if (!formData.address_level1) {
        newErrors.address_level1 =
          language === 'rus' ? 'Введите область' : 'Облысты енгізіңіз';
      } else if (!addressRegex.test(formData.address_level1)) {
        newErrors.address_level1 =
          language === 'rus'
            ? 'Область должна содержать минимум 2 символа, только буквы, цифры, пробелы и дефисы'
            : 'Облыс кемінде 2 таңбадан тұруы керек, тек әріптер, сандар, бос орындар және сызықшалар';
      }

      if (!formData.address_level2) {
        newErrors.address_level2 =
          language === 'rus' ? 'Введите город' : 'Қаланы енгізіңіз';
      } else if (!addressRegex.test(formData.address_level2)) {
        newErrors.address_level2 =
          language === 'rus'
            ? 'Город должен содержать минимум 2 символа, только буквы, цифры, пробелы и дефисы'
            : 'Қала кемінде 2 таңбадан тұруы керек, тек әріптер, сандар, бос орындар және сызықшалар';
      }

      if (!formData.postal_code) {
        newErrors.postal_code =
          language === 'rus' ? 'Введите почтовый индекс' : 'Пошта индексін енгізіңіз';
      } else if (!postalCodeRegex.test(formData.postal_code.replace(/\D/g, ''))) {
        newErrors.postal_code =
          language === 'rus'
            ? 'Почтовый индекс должен содержать ровно 6 цифр'
            : 'Пошта индексі дәл 6 саннан тұруы керек';
      }
    }

    if (!cart || cart.length === 0) {
      newErrors.cart =
        language === 'rus' ? 'Корзина пуста' : 'Себет бос';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handlePaymentSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const cartData = {
      items: cart.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        sum: item.product.trade_price * item.quantity,
      })),
    };

    const payload = {
      total: calculateTotal(),
      cart: cartData,
      points_total: 0,
      user_name: formData.user_name,
      user_surname: formData.user_surname,
      phone: formData.phone.replace(/\D/g, ''),
      type: isDeliveryTypeActive ? 'доставка' : 'самовывоз',
      address_level1: formData.address_level1,
      address_level2: formData.address_level2,
      postal_code: formData.postal_code,
    };

    try {
      const endpoint = 'https://veira.kz/api/payment';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success && data.robokassaUrl) {
        console.log(data);
          window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    ecommerce: {
      purchase: {
        actionField: {
          id: `${Date.now()}`, // или data.orderId, если есть от сервера
          revenue: calculateTotal(), // итоговая сумма
          shipping: 0,
        },
        products: cart.map((item) => ({
          id: item.product.id.toString(),
          name: item.product.name,
          category: item.product.category || '', // если есть
          price: item.product.trade_price,
          quantity: item.quantity,
        })),
      },
    },
  });
        window.location.href = data.robokassaUrl;
        setCart([]);
        localStorage.removeItem('cart');
        setCartFull(false);
        setPaymentActive(false);
        setErrors({});
      } else {
        setErrors({
          general:
            language === 'rus'
              ? 'Ошибка при обработке платежа'
              : 'Төлемді өңдеу кезінде қате',
        });
      }
    } catch (err) {
      console.error('Payment error:', err);
      setErrors({
        general:
          language === 'rus'
            ? 'Ошибка сервера. Пожалуйста, попробуйте позже'
            : 'Сервер қатесі. Кейінірек қайталап көріңіз',
      });
    }
  };

  useEffect(() => {
    if (isPaymentActive && cartContainerRef.current) {
      cartContainerRef.current.style.overflow = 'hidden';
    } else if (cartContainerRef.current) {
      cartContainerRef.current.style.overflow = 'auto';
    }
    // Очистка при размонтировании
    return () => {
      if (cartContainerRef.current) {
        cartContainerRef.current.style.overflow = 'auto';
      }
    };
  }, [isPaymentActive]);

  useEffect(() => {
  setCartFull(false); // сбрасываем при монтировании Cart

  return () => {
    // когда Cart размонтируется — ничего не делаем, чтобы isCartFull остался false
  };
}, []);


  return (
    <div className="cart-container" ref={cartContainerRef}>
      <div className="filter-top">
        <h1>{language === 'rus' ? 'Корзина' : 'Себет'}</h1>
        <button className="filter-button-close" onClick={handleCart}>
          x
        </button>
      </div>
      <div className="cart-products">
        {cart.length === 0 ? (
          <p>{language === 'rus' ? 'Корзина пуста' : 'Себет бос'}</p>
        ) : (
          cart.map((item) => ( 
            <div className="i-product" key={item.product.id}>
              <div className="i-product-image">
                <img
  src={
    item.product.image_url
      ? `${API_URL}/${item.product.image_url.replace('/images/', '')}`
      : 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'
  }
  alt={item.product.name}
  onError={(e) => {
    const fallbackUrl = item.product.image_url || 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg';
    e.target.onerror = null; // предотврати бесконечный цикл
    e.target.src = fallbackUrl;
  }}
/>
              </div>
              <div className="i-product-info">
                <h3>{item.product.name}</h3>
                <div className="i-product-elements">
                  <div className='i-product-q-and-p'>
                  <div className="product-quantity-controls">
                    <button onClick={() => decreaseQuantity(item.product.id)}>
                      -
                    </button>
                    <p>{item.quantity}</p>
                    <button onClick={() => increaseQuantity(item.product.id)}>
                      +
                    </button>
                  </div>
                  <div className="i-product-price-container">
                    <p className="i-product-price">
                      {item.product.trade_price.toLocaleString('ru-RU')} тг
                    </p>
                    {item.product.old_price && (
                      <p className="i-product-old-price">
                        {item.product.old_price.toLocaleString('ru-RU')}
                      </p>
                    )}
                  </div>
                </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="cart-bottom" style={{ height: isPaymentActive ? '100%' : 'auto', 
        paddingBottom: isPaymentActive ? '120px' : '10px', 
        flexDirection: isPaymentActive ? 'column' : 'row',
        justifyContent: isPaymentActive ? 'flex-start' : 'center'
         }}>
        <div className="filter-top" style={{ display: isPaymentActive ? 'flex' : 'none' }}>
          <h1>{language === 'rus' ? 'Оплата' : 'Төлем'}</h1>
          <button
            className="filter-button-close"
            onClick={handlePayment}
            style={{ width: '30px', height: '30px' }}
          >
            x
          </button>
        </div>
        <div
          className="cart-bottom-element"
          style={{ display: isPaymentActive ? 'none' : 'block' }}
        >
          <p>
            {language === 'rus' ? 'Общая сумма' : 'Жалпы сома'}: {calculateTotal().toLocaleString('ru-RU')} тг.
          </p>
        </div>
        <h2 style={{ display: isPaymentActive ? 'block' : 'none' }}>
          {language === 'rus' ? 'Способ получения' : 'Алу тәсілі'}:
        </h2>
        <div
          className="order-type-container"
          style={{ display: isPaymentActive ? 'flex' : 'none' }}
        >
          <div
            className="order-type"
            style={{ background: isDeliveryTypeActive ? '#4886B9' : '#fff' }}
            onClick={handleDeliveryType}
          >
            <div className="order-type-select"></div>
            <img src="/images/order-type-icon-1.png" alt="Delivery" />
            <div className='order-type-text'>
              <p style={{ color: isDeliveryTypeActive ? '#fff' : '#263242' }} className='order-type-title'>
                {language === 'rus' ? 'ДОСТАВКА ПОЧТОЙ' : 'ПОШТА АРҚЫЛЫ ЖЕТКІЗУ'}
              </p>
              <p className='order-type-subtitle' style={{ color: isDeliveryTypeActive ? '#fff' : '#263242' }}>
                KazPost, СДЭК, РИКА
              </p>
            </div>
          </div>
          <div
            className="order-type"
            style={{ background: isPickupTypeActive ? '#4886B9' : '#fff' }}
            onClick={handlePickupType}
          >
            <div className="order-type-select"></div>
            <img src="/images/order-type-icon-2.png" alt="Pickup" />
            <div className='order-type-text'>
              <p style={{ color: isPickupTypeActive ? '#fff' : '#263242' }} className='order-type-title'>
                {language === 'rus' ? 'САМОВЫВОЗ' : 'ӨЗІНДІК АЛЫП КЕТУ'}
              </p>
              <p className='order-type-subtitle' style={{ color: isPickupTypeActive ? '#fff' : '#263242' }}>
                г.Караганда, пр.Нурсултана Назарбаева 16, офис 115
              </p>
            </div>
          </div>
        </div>
        <h2 style={{ display: isPaymentActive ? 'block' : 'none' }}>
          {language === 'rus' ? 'Контактные данные' : 'Байланыс деректері'}:
        </h2>
        <div
          className="order-form-container"
          style={{ display: isPaymentActive ? 'block' : 'none' }}
        >
          {errors.general && <p style={{ color: 'red' }}>{errors.general}</p>}
          {errors.cart && <p style={{ color: 'red' }}>{errors.cart}</p>}
          <div>
            <div className="input-container">
              <input
                name="user_name"
                placeholder={language === 'rus' ? 'Имя' : 'Аты'}
                value={formData.user_name}
                onChange={handleInputChange}
                className={errors.user_name ? 'input-error' : ''}
                autoComplete="name"
              />
              {errors.user_name && (
                <p className="error-message">{errors.user_name}</p>
              )}
            </div>
            <div className="input-container">
              <input
                name="user_surname"
                placeholder={language === 'rus' ? 'Фамилия' : 'Тегі'}
                value={formData.user_surname}
                onChange={handleInputChange}
                className={errors.user_surname ? 'input-error' : ''}
                autoComplete="surname"
              />
              {errors.user_surname && (
                <p className="error-message">{errors.user_surname}</p>
              )}
            </div>
            <div className="input-container">
              <IMaskInput
                mask="+7 (000) 000-00-00"
                name="phone"
                placeholder={language === 'rus' ? 'Телефон' : 'Телефон'}
                value={formData.phone}
                onAccept={(value) =>
                  handleInputChange({ target: { name: 'phone', value } })
                }
                className={errors.phone ? 'input-error' : ''}
                autoComplete="tel"
              />
              {errors.phone && <p className="error-message">{errors.phone}</p>}
            </div>
            <div className="input-container">
              <input
                name="address_level2"
                placeholder={language === 'rus' ? 'Город' : 'Қала'}
                value={formData.address_level2}
                onChange={handleInputChange}
                className={errors.address_level2 ? 'input-error' : ''}
                autoComplete="address-level2"
              />
              {errors.address_level2 && (
                <p className="error-message">{errors.address_level2}</p>
              )}
            </div>
            <div className="input-container">
              <input
                name="address_level1"
                placeholder={language === 'rus' ? 'Область' : 'Облыс'}
                value={formData.address_level1}
                onChange={handleInputChange}
                className={errors.address_level1 ? 'input-error' : ''}
                autoComplete="address-level1"
              />
              {errors.address_level1 && (
                <p className="error-message">{errors.address_level1}</p>
              )}
            </div>
            <div className="input-container">
              <IMaskInput
                mask="000000"
                name="postal_code"
                placeholder={language === 'rus' ? 'Почтовый индекс' : 'Пошта индексі'}
                value={formData.postal_code}
                onAccept={(value) =>
                  handleInputChange({ target: { name: 'postal_code', value } })
                }
                className={errors.postal_code ? 'input-error' : ''}
                autoComplete="postal-code"
              />
              {errors.postal_code && (
                <p className="error-message">{errors.postal_code}</p>
              )}
            </div>
          </div>
        </div>
        <div
          className="order-payment-button"
          style={{ display: isPaymentActive ? 'flex' : 'none' }}
        >
          <button onClick={handlePaymentSubmit}>
            {language === 'rus' ? 'Оплатить' : 'Төлеу'} ({calculateTotal().toLocaleString('ru-RU')} тенге)
          </button>
        </div>
        <button
          onClick={handlePayment}
          style={{
            display: isPaymentActive ? 'none' : 'block',
            background: cart.length === 0 ? 'gray' : '',
            opacity: cart.length === 0 ? 0.5 : 1,
            pointerEvents: cart.length === 0 ? 'none' : 'auto',
          }}
          disabled={cart.length === 0}
        >
          {language === 'rus' ? 'Перейти к оплате' : 'Төлемге өту'}
        </button>
      </div>
    </div>
  );
}

export default Cart;