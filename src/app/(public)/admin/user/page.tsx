

import React from "react";
import UserTable from "./user-table";
import FilterForm from "./form-filter";


const UsersPage = () => {

    return (
        <div>
            <FilterForm />
            <UserTable />
        </div>
    );
}

export default UsersPage