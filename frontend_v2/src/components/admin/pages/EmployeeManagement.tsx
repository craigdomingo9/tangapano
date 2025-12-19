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
    serverData: { accessToken },
}: AdminPanelComponentProps) {
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
        if (selectedEmployee) {
            updateEmployee({ payload: data, id: selectedEmployee.id }, {
                onSuccess: () => setEmployeeModalOpen(false)
            });
        } else {
            createEmployee(data, {
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border/40 pb-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">Staff Control</h1>
                    <p className="text-muted-foreground mt-1 text-sm font-medium">Manage internal accounts, security policies, and organizational structure.</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="overflow-x-auto pb-2 -mx-2 px-2 no-scrollbar">
                <div className="flex p-1 bg-muted/20 backdrop-blur-md border border-border/40 rounded-2xl w-fit min-w-full md:min-w-0">
                    <button
                        onClick={() => { setActiveTab('employees'); setSearchQuery(''); }}
                        className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-500 flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === 'employees'
                            ? 'bg-card text-lapis shadow-xl ring-1 ring-border/10'
                            : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                            }`}
                    >
                        <Users className="w-4 h-4" /> Personnel
                    </button>
                    <button
                        onClick={() => { setActiveTab('roles'); setSearchQuery(''); }}
                        className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-500 flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === 'roles'
                            ? 'bg-card text-lapis shadow-xl ring-1 ring-border/10'
                            : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                            }`}
                    >
                        <Shield className="w-4 h-4" /> Role Matrix
                    </button>
                    <button
                        onClick={() => { setActiveTab('departments'); setSearchQuery(''); }}
                        className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-500 flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === 'departments'
                            ? 'bg-card text-lapis shadow-xl ring-1 ring-border/10'
                            : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                            }`}
                    >
                        <Building className="w-4 h-4" /> Departments
                    </button>
                </div>
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
