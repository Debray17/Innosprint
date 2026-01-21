// src/data/userMockData.js

// ==================== CURRENT USER ====================
export const currentUser = {
  id: 1,
  firstName: "Dorji",
  lastName: "Wangchuk",
  email: "dorji@email.com",
  phone: "+1 555 123 4567",
  avatar: null,
  dateOfBirth: "1990-05-15",
  gender: "male",
  nationality: "USA",
  address: {
    street: "123 Main Street",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
    country: "USA",
  },
  memberSince: "2023-01-15",
  membershipTier: "Gold",
  loyaltyPoints: 2500,
  totalBookings: 12,
  totalSpent: 8500,
  isVerified: true,
};

// ==================== POPULAR DESTINATIONS ====================
export const popularDestinations = [
  {
    id: 1,
    name: "New York",
    country: "USA",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800",
    propertiesCount: 245,
    startingPrice: 120,
  },
  {
    id: 2,
    name: "Miami Beach",
    country: "USA",
    image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800",
    propertiesCount: 189,
    startingPrice: 99,
  },
  {
    id: 3,
    name: "Los Angeles",
    country: "USA",
    image: "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=800",
    propertiesCount: 312,
    startingPrice: 89,
  },
  {
    id: 4,
    name: "San Francisco",
    country: "USA",
    image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800",
    propertiesCount: 156,
    startingPrice: 150,
  },
  {
    id: 5,
    name: "Aspen",
    country: "USA",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
    propertiesCount: 78,
    startingPrice: 250,
  },
  {
    id: 6,
    name: "Las Vegas",
    country: "USA",
    image: "https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?w=800",
    propertiesCount: 198,
    startingPrice: 85,
  },
];

// ==================== PROPERTY TYPES ====================
export const propertyCategories = [
  { id: 1, name: "Hotels", icon: "hotel", count: 450 },
  { id: 2, name: "Resorts", icon: "beach", count: 120 },
  { id: 3, name: "Villas", icon: "villa", count: 85 },
  { id: 4, name: "Apartments", icon: "apartment", count: 320 },
  { id: 5, name: "Homestays", icon: "home", count: 210 },
  { id: 6, name: "Hostels", icon: "hostel", count: 95 },
];

// ==================== FEATURED PROPERTIES ====================
export const featuredProperties = [
  {
    id: 1,
    name: "Grand Plaza Hotel",
    type: "Hotel",
    location: {
      city: "New York",
      state: "NY",
      country: "USA",
      address: "100 Broadway, New York, NY 10005",
    },
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
    ],
    rating: 4.8,
    reviewsCount: 245,
    pricePerNight: 199,
    originalPrice: 249,
    discount: 20,
    amenities: ["WiFi", "Pool", "Spa", "Gym", "Restaurant", "Bar"],
    isFavorite: true,
    freeCancellation: true,
    breakfastIncluded: true,
  },
  {
    id: 2,
    name: "Sunset Beach Resort",
    type: "Resort",
    location: {
      city: "Miami Beach",
      state: "FL",
      country: "USA",
      address: "500 Ocean Drive, Miami Beach, FL 33139",
    },
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
    ],
    rating: 4.6,
    reviewsCount: 189,
    pricePerNight: 349,
    originalPrice: null,
    discount: 0,
    amenities: ["WiFi", "Beach Access", "Pool", "Spa", "Restaurant"],
    isFavorite: false,
    freeCancellation: true,
    breakfastIncluded: true,
  },
  {
    id: 3,
    name: "Mountain View Villa",
    type: "Villa",
    location: {
      city: "Aspen",
      state: "CO",
      country: "USA",
      address: "25 Highland Road, Aspen, CO 81611",
    },
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    ],
    rating: 4.9,
    reviewsCount: 67,
    pricePerNight: 599,
    originalPrice: 699,
    discount: 15,
    amenities: ["WiFi", "Fireplace", "Hot Tub", "Kitchen", "Mountain View"],
    isFavorite: true,
    freeCancellation: false,
    breakfastIncluded: false,
  },
  {
    id: 4,
    name: "Urban Loft Apartments",
    type: "Apartment",
    location: {
      city: "San Francisco",
      state: "CA",
      country: "USA",
      address: "750 Market Street, San Francisco, CA 94102",
    },
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
    ],
    rating: 4.5,
    reviewsCount: 112,
    pricePerNight: 179,
    originalPrice: null,
    discount: 0,
    amenities: ["WiFi", "Kitchen", "Gym", "Laundry", "City View"],
    isFavorite: false,
    freeCancellation: true,
    breakfastIncluded: false,
  },
  {
    id: 5,
    name: "Cozy Beachside Homestay",
    type: "Homestay",
    location: {
      city: "Malibu",
      state: "CA",
      country: "USA",
      address: "88 Coastal Highway, Malibu, CA 90265",
    },
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    ],
    rating: 4.7,
    reviewsCount: 45,
    pricePerNight: 159,
    originalPrice: 189,
    discount: 15,
    amenities: ["WiFi", "Beach Access", "Kitchen", "Patio", "BBQ"],
    isFavorite: false,
    freeCancellation: true,
    breakfastIncluded: true,
    host: {
      name: "Maria Santos",
      superhost: true,
    },
  },
  {
    id: 6,
    name: "Lakeside Cottage Retreat",
    type: "Cottage",
    location: {
      city: "Lake Tahoe",
      state: "CA",
      country: "USA",
      address: "45 Lake Shore Drive, Lake Tahoe, CA",
    },
    images: [
      "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800",
    ],
    rating: 4.8,
    reviewsCount: 89,
    pricePerNight: 289,
    originalPrice: null,
    discount: 0,
    amenities: ["WiFi", "Fireplace", "Kitchen", "Lake View", "Kayak"],
    isFavorite: true,
    freeCancellation: true,
    breakfastIncluded: false,
  },
];

// ==================== PROPERTY DETAILS ====================
export const propertyDetails = {
  id: 1,
  name: "Grand Plaza Hotel",
  type: "Hotel",
  stars: 5,
  location: {
    address: "100 Broadway",
    city: "New York",
    state: "NY",
    zipCode: "10005",
    country: "USA",
    coordinates: { lat: 40.7128, lng: -74.006 },
  },
  images: [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200",
      caption: "Hotel Exterior",
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200",
      caption: "Lobby",
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200",
      caption: "Room",
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200",
      caption: "Pool",
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200",
      caption: "Restaurant",
    },
  ],
  rating: 4.8,
  reviewsCount: 245,
  description: `Experience luxury like never before at Grand Plaza Hotel. Located in the heart of Manhattan, our 5-star hotel offers stunning city views, world-class amenities, and impeccable service.

Whether you're traveling for business or pleasure, our dedicated staff ensures your stay is nothing short of exceptional.`,
  amenities: [
    { name: "Free WiFi", icon: "wifi" },
    { name: "Swimming Pool", icon: "pool" },
    { name: "Spa & Wellness", icon: "spa" },
    { name: "Fitness Center", icon: "fitness" },
    { name: "Restaurant", icon: "restaurant" },
    { name: "Bar/Lounge", icon: "bar" },
    { name: "Room Service", icon: "room_service" },
    { name: "Free Parking", icon: "parking" },
    { name: "Concierge", icon: "concierge" },
    { name: "Air Conditioning", icon: "ac" },
  ],
  policies: {
    checkIn: "3:00 PM",
    checkOut: "11:00 AM",
    cancellation: "Free cancellation up to 24 hours before check-in",
    children: "Children of all ages are welcome",
    pets: "Pets are not allowed",
  },
  rooms: [
    {
      id: 1,
      name: "Deluxe Double Room",
      type: "Double Room",
      description: "Spacious room with city views and modern amenities",
      size: 35,
      maxGuests: 2,
      bedType: "1 King Bed",
      images: [
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
      ],
      amenities: ["WiFi", "TV", "Mini Bar", "Safe", "Air Conditioning"],
      pricePerNight: 199,
      originalPrice: 249,
      availableRooms: 8,
      freeCancellation: true,
      breakfastIncluded: false,
      breakfastPrice: 25,
    },
    {
      id: 2,
      name: "Executive Suite",
      type: "Suite",
      description:
        "Luxurious suite with separate living area and premium amenities",
      size: 55,
      maxGuests: 2,
      bedType: "1 King Bed",
      images: [
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
      ],
      amenities: ["WiFi", "TV", "Mini Bar", "Safe", "Living Area", "Jacuzzi"],
      pricePerNight: 399,
      originalPrice: null,
      availableRooms: 4,
      freeCancellation: true,
      breakfastIncluded: true,
      breakfastPrice: 0,
    },
    {
      id: 3,
      name: "Family Room",
      type: "Family Room",
      description: "Perfect for families with connecting rooms option",
      size: 45,
      maxGuests: 4,
      bedType: "1 King Bed + 2 Twin Beds",
      images: [
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
      ],
      amenities: ["WiFi", "TV", "Mini Bar", "Safe", "Extra Space"],
      pricePerNight: 349,
      originalPrice: 399,
      availableRooms: 3,
      freeCancellation: true,
      breakfastIncluded: false,
      breakfastPrice: 20,
    },
  ],
  reviews: [
    {
      id: 1,
      guestName: "Robert Williams",
      guestCountry: "USA",
      rating: 5,
      title: "Exceptional stay!",
      comment:
        "Everything was perfect from check-in to check-out. The staff went above and beyond.",
      date: "2024-01-10",
      roomType: "Executive Suite",
      tripType: "Couple",
    },
    {
      id: 2,
      guestName: "Emma Johnson",
      guestCountry: "Canada",
      rating: 4,
      title: "Great location, minor issues",
      comment:
        "The location is unbeatable and the room was beautiful. Only minor issue was slow room service.",
      date: "2024-01-05",
      roomType: "Deluxe Double Room",
      tripType: "Business",
    },
  ],
};

// ==================== USER'S BOOKINGS ====================
export const userBookings = [
  {
    id: 1,
    bookingCode: "BK-2024-001",
    property: {
      id: 1,
      name: "Grand Plaza Hotel",
      type: "Hotel",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
      address: "100 Broadway, New York, NY",
      rating: 4.8,
    },
    room: {
      name: "Executive Suite",
      type: "Suite",
    },
    checkIn: "2024-02-15",
    checkOut: "2024-02-18",
    nights: 3,
    guests: { adults: 2, children: 0 },
    pricing: {
      roomRate: 399,
      subtotal: 1197,
      taxes: 119.7,
      total: 1316.7,
    },
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: "2024-01-20T10:30:00",
    canCancel: true,
    canModify: true,
  },
  {
    id: 2,
    bookingCode: "BK-2024-002",
    property: {
      id: 2,
      name: "Sunset Beach Resort",
      type: "Resort",
      image:
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400",
      address: "500 Ocean Drive, Miami Beach, FL",
      rating: 4.6,
    },
    room: {
      name: "Ocean View Suite",
      type: "Suite",
    },
    checkIn: "2024-03-10",
    checkOut: "2024-03-15",
    nights: 5,
    guests: { adults: 2, children: 1 },
    pricing: {
      roomRate: 449,
      subtotal: 2245,
      taxes: 224.5,
      total: 2469.5,
    },
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: "2024-01-25T14:20:00",
    canCancel: true,
    canModify: true,
  },
  {
    id: 3,
    bookingCode: "BK-2023-089",
    property: {
      id: 3,
      name: "Mountain View Villa",
      type: "Villa",
      image:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
      address: "25 Highland Road, Aspen, CO",
      rating: 4.9,
    },
    room: {
      name: "Master Suite",
      type: "Suite",
    },
    checkIn: "2023-12-23",
    checkOut: "2023-12-28",
    nights: 5,
    guests: { adults: 2, children: 0 },
    pricing: {
      roomRate: 699,
      subtotal: 3495,
      taxes: 349.5,
      total: 3844.5,
    },
    status: "completed",
    paymentStatus: "paid",
    createdAt: "2023-11-15T09:00:00",
    canCancel: false,
    canModify: false,
    reviewSubmitted: true,
  },
];

// ==================== USER'S WISHLIST ====================
export const userWishlist = [
  { id: 1, property: featuredProperties[0], addedAt: "2024-01-15" },
  { id: 2, property: featuredProperties[2], addedAt: "2024-01-10" },
  { id: 3, property: featuredProperties[5], addedAt: "2023-12-20" },
];

// ==================== USER'S REVIEWS ====================
export const userReviews = [
  {
    id: 1,
    bookingCode: "BK-2023-089",
    property: {
      id: 3,
      name: "Mountain View Villa",
      image:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
    },
    rating: 5,
    title: "Perfect anniversary getaway!",
    comment:
      "We had an absolutely magical stay at Mountain View Villa for our anniversary.",
    stayDate: "December 2023",
    createdAt: "2023-12-29",
    helpful: 8,
  },
];

// ==================== SEARCH FILTERS ====================
export const searchFilters = {
  priceRange: { min: 0, max: 1000 },
  propertyTypes: [
    { id: "hotel", label: "Hotels", count: 450 },
    { id: "resort", label: "Resorts", count: 120 },
    { id: "villa", label: "Villas", count: 85 },
    { id: "apartment", label: "Apartments", count: 320 },
    { id: "homestay", label: "Homestays", count: 210 },
  ],
  amenities: [
    { id: "wifi", label: "Free WiFi", count: 890 },
    { id: "parking", label: "Free Parking", count: 450 },
    { id: "pool", label: "Swimming Pool", count: 220 },
    { id: "spa", label: "Spa", count: 120 },
    { id: "gym", label: "Fitness Center", count: 310 },
    { id: "restaurant", label: "Restaurant", count: 380 },
    { id: "breakfast", label: "Breakfast Included", count: 420 },
  ],
  guestRatings: [
    { value: 4.5, label: "Exceptional (4.5+)" },
    { value: 4.0, label: "Excellent (4.0+)" },
    { value: 3.5, label: "Very Good (3.5+)" },
  ],
  sortOptions: [
    { value: "recommended", label: "Recommended" },
    { value: "price_low", label: "Price: Low to High" },
    { value: "price_high", label: "Price: High to Low" },
    { value: "rating", label: "Guest Rating" },
  ],
};

// ==================== SPECIAL OFFERS ====================
export const specialOffers = [
  {
    id: 1,
    title: "Early Bird Discount",
    description: "Book 30 days in advance and save up to 25%",
    code: "EARLY25",
    discount: 25,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
  },
  {
    id: 2,
    title: "Weekend Getaway",
    description: "Stay 2 nights on weekends and get 15% off",
    code: "WEEKEND15",
    discount: 15,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
  },
  {
    id: 3,
    title: "Long Stay Offer",
    description: "Book 7+ nights and save Nu 100",
    code: "LONGSTAY100",
    discount: 100,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
  },
];

// ==================== USER NOTIFICATIONS ====================
export const userNotifications = [
    {
        id: 1,
        type: "booking_confirmation",
        title: "Booking Confirmed",
        message: "Your booking at Grand Plaza Hotel (BK-2024-001) has been confirmed.",
        isRead: true,
        createdAt: "2024-01-20T10:35:00",
        link: "/account/bookings/1",
    },
    {
        id: 2,
        type: "upcoming_stay",
        title: "Your stay is coming up!",
        message: "Your stay at Grand Plaza Hotel is in 3 days. Don't forget to check in online!",
        isRead: false,
        createdAt: "2024-02-12T09:00:00",
        link: "/account/bookings/1",
    },
    {
        id: 3,
        type: "promotion",
        title: "Special Offer: 20% Off",
        message: "Book now and get 20% off on selected properties. Offer valid until Feb 28.",
        isRead: false,
        createdAt: "2024-02-10T08:00:00",
        link: "/search?promo=WINTER20",
    },
    {
        id: 4,
        type: "review_reminder",
        title: "How was your stay?",
        message: "Share your experience at Mountain View Villa and help other travelers.",
        isRead: true,
        createdAt: "2023-12-29T08:00:00",
        link: "/account/bookings/3",
    },
    {
        id: 5,
        type: "price_drop",
        title: "Price Drop Alert",
        message: "Sunset Beach Resort in your wishlist just dropped prices by 15%!",
        isRead: false,
        createdAt: "2024-02-08T11:30:00",
        link: "/property/2",
    },
    {
        id: 6,
        type: "booking_reminder",
        title: "Complete Your Booking",
        message: "You have an incomplete booking for Lakeside Cottage. Complete it before prices change!",
        isRead: false,
        createdAt: "2024-02-07T14:20:00",
        link: "/property/6",
    },
    {
        id: 7,
        type: "loyalty",
        title: "You've Earned 500 Points!",
        message: "Congratulations! Your recent stay earned you 500 loyalty points.",
        isRead: true,
        createdAt: "2024-01-28T10:00:00",
        link: "/account/rewards",
    },
];

// ==================== PAYMENT METHODS ====================
export const paymentMethods = [
    {
        id: 1,
        type: "credit_card",
        brand: "visa",
        last4: "4242",
        expiryMonth: 12,
        expiryYear: 2025,
        holderName: "Dorji",
        isDefault: true,
    },
    {
        id: 2,
        type: "credit_card",
        brand: "mastercard",
        last4: "5678",
        expiryMonth: 8,
        expiryYear: 2024,
        holderName: "Dorji",
        isDefault: false,
    },
    {
        id: 3,
        type: "paypal",
        email: "dorji@email.com",
        isDefault: false,
    },
];