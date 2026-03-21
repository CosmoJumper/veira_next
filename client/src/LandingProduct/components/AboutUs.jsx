import React from "react";

export default function AboutUs({ language }) {
  return (
    <div className="landing-product-block about-us-block">
      <p className="p-bold-underline-white">
        {language === "rus"
          ? "КРАСОТА НАЧИНАЕТСЯ С ПРАВДЫ"
          : "СҰЛУЛЫҚ ШЫНДЫҚТАН БАСТАЛАДЫ"}
      </p>
    </div>
  );
}
