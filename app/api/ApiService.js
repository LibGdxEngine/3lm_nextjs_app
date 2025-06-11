import axios from 'axios';

class ApiService {
  constructor(baseURL) {
    this.api = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // GET request
  async get(endpoint, params = {}) {
    try {
      const response = await this.api.get(endpoint, { params });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // POST request
  async post(endpoint, data = {}, config = {}) {
    try {
      const response = await this.api.post(endpoint, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // PUT request
  async put(endpoint, data = {}) {
    try {
      const response = await this.api.put(endpoint, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // DELETE request
  async delete(endpoint) {
    try {
      const response = await this.api.delete(endpoint);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Error handler
  handleError(error) {
    console.error("API Error:", error);
    throw error;
  }
}

export default ApiService;
