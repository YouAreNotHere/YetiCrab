import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

interface IUseRequestProps {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  body?: any;
  params?: any;
  onSuccess?: (data: any) => void;
}

const useRequest = (props: IUseRequestProps) => {
  const { method, url, body, params, onSuccess } = props;

  // const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const makeRequest = async (innerBody: any = body) => {
    setIsLoading(true);
    let urlAdress;

    if (import.meta.env.MODE === 'production') {
      urlAdress = import.meta.env.VITE_REACT_APP_API_URL_PROD;
      console.log("prod")
    } else {
      urlAdress = import.meta.env.VITE_REACT_APP_API_URL_DEV;
      console.log("dev")
    }

    try {
      let response;
      if (method === 'POST') {
        response = await fetch(`${urlAdress}${url}`, {
          method,
          body: innerBody,
          credentials: 'include',
        });
      } else if (method === 'GET') {
        response = await fetch(`${urlAdress}${url}`, {
          method,
          ...params,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } else if (method === 'DELETE') {
        response = await fetch(`${urlAdress}${url}`, {
          method,
          headers: {'Content-Type': 'application/json'},
          credentials: 'include',
        });
      } else if (method === 'PUT') {
        response = await fetch(`${urlAdress}${url}`, {
          method,
          body: innerBody,
          credentials: 'include',
        });
      }


      if (response.ok) {
        const data = await response.json();
        setData(data);
        setErrorMessage(null);
        if (onSuccess) {
           onSuccess(data);
        }
      } else {
        const error = await response.json();
        console.log(error)

        if (response.status === 401) {
          // navigate('/auth');
        }
        setErrorMessage(error.message ?? 'Ошибка');
        setData(null);
      }
    } catch (e) {
      setErrorMessage(JSON.stringify(e));
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };
  return {
    data,
    isLoading,
    errorMessage,
    makeRequest,
  };
};

export { useRequest };
