/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosPublic } from "@/hooks/useAxiosPublic";
import useAxiosSecure from "@/hooks/useAxiosSecure";

// Public API calls (no token required)
const getVideos = async (params: Record<string, any>) => {
  const { data } = await axiosPublic.get("/videos/", { params });
  return data;
};

// Secure API calls (token required)

export const useVideosQuery = (params: Record<string, any>) => {
  return useQuery({
    queryKey: ["videos", params],
    queryFn: () => getVideos(params),
  });
};

export const useVideoQuery = (id: string) => {
  const axiosSecure = useAxiosSecure();
  return useQuery({
    queryKey: ["video", id],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/video/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useGetNewestVideosQuery = () => {
  return useQuery({
    queryKey: ["videos", "newest"],
    queryFn: async () => {
      const { data } = await axiosPublic.get("/videos/?ordering=-created_at");
      return data;
    },
  });
};

export const useGetMostViewedVideosQuery = () => {
  return useQuery({
    queryKey: ["videos", "most-viewed"],
    queryFn: async () => {
      const { data } = await axiosPublic.get("/videos/?ordering=-views_count");
      return data;
    },
  });
};

export const useAddVideoMutation = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const { data: res } = await axiosSecure.post(
        "/videos/?ordering=-views_count",
        data,
      );
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });
};
