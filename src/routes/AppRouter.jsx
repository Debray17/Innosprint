import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../Layout/DashboardLayout";
import ContentPage from "../components/ContentPage";

export default function AppRouter() {
    return (
        <Routes>
            <Route element={<DashboardLayout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                
                {/* Main Navigation Routes */}
                <Route path="/dashboard" element={<ContentPage title="Dashboard" />} />
                <Route path="/projects" element={<ContentPage title="Projects" />} />
                <Route path="/tasks" element={<ContentPage title="Tasks" />} />
                <Route path="/reports" element={<ContentPage title="Reports" />} />
                <Route path="/users" element={<ContentPage title="Users" />} />

                {/* --- New Nested Navigation Routes (Settings) --- */}
                <Route path="/settings" element={<Navigate to="/settings/general" replace />} />
                <Route path="/settings/general" element={<ContentPage title="General Settings" />} />
                <Route path="/settings/billing" element={<ContentPage title="Billing Settings" />} />

                {/* --- New Nested Navigation Routes (Support) --- */}
                <Route path="/support" element={<Navigate to="/support/faq" replace />} />
                <Route path="/support/faq" element={<ContentPage title="FAQ" />} />
                <Route path="/support/contact" element={<ContentPage title="Contact Us" />} />

            </Route>
            
        </Routes>
    );
}