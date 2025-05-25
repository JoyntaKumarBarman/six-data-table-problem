import React, {useRef, useState} from 'react';
import {DataTable, DataTableExpandedRows, DataTableValueArray} from 'primereact/datatable';
import {Column} from 'primereact/column';
import useFetch from "../hook/UseFetch";
import {Toast} from "primereact/toast";
import {Department, Item, Order} from "../type";

interface Response {
    warehouse: {
        orders: Order[];
        inventory: {
            [key: string]: number;
        }
    }
}

export default function FifthProblemDataTable() {
    const {data}: { data: Response | null } = useFetch('/inventoryData/warehouse.json');

    const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined);
    const [expandedTeamRows, setExpandedTeamRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined);
    const toast = useRef<Toast>(null);

    const itemCountTemplate = (rowData: Order) => {
        const totalItem = rowData?.items.reduce((total: number, item: Item) => total + item?.quantity, 0)
        return totalItem;
    }
    const totalValueTemplate = (rowData: Order) => {
        const totalValue = rowData?.items.reduce((total: number, item: Item) => {
            const {unit_price, quantity} = item;
            total = total + (quantity * unit_price);
            return parseFloat(total.toFixed(2))
        }, 0)
        return `$ ${totalValue}`;
    }

    const subtotalValueTemplate = (rowData: Order) => {
        const subTotal = rowData?.items.reduce((total: number, item: Item) => {
            const {unit_price, quantity} = item;
            let discountUnitPercentage = 0;
            let fixedDiscount = 0;
            if (item?.discount) {
                if(item?.discount?.type === "percentage"){
                    discountUnitPercentage = item?.discount?.value;
                } else {
                    fixedDiscount = item?.discount?.value;
                }
            }
            let discountUnitPrice = 0;

            if(discountUnitPercentage){
               discountUnitPrice = unit_price - ((unit_price / 100) * discountUnitPercentage);
            } else {
                discountUnitPrice = unit_price - fixedDiscount;
            }
            total = total + (quantity * discountUnitPrice);
            if(total > 500){
                total = total - (total/100) * 5;
            }
            return parseFloat(total.toFixed(2))
        }, 0)
        return `$ ${subTotal}`;
    }

    const discountPercentageTemplate = (data: Item)=> {
        return data?.discount?.type === "percentage" ? `${data?.discount?.value}%` : `$${data?.discount?.value}`
    }

    const discountPriceTemplate = (data: Item)=> {
        const {unit_price, quantity, discount} = data;
        let discountedPrice = 0;
        if(discount){
            if(discount?.type === "percentage"){
                discountedPrice = unit_price - ((unit_price/100)* discount?.value);
            } else {
                discountedPrice = unit_price - discount?.value;
            }
        }
        return discountedPrice.toFixed(2);
    }

    const profitMarginValueTemplate = (rowData: Order) => {
        const {shipping: {cost, tax_rate, promo_code, discount_value}} = rowData;
        const subtotal = rowData?.items.reduce((total: number, item: Item) => {
            const {unit_price, quantity} = item;
            let discountUnitPercentage = 0;
            let fixedDiscount = 0;
            if (item?.discount) {
                if(item?.discount?.type === "percentage"){
                    discountUnitPercentage = item?.discount?.value;
                } else {
                    fixedDiscount = item?.discount?.value;
                }
            }
            let discountUnitPrice = 0;

            if(discountUnitPercentage){
                discountUnitPrice = unit_price - ((unit_price / 100) * discountUnitPercentage);
            } else {
                discountUnitPrice = unit_price - fixedDiscount;
            }
            total = total + (quantity * discountUnitPrice);
            if(total > 500){
                total = total - (total/100) * 5;
            }
            return parseFloat(total.toFixed(2))
        }, 0)
        const tax = ((subtotal + cost)/100)*tax_rate;
        let grandTotal = 0;
        if(promo_code){
            grandTotal = (subtotal + grandTotal + tax ) - discount_value;
        } else {
            grandTotal = (subtotal + grandTotal + tax );
        }
        const cogs = subtotal * .3;
        const profitMargin = ((grandTotal - cogs)/grandTotal) *100;
        return `${parseFloat(profitMargin.toFixed(2))}%`
    }


    const rowClassName = (rowData: Item) => {
        const {sku, quantity} = rowData;

        const inventory = data?.warehouse?.inventory?.[sku]|| 0;

        if (inventory < quantity) {
            return 'low-inventory-row';
        }

        return '';

    };

    const rowExpansionTemplate = (data: Order) => {

        return (
            <div className="p-5">
                <DataTable value={data?.items} dataKey={'team_id'} emptyMessage="No data found."
                           rowClassName={rowClassName}
                >
                    <Column field="sku" header="SKU" ></Column>
                    <Column field="name" header="Name" ></Column>
                    <Column field="unit_price" header="unit_price" ></Column>
                    <Column field="quantity" header="Order quantity" ></Column>
                    <Column field="quantity" header="Discount" body={discountPercentageTemplate} ></Column>
                    <Column field="quantity" header="Discounted Price" body={discountPriceTemplate} ></Column>
                </DataTable>
            </div>
        );
    }



    return (
        <div className="card">

            <Toast ref={toast}></Toast>
            <DataTable value={data?.warehouse?.orders} dataKey="order_id" filterDisplay="row"
                       emptyMessage="No data found."
                       globalFilterFields={["department", "status"]}
                       expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
                       rowExpansionTemplate={rowExpansionTemplate}

                       rows={10}
                       paginator


            >
                <Column expander={true} style={{width: '1rem'}}/>
                <Column field="order_id" header="Order Id" style={{minWidth: '12rem'}}/>
                <Column field="" header="Item Count" body={itemCountTemplate} style={{minWidth: '12rem'}}/>
                <Column field="instructor" header="Total Value" body={totalValueTemplate} style={{minWidth: '12rem'}}/>
                <Column field="instructor" header="Subtotal" body={subtotalValueTemplate} style={{minWidth: '12rem'}}/>
                <Column field="instructor" header="Profit Margin" body={profitMarginValueTemplate} style={{minWidth: '12rem'}}/>


            </DataTable>
            {/*<TestTable/>*/}
        </div>
    );
}

