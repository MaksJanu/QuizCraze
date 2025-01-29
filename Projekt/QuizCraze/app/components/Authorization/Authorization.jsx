'use client'

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './Authorization.scss';


const RegistrationSchema = Yup.object().shape({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  nickname: Yup.string().required('Nickname is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});



export default function Authorization() {
  const [isRegistering, setIsRegistering] = useState(true);

  const formik = useFormik({
    initialValues: isRegistering ? {
      firstName: '',
      lastName: '',
      email: '',
      nickname: '',
      password: '',
    } : {
      email: '',
      password: '',
    },
    validationSchema: isRegistering ? RegistrationSchema : LoginSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <div className="auth-container">
      <div className="auth-toggle">
        <button onClick={() => setIsRegistering(true)}>Sign Up</button>
        <button onClick={() => setIsRegistering(false)}>Sign In</button>
      </div>
      <form onSubmit={formik.handleSubmit} className="auth-form">
        {isRegistering && (
          <>
            <div>
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.firstName}
              />
              {formik.touched.firstName && formik.errors.firstName ? (
                <div>{formik.errors.firstName}</div>
              ) : null}
            </div>
            <div>
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.lastName}
              />
              {formik.touched.lastName && formik.errors.lastName ? (
                <div>{formik.errors.lastName}</div>
              ) : null}
            </div>
            <div>
              <label htmlFor="nickname">Nickname</label>
              <input
                id="nickname"
                name="nickname"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.nickname}
              />
              {formik.touched.nickname && formik.errors.nickname ? (
                <div>{formik.errors.nickname}</div>
              ) : null}
            </div>
          </>
        )}
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email ? (
            <div>{formik.errors.email}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password ? (
            <div>{formik.errors.password}</div>
          ) : null}
        </div>
        <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
      </form>
    </div>
  );
};
