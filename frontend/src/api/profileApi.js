const API_BASE_URL = 'http://localhost:3001/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Nao foi possivel concluir a operacao');
  }

  return data;
}

export function listProfiles() {
  return request('/profiles');
}

export function createProfile(profile) {
  return request('/profiles', {
    method: 'POST',
    body: JSON.stringify(profile),
  });
}

export function updateProfile(id, profile) {
  return request(`/profiles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(profile),
  });
}

export function deleteProfile(id) {
  return request(`/profiles/${id}`, {
    method: 'DELETE',
  });
}
