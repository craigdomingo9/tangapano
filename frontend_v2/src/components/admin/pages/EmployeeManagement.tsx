import { AdminPanelComponentProps } from "@/lib/types/admin";
import React from "react";

function EmployeeManagement({
    serverData: { accessToken },
}: AdminPanelComponentProps) {
    return (
        <div className="space-y-6 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/40 pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Employee Roster
                    </h1>
                    <p className="text-muted-foreground text-sm font-medium">
                        Manage internal staff and roles.
                    </p>
                </div>
            </div>

            <div className="p-12 text-center border border-dashed border-border rounded-xl bg-muted/30">
                <h3 className="text-lg font-medium text-foreground">
                    Employee Management Module
                </h3>
                <p className="text-muted-foreground mt-2">
                    This module is under construction.
                </p>
            </div>
        </div>
    );
}

export default EmployeeManagement;
