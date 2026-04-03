import "./Cabinet.css";
import { useState, useEffect, useContext } from "react";
import { LanguageContext } from "../../App";
import { AuthContext } from "../../App";
import { useNavigate } from "react-router-dom";
import Navigation from "../Navigation/Navigation";

function Cabinet({}) {
  const { language } = useContext(LanguageContext);
  const auth = useContext(AuthContext);
  const user = auth?.user;
  const logout = auth?.logout;
  const [isProfileEditActive, setProfileEditActive] = useState(false);
  const [isCitysListActive, setCitysListActive] = useState(false);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/auth/orders", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await response.json();
        if (data.success) {
          setOrders(data.orders);
        } else {
          console.error("Error fetching orders:", data.message);
        }
      } catch (err) {
        console.error("Fetch orders error:", err);
      }
    };
    if (user) fetchOrders();
  }, [user]);

  const handleProfileEdit = () => {
    setProfileEditActive(!isProfileEditActive);
  };

  const handleProfileUpdate = async () => {
    const name = document.querySelector('input[placeholder="Имя"]').value;
    const surname = document.querySelector(
      'input[placeholder="Фамилия"]'
    ).value;
    const phone = document.querySelector(
      'input[placeholder="Номер телефона"]'
    ).value;
    const city = document.querySelector('input[placeholder="Город"]').value;

    try {
      const response = await fetch("/api/auth/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, surname, phone, city }),
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        auth.setUser(data.user);
        setProfileEditActive(false);
      } else {
        alert(data.message || "Ошибка обновления профиля");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Ошибка при обновлении профиля");
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Вы уверены, что хотите отменить заказ?")) return;
    try {
      const response = await fetch("/api/orders/cancel-order", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId ? { ...o, order_status: "отменен" } : o
          )
        );
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Ошибка при отмене заказа:", err);
      alert("Не удалось отменить заказ");
    }
  };

  const handleCitysList = () => {
    setCitysListActive(!isCitysListActive);
  };

  const toPartner = () => {
    window.location.href = "/partner";
  };

  if (!user) return null;

  return (
    <div className="cabinet-container">
      <div className="cabinet-bg">
        <img src="/images/cabinet-bg.jpg" />
      </div>
      <div className="cabinet-elements">
        <div className="cabinet-element">
          <div className="cabinet-element-top" onClick={handleProfileEdit}>
            <img src="/images/cabinet-edit-icon.png" />
          </div>
          <div className="cabinet-element-part">
            <div className="cabinet-photo">
              <img src="/images/cabinet-default-photo.png" />
            </div>
            <h2>
              {user.name} {user.surname}
            </h2>
          </div>
          <div className="app-separator-gray"></div>
          <div className="cabinet-element-part">
            <div className="cabinet-element-part-data">
              <img src="/images/cabinet-phone-icon.png" />
              <div>
                <h3>Телефон:</h3>
                <p>{user.phone}</p>
              </div>
            </div>
            <div className="cabinet-element-part-data">
              <img src="/images/cabinet-city-icon.png" />
              <div>
                <h3>Город:</h3>
                <p>{user.city || "Город не указан"}</p>
              </div>
            </div>
          </div>
          <div className="cabinet-element-part">
            <button
              onClick={logout}
              style={{
                width: "100%",
                background: "transparent",
                color: "#CA5538",
              }}
            >
              Выйти
            </button>
          </div>
        </div>
        <div
          className="cabinet-element"
          style={{ background: "rgb(72, 134, 185, 0.5)" }}
        >
          <div
            className="cabinet-element-part"
            style={{ justifyContent: "center" }}
          >
            <div className="cabinet-image">
              <img src="/images/cabinet-partner-icon.png" />
            </div>
            <h2 style={{ color: "#fff" }}>Стать партнером</h2>
          </div>
          <div className="app-separator-gray"></div>
          <div
            className="cabinet-element-part"
            style={{ justifyContent: "center" }}
          >
            <button onClick={toPartner}>Подробнее</button>
          </div>
        </div>
      </div>
      <div className="cabinet-orders-list">
        <div className="cabinet-orders-list-top">
          <h2>Мои заказы</h2>
        </div>
        {orders.length > 0 ? (
          orders.map((order) => {
            let items = [];
            try {
              items =
                typeof order.order_info === "string"
                  ? JSON.parse(order.order_info).items
                  : order.order_info.items;
            } catch (err) {
              console.error("Error parsing order_info:", err);
            }
            return (
              <div className="cabinet-orders-list-order" key={order.id}>
                <div className="cabinet-orders-list-order-element">
                  <p>
                    {new Date(order.created_at).toLocaleDateString("ru-RU")}
                  </p>
                  <div>
                    <h3>№{order.inv_id || order.id}</h3>
                    {items.length > 0 ? (
                      items.map((item, index) => (
                        <p
                          key={index}
                          className="cabinet-orders-list-order-element-info"
                        >
                          {item.name} x{item.quantity} - {item.sum} тг
                        </p>
                      ))
                    ) : (
                      <p>Детали заказа отсутствуют</p>
                    )}
                  </div>
                  <div className="order-stat-and-price">
                    <p
                      style={{
                        color:
                          order.order_status === "оплачен"
                            ? "green"
                            : order.order_status === "отменен"
                            ? "gray"
                            : order.order_status === "не оплачен"
                            ? "red"
                            : "black",
                      }}
                    >
                      Статус: {order.order_status || "Не указан"}
                    </p>

                    <p>Цена: {parseFloat(order.price).toFixed(0)} тг</p>

                    {order.points ? <p>Бонусы: {order.points}</p> : null}
                  </div>
                </div>
                <div className="cabinet-orders-list-order-element">
                  {order.order_status !== "отменен" && (
                    <button onClick={() => handleCancelOrder(order.id)}>
                      Отменить
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p style={{ color: "#fff" }}>Заказы отсутствуют</p>
        )}
      </div>
      <div
        className="cabinet-edit-container"
        style={{ display: isProfileEditActive ? "flex" : "none" }}
      >
        <div className="cabinet-edit">
          <div className="cabinet-edit-photo">
            <img src="/images/cabinet-default-photo.png" />
          </div>
          <input placeholder="Имя" defaultValue={user.name} />
          <input placeholder="Фамилия" defaultValue={user.surname} />
          <input placeholder="Номер телефона" defaultValue={user.phone} />
          <div className="cabinet-edit-citys">
            <input
              placeholder="Город"
              defaultValue={user.city}
              onClick={handleCitysList}
            />
            <div
              className="cabinet-edit-citys-list"
              style={{ display: isCitysListActive ? "flex" : "none" }}
            >
              <div>
                <p>Караганда</p>
              </div>
              <div>
                <p>Астана</p>
              </div>
              <div>
                <p>Алматы</p>
              </div>
            </div>
          </div>
          <button
            className="cabinet-edit-cancel-button"
            onClick={handleProfileEdit}
          >
            Отменить
          </button>
          <button
            className="cabinet-edit-confirm-button"
            onClick={handleProfileUpdate}
          >
            Подтвердить
          </button>
        </div>
      </div>
      <Navigation
        isCartFull={false} // или передай из состояния/пропсов
        setCartFull={() => {}} // если не нужен, можно пустую функцию
      />
    </div>
  );
}

export default Cabinet;
