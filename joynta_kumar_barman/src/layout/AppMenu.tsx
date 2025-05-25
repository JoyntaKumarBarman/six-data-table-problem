import type {MenuModel} from "../../types";
import AppSubMenu from "./AppSubMenu";

const AppMenu = () => {
    const model: MenuModel[] = [
        {
            label: "Dashboards",
            icon: "pi pi-home",
            items: [
                {
                    label: "Problem One",
                    icon: "pi pi-fw pi-home",
                    to: "/",
                },{
                    label: "Problem Two",
                    icon: "pi pi-fw pi-home",
                    to: "/two",
                },{
                    label: "Problem Three",
                    icon: "pi pi-fw pi-home",
                    to: "/three",
                },{
                    label: "Problem Four",
                    icon: "pi pi-fw pi-home",
                    to: "/four",
                },{
                    label: "Problem Five",
                    icon: "pi pi-fw pi-home",
                    to: "/five",
                },{
                    label: "Problem Six",
                    icon: "pi pi-fw pi-home",
                    to: "/six",
                },
            ],
        },
    ];

    return <AppSubMenu model={model}/>;
};

export default AppMenu;
