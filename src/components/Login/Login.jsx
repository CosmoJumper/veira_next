import "./Login.css";
import React, { useState, useContext, useEffect, createContext } from "react";
import { LanguageContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../App";

function Login({
  isRegistrationActive,
  setRegistrationActive,
  isPhoneConfirmActive,
  setPhoneConfirmActive,
}) {
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const setUser = auth?.setUser;
  const isValidPhone = (phone) => /^\+7\d{10}$/.test(phone);
  const isValidPassword = (password) => password.length >= 6;

  const [form, setForm] = useState({
    name: "",
    surname: "",
    city: "",
    address: "",
    phone: "",
    password: "",
    confirmPassword: "",
    code: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      let raw = value.replace(/\D/g, "");
      if (raw.startsWith("8")) raw = "7" + raw.slice(1);
      if (!raw.startsWith("7")) raw = "7" + raw;
      if (raw.length > 11) raw = raw.slice(0, 11);
      setForm({ ...form, [name]: "+" + raw });
    } else if (name === "name" || name === "surname" || name === "city") {
      const textOnly = value.replace(/[^a-zA-Zа-яА-Я\s]/g, "");
      setForm({ ...form, [name]: textOnly });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleRegistration = () => {
    setRegistrationActive(!isRegistrationActive);
    setPhoneConfirmActive(false);
  };

  const handlePhoneConfirm = async () => {
    if (!isValidPhone(form.phone)) {
      return alert("Введите корректный номер телефона в формате +7XXXXXXXXXX");
    }
    if (!isRegistrationActive && !isValidPassword(form.password)) {
      return alert("Пароль должен содержать минимум 6 символов");
    }
    if (isRegistrationActive) {
      if (!form.name || !form.surname || !form.city || !form.address) {
        return alert("Пожалуйста, заполните все поля");
      }
      if (
        !form.password ||
        !form.confirmPassword ||
        form.password !== form.confirmPassword
      ) {
        return alert("Пароли не совпадают или не заполнены");
      }
      if (!isValidPassword(form.password)) {
        return alert("Пароль должен содержать минимум 6 символов");
      }
      const response = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: form.phone }),
      });
      const data = await response.json();
      if (data.success) setPhoneConfirmActive(true);
      else alert(data.message);
    } else {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: form.phone, password: form.password }),
      });
      const data = await response.json();
      if (data.success) {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });
        const userData = await res.json();
        if (userData.success) {
          setUser(userData.user);
          navigate("/cabinet");
        }
      } else {
        alert(data.message || "Ошибка");
      }
    }
  };

  const handleCodeSubmit = async () => {
    if (!form.name || !form.surname || !form.city || !form.address) {
      return alert("Пожалуйста, заполните все поля");
    }
    if (!isValidPhone(form.phone)) {
      return alert("Некорректный номер телефона");
    }
    if (
      !form.password ||
      !form.confirmPassword ||
      form.password !== form.confirmPassword
    ) {
      return alert("Пароли не совпадают или не заполнены");
    }
    if (!isValidPassword(form.password)) {
      return alert("Пароль должен содержать минимум 6 символов");
    }
    const verify = await fetch("/api/auth/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: form.phone, code: form.code }),
    });
    const result = await verify.json();
    if (!result.success) return alert(result.message);

    const register = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form }),
    });
    const res = await register.json();
    if (res.success) {
      fetchUser();
      navigate("/cabinet");
    } else {
      alert(res.message || "Ошибка регистрации");
    }
  };

  const fetchUser = async () => {
    const res = await fetch("/api/auth/me", {
      credentials: "include",
    });
    const data = await res.json();
    if (data.success) setUser(data.user);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const res = await fetch("/api/auth/me", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        if (window.location.pathname === "/login") navigate("/cabinet");
      }
    };
    checkUser();
  }, [navigate, setUser]);

  return (
    <div className="login-main-container">
      <img src="/images/logo-blue.png" className="login-form-logo" />
      {!isPhoneConfirmActive && (
        <div className="login-form">
          <h1>{isRegistrationActive ? "Регистрация" : "Вход"}</h1>
          {isRegistrationActive && (
            <>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Имя"
              />
              <input
                name="surname"
                value={form.surname}
                onChange={handleChange}
                placeholder="Фамилия"
              />
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Город"
              />
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Адрес"
              />
            </>
          )}
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Номер телефона"
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Пароль"
          />
          {isRegistrationActive && (
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Подтвердите пароль"
            />
          )}
          <button onClick={handlePhoneConfirm}>
            {isRegistrationActive ? "Зарегистрироваться" : "Войти"}
          </button>
          <p onClick={handleRegistration}>
            {isRegistrationActive
              ? "Уже зарегистрированы? Нажмите сюда"
              : "Еще не зарегистрированы? Нажмите сюда"}
          </p>
        </div>
      )}
      {isPhoneConfirmActive && (
        <div className="login-form">
          <h1>Введите код</h1>
          <p className="login-form-description">
            Мы отправили на указанный номер телефона СМС с кодом подтверждения,
            введите его сюда
          </p>
          <input
            name="code"
            value={form.code}
            onChange={handleChange}
            placeholder="Код"
          />
          <button onClick={handleCodeSubmit}>Подтвердить</button>
        </div>
      )}
    </div>
  );
}

export default Login;
