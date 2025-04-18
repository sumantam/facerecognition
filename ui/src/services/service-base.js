import axios from "axios";

const API_BASE_KEY = "http://localhost:8000/api";
const token = "4870f96b-6590-43ef-bde5-ad20afdf3daa";
const headers = { "Content-Type": "application/json", api_key: token };
const headersForFile = { "Content-Type": "multipart/form-data", api_key: token };
const params = { "schemaName": "company5", "date": "2024-08-15" };


const api = axios.create({
  baseURL: API_BASE_KEY
});

// const getWithMainThread = async (uri, queryParams = params) => {
//   return await api.get(`/${uri}`, { headers: headers, params: queryParams });
// };


const getWithMainThread = async (uri, queryParams = params) => {
  try {
    // const response = await api.get(`/${uri}`, { headers: headers, params: queryParams });
    const response = await api.get(`/${uri}`, { headers: headers});
    return response;
  } catch (error) {
    console.error("Axios error in getWithMainThread:", error);
    return { error: error.message };
  }
};



const getWithWebWorkerThread = async (uri, queryParams = params) => {
  return new Promise((resolve, reject) => {
    const workerCode = `
      importScripts("https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js");

      self.onmessage = async function (event) {
        const { url, params } = event.data;
          try {
                // const response = await axios.get(url, params);
                const response = await axios.get(url, { params: params.params, headers: params.headers });

              // Send data back to the main thread
              self.postMessage({ data: { data: response.data } });
              // Send the result back to the main thread
          } catch (error) {
              // Send error back if the request fails
              self.postMessage({ error: error.message });
          }
    }`;
    // Create a Blob for the worker script
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const worker = new Worker(URL.createObjectURL(blob));

    // Listen for messages from the worker
    worker.onmessage = (event) => {
      const { data, error } = event.data;
      worker.terminate();  // Terminate worker after completion
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    };

    // Handle errors in the worker
    worker.onerror = (error) => {
      worker.terminate();  // Terminate worker in case of an error
      reject(error.message);
    };

    // Post data to the worker
    worker.postMessage(
      JSON.parse(
        JSON.stringify({
          url: `${API_BASE_KEY}/${uri}`,
          params: { headers: headers, params: queryParams },
        })
      )
    );
  });
};

const handleParallelApiCalls = async (urls, queryParams = params) => {
  try {
    const workerPromises = urls.map(url =>
      getWithWebWorkerThread(url, queryParams)
    )
    return await Promise.all(workerPromises);
  } catch (e) {
    console.log(e);
  }
}

const deleteItem = async (uri) => {
  return await api.delete(`/${uri}`, { headers: headers });
};

const update = async (uri, model) => {
  return await api.put(`/${uri}`, model, { headers: headers });
};
const post = async (uri, model) =>
  await api.post(`/${uri}`, model, { headers: headers });

const postForFileUpload = async (uri, model) =>
  await api.post(`/${uri}`, model, { headers: headersForFile });

const getJsonData = async () => {
  const data = await axios.get('http://localhost:8000/data.json');
  return data.data;
};

export { getWithMainThread, getWithWebWorkerThread, handleParallelApiCalls, deleteItem, update, post, postForFileUpload, getJsonData };
