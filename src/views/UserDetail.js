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
    const [user, setUser] = useState(true);
    const [currentPage, setCurrentPage] = useState(0)
    const [data, setdata] = useState();
    const [status, setstatus] = useState("active")

    const handlePagination = page => {
        setCurrentPage(page.selected)
    }

    const DeleteRecord = async () => {
        try {
            await axios.delete(`http://localhost:3100/user/deleteuser/${deleteid}`, {
                headers: {
                    "content-type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            })
            console.log("Record deleted sucessfully")
            handleClose();
        } catch (e) {
            console.log("Record not deleted")
        }
    }

    const get = async () => {
        const responce = await axios.get("http://localhost:3100/user/getuser", {
            headers: {
                "content-type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
        setdata(responce.data)
        console.log(responce.data);
    }

    const handlestatus = async (row) => {
        console.log(row)
        try {
            const response = await axios.put(`http://localhost:3100/user/updatestatus/${row._id}`, {}, {
                headers: {
                    "content-type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            });

            console.log(response.data);
            const updatedStatus = response.data.status;
            setdata(prevData =>
                prevData.map(user =>
                    user._id === row._id ? { ...user, status: updatedStatus } : user
                )
            );

        } catch (e) {
            console.log("Status Update Error");
        }
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
            name: 'email',
            reorder: true,
            sortable: true,
            minwidth: '150px',
            maxWidth: '250px',
            selector: row => row.email
        },
        {
            name: "Status",
            cell: (row) => (
                <div className='flex-row'>
                    <Button
                        color="warning"
                        style={{ maxWidth: '130px', textWrap: "nowrap" }}
                        size="sm"
                        className="ms-2"
                        onClick={() => handlestatus(row)}
                    >
                        {row.status}
                    </Button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }
    ]

    /* Update form */

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
                    <CardTitle tag='h4'>User Detail</CardTitle>
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
        </>
    )
}
export default CategoryTable

