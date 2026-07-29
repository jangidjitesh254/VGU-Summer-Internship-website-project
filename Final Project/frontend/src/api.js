const API_BASE_URL = 'http://localhost:5000';

export async function getProducts() {
  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
}

export async function getProductById(id) {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch product details');
  }
  return response.json();
}

export async function createProduct(productData) {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create product');
  }
  return response.json();
}

export async function updateProduct(id, productData, userEmail) {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (userEmail) {
    headers['x-user-email'] = userEmail;
  }

  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(productData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update product');
  }
  return data;
}

export async function deleteProductApi(id, userEmail) {
  const headers = {};
  if (userEmail) {
    headers['x-user-email'] = userEmail;
  }

  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete product');
  }
  return data;
}

// Authentication APIs
export async function loginUser(credentials) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }
  return data;
}

export async function registerUser(userData) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Registration failed');
  }
  return data;
}

// Messaging APIs
export async function sendMessage(msgData) {
  const response = await fetch(`${API_BASE_URL}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(msgData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to send message');
  }
  return data;
}

export async function getUserMessages(email) {
  const response = await fetch(`${API_BASE_URL}/messages?email=${encodeURIComponent(email)}`);
  if (!response.ok) {
    throw new Error('Failed to fetch messages');
  }
  return response.json();
}

export async function getChatThread(productId, user1, user2) {
  const response = await fetch(
    `${API_BASE_URL}/messages/thread?productId=${productId}&user1=${encodeURIComponent(user1)}&user2=${encodeURIComponent(user2)}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch chat thread');
  }
  return response.json();
}

// Escrow Transactions APIs
export async function createEscrowCheckout(checkoutData) {
  const response = await fetch(`${API_BASE_URL}/transactions/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(checkoutData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Checkout failed');
  }
  return data;
}

export async function getUserTransactions(email) {
  const response = await fetch(`${API_BASE_URL}/transactions/user?email=${encodeURIComponent(email)}`);
  if (!response.ok) {
    throw new Error('Failed to fetch transactions');
  }
  return response.json();
}

export async function releaseEscrow(id) {
  const response = await fetch(`${API_BASE_URL}/transactions/${id}/release`, {
    method: 'PUT',
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to release escrow');
  }
  return data;
}
