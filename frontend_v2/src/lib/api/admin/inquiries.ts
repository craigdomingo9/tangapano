import { axiosInstance } from "../config";

export async function getInquiries(accessToken: string) {
  const { data } = await axiosInstance.get<Inquiry[]>("/interests/inquiries/", {
    headers: {
      Authorization: `Token ${accessToken}`,
    },
  });
  return data;
}

export async function updateInquiry(
  accessToken: string,
  inquiryId: string,
  payload: Interest
) {
  const { data } = await axiosInstance.put<Interest>(
    `/interests/inquiries/${inquiryId}/`,
    payload,
    {
      headers: {
        Authorization: `Token ${accessToken}`,
      },
    }
  );
  return data;
}

export async function generateInquiryReceipt(
  accessToken: string,
  inquiryId: string
) {
  const { data } = await axiosInstance.get(`/interests/receipt/${inquiryId}/`, {
    headers: {
      Authorization: `Token ${accessToken}`,
    },
    responseType: "blob",
  });
  return data;
}
