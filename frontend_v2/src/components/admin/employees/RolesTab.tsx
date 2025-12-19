import React from "react";
import { Plus, Shield } from "lucide-react";
import Pagination from "../common-components/Pagination";

interface RolesTabProps {
    roles: Role[];
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    onEdit: (role: Role) => void;
    onCreate: () => void;
}

const RolesTab: React.FC<RolesTabProps> = ({
    roles,
    totalPages,
    currentPage,
    onPageChange,
    onEdit,
    onCreate
}) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                <button
                    onClick={onCreate}
                    className="w-full h-14 bg-lapis text-white rounded-2xl font-black text-sm shadow-xl shadow-lapis/20 hover:bg-lapis/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> Create Security Role
                </button>

                <div className="bg-card/30 backdrop-blur-xl border border-border/40 rounded-[2rem] overflow-hidden divide-y divide-border/30 shadow-xl">
                    <div className="p-5 bg-muted/20 border-b border-border/40">
                        <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-70">Role Directory</h3>
                    </div>
                    {roles.map((role) => (
                        <button
                            key={role.id}
                            onClick={() => onEdit(role)}
                            className="w-full p-6 flex flex-col items-start hover:bg-lapis/[0.03] active:bg-lapis/[0.08] transition-all group text-left"
                        >
                            <div className="flex items-center justify-between w-full mb-2">
                                <span className="font-black text-foreground group-hover:text-lapis transition-colors text-lg tracking-tight">{role.name}</span>
                                <Shield className="w-5 h-5 text-lapis opacity-20 group-hover:opacity-100 transition-all" />
                            </div>
                            <p className="text-xs text-muted-foreground font-medium leading-relaxed opacity-80">{role.description}</p>
                            <div className="mt-5 flex items-center gap-2">
                                <span className="text-[9px] font-black px-3 py-1 bg-lapis/10 rounded-full border border-lapis/20 text-lapis uppercase tracking-widest">
                                    {role.permissions.length} Active Policies
                                </span>
                            </div>
                        </button>
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
                <div className="bg-card/20 backdrop-blur-3xl border-2 border-dashed border-border/40 rounded-[3rem] p-12 h-full flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 rounded-full bg-lapis/5 border border-lapis/10 flex items-center justify-center mb-6">
                        <Shield className="w-12 h-12 text-lapis opacity-20 animate-pulse" />
                    </div>
                    <h3 className="text-2xl font-black text-foreground tracking-tight opacity-40">Role Matrix Engine</h3>
                    <p className="text-sm max-w-sm mt-3 font-bold text-muted-foreground opacity-30 leading-relaxed">Select a security role from the sidebar to inspect or modify access parameters across the platform infrastructure.</p>
                </div>
            </div>
        </div>
    );
};

export default RolesTab;
