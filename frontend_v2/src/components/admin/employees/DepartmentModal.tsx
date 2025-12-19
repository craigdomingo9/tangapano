import React from "react";
import Modal from "../common-components/Modal";

interface DepartmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    department: Department | null;
    onSubmit: (data: any) => void;
    isLoading?: boolean;
}

const DepartmentModal: React.FC<DepartmentModalProps> = ({
    isOpen,
    onClose,
    department,
    onSubmit,
    isLoading
}) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const payload = {
            name: formData.get('name'),
            description: formData.get('description'),
        };

        onSubmit(payload);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={department ? 'Refine Departmental Logic' : 'Establish New Department'}
            footer={
                <div className="grid grid-cols-2 gap-4 w-full sm:w-auto">
                    <button type="button" onClick={onClose} className="px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all">Cancel</button>
                    <button
                        form="dept-form"
                        type="submit"
                        disabled={isLoading}
                        className="px-8 py-3 bg-lapis hover:bg-lapis/90 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-lapis/20 active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        {isLoading ? 'Saving...' : 'Commit Unit'}
                    </button>
                </div>
            }
        >
            <form id="dept-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Department Identifier</label>
                    <input name="name" type="text" defaultValue={department?.name} required className="w-full bg-muted/20 border border-border/60 rounded-xl px-4 py-3 text-sm text-foreground font-black focus:outline-none focus:ring-2 focus:ring-lapis/40 transition-all" placeholder="Unit Label" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Operational Scope</label>
                    <textarea name="description" defaultValue={department?.description || ''} className="w-full h-40 bg-muted/20 border border-border/60 rounded-xl px-4 py-3 text-sm text-foreground font-bold focus:outline-none focus:ring-2 focus:ring-lapis/40 transition-all resize-none leading-relaxed" placeholder="Detailed unit responsibilities..." />
                </div>
            </form>
        </Modal>
    );
};

export default DepartmentModal;
