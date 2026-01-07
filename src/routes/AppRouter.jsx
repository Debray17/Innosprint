import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../Layout/DashboardLayout";

// Dashboard
import DashboardPage from "../pages/Dashboard/DashboardPage";

// User Management
import OwnersListPage from "../pages/Users/OwnersListPage";
import PendingVerificationsPage from "../pages/Users/PendingVerificationsPage";

// Properties
import PropertyRequestsPage from "../pages/Properties/PopertyRequestsPage";
import AllPropertiesPage from "../pages/Properties/AllPropertiesPage";
import PropertyTypesPage from "../pages/Properties/PropertyTypesPage";
import PropertyDetailsPage from "../pages/Properties/PropertyDetailsPage";

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

export default function AppRouter() {
    return (
        <Routes>
            <Route element={<DashboardLayout />}>
                {/* Default redirect */}
                <Route index element={<Navigate to="/dashboard" replace />} />

                {/* Dashboard */}
                <Route path="/dashboard" element={<DashboardPage />} />

                {/* User Management */}
                <Route path="/users" element={<Navigate to="/users/owners" replace />} />
                <Route path="/users/owners" element={<OwnersListPage />} />
                <Route path="/users/pending" element={<PendingVerificationsPage />} />

                {/* Properties */}
                <Route path="/properties" element={<Navigate to="/properties/all" replace />} />
                <Route path="/properties/requests" element={<PropertyRequestsPage />} />
                <Route path="/properties/all" element={<AllPropertiesPage />} />
                <Route path="/properties/types" element={<PropertyTypesPage />} />
                <Route path="/properties/:id" element={<PropertyDetailsPage />} />

                {/* Rooms */}
                <Route path="/rooms" element={<Navigate to="/rooms/all" replace />} />
                <Route path="/rooms/all" element={<AllRoomsPage />} />
                <Route path="/rooms/types" element={<RoomTypesPage />} />

                {/* Bookings */}
                <Route path="/bookings" element={<Navigate to="/bookings/all" replace />} />
                <Route path="/bookings/all" element={<AllBookingsPage />} />
                <Route path="/bookings/check-in-out" element={<CheckInOutPage />} />
                <Route path="/bookings/calendar" element={<CalendarPage />} />

                {/* Guests */}
                <Route path="/guests" element={<GuestsListPage />} />

                {/* Services */}
                <Route path="/services" element={<Navigate to="/services/categories" replace />} />
                <Route path="/services/categories" element={<ServiceCategoriesPage />} />
                <Route path="/services/bookings" element={<ServiceBookingsPage />} />

                {/* Reports */}
                <Route path="/reports" element={<Navigate to="/reports/revenue" replace />} />
                <Route path="/reports/revenue" element={<RevenueReportPage />} />
                <Route path="/reports/occupancy" element={<OccupancyReportPage />} />

                {/* Settings */}
                <Route path="/settings" element={<Navigate to="/settings/general" replace />} />
                <Route path="/settings/general" element={<GeneralSettingsPage />} />
                <Route path="/settings/commission" element={<CommissionSettingsPage />} />
                <Route path="/settings/seasonal-pricing" element={<SeasonalPricingPage />} />

                {/* 404 Fallback */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
        </Routes>
    );
}