declare global {
    interface Campus {
        id: string;
        name: string;
        city: City;
        address: string;
        neighborhoods: Neighborhood[];
        agent: Agent;
        latitude?: number | null;
        longitude?: number | null;
    }

    interface City {
        id: string;
        name: string;
        campuses: Campus[];
    }

    interface Neighborhood {
        id: string;
        name: string;
        city: City;
        has_listings: string;
    }
}

export { };
