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

const GameForm = () => {
    const navigate = useNavigate();
    const [category, setCategory] = useState([]);

    // ** Validation Schema
    const SignupSchema = yup.object().shape({
        title: yup.string().min(3).required(),
        category: yup.string().required(),
        description: yup.string().min(4).required(),
        price: yup.number().required(),
        image: yup.mixed().required(),
        rating: yup.number().required()
    });

    useEffect(() => {
        const getCategory = async () => {
            try {
                const response = await axios.get("http://localhost:3100/category/getcategory");
                setCategory(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        getCategory();
    }, []);

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
            formData.append("category", data.category);
            formData.append("description", data.description);
            formData.append("price", data.price);
            formData.append("rating", data.rating);

            // Append the file correctly
            if (data.image && data.image.length > 0) {
                formData.append("image", data.image[0]); // Correct way to send file
            }

            // API Call
            const response = await axios.post("http://localhost:3100/game/addGame", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            console.log("Game added:", response.data);
            reset(); // Reset form after submission
        } catch (error) {
            console.error("Error submitting form:", error.response?.data?.message || error.message);
            alert(error.response?.data?.message || "Something went wrong!");
        }
    };

    const handleReset = () => {
        reset({
            title: '',
            category: '',
            image: '',
            rating: '',
            price: '',
            description: ''
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle tag='h4'>Game</CardTitle>
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

                    {/* Category */}
                    <div className='mb-1'>
                        <Label className='form-label' for='category'>Category</Label>
                        <Controller
                            name='category'
                            control={control}
                            render={({ field }) => (
                                <Input {...field} type='select' invalid={errors.category && true}>
                                    <option value="">Select Category</option>
                                    {category.map((item) => (
                                        <option key={item._id} value={item._id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </Input>
                            )}
                        />
                        {errors.category && <FormFeedback>{errors.category.message}</FormFeedback>}
                    </div>

                    {/* Description */}
                    <div className='mb-1'>
                        <Label className='form-label' for='description'>Description</Label>
                        <Controller
                            name='description'
                            control={control}
                            render={({ field }) => <Input {...field} type='textarea' placeholder='Description' invalid={errors.description && true} />}
                        />
                        {errors.description && <FormFeedback>{errors.description.message}</FormFeedback>}
                    </div>

                    {/* Price */}
                    <div className='mb-1'>
                        <Label className='form-label' for='price'>Price</Label>
                        <Controller
                            name='price'
                            control={control}
                            render={({ field }) => <Input {...field} placeholder='Price' type="number" invalid={errors.price && true} />}
                        />
                        {errors.price && <FormFeedback>{errors.price.message}</FormFeedback>}
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

                    {/* Rating */}
                    <div className='mb-1'>
                        <Label className='form-label' for='rating'>Rating</Label>
                        <Controller
                            name='rating'
                            control={control}
                            render={({ field }) => <Input {...field} type="number" placeholder='Rating' invalid={errors.rating && true} />}
                        />
                        {errors.rating && <FormFeedback>{errors.rating.message}</FormFeedback>}
                    </div>

                    {/* Buttons */}
                    <div className='d-flex'>
                        <Button className='me-1' color='primary' type='submit'>Submit</Button>
                        <Button outline color='secondary' type='reset' onClick={handleReset}>Reset</Button>
                    </div>
                </Form>
            </CardBody>
        </Card>
    );
};

export default GameForm;
