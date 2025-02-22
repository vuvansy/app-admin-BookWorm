import React from "react";
import AuthorTable from "./author-table";



const data = [
    {
        id: "67441ccbdrcaffdsfsdf07",
        name: "khang",
    },
    {
        id: "67441ccbdrcaffdsfsdf08",
        name: "tuan",
    },
    {
        id: "67441ccbdrcaffdsfsdf09",
        name: "sy",
    },
    {
        id: "67441ccbdrcaffdsfsdf01",
        name: "kha",
    },
    {
        id: "67441ccbdrcaffdsfsdf02",
        name: "khang",
    },
    {
        id: "67441ccbdrcaffdsfsdf03",
        name: "tuan",
    },

];

const AuthorPage = () => {
    return (
        <>
            <AuthorTable data={data} />
        </>
    );
}
export default AuthorPage;
