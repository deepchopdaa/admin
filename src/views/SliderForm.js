// ** React Imports
import { useEffect, useState } from 'react';

// ** Third-Party Components
import * as yup from 'yup';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, Button, Form, Label, Input, FormFeedback } from 'reactstrap';
import toast from 'react-hot-toast';

const GameForm = () => {
    // ** Validation Schema
    const SignupSchema = yup.object().shape({
        title: yup.string().required(),
        image: yup.mixed().required(),

    });
    // ** React Hook Form
    const {
        reset,
        control,
        setValue,
        handleSubmit,
        formState: { errors }
    } = useForm({ mode: 'onChange', resolver: yupResolver(SignupSchema) });

    const onSubmit = async (data) => {
        console.log(data)
        try {
            const formData = new FormData();
            formData.append("title", data.title);

            // Append the file correctly
            if (data.image && data.image.length > 0) {
                formData.append("image", data.image[0]); // Correct way to send file
            }
            // API Call
            const response = await axios.post("http://localhost:3100/slider/sendimage", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            });
            toast.success("Slide Added Sucessfully")
            console.log("Slide added:", response.data);
            reset(); // Reset form after submission
        } catch (error) {
            console.error("Error submitting form:", error.response?.data?.message || error.message);
            alert(error.response?.data?.message || "Something went wrong!");
        }
    };

    const handleReset = () => {
        reset({
            title: '',
            image: '',
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle tag='h4'>Slider</CardTitle>
            </CardHeader>
            <CardBody>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    {/* Title */}
                    <div className='mb-1'>
                        <Label className='form-label' for='title'>Title</Label>
                        <Controller
                            name='title'
                            control={control}
                            render={({ field }) => <Input {...field} placeholder='Title' invalid={errors.title && true} />}
                        />
                        {errors.title && <FormFeedback>{errors.title.message}</FormFeedback>}
                    </div>
                    {/* Image Upload */}
                    <div className='mb-1'>
                        <Label className='form-label' for='image'>Image</Label>
                        <Controller
                            name='image'
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setValue("image", e.target.files)}
                                    invalid={errors.image && true}
                                />
                            )}
                        />
                        {errors.image && <FormFeedback>{errors.image.message}</FormFeedback>}
                    </div>


                    {/* Buttons */}
                    <div className='d-flex'>
                        <Button className='me-1' color='primary' type='submit'>Submit</Button>
                        <Button outline color='secondary' type='reset' onClick={handleReset}>Reset</Button>
                    </div>
                </Form>
            </CardBody>
            {/*          <ToastContainer /> */}
        </Card>
    );
};

export default GameForm;
