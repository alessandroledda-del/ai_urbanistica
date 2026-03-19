const API_URL = import.meta.env.VITE_API_URL || "/api";

export interface ChatSource {
  page_content: string;
  metadata: Record<string, string>;
}

export interface ChatResponse {
  answer: string;
  sources: ChatSource[];
}

export const sendMessage = async (question: string, useInternet: boolean = false): Promise<ChatResponse> => {
  const response = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question, use_internet: useInternet }),
  });
  
  if (!response.ok) {
    throw new Error("Errore durante la comunicazione con il server");
  }
  
  return response.json();
};

export const uploadDocument = async (
  file: File,
  level: string,
  region?: string,
  province?: string,
  commune?: string
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("level", level);
  if (region) formData.append("region", region);
  if (province) formData.append("province", province);
  if (commune) formData.append("commune", commune);

  const response = await fetch(`${API_URL}/ingest`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Errore durante l'upload del documento");
  }

  return response.json();
};
