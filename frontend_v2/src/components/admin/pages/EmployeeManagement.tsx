import React, { useState } from "react";
import { AdminPanelComponentProps } from "@/lib/types/admin";
import { Users, Shield, Building } from "lucide-react";
import useEmployees from "@/hooks/admin/use-employees";
import useRoles from "@/hooks/admin/use-roles";
import useDepartments from "@/hooks/admin/use-departments";

import LoadingScreen from "@/components/student/interest/states/LoadingScreen";

import EmployeesTab from "../employees/EmployeesTab";
import RolesTab from "../employees/RolesTab";
import DepartmentsTab from "../employees/DepartmentsTab";

import EmployeeModal from "../employees/EmployeeModal";
import RoleModal from "../employees/RoleModal";
import DepartmentModal from "../employees/DepartmentModal";
import { ErrorPage } from "@/components/partner/dashboard/overview/ErrorPage";

const ITEMS_PER_PAGE = 6;

function EmployeeManagement({
    serverData: { accessToken, user },
}: AdminPanelComponentProps) {
    // Permission checks
    const hasAddEmployeePermission = user?.employee_profile?.role?.permissions?.some(
        (permission) => permission.codename === "add_employee"
    ) ?? false;

    const hasChangeEmployeePermission = user?.employee_profile?.role?.permissions?.some(
        (permission) => permission.codename === "change_employee"
    ) ?? false;

    const hasAddRolePermission = user?.employee_profile?.role?.permissions?.some(
        (permission) => permission.codename === "add_role"
    ) ?? false;

    const hasChangeRolePermission = user?.employee_profile?.role?.permissions?.some(
        (permission) => permission.codename === "change_role"
    ) ?? false;

    const hasAddDepartmentPermission = user?.employee_profile?.role?.permissions?.some(
        (permission) => permission.codename === "add_department"
    ) ?? false;

    const hasChangeDepartmentPermission = user?.employee_profile?.role?.permissions?.some(
        (permission) => permission.codename === "change_department"
    ) ?? false;

    const [activeTab, setActiveTab] = useState<'employees' | 'roles' | 'departments'>('employees');
    const [searchQuery, setSearchQuery] = useState('');

    // Hooks
    const {
        employees,
        employeesIsLoading,
        employeesIsError,
        createEmployee,
        updateEmployee,
        isCreatingEmployee,
        isUpdatingEmployee
    } = useEmployees(accessToken);

    const {
        roles,
        rolesIsLoading,
        rolesIsError,
        createRole,
        updateRole,
        isCreatingRole,
        isUpdatingRole
    } = useRoles(accessToken);

    const {
        departments,
        departmentsIsLoading,
        departmentsIsError,
        createDepartment,
        updateDepartment,
        isCreatingDepartment,
        isUpdatingDepartment
    } = useDepartments(accessToken);

    // Loading & Error States
    const isLoading = employeesIsLoading || rolesIsLoading || departmentsIsLoading;
    const isError = employeesIsError || rolesIsError || departmentsIsError;

    // Pagination State
    const [empPage, setEmpPage] = useState(1);
    const [rolePage, setRolePage] = useState(1);
    const [deptPage, setDeptPage] = useState(1);

    // Modal State
    const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
    const [roleModalOpen, setRoleModalOpen] = useState(false);
    const [deptModalOpen, setDeptModalOpen] = useState(false);

    // Selection State
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [selectedDept, setSelectedDept] = useState<Department | null>(null);

    // Filter Logic
    const filteredEmployees = employees?.filter(emp =>
        (emp.user.first_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (emp.user.last_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (emp.user.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (emp.department?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const filteredRoles = roles?.filter(role =>
        (role.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const filteredDepts = departments?.filter(dept =>
        (dept.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    // Pagination Helpers
    const paginate = (items: any[], page: number) => {
        return items.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
    };

    const paginatedEmployees = paginate(filteredEmployees, empPage);
    const paginatedRoles = paginate(filteredRoles, rolePage);
    const paginatedDepts = paginate(filteredDepts, deptPage);

    const totalEmpPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE);
    const totalRolePages = Math.ceil(filteredRoles.length / ITEMS_PER_PAGE);
    const totalDeptPages = Math.ceil(filteredDepts.length / ITEMS_PER_PAGE);

    // Actions
    const handleEmployeeSubmit = (data: any) => {
        // Construct payload with nested user object
        const payload = {
            user: {
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                username: data.email?.split('@')[0] || data.username // Fallback username generation if not provided
            },
            department_id: data.department_id,
            role_id: data.role_id,
            phone_number: data.phone_number,
            date_hired: data.date_hired,
            address: data.address
        };

        if (selectedEmployee) {
            updateEmployee({ payload: payload, id: selectedEmployee.id }, {
                onSuccess: () => setEmployeeModalOpen(false)
            });
        } else {
            createEmployee(payload, {
                onSuccess: () => setEmployeeModalOpen(false)
            });
        }
    };

    const handleRoleSubmit = (data: any) => {
        if (selectedRole) {
            updateRole({ payload: data, id: selectedRole.id }, {
                onSuccess: () => setRoleModalOpen(false)
            });
        } else {
            createRole(data, {
                onSuccess: () => setRoleModalOpen(false)
            });
        }
    };

    const handleDeptSubmit = (data: any) => {
        if (selectedDept) {
            updateDepartment({ payload: data, id: selectedDept.id }, {
                onSuccess: () => setDeptModalOpen(false)
            });
        } else {
            createDepartment(data, {
                onSuccess: () => setDeptModalOpen(false)
            });
        }
    };

    if (isLoading) return <LoadingScreen />;
    if (isError) return <ErrorPage type="500" />;

    return (
        <div className="space-y-6 md:space-y-8 animate-fade-in pb-20 md:pb-12 max-w-[1600px] mx-auto">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/40 pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Personnel & Access</h1>
                    <p className="text-muted-foreground text-sm font-medium">Govern internal staff, security roles, and organizational structure.</p>
                </div>
            </div>

            {/* Modern Unified Tabs - Matching Locations/Amenities style */}
            <div className="flex p-1 bg-muted/30 border border-border/40 rounded-xl w-full sm:w-fit overflow-x-auto">
                <button
                    onClick={() => { setActiveTab('employees'); setSearchQuery(''); }}
                    className={`cursor-pointer flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === 'employees'
                        ? 'bg-card text-lapis shadow-sm ring-1 ring-border/10'
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                        }`}
                >
                    <Users className="w-4 h-4" />
                    Staff Directory
                </button>
                <button
                    onClick={() => { setActiveTab('roles'); setSearchQuery(''); }}
                    className={`cursor-pointer flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === 'roles'
                        ? 'bg-card text-lapis shadow-sm ring-1 ring-border/10'
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                        }`}
                >
                    <Shield className="w-4 h-4" />
                    Security Roles
                </button>
                <button
                    onClick={() => { setActiveTab('departments'); setSearchQuery(''); }}
                    className={`cursor-pointer flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === 'departments'
                        ? 'bg-card text-lapis shadow-sm ring-1 ring-border/10'
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                        }`}
                >
                    <Building className="w-4 h-4" />
                    Operational Units
                </button>
            </div>

            <div className="animate-slide-up">
                {activeTab === 'employees' && (
                    <EmployeesTab
                        employees={paginatedEmployees}
                        totalPages={totalEmpPages}
                        currentPage={empPage}
                        onPageChange={setEmpPage}
                        onEdit={(emp) => { setSelectedEmployee(emp); setEmployeeModalOpen(true); }}
                        onCreate={() => { setSelectedEmployee(null); setEmployeeModalOpen(true); }}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        hasAddEmployeePermission={hasAddEmployeePermission}
                        hasChangeEmployeePermission={hasChangeEmployeePermission}
                    />
                )}

                {activeTab === 'roles' && (
                    <RolesTab
                        roles={paginatedRoles}
                        totalPages={totalRolePages}
                        currentPage={rolePage}
                        onPageChange={setRolePage}
                        onEdit={(role) => { setSelectedRole(role); setRoleModalOpen(true); }}
                        onCreate={() => { setSelectedRole(null); setRoleModalOpen(true); }}
                        hasAddRolePermission={hasAddRolePermission}
                        hasChangeRolePermission={hasChangeRolePermission}
                    />
                )}

                {activeTab === 'departments' && (
                    <DepartmentsTab
                        departments={paginatedDepts}
                        totalPages={totalDeptPages}
                        currentPage={deptPage}
                        onPageChange={setDeptPage}
                        onEdit={(dept) => { setSelectedDept(dept); setDeptModalOpen(true); }}
                        onCreate={() => { setSelectedDept(null); setDeptModalOpen(true); }}
                        hasAddDepartmentPermission={hasAddDepartmentPermission}
                        hasChangeDepartmentPermission={hasChangeDepartmentPermission}
                    />
                )}
            </div>

            {/* Modals */}
            <EmployeeModal
                isOpen={employeeModalOpen}
                onClose={() => setEmployeeModalOpen(false)}
                employee={selectedEmployee}
                departments={departments || []}
                roles={roles || []}
                onSubmit={handleEmployeeSubmit}
                isLoading={isCreatingEmployee || isUpdatingEmployee}
            />

            <RoleModal
                isOpen={roleModalOpen}
                onClose={() => setRoleModalOpen(false)}
                role={selectedRole}
                onSubmit={handleRoleSubmit}
                isLoading={isCreatingRole || isUpdatingRole}
            />

            <DepartmentModal
                isOpen={deptModalOpen}
                onClose={() => setDeptModalOpen(false)}
                department={selectedDept}
                onSubmit={handleDeptSubmit}
                isLoading={isCreatingDepartment || isUpdatingDepartment}
            />
        </div>
    );
}

export default EmployeeManagement;
