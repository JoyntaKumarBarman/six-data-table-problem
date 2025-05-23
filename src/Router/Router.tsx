import {createBrowserRouter} from "react-router-dom";
import Layout from "../layout/Layout";
import NotFound from "../NotFound/NotFound";
import SecondProblemDataTable from "../components/SecondProblemDataTable";
import ThirdProblemDataTable from "../components/ThirdProblemDataTable";
import ForthProblemDataTable from "../components/ForthProblemDataTable";
import FifthProblemDataTable from "../components/FifthProblemDataTable";
import SixthProblemDataTable from "../components/SixthProblemDataTable";
import FirstProblemDataTable from "../components/FirstProblemDataTable";


export const router: any = createBrowserRouter([
    {
        path: "/",
        element: <Layout/>,
        errorElement: <NotFound/>,
        children: [

            {
                path: "/",
                element: <FirstProblemDataTable/>,
            },{
                path: "/two",
                element: <SecondProblemDataTable/>,
            },{
                path: "/three",
                element: <ThirdProblemDataTable/>,
            },{
                path: "/four",
                element: <ForthProblemDataTable/>,
            },{
                path: "/five",
                element: <FifthProblemDataTable/>,
            },{
                path: "/six",
                element: <SixthProblemDataTable/>,
            },
        ],
    },
]);
