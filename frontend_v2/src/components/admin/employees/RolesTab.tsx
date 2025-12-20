import React from "react";
import { Edit, Shield } from "lucide-react";
import { warningToast } from "@/lib/toast";
import Pagination from "../common-components/Pagination";

interface RolesTabProps {
    roles: Role[];
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    onEdit: (role: Role) => void;
    onCreate: () => void;
    hasAddRolePermission: boolean;
    hasChangeRolePermission: boolean;
}

const RolesTab: React.FC<RolesTabProps> = ({
    roles,
    totalPages,
    currentPage,
    onPageChange,
    onEdit,
    onCreate,
    hasAddRolePermission,
    hasChangeRolePermission
}) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                <button
                    onClick={() => {
                        if (!hasAddRolePermission) {
                            warningToast("You don't have permission to create security roles");
                            return;
                        }
                        onCreate();
                    }}
                    className={`w-full py-3 bg-lapis/10 text-lapis border border-lapis/20 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${hasAddRolePermission
                        ? "cursor-pointer hover:bg-lapis/20"
                        : "opacity-70 cursor-not-allowed"
                        }`}
                >
                    <Shield className="w-4 h-4" /> Create Security Role
                </button>

                <div className="bg-card/30 backdrop-blur-xl border border-border/40 rounded-4xl overflow-hidden divide-y divide-border/30 shadow-xl">
                    <div className="p-5 bg-muted/20 border-b border-border/40">
                        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-70">Role Directory</h3>
                    </div>
                    {roles.map((role) => (
                        <div
                            key={role.id}
                            className="w-full p-6 flex flex-col items-start transition-all text-left"
                        >
                            <div className="flex items-center justify-between w-full mb-2">
                                <span className="font-bold text-lg tracking-tight">{role.name}</span>
                                <button
                                    onClick={() => {
                                        if (!hasChangeRolePermission) {
                                            warningToast("You don't have permission to edit roles");
                                            return;
                                        }
                                        onEdit(role);
                                    }}
                                    className={`px-3 py-1.5 bg-lapis/5 text-lapis border border-lapis/20 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${hasChangeRolePermission
                                        ? "cursor-pointer hover:bg-lapis/10"
                                        : "opacity-70 cursor-not-allowed"
                                        }`}
                                >
                                    <Edit className="w-3 h-3" /> Edit
                                </button>
                            </div>
                            <p className="text-xs text-muted-foreground font-medium leading-relaxed opacity-80">{role.description}</p>
                            <div className="mt-5 flex items-center gap-2">
                                <span className="text-[9px] font-bold px-3 py-1 bg-lapis/10 rounded-full border border-lapis/20 text-lapis uppercase tracking-widest">
                                    {role.permissions.length} Active Policies
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                    totalItems={0}
                    itemsPerPage={6}
                />
            </div>

            <div className="hidden lg:block lg:col-span-2">
                <div className="bg-card/20 backdrop-blur-3xl border-2 border-dashed border-border/40 rounded-4xl p-12 h-full flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 rounded-full bg-lapis/5 border border-lapis/10 flex items-center justify-center mb-6">
                        <Shield className="w-12 h-12 text-lapis opacity-20 animate-pulse" />
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight opacity-40">Role Matrix Engine</h3>
                    <p className="text-sm max-w-sm mt-3 font-bold text-muted-foreground opacity-30 leading-relaxed">Select a security role from the sidebar to inspect or modify access parameters across the platform infrastructure.</p>
                </div>
            </div>
        </div>
    );
};

export default RolesTab;
