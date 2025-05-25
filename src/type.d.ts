export type Product= {
sku: string,
    supplier: Supplier,
    reviews: {
    average: number;
    count: number;
    }
    variants: Variant[];

}

export type Supplier = {
    id: string;
    name: string;
    rating: number;
}

export type Variant = {
    "color": string,
        "price": number,
        "stock": number,
    discount: Discount
}

export type Discount = {
    type: string;
    value: number;
}

//problem two

export type Department = {
    "dept_id": string;
    "name": string;
    "head_count": number;
    teams: Team[];
}

export type Team = {
    "team_id": string;
    "members": Member[];
    "budget": number;
}

export type Member = {
    "employee_id": string;
    "name": string;
    "role": string;
    "skills": string[],
    "projects": Project[],
}

export type Project =  {
    "project_id": string;
    "name": string;
    "status": string;
    "completion": number;
}

/*problem three*/
export type Course = {
    "course_code": string;
    "title": string;
    "instructor": string;
    "enrollment": Enrollment;
    "status": string;
    "schedule": Schedule;
    "prerequisites": string[];
    "department": string;
}

export type Enrollment = {
    "current": number;
    "capacity": number;
}

export type Schedule = {
    "time": string;
    "room": string;
}

//Problem five
export type Order = {
    "order_id": string;
    "date": string;
    "customer": string;
    items: Item[];
    shipping: Shipping;
    "status": string;
    "subtotal": number;
    "tax": number;
    "grand_total": number;
    "profit_margin": number;
    "bulk_discount_applied": boolean

}

export type Shipping = {
    "cost": number;
    "tax_rate": number;
    "promo_code": string;
    discount_value: number;
}

export type Item = {
    "sku": string;
    "name": string;
    "unit_price": number;
    "quantity": number;
    "discount": Discount
}

// problem six
export type FactoryProduct = {
    "product_id": string;
    "materials": Material[];
    "labor": Labor;
}

export type Material = {
    "material_id": string;
    "units_required": number;
    "waste_factor": number;
}

export type Labor =  {
    "hours": number;
    "cost_per_hour": number;
}

export type Resources = {
    [key: string]:  Resource
}

export type Resource = {
    "stock": number;
    "unit_cost": number;
    "lead_time": number;
}

export type FactoryOrder = {
    "order_id": string;
    "product_id": string
    "order_qty": number;
    "due_date": string;
    "status": string;
    "priority": string;
}

export type Dashboard = {
    "current_date": string;
    "order_status_options": string[];
    "priority_levels":string[]
    "material_status_colors": {
        "green": string;
        "yellow": string;
        "red": string;
    }
}
