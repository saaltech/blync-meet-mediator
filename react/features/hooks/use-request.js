import axios from 'axios';
import React, { useState } from 'react';
import { setToken } from '../app-auth/functions'

export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async (tokenRequired = true) => {
    try {
      setErrors(null);
      const response = await axios[method](url, 
        method.toLowerCase() === 'post' ? 
        (typeof body === "function" ? body() : body) :
        setToken(tokenRequired)
        , 
        method.toLowerCase() === 'post' ? setToken(tokenRequired) : false);

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      console.log(err)
      setErrors(
        err.response.data.errors || "Unable to process"
      );
    }
  };

  return [ doRequest, errors ];
};
