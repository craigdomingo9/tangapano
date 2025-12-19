declare global {
    interface Interest {
        room: any;
        contacted_agent?: string;
        full_name: string;
        student_id: string;
        phone_number: string;
        year_of_study: string;
        program: string;
        move_in_timeline: "immediately" | "2_weeks" | "1_month" | "next_semester";
        deposit_readiness: "ready_now" | "within_24h" | "need_time";
        payment_method: "cash" | "mobile" | "bank_transfer";
        agree_to_terms: boolean;
    }

    interface Inquiry {
        id: string;
        move_in_timeline: {
            key: "immediately" | "2_weeks" | "1_month" | "next_semester";
            value:
            | "Immediately (within 1 week)"
            | "Within 2 weeks"
            | "Within 1 month"
            | "Next Semester";
        };
        deposit_readiness: {
            key: "ready_now" | "within_24h" | "need_time";
            value:
            | "Yes, ready to pay deposit"
            | "Will arrange within 24 hours"
            | "Need more time to arrange funds";
        };
        payment_method: {
            key: "cash" | "mobile" | "bank_transfer";
            value: "Cash" | "Mobile Payment" | "Bank Transfer";
        };
        agree_to_terms: boolean;
        listing: Partial<Listing>;
        room: Partial<Room>;
        full_name: string;
        student_id: string;
        phone_number: string;
        year_of_study: string;
        program: string;
        timestamp: string;
        contacted_agent: Agent;
    }
}

export { };
