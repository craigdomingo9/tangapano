import createEntityStore from "./entityStore";

export interface PartnerSignupDataStore {
  first_name: string;
  last_name: string;
  // email: string;
  username: string;
  password: string;
  confirm_password: string;
  company_name: string;
  phone_number: string;
  address: string;
}

const testData = {
  first_name: "Craig",
  last_name: "Domingo",
  // email: "craigdomingo9@gmail.com",
  username: "craigktb",
  password: "password",
  confirm_password: "password",
  company_name: "Domingo Properties",
  phone_number: "+263776808964",
  address: "1546 Adelaide Park",
};

const empty = {
  first_name: "",
  last_name: "",
  // email: "craigdomingo9@gmail.com",
  username: "",
  password: "",
  confirm_password: "",
  company_name: "",
  phone_number: "",
  address: "",
};

const usePartnerSignupDataStore =
  createEntityStore<PartnerSignupDataStore>(empty);

export const usePartnerSignupData = usePartnerSignupDataStore;
