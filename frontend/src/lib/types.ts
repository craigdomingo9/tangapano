


interface Campus {
  id: string;
  name: string;
  city: string;
  address: string;
  neighborhoods: Neighborhood[];
}

interface Neighborhood {
  id: string;
  name: string;
  city: string;
}

interface Amenity {
  id: string;
  name: string;
  display_name: string;
}


