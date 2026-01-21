import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';

import * as Yup from 'yup';
import { Formik, Field, Form, ErrorMessage } from "formik";

import ReactPaginate from 'react-paginate'
import { ChevronDown, Table } from 'react-feather'
import DataTable from 'react-data-table-component'
import CategoryForm from "./CategoryForm"
import { Edit, Trash2 } from "react-feather";

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

    const [currentPage, setCurrentPage] = useState(0)
    const [data, setdata] = useState();


    const handlePagination = page => {
        setCurrentPage(page.selected)
    }


    const DeleteRecord = async () => {
        try {
            await axios.delete(`https://gamezone-r2eq.onrender.com/contact/deletecontact/${deleteid}`, {
                headers: {
                    "content-type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            })
            console.log("Record deleted sucessfully")
            setdata(preData => preData.filter(contact => contact._id !== deleteid))
            handleClose();
        } catch (e) {
            console.log("Record not deleted")
        }
    }

    const get = async () => {
        const responce = await axios.get("https://gamezone-r2eq.onrender.com/contact/getcontact", {
            headers: {
                "content-type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
        setdata(responce.data)
        console.log(responce.data);
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
            name: 'Name',
            reorder: true,
            sortable: true,
            minwidth: '100px',
            maxWidth: '200px',
            selector: row => row.name
        },
        {
            name: 'number',
            reorder: true,
            sortable: true,
            minwidth: '150px',
            maxWidth: '300px',
            selector: row => row.number
        },
        {
            name: 'email',
            reorder: true,
            sortable: true,
            minwidth: '150px',
            maxWidth: '300px',
            selector: row => row.email
        },
        {
            name: 'description',
            reorder: true,
            sortable: true,
            minwidth: '150px',
            maxWidth: '300px',
            selector: row => row.description
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
                    <CardTitle tag='h4'>Contact User</CardTitle>
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

        </>
    )
}
export default CategoryTable

