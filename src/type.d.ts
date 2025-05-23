export type Product= {
sku: string,
    supplier: Supplier,
    reviews: {
    average: number;
    count: number;
    }
    variants: Variant[];

}

type Supplier = {
    id: string;
    name: string;
    rating: number;
}

type Variant = {
    "color": string,
        "price": number,
        "stock": number,
    discount: Discount
}

type Discount = {
    type: string;
    value: number;
}