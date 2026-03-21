import React from "react";

const Reviews = ({ language, landing }) => {
  const author_avatars = [
    {
      src: "https://marketplace.canva.com/EAFewoMXU-4/1/0/1600w/canva-purple-pink-gradient-man-3d-avatar-0o0qE2T_kr8.jpg",
    },
    {
      src: "https://img.freepik.com/free-psd/3d-illustration-with-online-avatar_23-2151303097.jpg",
    },
    {
      src: "https://img.freepik.com/free-psd/3d-illustration-with-online-avatar_23-2151303048.jpg",
    },
  ];

  const authors = [
    { name: "Марина", age: 32, age_text: "года", city: "Алматы" },
    { name: "Айгуль", age: 27, age_text: "лет", city: "Нур-Султан" },
    { name: "Оксана", age: 41, age_text: "год", city: "Шымкент" },
  ];

  return (
    <div className="landing-product-block reviews-block">
      <h1 className="h1-main-gray">
        {language === "rus" ? "ОТЗЫВЫ" : "ШОЛУЛАР"}
      </h1>
      <div className="row-elements-center">
        {[1, 2, 3].map((index) => {
          const key =
            language === "rus" ? `review_ru_${index}` : `review_kz_${index}`;
          const raw = landing?.[key];
          let description = "";

          try {
            const obj = typeof raw === "string" ? JSON.parse(raw) : raw;
            description = obj?.description ?? "";
          } catch {}

          const author_avatar = author_avatars[index - 1];
          const author = authors[index - 1];

          return (
            <div className="review" key={index}>
              <div className="review-decoration review-decoration-1"></div>
              <div className="review-decoration review-decoration-2"></div>
              <div className="round-photo review-photo">
                <img src={author_avatar.src} alt="" style={{ width: "60px" }} />
              </div>
              <div className="column-elements-left">
                <div className="row-elements-center stars">
                  <img
                    className="star"
                    src="/images/landing-product/star-active.png"
                    alt=""
                  />
                  <img
                    className="star"
                    src="/images/landing-product/star-active.png"
                    alt=""
                  />
                  <img
                    className="star"
                    src="/images/landing-product/star-active.png"
                    alt=""
                  />
                  <img
                    className="star"
                    src="/images/landing-product/star-active.png"
                    alt=""
                  />
                  <img
                    className="star"
                    src="/images/landing-product/star-inactive.png"
                    alt=""
                  />
                </div>
                <p className="p-bold-gray">
                  {author.name}, {author.age} {author.age_text}, {author.city}
                </p>
                <p className="p-normal-little-gray">{description || "…"}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Reviews;
