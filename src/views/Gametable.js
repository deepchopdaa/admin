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

import { Edit, Trash2 } from "react-feather";
// ** Reactstrap Imports
// import { Button, Card, CardHeader, CardTitle } from 'reactstrap'
import { Card, CardHeader, CardTitle, CardBody, Button, Label, Input, FormFeedback } from 'reactstrap'
import axios from 'axios'


const GameTable = () => {
    const [show1, setShow1] = useState(false);
    const handleClose1 = () => setShow1(false);
    const handleShow1 = () => setShow1(true);
    const [show, setShow] = useState(false);
    const [categorydata, setcategorydata] = useState(null);
    const [updateid, setupdateid] = useState();
    const [title, settitle] = useState();
    const [category, setcategory] = useState();
    const [price, setprice] = useState();
    const [image, setimage] = useState(null);
    const [rating, setrating] = useState();
    const [description, setdescription] = useState();
    const [deleteitem, setdeleteitem] = useState();
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
    console.log(categorydata, "categorydatacategorydatacategorydatacategorydata")
    const handleEdit = (row) => {
        console.log("Edit clicked for:", row);
        setupdateid(row._id)
        settitle(row.title)
        setcategory(row.category)
        setprice(row.price)
        setimage(row.image)
        setrating(row.rating)
        setdescription(row.description)
        handleShow1();
    };

    const updateRecord = async (data, updateid) => {
        try {
            if (!updateid) {
                console.error("Update ID is missing");
                return;
            }
            console.log("Updating Record:", data);

            // Ensure FormData is populated correctly
            const formData = new FormData();
            formData.append("title", data?.title || "");
            formData.append("category", data?.category || "");
            formData.append("description", data?.description || "");
            formData.append("price", data?.price || "");
            formData.append("rating", data?.rating || "");

            // Append image only if it's a valid file
            if (data?.image instanceof File) {
                formData.append("image", data.image);
            } else if (data?.image && data?.image.file instanceof File) {
                formData.append("image", data.image.file);
            }
            console.log("Update ID:", updateid);
            console.log("FormData:", formData);

            // Send PUT request with multipart form-data
            const response = await axios.put(`http://localhost:3100/game/updateGame/${updateid}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.log("Record updated successfully", response.data);
            handleClose(false);
        } catch (error) {
            console.error("Record not updated:", error);
        }
    };


    const DeleteRecord = async () => {
        try {
            console.log(deleteid)
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
    const categoryget = async () => {
        const responsecategory = await axios.get("http://localhost:3100/category/getcategory")
        setcategorydata(responsecategory.data);
        console.log(categorydata)
        console.log(responsecategory.data)
    }

    const getCategoryName = (categoryId) => {
        if (!categorydata || categorydata.length === 0) return "Unknown Category"; // Handle null/empty data
        const category = categorydata.find(cat => cat._id === categoryId);
        return category ? category.name : "Unknown Category";
    };

    const addrecord = () => {
        navigate("/gameform");
    }

    const handleDelete = (row) => {
        console.log("Delete clicked for:", row);
        setdeleteid(row._id);
        setdeleteitem(row)
        console.log(deleteitem)
        handleShow();
        get();
    };

    useEffect(() => {
        try {
            get()
            categoryget();
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
            selector: row => getCategoryName(row.category)
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
            selector: row => <img
                src={`http://localhost:3100/${row.image}`} // Fetch from local uploads folder
                alt={row.title}
                style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "5px" }}
            />
        },
        {
            name: 'description',
            reorder: true,
            sortable: true,
            minwidth: '150px',
            maxWidth: '250px',
            selector: row => row.description
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
        title: title,
        category: category,
        description: description,
        price: price,
        image: image,
        rating: rating,
    }

    const validationSchema = Yup.object().shape({
        title: Yup.string()
            .required('Required title'),
        category: Yup.string()
            .required('Required category'),
        description: Yup.string()
            .required('Required description'),
        price: Yup.string()
            .required('Required price'),
        image: Yup.mixed()
            .required('Required image'),
        rating: Yup.string()
            .required('Required rating'),
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
            <Card className="overflow-hidden">
                <CardHeader>
                    <CardTitle tag="h4">Games</CardTitle>
                </CardHeader>
                <div className="react-dataTable">
                    <DataTable
                        pagination
                        data={data}
                        columns={reOrderColumns}
                        className="react-dataTable"
                        sortIcon={<ChevronDown size={10} />}
                        paginationComponentOptions={{ rowsPerPageText: "Rows per page:" }}
                        paginationDefaultPage={currentPage + 1}
                        paginationRowsPerPageOptions={[10, 25, 50, 100]}
                        responsive 
                        highlightOnHover
                    />
                </div>
                <div className="text-center p-5 pt-0">
                    <Button color="success" onClick={addrecord}>Add New</Button>
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
                    <Formik
                        initialValues={initialvalue}
                        validationSchema={validationSchema}
                        onSubmit={(values) => updateRecord(values, updateid)} 
                    >
                        {({ setFieldValue }) => (
                            <Form>
                                <div className="mb-3">
                                    <label className="mb-1">Title</label>
                                    <Field type="text" name="title" className="form-control" />
                                    <ErrorMessage name="title" component="div" className="text-danger" />
                                </div>

                                <div className="mb-3">
                                    <label className="mb-1">Category</label>
                                    <Field as="select" name="category" className="form-control">
                                        <option>Select Category</option>
                                        {categorydata?.map(items => (
                                            <option value={items._id} key={items._id}>{items.name}</option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="category" component="div" className="text-danger" />
                                </div>

                                <div className="mb-3">
                                    <label className="mb-1">Description</label>
                                    <Field as="textarea" name="description" className="form-control" />
                                    <ErrorMessage name="description" component="div" className="text-danger" />
                                </div>

                                <div className="mb-3">
                                    <label className="mb-1">Price</label>
                                    <Field type="text" name="price" className="form-control" />
                                    <ErrorMessage name="price" component="div" className="text-danger" />
                                </div>

                                <div className="mb-3">
                                    <label className="mb-1">Image</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        onChange={(event) => setFieldValue("image", event.currentTarget.files[0])} 
                                    />
                                    <ErrorMessage name="image" component="div" className="text-danger" />
                                </div>

                                <div className="mb-3">
                                    <label className="mb-1">Rating</label>
                                    <Field type="text" name="rating" className="form-control" />
                                    <ErrorMessage name="rating" component="div" className="text-danger" />
                                </div>

                                <Button color='dark' type='submit'>Update</Button> 
                            </Form>
                        )}
                    </Formik>

                </Modal.Body>
            </Modal>
        </>
    )
}
export default GameTable


