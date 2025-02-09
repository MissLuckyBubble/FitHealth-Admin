import { fetchUtils } from "react-admin";

const apiUrl = "http://localhost:8080";

const httpClient = async (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: "application/json" });
  }

  const token = localStorage.getItem("authToken");
  if (token) {
    options.headers.set("Authorization", `Bearer ${token}`);
  }

  try {
    const response = await fetchUtils.fetchJson(url, options);
    return response;
  } catch (error) {
    const status = error.status;
    let errorMessage = "Unexpected error occurred.";
    if (status === 400) {
      errorMessage = "Invalid data provided.";
    } else if (status === 404) {
      errorMessage = "Resource not found.";
    } else if (status === 500) {
      errorMessage = "Server error. Please try again later.";
    } else if (status === 401 || status === 403) {
      errorMessage = "You don't have permission to perform this action.";
    }

    if (error.body) {
      try {
        const body = await error.body.json();
        errorMessage = body.message || errorMessage;
      } catch {}
    }

    error.message = errorMessage;

    throw error;
  }
};

const dataProvider = {
  getList: async (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: JSON.stringify(params.filter),
    };
    const url = `${apiUrl}/${resource}?${fetchUtils.queryParameters(query)}`;

    const { headers, json } = await httpClient(url);
    return {
      data: json,
      total:
        parseInt(headers.get("content-range")?.split("/")?.pop(), 10) ||
        json.length,
    };
  },

  getOne: (resource, params) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => ({
      data: json,
    })),

  getMany: (resource, params) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    const url = `${apiUrl}/${resource}?${fetchUtils.queryParameters(query)}`;

    return httpClient(url).then(({ json }) => ({ data: json }));
  },

  getManyReference: (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: JSON.stringify({
        ...params.filter,
        [params.target]: params.id,
      }),
    };
    const url = `${apiUrl}/${resource}?${fetchUtils.queryParameters(query)}`;

    return httpClient(url).then(({ headers, json }) => ({
      data: json,
      total:
        parseInt(headers.get("content-range")?.split("/")?.pop(), 10) ||
        json.length,
    }));
  },

  update: (resource, params) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json })),

  updateMany: (resource, params) =>
    Promise.all(
      params.ids.map((id) =>
        httpClient(`${apiUrl}/${resource}/${id}`, {
          method: "PUT",
          body: JSON.stringify(params.data),
        })
      )
    ).then((responses) => ({ data: responses.map(({ json }) => json.id) })),

  create: (resource, params) =>
    httpClient(`${apiUrl}/${resource}`, {
      method: "POST",
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json })),

  delete: (resource, params) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: "DELETE",
    }).then(({ json }) => ({ data: json })),

  deleteMany: (resource, params) =>
    Promise.all(
      params.ids.map((id) =>
        httpClient(`${apiUrl}/${resource}/${id}`, {
          method: "DELETE",
        })
      )
    ).then((responses) => ({ data: responses.map(({ json }) => json.id) })),
};

export default dataProvider;
