import React from "react";
import { Plus, Edit, Building } from "lucide-react";
import Pagination from "../common-components/Pagination";

interface DepartmentsTabProps {
    departments: Department[];
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    onEdit: (dept: Department) => void;
    onCreate: () => void;
}

const DepartmentsTab: React.FC<DepartmentsTabProps> = ({
    departments,
    totalPages,
    currentPage,
    onPageChange,
    onEdit,
    onCreate
}) => {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2">
                <div>
                    <h3 className="text-xl font-black text-foreground tracking-tight">Departmental Units</h3>
                    <p className="text-xs font-bold text-muted-foreground opacity-70">Governing organizational hierarchy</p>
                </div>
                <button
                    onClick={onCreate}
                    className="w-full md:w-auto flex items-center justify-center gap-2 h-12 px-8 bg-card/60 backdrop-blur-md border border-border/40 text-foreground hover:bg-muted/50 active:scale-95 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-sm"
                >
                    <Plus className="w-4 h-4" /> New Dept
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {departments.map((dept) => (
                    <div key={dept.id} className="bg-card/30 backdrop-blur-2xl border border-border/40 rounded-[2.5rem] p-7 shadow-xl hover:shadow-2xl hover:shadow-lapis/5 hover:-translate-y-1 transition-all group flex flex-col relative overflow-hidden">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-4 bg-lapis/10 rounded-[1.5rem] text-lapis border border-lapis/10 shadow-inner group-hover:bg-lapis group-hover:text-lapis-foreground transition-all duration-500">
                                <Building className="w-7 h-7" />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => onEdit(dept)}
                                    className="p-3 bg-background/50 border border-border/40 rounded-2xl text-muted-foreground hover:text-lapis transition-all active:scale-90"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <h4 className="font-black text-foreground text-xl mb-3 tracking-tight">{dept.name}</h4>
                        <p className="text-sm text-muted-foreground font-semibold leading-relaxed opacity-80 flex-1">{dept.description || 'No specific scope defined.'}</p>

                        <div className="mt-8 pt-6 border-t border-border/40 flex items-center justify-between">
                            <div className="flex -space-x-3">
                                {/* Placeholder for user avatars if we had them related to dept */}
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-9 h-9 rounded-2xl border-2 border-card bg-muted/60 backdrop-blur-sm flex items-center justify-center text-[10px] font-black text-lapis shadow-sm">
                                        U{i}
                                    </div>
                                ))}
                                <div className="w-9 h-9 rounded-2xl border-2 border-card bg-lapis text-lapis-foreground flex items-center justify-center text-[10px] font-black shadow-lg">
                                    +12
                                </div>
                            </div>
                            <span className="text-[10px] font-black text-lapis uppercase tracking-[0.2em] opacity-80">Operational</span>
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
    );
};

export default DepartmentsTab;
