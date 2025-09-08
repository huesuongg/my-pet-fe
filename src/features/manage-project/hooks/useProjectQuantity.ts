import { useEffect, useState } from "react";
import axiosInstance from "../../../services/axiosInstance";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";

type StatusData = {
  status: 0 | 1;
  quantity: number;
};

export const useProjectQuantity = () => {
  const [statusData, setStatusData] = useState<StatusData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const projects = useSelector((state: RootState) => state.projects.projects);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/services/app/Project/GetQuantityProject");
        setStatusData(res.data.result);
      } catch (err) {
        setError("Failed to fetch quantity project"+ err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projects]);

  const getQuantity = (status: 0 | 1): number => {
    return statusData.find((item) => item.status === status)?.quantity ?? 0;
  };

  return { statusData, getQuantity, loading, error };
};
