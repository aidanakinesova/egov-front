import React, { useState } from 'react';
import { Controller, useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import classes from './Register.module.scss';
import classNames from 'classnames';
import { Link, useNavigate } from 'react-router-dom';
// import { registration } from '../../../api';

export const Register = () => {

  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState(""); 

    const schema = yup.object().shape({
    iinbin: yup
      .string()
      .required("Это поле обязательное")
      .matches(/^[0-9]{12}$/, "BIN должен содержать ровно 12 цифр")
      .trim(),
    password: yup
      .string()
      .required("Это поле обязательное")
      .min(8, "Пароль должен содержать минимум 8 символов")
      .max(30, "Пароль не должен содержать больше 30 символов")
      .matches(/^[0-9a-zA-Zа-яА-Я_]*$/, "Пароль должен содержать только цифры, буквы и специальные символы"),
    name: yup
      .string()
      .required("Это поле обязательное")
      .min(1, "Имя должно содержать минимум 1 символов")
      .max(30, "Имя не должно содержать больше 30 символов")
      .matches(/^[a-zA-Zа-яА-ЯёЁ\s]*$/, "Не должно содержать специальных символов или цифр"),
    birthdate: yup
      .string()
      .required("Это поле обязательное"),
      // .matches(/^[0-9.]*$/, "Не должно содержать пробелов, специальных символов или цифр"),
    });
    
    
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({ resolver: yupResolver(schema) });
    const [isLoading, setIsLoading] = useState(false);
    
   const onSubmit = async (dataForm) => {
      console.log("Submitting");
      setIsLoading(true);
      console.log("dataForm in the front", dataForm);
    
      try {
        const response = await fetch('http://localhost:8000/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataForm),
        });
    
        if (!response.ok) {
          throw new Error('Register failed');
        }
    
        const {access_token} = await response.json();
        console.log("access_token from Back", access_token);
        // localStorage.setItem("access_token", access_token)
        setErrMsg("");
        navigate("/login");

        reset(); // Reset the form after a successful register
    
      } catch (error) {
        console.error('Error:', error.message);
        setErrMsg("Возникла ошибка. Попробуйте еще раз")
      } finally {
        setIsLoading(false);
      }
    };



//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
// //   const history = useHistory();
//   const navigate = useNavigate();

//   const loginpage = async () => {
//     try {
//       if (!email || !password) {
//         setError('Please fill in all fields');
//         return;
//       }

//       setError('');

//       // Validate email format
//       if (!validateEmail(email)) {
//         setError('Invalid email format');
//         throw new Error('Invalid email format');
//       }

//       const response = await fetch('http://127.0.0.1:8000/login', {
//         method: 'POST',
//         mode: 'cors',
//         headers: {
//           'Content-Type': 'application/json',
//           'Access-Control-Allow-Origin': '*',
//           'Access-Control-Allow-Methods': 'POST,PATCH,OPTIONS',
//         },
//         body: JSON.stringify({
//           email: email,
//           password: password,
//         }),
//       });

//       if (!response.ok) {
//         if (response.status === 401) {
//           setError('Invalid credentials');
//           throw new Error('Invalid credentials');
//         } else if (response.status === 404) {
//           setError('User not found');
//           throw new Error('User not found');
//         } else {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//       }

//       const data = await response.json();
//       console.log(data);
//       // Redirect to the dashboard page
//       // You can use React Router for navigation
//     } catch (error) {
//       console.error('Error logging in:', error);
//     }
//     // history.push('/dashboard');
//   };

//   const toRegister = () => {

//     // Redirect to the registration page
//     // You can use React Router for navigation
//     // return <Link to="/registration" />;
//     // history.push('/registration');
//     navigate('/Register');
//   };

//   const validateEmail = (email) => {
//     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return re.test(email);
//   };

  return (
    <section>
    <div className="container d-flex flex-column justify-content-center align-items-center py-5">
      <div className='text-center'>
        <h2 className='pb-4'>Порталға тіркелу</h2>
        <p className={classes.formTitle}>Құрметті пайдаланушылар!</p>
        <p className={classes.formSubtitle}>Сіздің бейініңіздің қауіпсіздігін арттыру және қорғау мақсатында Сізге авторизациялау көп факторлы авторизация (логин (ЖСН/БСН) және пароль енгізілгеннен кейін ЭЦҚ міндетті түрде қол қою) қолданылатынын хабарлаймыз.Осы тәсіл Қазақстан Республикасы Үкіметінің 2016 жылғы 20 желтоқсандағы №832 қаулысымен бекітілген ақпараттық-коммуникациялық технологиялар және ақпараттық қауіпсіздікті қамтамасыз ету саласындағы бірыңғай талаптарға сәйкес енгізіледі.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className={classes.formWrapper} autoComplete='off'>
        <div className={classNames(["d-flex flex-column p-3"])}>
            <label htmlFor="" className={classNames(["text-center", classes.formLabel])}>IIN/BIN *</label>
            <input
                type='text'  // Change type to 'text' since BIN is a string of digits
                placeholder='--------------'
                maxLength={12}
                minLength={12}
                {...register("iinbin")}  // Update to use the new field name "BIN"
                className={classNames(["w-100 px-3 text-center", classes.formInput])}
            />
            <p className={classes.formInputError}>{errors.iinbin?.message}</p>
        </div>
        <div className={classNames(["d-flex flex-column p-3"])}>
            <label htmlFor="" className={classNames(["text-center", classes.formLabel])}>Жасырын сөз *</label>
            <input type='password' maxLength={30} placeholder='********************' {...register("password")} className={classNames(["w-100 px-3 text-center", classes.formInput])}/>
            <p className={classes.formInputError}>{errors.password?.message}</p>
        </div>
        <div className={classNames(["d-flex flex-column p-3"])}>
            <label htmlFor="" className={classNames(["text-center", classes.formLabel])}>Аты-жөні *</label>
            <input type='text' placeholder='-------------' {...register("name")} className={classNames(["w-100 px-3 text-center", classes.formInput])}/>
            <p className={classes.formInputError}>{errors.name?.message}</p>
        </div>
        <div className={classNames(["d-flex flex-column p-3"])}>
            <label htmlFor="" className={classNames(["text-center", classes.formLabel])}>Туған күні *</label>
            {/* <input type='text' placeholder='-------------' {...register("birthdate")} className={classNames(["w-100 px-3 text-center", classes.formInput])}/> */}
            <Controller
              name="birthdate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  placeholderText={"-------------"}
                  // minDate={new Date()}
                  onKeyDown={(e) => {
                    e.preventDefault();
                  }}
                  // minTime={
                  //   !field.value || field.value.getDate() === new Date().getDate()
                  //     ? new Date(new Date().setHours(new Date().getHours() + 1, 29, 0, 0))
                  //     : new Date(new Date().setHours(9, 29, 0, 0))
                  // }
                  // maxTime={new Date(new Date().setHours(18, 29, 0, 0))}
                  showTimeSelect={false}
                  // timeFormat="HH:mm"
                  // timeCaption="time"
                  dateFormat="d MMMM, yyyy"
                  popperPlacement="top-end"
                  onChange={(e) => {
                    field.onChange(e);
                    // onChangeInputTime(e);
                  }}
                  selected={field.value}
                  className={classNames(["w-100 px-3 text-center", classes.formInput])}
                />
              )}
            />
            <p className={classes.formInputError}>{errors.birthdate?.message}</p>
        </div>
        <div>
            <button className={classNames(['w-100', classes.formButton])} type='submit' disabled={isLoading}>{isLoading ? "..." : "Жүйеге тіркелу" }</button>
        </div>
      </form>
        {errMsg !== "" && <p>{errMsg }</p> }
      <Link to="/login" className={classes.formLink}>Войти</Link>
    </div>
    </section>
  );
};

