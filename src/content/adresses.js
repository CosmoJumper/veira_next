export const adresses = [
  {
    id: "karaganda-main",
    city: "Караганда",
    citySlug: "karaganda",
    title: "Главный офис",
    address: "пр. Нурсултана Назарбаева 16, офис 115, 1 этаж",

    coordinates: {
      lat: 49.806,
      lng: 73.085,
    },

    contacts: {
      phone: "+77025328122",
      email: "info@veira.kz",
    },

    links: {
      map: "https://2gis.kz/karaganda/firm/70000001058910600",
    },

    isMain: true,
  },

  {
    id: "astana-office",
    city: "Астана",
    citySlug: "astana",
    title: "Региональный офис",
    address: "Проспект Абылай хана, 47",

    coordinates: {
      lat: 51.169,
      lng: 71.449,
    },

    contacts: {
      phone: "+77025328122",
    },

    links: {
      map: "https://2gis.kz/astana/firm/70000001056303492",
    },

    isMain: false,
  },
];
