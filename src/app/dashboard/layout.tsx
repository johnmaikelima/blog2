import { DashboardLayout as DashboardLayoutComponent } from '@/components/dashboard/dashboard-layout';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { RoleGuard } from '@/components/auth/role-guard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={['admin', 'editor']}>
        <DashboardLayoutComponent>
          {children}
        </DashboardLayoutComponent>
      </RoleGuard>
    </ProtectedRoute>
  );
}
