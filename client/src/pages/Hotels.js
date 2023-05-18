import React, { useContext } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";



function Hotels() {
    const [listOfHotels, setListOfHotels] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const { authState } = useContext(AuthContext);

    let history = useHistory();

    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            console.log(localStorage.getItem("accessToken"))
            history.push("/login");
        } else {
            axios
                .get("http://localhost:3001/hotels", {
                    headers: { accessToken: localStorage.getItem("accessToken") }
                })
                .then((response) => {
                    console.log(response.data.error != undefined)
                    if (response.data.error != undefined) {
                        history.push("/login");
                    }
                    else {
                        setListOfHotels(response.data);
                    }
                });
        }
    }, []);

    return (
        <div>{listOfHotels.length > 0 ? (
            <div>
                <input
                    type="text"
                    placeholder="Search by hotel name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <table>
                    <tbody>
                        {listOfHotels.filter((hotel) => {
                            const regex = new RegExp(`^${searchTerm}`, "i");
                            return regex.test(hotel.name);
                        })
                            .map((item) => (
                                <tr
                                    key={item.id}
                                    onClick={() => {
                                        history.push(`/tour/${item.id}`);
                                    }}
                                >
                                    <td>
                                        <h1>{item.name}</h1>
                                        <h2>{item.city}</h2>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        ) :
            (
                <h1>Отелей нет</h1>
            )}
        </div>
    );
}

export default Hotels;
