// src/services/bookingService.js
import api, { extractResponseData } from "./api";
import {
  ACCEPT_LANGUAGE_HEADER,
  DEFAULT_LANGUAGE,
  ENDPOINTS,
} from "../config/apiConfig";
import { userBookings } from "../data/userMockData";

const BOOKING_STORAGE_KEY = "hpms.user.bookings";

const isBrowser = typeof window !== "undefined";

const normalizeBookingList = (value) => (Array.isArray(value) ? value : []);

const readStoredBookings = () => {
  if (!isBrowser) return [];

  try {
    const rawValue = window.localStorage.getItem(BOOKING_STORAGE_KEY);
    if (!rawValue) return [];

    const parsedValue = JSON.parse(rawValue);
    return normalizeBookingList(parsedValue);
  } catch (error) {
    return [];
  }
};

const writeStoredBookings = (bookings) => {
  if (!isBrowser) return;

  try {
    window.localStorage.setItem(
      BOOKING_STORAGE_KEY,
      JSON.stringify(normalizeBookingList(bookings))
    );
  } catch (error) {
    // Ignore storage failures and keep the API flow working.
  }
};

const removeStoredBooking = (id) => {
  if (!id) return;

  const currentBookings = readStoredBookings().filter(
    (booking) => String(booking.id) !== String(id)
  );
  writeStoredBookings(currentBookings);
};

const toNumber = (value, fallbackValue = 0) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : fallbackValue;
};

const toIsoString = (value, fallbackValue = new Date().toISOString()) => {
  if (!value) return fallbackValue;

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return fallbackValue;
  }

  return parsedDate.toISOString();
};

const calculateNights = (checkIn, checkOut) => {
  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);

  if (
    Number.isNaN(startDate.getTime()) ||
    Number.isNaN(endDate.getTime())
  ) {
    return 1;
  }

  const diffInMs = endDate.getTime() - startDate.getTime();
  const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

  return diffInDays > 0 ? diffInDays : 1;
};

const normalizeStatus = (statusLabel, paymentStatusLabel) => {
  const normalizedStatus = String(statusLabel || "").toLowerCase();
  if (
    normalizedStatus.includes("checked out") ||
    normalizedStatus.includes("checked-out") ||
    normalizedStatus.includes("checkout")
  ) {
    return "completed";
  }
  if (
    normalizedStatus.includes("checked in") ||
    normalizedStatus.includes("checked-in") ||
    normalizedStatus.includes("checkin")
  ) {
    return "checked-in";
  }
  if (normalizedStatus.includes("cancel")) return "cancelled";
  if (normalizedStatus.includes("complete")) return "completed";
  if (normalizedStatus.includes("pending")) return "pending";

  const normalizedPaymentStatus = String(paymentStatusLabel || "").toLowerCase();
  if (normalizedPaymentStatus.includes("pending")) return "pending";

  return "confirmed";
};

const normalizeApprovalStatus = (statusLabel, fallbackValue = "pending") => {
  const normalizedStatus = String(statusLabel || "").toLowerCase();
  if (normalizedStatus.includes("reject")) return "rejected";
  if (
    normalizedStatus.includes("approve") ||
    normalizedStatus.includes("confirm") ||
    normalizedStatus.includes("check")
  ) {
    return "approved";
  }
  if (normalizedStatus.includes("cancel")) return "rejected";
  if (normalizedStatus.includes("pending")) return "pending";
  return fallbackValue;
};

const resolvePaymentStatus = (totalAmount, amountPaid = 0) => {
  if (amountPaid >= totalAmount && totalAmount > 0) {
    return { paymentStatusId: 3, paymentStatusLabel: "Fully Paid" };
  }

  if (amountPaid > 0) {
    return { paymentStatusId: 2, paymentStatusLabel: "Partially Paid" };
  }

  return { paymentStatusId: 0, paymentStatusLabel: "Pending" };
};

export const buildBookingPayload = ({
  userId,
  roomId,
  checkIn,
  checkOut,
  totalAmount,
  amountPaid = 0,
  journalNo,
  propertyName,
  roomNo,
  userName,
  transactedBy,
  bookingNo = 0,
  bookingCode = "",
  isActive = true,
}) => {
  const paymentStatus = resolvePaymentStatus(totalAmount, amountPaid);

  return {
    isActive,
    transactedBy: transactedBy || "",
    bookingNo,
    bookingCode,
    userId: userId || "",
    roomId: roomId || "",
    checkinDate: toIsoString(checkIn),
    checkoutDate: toIsoString(checkOut),
    totalAmount: toNumber(totalAmount),
    amountPaid: toNumber(amountPaid),
    paymentStatusId: paymentStatus.paymentStatusId,
    paymentStatusLabel: paymentStatus.paymentStatusLabel,
    journalNo: journalNo || "",
    statusId: 0,
    statusLabel: "Pending",
    propertyName: propertyName || "",
    roomNo: roomNo || "",
    userName: userName || "",
  };
};

export const buildBookingRecord = (bookingResponse, context = {}) => {
  const checkIn =
    bookingResponse?.checkinDate || context.checkIn || new Date().toISOString();
  const checkOut =
    bookingResponse?.checkoutDate ||
    context.checkOut ||
    new Date().toISOString();
  const totalAmount =
    context.pricing?.total ?? bookingResponse?.totalAmount ?? 0;
  const roomRate =
    context.pricing?.roomRate ??
    (calculateNights(checkIn, checkOut) > 0
      ? totalAmount / calculateNights(checkIn, checkOut)
      : totalAmount);
  const subtotal = context.pricing?.subtotal ?? roomRate * calculateNights(checkIn, checkOut);
  const taxes = context.pricing?.taxes ?? Math.max(totalAmount - subtotal, 0);

  return {
    id:
      bookingResponse?.id ||
      bookingResponse?.primaryKeyValue ||
      context.id ||
      bookingResponse?.bookingCode,
    bookingCode:
      bookingResponse?.bookingCode ||
      context.bookingCode ||
      bookingResponse?.primaryKeyValue ||
      "",
    bookingNo: bookingResponse?.bookingNo ?? context.bookingNo ?? 0,
    userId: bookingResponse?.userId || context.userId || "",
    roomId: bookingResponse?.roomId || context.roomId || "",
    checkIn: toIsoString(checkIn),
    checkOut: toIsoString(checkOut),
    nights: context.nights || calculateNights(checkIn, checkOut),
    status: normalizeStatus(
      bookingResponse?.statusLabel || context.status,
      bookingResponse?.paymentStatusLabel || context.paymentStatus
    ),
    paymentStatus:
      bookingResponse?.paymentStatusLabel || context.paymentStatus || "Pending",
    approvalStatus: normalizeApprovalStatus(
      bookingResponse?.statusLabel,
      context.approvalStatus || "pending"
    ),
    pricing: {
      roomRate: toNumber(roomRate),
      subtotal: toNumber(subtotal),
      taxes: toNumber(taxes),
      total: toNumber(totalAmount),
    },
    guests: {
      adults: toNumber(context.guests?.adults, 2),
      children: toNumber(context.guests?.children, 0),
      rooms: toNumber(context.guests?.rooms, 1),
    },
    guestDetails: {
      firstName: context.guestDetails?.firstName || "",
      lastName: context.guestDetails?.lastName || "",
      email: context.guestDetails?.email || "",
      phone: context.guestDetails?.phone || "",
    },
    property: {
      id: context.property?.id || "",
      name: bookingResponse?.propertyName || context.property?.name || "",
      image:
        context.property?.image ||
        context.property?.images?.[0]?.url ||
        context.property?.images?.[0] ||
        "",
      address:
        context.property?.address || context.property?.location?.address || "",
      rating: toNumber(context.property?.rating),
      type: context.property?.type || "",
    },
    room: {
      id: bookingResponse?.roomId || context.room?.id || "",
      name: bookingResponse?.roomNo || context.room?.name || "",
      roomNo: bookingResponse?.roomNo || context.room?.roomNo || "",
      type: context.room?.type || "",
    },
    canModify:
      typeof context.canModify === "boolean" ? context.canModify : true,
    canCancel:
      typeof context.canCancel === "boolean" ? context.canCancel : true,
    reviewSubmitted: Boolean(context.reviewSubmitted),
    createdAt:
      bookingResponse?.transactedDate ||
      context.createdAt ||
      new Date().toISOString(),
    api: bookingResponse,
  };
};

export const getStoredBookingHistory = () => {
  const storedBookings = readStoredBookings();
  if (storedBookings.length === 0) {
    return userBookings;
  }

  const storedIds = new Set(storedBookings.map((booking) => String(booking.id)));
  const fallbackBookings = userBookings.filter(
    (booking) => !storedIds.has(String(booking.id))
  );

  return [...storedBookings, ...fallbackBookings];
};

export const getStoredBookingById = (id) =>
  getStoredBookingHistory().find((booking) => String(booking.id) === String(id)) ||
  null;

export const upsertBookingRecord = (bookingRecord) => {
  if (!bookingRecord?.id) return bookingRecord;

  const currentBookings = readStoredBookings();
  const existingIndex = currentBookings.findIndex(
    (booking) => String(booking.id) === String(bookingRecord.id)
  );

  if (existingIndex >= 0) {
    currentBookings[existingIndex] = {
      ...currentBookings[existingIndex],
      ...bookingRecord,
    };
  } else {
    currentBookings.unshift(bookingRecord);
  }

  writeStoredBookings(currentBookings);
  return bookingRecord;
};

export const normalizeBookingRecord = (bookingResponse) => {
  const storedContext =
    getStoredBookingById(bookingResponse?.id || bookingResponse?.primaryKeyValue) || {};
  return buildBookingRecord(bookingResponse, storedContext);
};

const executeBookingAction = async (endpoint, payload, options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.post(endpoint, payload, { headers });
  return extractResponseData(response);
};

/**
 * Create booking.
 * Endpoint: /hpms/api/Booking/Post
 * @param {object} payload
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const createBooking = async (payload, options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.post(ENDPOINTS.BOOKINGS.POST, payload, {
    headers,
  });
  return extractResponseData(response);
};

/**
 * Get booking by id.
 * Endpoint: /hpms/api/Booking/GetById/{id}
 * @param {string} id
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const getBookingById = async (id, options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.get(`${ENDPOINTS.BOOKINGS.GET_BY_ID}/${id}`, {
    headers,
  });
  return extractResponseData(response);
};

/**
 * Get booking list.
 * Endpoint: /hpms/api/Booking/GetList
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const getBookingList = async (options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.get(ENDPOINTS.BOOKINGS.GET_LIST, { headers });
  return extractResponseData(response);
};

/**
 * Update booking.
 * Endpoint: /hpms/api/Booking/Put
 * @param {object} payload
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const updateBooking = async (payload, options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.put(ENDPOINTS.BOOKINGS.PUT, payload, {
    headers,
  });
  return extractResponseData(response);
};

/**
 * Delete booking.
 * Endpoint: /hpms/api/Booking/Delete
 * @param {object} payload
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const deleteBooking = async (payload, options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.delete(ENDPOINTS.BOOKINGS.DELETE, {
    data: payload,
    headers,
  });

  const responseData = extractResponseData(response);
  removeStoredBooking(payload?.id || payload?.primaryKeyValue);
  return responseData;
};

export const approveBooking = async (payload, options = {}) =>
  executeBookingAction(ENDPOINTS.BOOKINGS.APPROVE, payload, options);

export const rejectBooking = async (payload, options = {}) =>
  executeBookingAction(ENDPOINTS.BOOKINGS.REJECT, payload, options);

export const checkinBooking = async (payload, options = {}) =>
  executeBookingAction(ENDPOINTS.BOOKINGS.CHECKIN, payload, options);

export const checkoutBooking = async (payload, options = {}) =>
  executeBookingAction(ENDPOINTS.BOOKINGS.CHECKOUT, payload, options);
