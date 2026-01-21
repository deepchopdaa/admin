// ** React Imports
import { Fragment } from 'react'

// ** Third Party Components
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { Check } from 'react-feather'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate } from 'react-router-dom'
// ** Custom Components
import Avatar from '@components/avatar'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, Button, Form, Label, Input, FormFeedback } from 'reactstrap'
import axios from 'axios'

const ValidationOnChange = (props) => {
    const navigate = useNavigate("/");
    const SignupSchema = yup.object().shape({
        name: yup.string().min(3).required(),
        description: yup.string().min(20).required(),
    })
    // ** Hooks
    const {
        reset,
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({ mode: 'onChange', resolver: yupResolver(SignupSchema) })

    const onSubmit = async (data) => {
        console.log(data)
        try {
            await axios.post("https://gamezone-r2eq.onrender.com/category/addcategory", data, {
                headers: {
                    "content-type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            });
            if (Object.values(data).every(field => field.length > 0)) {
                toast.success("category Added Successfully")
                {/* <div className='d-flex'>
                            <div className='me-1'>
                                <Avatar size='sm' color='success' icon={<Check size={12} />} />
                            </div>
                            <div className='d-flex flex-column'>
                                <h6>Form Submitted!</h6>
                                <ul className='list-unstyled mb-0'>
                                    <li>
                                        <strong>Name</strong>: {data.name}
                                    </li>
                                    <li>
                                        <strong>Description</strong>: {data.description}
                                    </li>
                                </ul>
                            </div>
                        </div> */}
                navigate("/category")
            }
        } catch (e) {
            toast.error(
                <div className='d-flex'>
                    <p>Category Not Added {e}</p>
                </div>
            )
        }
    }

    const handleReset = () => {
        reset({
            name: '',
            description: ''
        })
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle tag='h4'>Category</CardTitle>
            </CardHeader>
            <CardBody>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className='mb-1'>
                        <Label className='form-label' for='name'>
                            First Name
                        </Label>
                        <Controller
                            id='name'
                            name='name'
                            defaultValue=''
                            control={control}
                            render={({ field }) => <Input {...field} placeholder='Category Name' invalid={errors.name && true} />}
                        />
                        {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
                    </div>
                    <div className='mb-1'>
                        <Label className='form-label' for='description'>
                            Descriptions
                        </Label>
                        <Controller
                            id='lastName'
                            name='description'
                            defaultValue=''
                            control={control}
                            render={({ field }) => <Input {...field} placeholder='Category Description' invalid={errors.description && true} />}
                        />
                        {errors.description && <FormFeedback>{errors.description.message}</FormFeedback>}
                    </div>
                    <div className='d-flex'>
                        <Button className='me-1' color='primary' type='submit'>
                            Submit
                        </Button>
                        <Button outline color='secondary' type='reset' onClick={handleReset}>
                            Reset
                        </Button>
                    </div>
                </Form>
            </CardBody>
            {/*     <ToastContainer /> */}
        </Card>
    )
}

export default ValidationOnChange
