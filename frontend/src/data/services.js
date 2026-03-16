const services = [
  {
    id: "deep-carpet-steam-cleaning",
    serviceName: "Deep Carpet Steam Cleaning",
    description:
      "Professional hot steam cleaning that removes deep dirt, allergens, and stubborn stains from carpets, leaving them fresh and sanitized.",
    rating: 4.8,
    price: 75.0,
    durationOfService: "1 - 2 hours",
    sampleImage: "/images/deep-carpet-steam-cleaning.svg",
    nameOfTheExpert: "Carlos Mendoza",
    sellerPayPalEmail: "carlos.mendoza.cleaning@example.com",
  },
  {
    id: "sofa-upholstery-shampoo-cleaning",
    serviceName: "Sofa & Upholstery Shampoo Cleaning",
    description:
      "Thorough shampoo cleaning for fabric sofas and upholstered furniture to remove stains, dust, and trapped odors.",
    rating: 4.6,
    price: 60.0,
    durationOfService: "1 hour",
    sampleImage: "/images/sofa-upholstery-shampoo-cleaning.svg",
    nameOfTheExpert: "Maria Gonzales",
    sellerPayPalEmail: "maria.gonzales.cleaning@example.com",
  },
  {
    id: "mattress-sanitizing",
    serviceName: "Mattress Sanitizing",
    description:
      "Deep sanitizing treatment for mattresses to reduce dust mites, bacteria, and allergens for a healthier sleeping environment.",
    rating: 4.7,
    price: 55.0,
    durationOfService: "45 minutes",
    sampleImage: "/images/mattress-sanitizing.svg",
    nameOfTheExpert: "Rafael Cruz",
    sellerPayPalEmail: "rafael.cruz.cleaning@example.com",
  },
  {
    id: "office-carpet-cleaning",
    serviceName: "Office Carpet Cleaning",
    description:
      "Scheduled low-moisture carpet cleaning for office spaces to refresh high-traffic areas with minimal business disruption.",
    rating: 4.9,
    price: 140.0,
    durationOfService: "2 - 3 hours",
    sampleImage: "/images/office-carpet-cleaning.svg",
    nameOfTheExpert: "Nina Harper",
    sellerPayPalEmail: "nina.harper.cleaning@example.com",
  },
  {
    id: "pet-odor-removal-treatment",
    serviceName: "Pet Odor Removal Treatment",
    description:
      "Targeted enzyme-based treatment that neutralizes pet odors and lifts embedded stains from carpets and upholstery.",
    rating: 4.5,
    price: 65.0,
    durationOfService: "1 - 1.5 hours",
    sampleImage: "/images/pet-odor-removal-treatment.svg",
    nameOfTheExpert: "Joanna Reyes",
    sellerPayPalEmail: "joanna.reyes.cleaning@example.com",
  },
];

export function getServiceById(serviceId) {
  return services.find((service) => service.id === serviceId);
}

export default services;