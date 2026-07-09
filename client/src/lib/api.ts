/**
 * Vama Illustrations — API Client
 * Typed wrapper around the Django REST Framework backend.
 * Base URL reads from Vite env var, falls back to localhost:8000 for dev.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// ── Types ────────────────────────────────────────────────────────────────────

export interface Gallery {
  id: number;
  title: string;
  tag: string;
  image_url: string;
  description: string;
  is_featured: boolean;
  recommendations: number[];
  created_at: string;
}

export interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  services_required: string;
  message: string;
}

export interface ContactEnquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  services_required: string;
  message: string;
  status: string;
  created_at: string;
}

export interface ApiError {
  [field: string]: string[];
}

// ── Core fetch helper ─────────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (response.status === 204) {
    return {} as T;
  }

  let data: any = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  }

  if (!response.ok) {
    throw (data as ApiError) || new Error(`API error: ${response.status}`);
  }

  return (data || {}) as T;
}

// ── Gallery endpoints ─────────────────────────────────────────────────────────

export const galleryApi = {
  /** Fetch all galleries, optionally filtered by tag or featured status */
  list: (params?: { tag?: string; featured?: boolean }) => {
    const qs = new URLSearchParams();
    if (params?.tag) qs.set('tag', params.tag);
    if (params?.featured) qs.set('featured', 'true');
    const query = qs.toString() ? `?${qs.toString()}` : '';
    return request<Gallery[]>(`/galleries/${query}`);
  },

  /** Fetch a single gallery by id */
  get: (id: number) => request<Gallery>(`/galleries/${id}/`),

  /** Create a new gallery */
  create: (data: Partial<Gallery>) =>
    request<Gallery>('/galleries/', { method: 'POST', body: JSON.stringify(data) }),

  /** Update an existing gallery */
  update: (id: number, data: Partial<Gallery>) =>
    request<Gallery>(`/galleries/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),

  /** Delete a gallery */
  remove: (id: number) =>
    request<void>(`/galleries/${id}/`, { method: 'DELETE' }),
};

// ── Contact endpoint ──────────────────────────────────────────────────────────

export const contactApi = {
  /** Submit a contact enquiry from the Contact page form */
  submit: (payload: ContactPayload) =>
    request<{ detail: string }>('/contact/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  /** List all enquiries (admin use) */
  list: () => request<ContactEnquiry[]>('/contact/'),

  /** Send email to an enquirer via SMTP (admin use) */
  sendEmail: (payload: { name: string; email: string; services_required?: string }) =>
    request<{ detail: string }>('/send-email/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  /** Get rendered WhatsApp template (admin use) */
  getWhatsAppTemplate: (payload: { name: string; services_required?: string }) =>
    request<{ template: string }>('/whatsapp-template/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

// ── Health check ──────────────────────────────────────────────────────────────

export const healthApi = {
  check: () => request<{ status: string; service: string }>('/health/'),
};

// ── Auth endpoint ─────────────────────────────────────────────────────────────

export const authApi = {
  login: (credentials: Record<string, string>) =>
    request<{ detail: string; username: string }>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  logout: () =>
    request<{ detail: string }>('/auth/logout/', {
      method: 'POST',
    }),
  check: () => request<{ is_authenticated: boolean; username?: string }>('/auth/check/'),
};
