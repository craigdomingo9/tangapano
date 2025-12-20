import React from "react";
import Modal from "../common-components/Modal";
// Actually global types don't need import.

interface EmployeeModalProps {
    isOpen: boolean;
    onClose: () => void;
    employee: Employee | null;
    departments: Department[];
    roles: Role[];
    onSubmit: (data: any) => void;
    isLoading?: boolean;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({
    isOpen,
    onClose,
    employee,
    departments,
    roles,
    onSubmit,
    isLoading
}) => {
    // Simple controlled state or using native form submission
    // For simplicity and to match the snippet style, I'll use native form with refs or direct onSubmit handling

    // However, React usually prefers state. Let's use form submission event to gather data
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const flatPayload = {
            first_name: formData.get('first_name'),
            last_name: formData.get('last_name'),
            email: formData.get('email'),
            department_id: formData.get('department_id'),
            role_id: formData.get('role_id'),
            phone_number: formData.get('phone_number'),
            date_hired: formData.get('date_hired'),
            address: formData.get('address')
        };

        onSubmit(flatPayload);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={employee ? 'Update Personnel Profile' : 'Register New Personnel'}
            containerClassName="max-w-2xl max-h-[85vh] overflow-y-auto"
            footer={
                <div className="grid grid-cols-2 gap-4 w-full sm:w-auto">
                    <button type="button" onClick={onClose} className="cursor-pointer px-6 py-3 md:py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-muted-foreground hover:font-bold hover:bg-muted/50 transition-all">Cancel</button>
                    <button
                        form="employee-form"
                        type="submit"
                        disabled={isLoading}
                        className="cursor-pointer px-6 py-3 md:py-2.5 bg-lapis hover:bg-lapis/90 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-xl shadow-lapis/20 active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        {isLoading ? 'Saving...' : 'Commit Changes'}
                    </button>
                </div>
            }
        >
            <form id="employee-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">First Name</label>
                        <input name="first_name" type="text" defaultValue={employee?.user.first_name} required className="w-full bg-muted/20 border border-border/60 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-lapis/40 transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Last Name</label>
                        <input name="last_name" type="text" defaultValue={employee?.user.last_name} required className="w-full bg-muted/20 border border-border/60 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-lapis/40 transition-all" />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Enterprise Email</label>
                    <input name="email" type="email" defaultValue={employee?.user.email} required className="w-full bg-muted/20 border border-border/60 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-lapis/40 transition-all" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Department Unit</label>
                        <select name="department_id" defaultValue={employee?.department?.id} className="w-full bg-muted/20 border border-border/60 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-lapis/40 transition-all h-12">
                            <option value="">Select Department</option>
                            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Access Role</label>
                        <select name="role_id" defaultValue={employee?.role?.id} className="w-full bg-muted/20 border border-border/60 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-lapis/40 transition-all h-12">
                            <option value="">Select Role</option>
                            {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Contact Phone</label>
                        <input name="phone_number" type="text" defaultValue={employee?.phone_number || ''} className="w-full bg-muted/20 border border-border/60 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-lapis/40 transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Hiring Timestamp</label>
                        <input name="date_hired" type="date" defaultValue={employee?.date_hired?.split('T')[0] || ''} className="w-full bg-muted/20 border border-border/60 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-lapis/40 transition-all" />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Address</label>
                    <input name="address" type="text" defaultValue={employee?.address || ''} className="w-full bg-muted/20 border border-border/60 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-lapis/40 transition-all" />
                </div>
            </form>
        </Modal>
    );
};

export default EmployeeModal;
