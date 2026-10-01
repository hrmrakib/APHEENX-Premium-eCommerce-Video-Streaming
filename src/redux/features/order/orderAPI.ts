/* eslint-disable @typescript-eslint/no-explicit-any */
import baseAPI from "@/redux/api/api";

export interface CreateOrderItem {
  product_id: number;
  quantity: number;
}

export interface CreateOrderPayload {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  items: CreateOrderItem[];
}

export interface OrderItemResponse {
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: string;
  subtotal: string;
}

export interface CreateOrderResponse {
  status?: string;
  code?: number;
  message?: string;
  data?: {
    order_id?: number;
    payment_url?: string;
    total_price?: string;
    items?: OrderItemResponse[];
    url?: string;
    checkout_url?: string;
    [key: string]: any;
  };
  url?: string;
  checkout_url?: string;
  [key: string]: any;
}

const orderAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    createOrder: build.mutation<CreateOrderResponse, CreateOrderPayload>({
      query: (data) => ({
        url: "/orders/create/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const { useCreateOrderMutation } = orderAPI;
export default orderAPI;
