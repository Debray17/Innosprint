// src/routes/AppRouter.jsx
import { Routes, Route, Navigate } from "react-router-dom";

// =====================================================
// LAYOUTS
// =====================================================
import DashboardLayout from "../Layout/DashboardLayout";
import UserLayout from "../Layout/UserLayout";

// =====================================================
// ADMIN PAGES
// =====================================================
// Dashboard
import AdminDashboardPage from "../pages/Dashboard/DashboardPage";

// User Management
import OwnersListPage from "../pages/Users/OwnersListPage";
import PendingVerificationsPage from "../pages/Users/PendingVerificationsPage";

// Properties
import PropertyRequestsPage from "../pages/Properties/PopertyRequestsPage";
import AllPropertiesPage from "../pages/Properties/AllPropertiesPage";
import PropertyTypesPage from "../pages/Properties/PropertyTypesPage";
import AdminPropertyDetailsPage from "../pages/Properties/PropertyDetailsPage";

// Rooms
import AllRoomsPage from "../pages/Rooms/AllRoomsPage";
import RoomTypesPage from "../pages/Rooms/RoomTypesPage";

// Bookings
import AllBookingsPage from "../pages/Bookings/AllBookingsPage";
import CheckInOutPage from "../pages/Bookings/CheckInOutPage";
import CalendarPage from "../pages/Bookings/CalenderPage";

// Guests
import GuestsListPage from "../pages/Guests/GuestsListPage";

// Services
import ServiceCategoriesPage from "../pages/Services/ServiceCategoriesPage";
import ServiceBookingsPage from "../pages/Services/ServiceBookingsPage";

// Reports
import RevenueReportPage from "../pages/Reports/RevenueReportPage";
import OccupancyReportPage from "../pages/Reports/OccupancyReportPage";

// Settings
import GeneralSettingsPage from "../pages/Settings/GeneralSettingsPage";
import CommissionSettingsPage from "../pages/Settings/CommissionSettingsPage";
import SeasonalPricingPage from "../pages/Settings/SeasonalPricingPage";

// =====================================================
// USER PAGES
// =====================================================
// Public Pages
import HomePage from "../pages/User/HomePage";
import SearchResultsPage from "../pages/User/SearchResultsPage";
import PropertyDetailsPage from "../pages/User/PropertyDetailsPage";

// Booking Flow
import BookingPage from "../pages/User/BookingPage";
import BookingConfirmationPage from "../pages/User/BookingConfirmationPage";

// User Account
import UserDashboardPage from "../pages/User/Account/UserDashboardPage";
import MyBookingsPage from "../pages/User/Account/MyBookingsPage";
import BookingDetailsPage from "../pages/User/Account/BookingDetailsPage";
import ProfilePage from "../pages/User/Account/ProfilePage";
import WishlistPage from "../pages/User/Account/WishlistPage";
import MyReviewsPage from "../pages/User/Account/MyReviewsPage";
import PaymentMethodsPage from "../pages/User/Account/PaymentMethodsPage";
import NotificationsSettingsPage from "../pages/User/Account/NotificationsSettingsPage";
import SecurityPage from "../pages/User/Account/SecurityPage";

// Support Pages
import HelpCenterPage from "../pages/User/Support/HelpCenterPage";
import ContactUsPage from "../pages/User/Support/ContactUsPage";

// Legal Pages
import PrivacyPolicyPage from "../pages/User/Legal/PrivacyPolicyPage";
import TermsOfServicePage from "../pages/User/Legal/TermsOfServicePage";
import CookiePolicyPage from "../pages/User/Legal/CookiePolicyPage";
import CancellationPolicyPage from "../pages/User/Legal/CancellationPolicyPage";

// Info Pages
import SafetyInformationPage from "../pages/User/Info/SafetyInformationPage";

// Company Pages
import AboutUsPage from "../pages/User/Company/AboutUsPage";
import CareersPage from "../pages/User/Company/CareersPage";

// Host Pages
import ListYourPropertyPage from "../pages/User/Host/ListYourPropertyPage";
import HostResourcesPage from "../pages/User/Host/HostResourcesPage";
import CommunityForumPage from "../pages/User/Host/CommunityForumPage";

// =====================================================
// AUTH PAGES
// =====================================================
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import ForgotPasswordPage from "../pages/Auth/ForgotPasswordPage";

// =====================================================
// ERROR PAGES
// =====================================================
import NotFoundPage from "../pages/NotFoundPage";

export default function AppRouter() {
  return (
    <Routes>
      {/* ============================================= */}
      {/* AUTH ROUTES (No Layout)                       */}
      {/* ============================================= */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* ============================================= */}
      {/* ADMIN ROUTES (/admin/*)                       */}
      {/* ============================================= */}
      <Route path="/admin" element={<DashboardLayout />}>
        {/* Default redirect */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* Dashboard */}
        <Route path="dashboard" element={<AdminDashboardPage />} />

        {/* User Management */}
        <Route path="users" element={<Navigate to="owners" replace />} />
        <Route path="users/owners" element={<OwnersListPage />} />
        <Route path="users/pending" element={<PendingVerificationsPage />} />

        {/* Properties */}
        <Route path="properties" element={<Navigate to="all" replace />} />
        <Route path="properties/requests" element={<PropertyRequestsPage />} />
        <Route path="properties/all" element={<AllPropertiesPage />} />
        <Route path="properties/types" element={<PropertyTypesPage />} />
        <Route path="properties/:id" element={<AdminPropertyDetailsPage />} />

        {/* Rooms */}
        <Route path="rooms" element={<Navigate to="all" replace />} />
        <Route path="rooms/all" element={<AllRoomsPage />} />
        <Route path="rooms/types" element={<RoomTypesPage />} />

        {/* Bookings */}
        <Route path="bookings" element={<Navigate to="all" replace />} />
        <Route path="bookings/all" element={<AllBookingsPage />} />
        <Route path="bookings/check-in-out" element={<CheckInOutPage />} />
        <Route path="bookings/calendar" element={<CalendarPage />} />

        {/* Guests */}
        <Route path="guests" element={<GuestsListPage />} />

        {/* Services */}
        <Route path="services" element={<Navigate to="categories" replace />} />
        <Route path="services/categories" element={<ServiceCategoriesPage />} />
        <Route path="services/bookings" element={<ServiceBookingsPage />} />

        {/* Reports */}
        <Route path="reports" element={<Navigate to="revenue" replace />} />
        <Route path="reports/revenue" element={<RevenueReportPage />} />
        <Route path="reports/occupancy" element={<OccupancyReportPage />} />

        {/* Settings */}
        <Route path="settings" element={<Navigate to="general" replace />} />
        <Route path="settings/general" element={<GeneralSettingsPage />} />
        <Route
          path="settings/commission"
          element={<CommissionSettingsPage />}
        />
        <Route
          path="settings/seasonal-pricing"
          element={<SeasonalPricingPage />}
        />

        {/* Admin 404 */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* ============================================= */}
      {/* USER ROUTES (/)                               */}
      {/* ============================================= */}
      <Route element={<UserLayout />}>
        {/* Home */}
        <Route index element={<HomePage />} />

        {/* Search & Property */}
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/property/:id" element={<PropertyDetailsPage />} />

        {/* Booking Flow */}
        <Route path="/booking/:propertyId/:roomId" element={<BookingPage />} />
        <Route
          path="/booking/confirmation/:bookingId"
          element={<BookingConfirmationPage />}
        />

        {/* User Account */}
        <Route
          path="/account"
          element={<Navigate to="/account/dashboard" replace />}
        />
        <Route path="/account/dashboard" element={<UserDashboardPage />} />
        <Route path="/account/bookings" element={<MyBookingsPage />} />
        <Route path="/account/bookings/:id" element={<BookingDetailsPage />} />
        <Route path="/account/profile" element={<ProfilePage />} />
        <Route path="/account/wishlist" element={<WishlistPage />} />
        <Route path="/account/reviews" element={<MyReviewsPage />} />
        <Route path="/account/payments" element={<PaymentMethodsPage />} />
        <Route
          path="/account/notifications"
          element={<NotificationsSettingsPage />}
        />
        <Route path="/account/security" element={<SecurityPage />} />

        {/* Support */}
        <Route path="/help" element={<HelpCenterPage />} />
        <Route path="/contact" element={<ContactUsPage />} />

        {/* Legal Pages */}
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />
        <Route path="/cookies" element={<CookiePolicyPage />} />
        <Route
          path="/cancellation-policy"
          element={<CancellationPolicyPage />}
        />

        {/* Info Pages */}
        <Route path="/safety" element={<SafetyInformationPage />} />

        {/* Company Pages */}
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/careers" element={<CareersPage />} />

        {/* Host Pages */}
        <Route path="/host" element={<ListYourPropertyPage />} />
        <Route path="/host-resources" element={<HostResourcesPage />} />
        <Route path="/community" element={<CommunityForumPage />} />

        {/* User 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
