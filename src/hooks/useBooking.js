import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  approveBooking,
  buildBookingRecord,
  checkinBooking,
  checkoutBooking,
  createBooking,
  deleteBooking,
  getBookingById,
  getBookingList,
  getStoredBookingById,
  getStoredBookingHistory,
  normalizeBookingRecord,
  rejectBooking,
  updateBooking,
  upsertBookingRecord,
} from "../services/bookingService";

export const BOOKING_QUERY_KEY = ["bookings"];

export const useBookingHistory = (options = {}) =>
  useQuery({
    queryKey: [...BOOKING_QUERY_KEY, "list"],
    queryFn: async () => {
      const response = await getBookingList(options.apiOptions);
      const records = Array.isArray(response)
        ? response.map(normalizeBookingRecord)
        : [];

      records.forEach((record) => {
        upsertBookingRecord(record);
      });

      return records;
    },
    enabled: options.enabled ?? true,
    initialData: () => getStoredBookingHistory(),
  });

export const useBookingRecord = (id, options = {}) =>
  useQuery({
    queryKey: [...BOOKING_QUERY_KEY, "detail", id],
    queryFn: async () => {
      const response = await getBookingById(id, options.apiOptions);
      const record = normalizeBookingRecord(response);
      upsertBookingRecord(record);
      return record;
    },
    enabled: options.enabled ?? Boolean(id),
    initialData: () => getStoredBookingById(id),
  });

export const useCreateBookingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ payload, options, context }) => {
      const response = await createBooking(payload, options);
      const bookingRecord = buildBookingRecord(response, context);
      upsertBookingRecord(bookingRecord);
      return { response, bookingRecord };
    },
    onSuccess: ({ bookingRecord }) => {
      queryClient.invalidateQueries({ queryKey: BOOKING_QUERY_KEY });
      queryClient.setQueryData(
        [...BOOKING_QUERY_KEY, "detail", bookingRecord.id],
        bookingRecord
      );
    },
  });
};

export const useUpdateBookingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ payload, options, context }) => {
      const response = await updateBooking(payload, options);
      const bookingRecord = buildBookingRecord(response, context);
      upsertBookingRecord(bookingRecord);
      return { response, bookingRecord };
    },
    onSuccess: ({ bookingRecord }) => {
      queryClient.invalidateQueries({ queryKey: BOOKING_QUERY_KEY });
      queryClient.setQueryData(
        [...BOOKING_QUERY_KEY, "detail", bookingRecord.id],
        bookingRecord
      );
    },
  });
};

export const useDeleteBookingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ payload, options }) => {
      const response = await deleteBooking(payload, options);
      return { response, id: payload?.id || payload?.primaryKeyValue };
    },
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: BOOKING_QUERY_KEY });
      queryClient.removeQueries({ queryKey: [...BOOKING_QUERY_KEY, "detail", id] });
    },
  });
};

const bookingActionMap = {
  approve: approveBooking,
  reject: rejectBooking,
  checkin: checkinBooking,
  checkout: checkoutBooking,
};

export const useBookingActionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ action, payload, options, context }) => {
      const actionFn = bookingActionMap[action];
      if (!actionFn) {
        throw new Error(`Unsupported booking action: ${action}`);
      }

      const response = await actionFn(payload, options);
      const bookingRecord = buildBookingRecord(response, context);
      upsertBookingRecord(bookingRecord);
      return { response, bookingRecord };
    },
    onSuccess: ({ bookingRecord }) => {
      queryClient.invalidateQueries({ queryKey: BOOKING_QUERY_KEY });
      queryClient.setQueryData(
        [...BOOKING_QUERY_KEY, "detail", bookingRecord.id],
        bookingRecord
      );
    },
  });
};
