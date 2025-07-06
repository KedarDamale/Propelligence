// Utility function to make authenticated API calls from admin frontend
export async function authenticatedFetch(url, options = {}) {
  try {
    // Get auth token from a secure source
    const authToken = await getAuthToken();
    
    if (!authToken) {
      throw new Error('Authentication token not available');
    }
    
    const headers = {
      ...options.headers,
      'x-admin-auth': authToken,
    };

    // Don't set Content-Type for FormData - let browser set it automatically
    // Only set Content-Type for JSON requests
    if (!(options.body instanceof FormData) && !options.headers?.['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    return fetch(url, {
      ...options,
      headers,
    });
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}

// Function to get auth token - this should be implemented securely
async function getAuthToken() {
  try {
    const response = await fetch('/api/auth/get-token');
    if (response.ok) {
      const data = await response.json();
      return data.token;
    } else {
      console.error('Failed to get auth token:', response.status);
      return null;
    }
  } catch (error) {
    console.error('Failed to get auth token:', error);
    return null;
  }
} 