"use client";

import "./Login.module.css";
import React, { useState, useContext, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LanguageContext } from "../providers/language-provider";
import { AuthContext } from "../providers/auth-provider";

function Login({
  isRegistrationActive,
  setRegistrationActive,
  isPhoneConfirmActive,
  setPhoneConfirmActive,
}) {
  const { language } = useContext(LanguageContext);
  const auth = useContext(AuthContext);
  const setUser = auth?.setUser;

  const router = useRouter();
  const pathname = usePathname();

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

      setForm((prev) => ({
        ...prev,
        [name]: "+" + raw,
      }));
    } else if (name === "name" || name === "surname" || name === "city") {
      const textOnly = value.replace(/[^a-zA-Zа-яА-Я\s]/g, "");

      setForm((prev) => ({
        ...prev,
        [name]: textOnly,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleRegistration = () => {
    setRegistrationActive(!isRegistrationActive);
    setPhoneConfirmActive(false);
  };

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me", {
        credentials: "include",
      });

      const data = await res.json();

      if (data.success && setUser) {
        setUser(data.user);
      }
    } catch (error) {
      console.error("Ошибка получения пользователя:", error);
    }
  };

  const handlePhoneConfirm = async () => {
    try {
      if (!isValidPhone(form.phone)) {
        return alert(
          "Введите корректный номер телефона в формате +7XXXXXXXXXX"
        );
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

        if (data.success) {
          setPhoneConfirmActive(true);
        } else {
          alert(data.message);
        }
      } else {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: form.phone,
            password: form.password,
          }),
        });

        const data = await response.json();

        if (data.success) {
          const res = await fetch("/api/auth/me", {
            credentials: "include",
          });

          const userData = await res.json();

          if (userData.success) {
            if (setUser) setUser(userData.user);
            router.push("/cabinet");
          }
        } else {
          alert(data.message || "Ошибка");
        }
      }
    } catch (error) {
      console.error("Ошибка авторизации:", error);
      alert("Произошла ошибка");
    }
  };

  const handleCodeSubmit = async () => {
    try {
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
        body: JSON.stringify({
          phone: form.phone,
          code: form.code,
        }),
      });

      const result = await verify.json();

      if (!result.success) {
        return alert(result.message);
      }

      const register = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form }),
      });

      const res = await register.json();

      if (res.success) {
        await fetchUser();
        router.push("/cabinet");
      } else {
        alert(res.message || "Ошибка регистрации");
      }
    } catch (error) {
      console.error("Ошибка регистрации:", error);
      alert("Произошла ошибка регистрации");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      if (setUser) setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Ошибка выхода:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        const data = await res.json();

        if (data.success) {
          if (setUser) setUser(data.user);

          if (pathname === "/login") {
            router.push("/cabinet");
          }
        }
      } catch (error) {
        console.error("Ошибка проверки пользователя:", error);
      }
    };

    checkUser();
  }, [pathname, router, setUser]);

  return (
    <div className="login-main-container">
      <img
        src="/images/logo-blue.png"
        className="login-form-logo"
        alt="VEIRA"
      />

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
