// a custom fetch wrapper to make my job easy :>
const fetchit = async (url: string, options?: RequestInit) => {
  try {
    if (
      options &&
      options.body &&
      typeof options.body === 'object' &&
      !(options.body instanceof FormData) &&
      !(options.body instanceof Blob)
    ) {
      options.body = JSON.stringify(options.body);
      options = {
        ...options,
        headers: { 'Content-Type': 'application/json', ...options.headers },
      };
    }

    const response = await fetch(url, options);
    const contentType = response.headers.get('content-type');

    if (!response.ok) {
      let errorMessage = `Request failed with status ${response.status}`;

      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } else {
        errorMessage = (await response.text()) || errorMessage;
      }

      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return null;
    }
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    return await response.text();
  } catch (error) {
    console.error('Fetch error: ', error);
    throw error;
  }
};

export default fetchit;
