import React from "react";
import { UserPlus, Search, Building, Calendar, Mail, Phone, MapPin, Edit, Shield } from "lucide-react";
import Pagination from "../common-components/Pagination";

interface EmployeesTabProps {
    employees: Employee[];
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    onEdit: (employee: Employee) => void;
    onCreate: () => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

const EmployeesTab: React.FC<EmployeesTabProps> = ({
    employees,
    totalPages,
    currentPage,
    onPageChange,
    onEdit,
    onCreate,
    searchQuery,
    setSearchQuery
}) => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card/40 backdrop-blur-xl border border-border/40 p-4 rounded-2xl shadow-sm">
                <div className="relative group w-full sm:w-96">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-lapis transition-colors" />
                    <input
                        type="text"
                        placeholder="Search staff by name, unit, or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 h-11 w-full bg-background/50 border border-border/60 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-lapis/40 transition-all font-bold placeholder:text-muted-foreground/60 shadow-inner"
                    />
                </div>
                <button
                    onClick={onCreate}
                    className="cursor-pointer flex items-center gap-2 px-6 h-11 bg-lapis text-lapis-foreground rounded-xl text-sm font-bold hover:bg-lapis/90 active:scale-[0.98] transition-all shadow-lg shadow-lapis/20 w-full sm:w-auto justify-center group"
                >
                    <UserPlus className="w-4 h-4 group-hover:rotate-12 transition-transform" /> Register Personnel
                </button>
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-4 px-1">
                {employees.map((emp) => (
                    <div key={emp.id} className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-[2rem] p-6 shadow-sm active:bg-muted/30 transition-all relative overflow-hidden group">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-lapis/20 to-lapis/5 text-lapis flex items-center justify-center font-bold text-xl border border-lapis/20 shadow-inner">
                                    {(emp.user.first_name || '?').charAt(0)}
                                </div>
                                <div>
                                    <div className="font-bold font-bold text-sm">{emp.user.first_name || 'Unknown'} {emp.user.last_name || ''}</div>
                                    <div className="text-xs text-lapis font-bold uppercase">{emp.role?.name || "No Role"}</div>
                                </div>
                            </div>
                            <button
                                onClick={() => onEdit(emp)}
                                className="cursor-pointer p-3 bg-background/50 border border-border/40 rounded-2xl text-muted-foreground hover:text-lapis active:scale-90 transition-all"
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="mt-6 space-y-3">
                            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-2xl border border-border/20">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest opacity-60">Department</span>
                                    <span className="text-sm font-bold font-bold flex items-center gap-1.5 mt-0.5">
                                        <Building className="w-3.5 h-3.5 text-lapis/70" /> {emp.department?.name || "Unassigned"}
                                    </span>
                                </div>
                                <div className="flex flex-col text-right">
                                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest opacity-60">Hired On</span>
                                    <span className="text-sm font-bold font-bold flex items-center justify-end gap-1.5 mt-0.5">
                                        <Calendar className="w-3.5 h-3.5 text-muted-foreground/70" /> {emp.date_hired || 'N/A'}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2 px-1">
                                <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground">
                                    <Mail className="w-3.5 h-3.5 opacity-60" /> {emp.user.email}
                                </div>
                                <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground">
                                    <Phone className="w-3.5 h-3.5 opacity-60" /> {emp.phone_number || 'N/A'}
                                </div>
                                <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground truncate">
                                    <MapPin className="w-3.5 h-3.5 opacity-60" /> {emp.address || 'N/A'}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block bg-card/30 backdrop-blur-2xl border border-border/40 rounded-[2rem] shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-[11px] text-muted-foreground uppercase bg-muted/20 border-b border-border/40 font-bold tracking-widest">
                            <tr>
                                <th className="px-8 py-5">Personnel</th>
                                <th className="px-8 py-5">Mission Assignment</th>
                                <th className="px-8 py-5">Contact Points</th>
                                <th className="px-8 py-5">Joined On</th>
                                <th className="px-8 py-5 text-right">Access</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {employees.map((emp) => (
                                <tr key={emp.id} className="cursor-default hover:bg-lapis/[0.02] transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-lapis/5 text-lapis flex items-center justify-center font-bold text-xl border border-lapis/10 shadow-inner group-hover:scale-110 group-hover:bg-lapis group-hover:text-lapis-foreground transition-all duration-500">
                                                {(emp.user.first_name || '?').charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold font-bold text-sm tracking-tight">{emp.user.first_name || 'Unknown'} {emp.user.last_name || ''}</div>
                                                <div className="text-xs text-muted-foreground font-bold opacity-70 group-hover:opacity-100 transition-opacity">{emp.user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="space-y-1.5">
                                            <span className="text-xs font-bold text-muted-foreground flex items-center gap-2 px-2.5 py-1 bg-muted/40 rounded-lg w-fit border border-border/20">
                                                <Building className="w-3.5 h-3.5 text-lapis" /> {emp.department?.name || "Unassigned"}
                                            </span>
                                            <span className="text-[10px] font-bold text-lapis uppercase tracking-widest flex items-center gap-2 pl-2">
                                                <Shield className="w-3 h-3 opacity-60" /> {emp.role?.name || "No Role"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="text-xs font-bold text-muted-foreground space-y-1">
                                            <span className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 opacity-40" /> {emp.phone_number || 'N/A'}</span>
                                            <span className="flex items-center gap-2 truncate max-w-[180px]"><MapPin className="w-3.5 h-3.5 opacity-40" /> {emp.address || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-muted-foreground font-bold text-xs uppercase tracking-tighter tabular-nums whitespace-nowrap">
                                        {emp.date_hired || 'N/A'}
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button
                                            onClick={() => onEdit(emp)}
                                            className="cursor-pointer p-3 bg-muted/20 hover:bg-lapis/10 text-muted-foreground hover:text-lapis rounded-xl transition-all active:scale-90"
                                        >
                                            <Edit className="w-4.5 h-4.5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                totalItems={0}
                itemsPerPage={8}
            />
        </div>
    );
};

export default EmployeesTab;
