import React, {useRef, useState} from 'react';
import {DataTable, DataTableExpandedRows, DataTableValueArray} from 'primereact/datatable';
import {Column} from 'primereact/column';
import useFetch from "../hook/UseFetch";
import {Toast} from "primereact/toast";
import {Dashboard, Department, FactoryOrder, FactoryProduct, Material, Order, Resource, Resources} from "../type";
import {getTotalMaterial} from "../utilis/helper";
import {Tag} from "primereact/tag";

interface Response {
    factory: {
        products: FactoryProduct[];
        resources: Resources;
        orders: FactoryOrder[];
        dashboard: Dashboard
    }
}

export default function SixthProblemDataTable() {
    const {data}: { data: Response | null } = useFetch('/inventoryData/factory.json');
    const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined);
    const [expandedTeamRows, setExpandedTeamRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined);
    const toast = useRef<Toast>(null);

    // functions
    const getStatusSeverity = (status: number) => {
        if (status > 110) {
            return "success";
        } else if (90 < status && status < 110) {
            return "warning";
        } else {
            return "danger";
        }
    };

    const getResources = (id: string): Resource => {
        return data?.factory?.resources?.[id]!;
    }

    const getMaterialCost = (materials: Material[]) => {
        const materialCost = materials.reduce((total: number, material: Material) => {
            const {material_id, waste_factor, units_required} = material;
            const {unit_cost} = getResources(material_id);
            return ((units_required * (1 + waste_factor)) * unit_cost) + total;
        }, 0);
        return materialCost;
    }

    const getProductionCost = (product: FactoryProduct) => {
        const {materials, labor: {hours, cost_per_hour}} = product;
        const materialCost = getMaterialCost(materials);
        const productionCost = materialCost + (hours * cost_per_hour)
        return productionCost;
    }

    const getOrder = (id: string) => {
        const order = data?.factory?.orders.find((order: FactoryOrder) => (order?.product_id === id));
        return order;
    }

    // Template
    const materialShortfallTemplate = (rowData: FactoryProduct) => {
        const {product_id, materials} = rowData;
        const orders = data?.factory?.orders;
        const order = orders?.find((order: FactoryOrder) => order?.product_id === product_id);
        let meterialShortfall = materials.map((material: Material) => {
            const {material_id, waste_factor, units_required} = material;
            if (order) {
                const totalMaterialNeeded = order?.order_qty * units_required * (1 + waste_factor);
                const stock = data?.factory?.resources?.[material_id]?.stock!;
                const shortfall = totalMaterialNeeded - stock;
                return <p className={'text-red-400'}>{shortfall > 0 && `${material_id}:  ${shortfall.toFixed(2)}`}</p>
            } else {
                {

                    return '';
                }
            }
        })

        return meterialShortfall;
    }

    const productionCostTemplate = (rowData: FactoryProduct) => {
        // const {product_id, materials, labor: {hours, cost_per_hour}} = rowData;
        // const materialCost = getMaterialCost(materials);
        // const productionCost = materialCost + (hours * cost_per_hour)
        return "$ " + getProductionCost(rowData).toFixed(2);
    }

    const marginColumnTemplate = (rowData: FactoryProduct) => {
        const productionCost = getProductionCost(rowData);
        const sellingPrice = productionCost * 1.25;
        return (sellingPrice - productionCost).toFixed(2);
    }

    // const materialNeeded = (id: string) => {
    //     const order = getOrder(id);
    //     const {units_required, waste_factor} = rowData;
    //     if(order){
    //         return (order?.order_qty * (units_required * (1 + waste_factor))).toFixed(2);
    //     }
    //     return (units_required * (1 + waste_factor)).toFixed(2);
    // }

    // const getNeeded =  ()

    // Expandable table
    const wasteTemplate = (rowData: Material) => (rowData?.waste_factor * 100) + "%";

    const currentStockTemplate = (rowData: Material) => {
        console.log(rowData);
        const {material_id} = rowData;
        const {stock} = getResources(material_id)
        return stock
    };

    const unitCostTemplate = (rowData: Material) => {
        const {material_id} = rowData;
        const {unit_cost} = getResources(material_id);
        return unit_cost;
    }

    const materialNeedsTemplate = (rowData: Material, product_id: string) => {
        const order = getOrder(product_id);
        const {units_required, waste_factor} = rowData;
        if (order) {
            return (order?.order_qty * (units_required * (1 + waste_factor))).toFixed(2);
        }
        return (units_required * (1 + waste_factor)).toFixed(2);
    }

    const shortfallTemplate = (rowData: Material, product_id: string) => {
        const order = getOrder(product_id);
        const {units_required, waste_factor, material_id} = rowData;
        const {stock} = getResources(material_id);
        if (order) {
            const shortfall = ((order?.order_qty * (units_required * (1 + waste_factor))) - stock);
            return shortfall < 0 ? "Available" : shortfall.toFixed(2);
        }
        const short = ((units_required * (1 + waste_factor)) - stock);
        return short < 0 ? "Available" : short.toFixed(2);
    }

    const stockCoverageTemplate = (rowData: Material, product_id: string) => {
        const order = getOrder(product_id);
        const {units_required, waste_factor, material_id} = rowData;
        const {stock} = getResources(material_id);
        if (order) {
            const unitRequired = (order?.order_qty * (units_required * (1 + waste_factor)));
            const stockCoverage = (stock / (unitRequired / 100))
            return stockCoverage.toFixed(2) + "%";
        } else {
            {
                const unitRequired = ((units_required * (1 + waste_factor)));
                const stockCoverage = (stock / (unitRequired / 100))
                return stockCoverage.toFixed(2) + "%";
            }
        }
    }

    const statusTemplate = (rowData: Material, product_id: string) => {
        const order = getOrder(product_id);
        const {units_required, waste_factor, material_id} = rowData;
        const {stock} = getResources(material_id);
        if (order) {
            const unitRequired = (order?.order_qty * (units_required * (1 + waste_factor)));
            const stockCoverage = (stock / (unitRequired / 100))
            return <Tag severity={getStatusSeverity(stockCoverage)}
                        className="border-circle w-2rem h-2rem flex align-items-center justify-content-center"
                        title={'Status'}/>
        } else {
            {
                const unitRequired = ((units_required * (1 + waste_factor)));
                const stockCoverage = (stock / (unitRequired / 100))
                return <Tag severity={getStatusSeverity(stockCoverage)}
                            className="border-circle w-2rem h-2rem flex align-items-center justify-content-center"
                            title={'Status'}/>
            }
        }
    };

    const maxProductionTemplate = (rowData: Material) => {
        const {material_id, units_required, waste_factor} = rowData;
        const {stock} = getResources(material_id);

        return (stock/(units_required * (1 + waste_factor))).toFixed(2);
    }

    const rowExpansionTemplate = (data: FactoryProduct) => {
        const {product_id} = data;
        return (
            <div className="p-5">
                <DataTable value={data?.materials} dataKey={'material_id'} emptyMessage="No data found."
                           expandedRows={expandedTeamRows} onRowToggle={(e) => setExpandedTeamRows(e.data)}
                >
                    <Column field="material_id" header="Material Id "></Column>
                    {/*<Column field="budget" header="Order Qty" body={orderQuantityTemplate} ></Column>*/}
                    <Column field="units_required" header="Req.per Unit"></Column>
                    <Column field="budget" header="Unit Cost" body={unitCostTemplate}></Column>
                    <Column field="waste_factor" header="Waste" body={wasteTemplate}></Column>
                    <Column field="budget" header="Curent Stock(unit)" body={currentStockTemplate}></Column>
                    <Column field="budget" header="Material Need(unit)"
                            body={(e) => materialNeedsTemplate(e, product_id)}></Column>
                    <Column field="budget" header="Shortfall" body={(e) => shortfallTemplate(e, product_id)}></Column>
                    <Column field="budget" header="Stock Coverage"
                            body={(e) => stockCoverageTemplate(e, product_id)}></Column>
                    <Column field="budget" header="Status" body={(e) => statusTemplate(e, product_id)}></Column>
                    <Column field="budget" header="Reorder Alert"></Column>
                    <Column field="budget" header="Max Production(unit)" body={maxProductionTemplate}></Column>
                </DataTable>
            </div>
        );
    }


    return (
        <div className="card">

            <Toast ref={toast}></Toast>
            <DataTable value={data?.factory?.products} dataKey="product_id" filterDisplay="row"
                       emptyMessage="No data found."
                       expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
                       rowExpansionTemplate={rowExpansionTemplate}
                       rows={10}
                       paginator

            >
                <Column expander={true} style={{width: '1rem'}}/>
                <Column field="product_id" header="Product Id" style={{minWidth: '12rem'}}/>
                <Column field="product_id" header="Material Shortfall(unit)" body={materialShortfallTemplate}
                        style={{minWidth: '12rem'}}/>
                <Column field="product_id" header="Prod. Cost" body={productionCostTemplate}
                        style={{minWidth: '12rem'}}/>
                <Column field="product_id" header="Margin" body={marginColumnTemplate} style={{minWidth: '12rem'}}/>


            </DataTable>
        </div>
    );
}

