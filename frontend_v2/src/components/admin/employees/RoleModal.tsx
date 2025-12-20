import React, { useState, useEffect } from "react";
import Modal from "../common-components/Modal";
import { CheckSquare, Shield } from "lucide-react";
import { AVAILABLE_PERMISSIONS } from "@/lib/constants/permissions";

interface RoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    role: Role | null;
    onSubmit: (data: any) => void;
    isLoading?: boolean;
}

const RoleModal: React.FC<RoleModalProps> = ({
    isOpen,
    onClose,
    role,
    onSubmit,
    isLoading
}) => {
    // We use codenames (string) for selection since we don't have IDs in the provided constant
    const [selectedPermissionCodenames, setSelectedPermissionCodenames] = useState<string[]>([]);

    useEffect(() => {
        if (role) {
            setSelectedPermissionCodenames(role.permissions.map(p => p.codename));
        } else {
            setSelectedPermissionCodenames([]);
        }
    }, [role, isOpen]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const payload = {
            name: formData.get('name'),
            description: formData.get('description'),
            permission_codenames: selectedPermissionCodenames
        };

        onSubmit(payload);
    };

    const togglePermission = (codename: string) => {
        setSelectedPermissionCodenames(prev =>
            prev.includes(codename)
                ? prev.filter(c => c !== codename)
                : [...prev, codename]
        );
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={role ? 'Refine Security Policy' : 'Engine: New Security Role'}
            containerClassName="max-w-5xl"
            footer={
                <div className="grid grid-cols-2 gap-4 w-full sm:w-auto">
                    <button type="button" onClick={onClose} className="px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all">Abort</button>
                    <button
                        form="role-form"
                        type="submit"
                        disabled={isLoading}
                        className="px-8 py-3 bg-lapis hover:bg-lapis/90 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-lapis/20 active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        {isLoading ? 'Saving...' : 'Propagate Policy'}
                    </button>
                </div>
            }
        >
            <form id="role-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Policy Identifier</label>
                        <input name="name" type="text" defaultValue={role?.name} required className="w-full bg-muted/20 border border-border/60 rounded-xl px-4 py-3 text-sm text-foreground font-bold focus:outline-none focus:ring-2 focus:ring-lapis/40 transition-all" placeholder="Role Label" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Policy Scope</label>
                        <textarea name="description" defaultValue={role?.description || ''} className="w-full h-40 bg-muted/20 border border-border/60 rounded-xl px-4 py-3 text-sm text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-lapis/40 transition-all resize-none leading-relaxed" placeholder="Functional scope..." />
                    </div>
                </div>
                <div className="md:col-span-2 space-y-4">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Permission Matrix Engagement</label>
                    <div className="bg-muted/10 border border-border/40 rounded-[2rem] p-4 md:p-6 max-h-[400px] overflow-y-auto custom-scrollbar shadow-inner">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {AVAILABLE_PERMISSIONS.map((permission) => {
                                const isChecked = selectedPermissionCodenames.includes(permission.codename);
                                return (
                                    <PermissionItem
                                        key={permission.codename}
                                        permission={permission}
                                        isChecked={isChecked}
                                        onToggle={() => togglePermission(permission.codename)}
                                    />
                                );
                            })}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-lapis/5 border border-lapis/10 rounded-xl mt-2">
                        <Shield className="w-4 h-4 text-lapis animate-pulse" />
                        <p className="text-[10px] text-lapis/80 font-bold uppercase tracking-wider">Policies propagate across distributed infrastructure in real-time.</p>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default RoleModal;

const PermissionItem = ({ permission, isChecked, onToggle }: any) => (
    <label className={`flex items-center gap-4 p-4 border rounded-2xl cursor-pointer transition-all duration-300 active:scale-[0.98] ${isChecked ? 'bg-lapis/5 border-lapis/40 shadow-sm' : 'bg-background/40 border-border/40 hover:border-lapis/30'}`}>
        <input type="checkbox" className="hidden" checked={isChecked} onChange={onToggle} />
        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-500 ${isChecked ? 'bg-lapis border-lapis scale-110' : 'border-muted-foreground/30'}`}>
            {isChecked && <CheckSquare className="w-4 h-4 text-white" />}
        </div>
        <div className="flex flex-col min-w-0">
            <span className="text-sm font-black text-foreground truncate tracking-tight">{permission.name}</span>
            <span className="text-[9px] text-lapis font-black uppercase tracking-[0.15em] opacity-60 truncate">{permission.codename}</span>
        </div>
    </label>
);
