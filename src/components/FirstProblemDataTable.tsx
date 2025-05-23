import React, {useRef, useState} from 'react';
import {DataTable, DataTableExpandedRows, DataTableValueArray} from 'primereact/datatable';
import {Column} from 'primereact/column';
import useFetch from "../hook/UseFetch";
import {Rating} from "primereact/rating";
import {Product, Variant} from "../type";
import {Tag} from "primereact/tag";
import {Toast} from "primereact/toast";
import {Button} from "primereact/button";
import callToast from "../utilis/helper";

interface Response {
    inventory: {
        low_stock_threshold: number;
        products: [];
        total_products: number;
    }
}

export default function FirstProblemDataTable() {
    const {data}: { data: Response | null } = useFetch('/inventoryData/inventory_products.json');

    const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined);
    const toast = useRef<Toast>(null);

    const supplierFieldTemplate = (rowData: Product) => {
        return <div>
            <div className={'flex align-content-center gap-2'}>
                <h5 className={'m-0'}>{rowData?.supplier?.name}</h5>

                <span className={'font-semibold text-primary'}>({rowData.supplier?.rating})</span>
            </div>
        </div>
    }

    const reviewFieldTemplate = (rowData: Product) => {
        return <div>
            <div className={'flex align-content-center gap-3 mb-1'}>
                <Rating value={rowData.reviews?.average} stars={5} readOnly cancel={false}/>
                <span className={'text-gray-600'}>({rowData.reviews?.average}/5)</span>
            </div>
            <span className={'text-gray-500'}>{rowData?.reviews?.count} review</span>
        </div>
    }

    const stockStatusTemplate = (rowData: Product) => {


        const totalStock = rowData.variants.reduce((total, varient) => {
            return total + varient?.stock;
        }, 0)
        const status = totalStock < data?.inventory?.low_stock_threshold!;

        return <div><Tag
            severity={status ? "danger" : "success"}>{status ? "Low Stock" : "Normal"} </Tag></div>;
    }

    const restockTemplate = (rowData: Product) => {


        const totalStock = rowData.variants.reduce((total, varient) => {
            return total + varient?.stock;
        }, 0)
        const status = totalStock < data?.inventory?.low_stock_threshold!;

        const handleRestockClick = ()=> {
            callToast(toast, true, "Restock");
        }

        const restockButton = <Button onClick={handleRestockClick} icon="pi pi-download" rounded text raised severity="secondary"
                                      badgeClassName={'p-0'}></Button>

        return status ? restockButton: "";
    }

    const variantColorTemplate = (rowData: Variant) => {

        const color = rowData?.color.toLowerCase() === "white" ? '' : rowData?.color.toLowerCase();
        return <Tag severity={'info'} rounded style={{background: `${color}`}}>{color}</Tag>
    }

    const discountTemplate = (rowData: Variant) => {
        const price = Math.ceil(rowData?.price);
        const discountedPrice = price - ((price / 100) * rowData?.discount?.value)

        return rowData?.discount ? `${discountedPrice} TK` : "No discount";
    }

    const priceTemplate = (rowData: Variant) => {
        return Math.ceil(rowData?.price) + " TK";
    }

    const totalVariantTemplate = (rowData: Product) => {
        return rowData?.variants.length;
    }


    const rowExpansionTemplate = (data: Product) => {
        console.log(data);
        return (
            <div className="pl-8">
                <DataTable value={data?.variants} dataKey={data?.sku}>
                    <Column field="color" header="Color" body={variantColorTemplate} sortable
                            style={{minWidth: '12rem'}}></Column>
                    <Column field="price" header="Price" body={priceTemplate} sortable
                            style={{minWidth: '12rem'}}></Column>
                    <Column body={discountTemplate} header="Discounted Price" sortable
                            style={{minWidth: '12rem'}}></Column>
                    <Column field="stock" header="Stock" sortable style={{minWidth: '12rem'}}></Column>
                </DataTable>
            </div>
        );
    };


    return (
        <div className="card">
            <Toast ref={toast}></Toast>
            <DataTable value={data?.inventory?.products} dataKey="sku" filterDisplay="row"
                       emptyMessage="No data found."
                       expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
                       rowExpansionTemplate={rowExpansionTemplate}
                       rows={10}
            >
                <Column expander={true} style={{width: '1rem'}}/>
                <Column field="name" header="Product Name" style={{minWidth: '12rem'}}/>
                <Column field="category" header="Category" style={{minWidth: '12rem'}}/>
                <Column field="supplier.name" header="Supplier" body={supplierFieldTemplate}
                        style={{minWidth: '12rem'}}/>
                <Column field="supplier.variants" header="Total  Veriants" body={totalVariantTemplate}
                        style={{minWidth: '12rem'}}/>

                <Column field="status" header="Stock Status" body={stockStatusTemplate} style={{minWidth: '12rem'}}/>
                <Column field="status" header="Restock" body={restockTemplate} style={{minWidth: '12rem'}}/>
                <Column field="reviews.average" header="Review" body={reviewFieldTemplate} style={{minWidth: '12rem'}}/>

            </DataTable>
        </div>
    );
}

