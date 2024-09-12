import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik"
import * as yup from "yup"
import datetime from 'react-datetime'

function NewNote() {
    const navigate = useNavigate()
    const location = useLocation()
    const [errors, setErrors] = useState([])
    const calendarID = location.state.calendarID
    const date = location.state.date
    const formatDate = datetime.date(date[0], date[1], date[2])

    const formSchema = yup.object().shape({
        date: yup.date().required(),
        title: yup.string().required("Note must have a title"),
        content: yup.string().required("Note must have content"),
      });

    const formik = useFormik({
        initialValues: { 
            date: formatDate,
            title: "",
            content: "",
            calendar_id: calendarID },
        validationSchema: formSchema,
        onSubmit: (values) => {
            fetch(`/calendar_notes/${calendarID}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values, null, 1),
            }).then(
            (response) => {
                if (response.ok) { navigate(`/calendar/${calendarID}`) }
                else { response.json().then((err) => setErrors(err.errors)) }
            }
            )
        },
    })

    return (
        <>
            <h2>New note:</h2>
            <form onSubmit={ formik.handleSubmit }>
                <div>
                    <div>Enter note date:</div>
                    <input
                    type="text"
                    id="date"
                    autoComplete="off"
                    value={ formik.values.date }
                    onChange={ formik.handleChange }
                    />
                </div>
                <div>
                    <div>Enter note title:</div>
                    <input
                    type="text"
                    id="title"
                    autoComplete="off"
                    value={ formik.values.title }
                    onChange={ formik.handleChange }
                    />
                </div>
                <div>
                    <div>Enter note content:</div>
                    <input
                    type="text"
                    id="content"
                    autoComplete="off"
                    value={ formik.values.content }
                    onChange={ formik.handleChange }
                    />
                </div>
            <div>
                <button type="submit">Create note</button>
            </div>
            </form>
        </>
    )
}

export default NewNote