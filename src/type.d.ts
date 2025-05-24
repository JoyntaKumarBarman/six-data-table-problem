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

/*Academic records*/
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