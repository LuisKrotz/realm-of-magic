import { Routes, Route } from "react-router-dom";

import List from "../pages/List";
import Create from "../pages/Create"
import Login from "../pages/Login"

const CreateRoutes = () => {
    return (
        <Routes>
            <Route path={global.config.routes.login}
            element={<Login title={'Login | Magic'} />}
            />

            <Route path={global.config.routes.list}
            element={<List title={'Magic'}/>}
            title="Magic"
            />

            <Route path={global.config.routes.create}
            element={<Create title={'Create | Magic'}/>}
            />
        </Routes>
    );
}

export default CreateRoutes