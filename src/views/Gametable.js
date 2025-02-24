// ** React Imports
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
// import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Formik, Field, Form, ErrorMessage } from "formik";
// ** Third Party Components
import ReactPaginate from 'react-paginate'
import { ChevronDown, Table } from 'react-feather'
import DataTable from 'react-data-table-component'
import CategoryForm from "./CategoryForm"
import { Edit, Trash2 } from "react-feather";
// ** Reactstrap Imports
// import { Button, Card, CardHeader, CardTitle } from 'reactstrap'
import { Card, CardHeader, CardTitle, CardBody, Button, Label, Input, FormFeedback } from 'reactstrap'
import axios from 'axios'

const CategoryTable = () => {
    const [show1, setShow1] = useState(false);
    const handleClose1 = () => setShow1(false);
    const handleShow1 = () => setShow1(true);
    const [show, setShow] = useState(false);
    const [updateid, setupdateid] = useState();
    const [name, setname] = useState();
    const [description, setdescription] = useState();
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [deleteid, setdeleteid] = useState(null)
    const navigate = useNavigate('/');
    // ** States
    const [currentPage, setCurrentPage] = useState(0)
    const [data, setdata] = useState();

    // ** Function to handle Pagination
    const handlePagination = page => {
        setCurrentPage(page.selected)
    }

    const handleEdit = (row) => {
        console.log("Edit clicked for:", row);
        setupdateid(row._id)
        setname(row.name)
        setdescription(row.description)
        handleShow1();
    };

    const updateRecord = async (value) => {
        try {
            console.log(value);
            console.log(updateid)
            await axios.put(`http://localhost:3100/game/updateGame/${updateid}`, value)
            console.log("Record updated sucessfully")
            handleClose(false);
        } catch (e) {
            console.log("Record not updated")
        }
    }

    const DeleteRecord = async () => {
        try {
            await axios.delete(`http://localhost:3100/game/deleteGame/${deleteid}`)
            console.log("Record deleted sucessfully")
            handleClose();
        } catch (e) {
            console.log("Record not deleted")
        }
    }

    const get = async () => {
        const responce = await axios.get("http://localhost:3100/game/getGame")
        setdata(responce.data)
        console.log(responce.data);
    }

    const addrecord = () => {
        navigate("/categoryform");
    }

    const handleDelete = (row) => {
        console.log("Delete clicked for:", row);
        setdeleteid(row._id);
        handleShow();
        get();
    };

    useEffect(() => {
        try {
            get();
        } catch (e) {
            console.log("data not fatched sucessfully")
        }
    }, [])

    const reOrderColumns = [
        {
            name: 'Title',
            reorder: true,
            sortable: true,
            minwidth: '100px',
            maxWidth: '150px',
            selector: row => row.title
        },
        {
            name: 'category',
            reorder: true,
            sortable: true,
            minwidth: '100px',   
            maxWidth: '150px',
            selector: row => row.category
        },
        {
            name: 'price',
            reorder: true,
            sortable: true,
            minwidth: '100px',   
            maxWidth: '150px',
            selector: row => row.price
        },
        {
            name: 'image',
            reorder: true,
            sortable: true,
            minwidth: '150px',   
            maxWidth: '250px',
            selector: row => row.image
        },
        {
            name: 'rating',
            reorder: true,
            sortable: true,
            minwidth: '100px',   
            maxWidth: '150px',
            selector: row => row.rating
        },
        {
            name: "Update",
            cell: (row) => (
                <div className='flex-row'>
                    <Button color="info" style={{ maxWidth: '100px' }} size="sm" onClick={() => handleEdit(row)}>
                        <Edit size={15} /> Edit
                    </Button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
        {
            name: "Delete",
            cell: (row) => (
                <div className='flex-row'>
                    <Button color="danger" style={{ maxWidth: '100px' }} size="sm" className="ms-2" onClick={() => handleDelete(row)}>
                        <Trash2 size={10} /> Delete
                    </Button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }
    ]

    /* Update form */

    const initialvalue = {
        name: name,
        description: description
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required('Required name'),
        description: Yup.string()
            .required('Required description'),
    });

    // ** Custom Pagination
    const CustomPagination = () => (
        <ReactPaginate
            nextLabel=''
            breakLabel='...'
            previousLabel=''
            pageRangeDisplayed={2}
            forcePage={currentPage}
            marginPagesDisplayed={2}
            activeClassName='active'
            pageClassName='page-item'
            breakClassName='page-item'
            nextLinkClassName='page-link'
            pageLinkClassName='page-link'
            breakLinkClassName='page-link'
            previousLinkClassName='page-link'
            nextClassName='page-item next-item'
            previousClassName='page-item prev-item'
            pageCount={Math.ceil(data.length / 7) || 1}
            onPageChange={page => handlePagination(page)}
            containerClassName='pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1'
        />
    )
    return (
        <>
            <Card className='overflow-hidden'>
                <CardHeader>
                    <CardTitle tag='h4'>Categories</CardTitle>
                </CardHeader>
                <div className='react-dataTable'>
                    <DataTable
                        pagination
                        data={data}
                        columns={reOrderColumns}
                        className='react-dataTable'
                        sortIcon={<ChevronDown size={10} />}
                        paginationComponent={CustomPagination}
                        paginationDefaultPage={currentPage + 1}
                        paginationRowsPerPageOptions={[10, 25, 50, 100]}
                    />
                </div>
                <div className='text-center p-5 pt-0' >
                    <Button color='success' onClick={addrecord}>Add New</Button>
                </div>
            </Card>

            <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are You sure to delete record ?</Modal.Body>
                <Modal.Footer>
                    <Button color="secondary" onClick={handleClose}>
                        No
                    </Button>
                    <Button color="primary" onClick={DeleteRecord}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* update model */}
            <Modal
                show={show1}
                onHide={handleClose1}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Update category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Formik initialValues={initialvalue} validationSchema={validationSchema} onSubmit={updateRecord}>
                        <Form>
                            <div className="mb-3">
                                <label className="mb-1">Category Name</label>
                                <Field
                                    type="text"
                                    name="name"
                                    className="form-control"
                                />
                                <ErrorMessage name="name" component="div" className="text-danger" />
                            </div>
                            <div className="mb-3">
                                <label className="mb-1">Description</label>
                                <Field
                                    type="text"
                                    name="description"
                                    className="form-control"
                                />
                                <ErrorMessage name="description" component="div" className="text-danger" />
                            </div>
                            <Button color='dark' type='submit' onClick={updateRecord}>Update</Button>
                        </Form>
                    </Formik>
                </Modal.Body>
            </Modal>
        </>
    )
}
export default CategoryTable

