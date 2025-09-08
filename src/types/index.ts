export type APIErrorResponse = {
  error?: {
    code?: number;
    message?: string;
    details?: string | null;
    validationErrors?: string | null;
  };
};

export type RequestStatus = "idle" | "loading" | "success" | "error";


export type RejectPayload = {
  status?: number;
  message?: string;
};


