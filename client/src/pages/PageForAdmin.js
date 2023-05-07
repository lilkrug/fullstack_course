import React from "react";
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

function PageForAdmin() {
    const history = useHistory();
    const [counter, setCounter] = useState(5);

    useEffect(() => {
        const timer =
            counter > 0 &&
            setTimeout(() => {
                setCounter(counter - 1);
            }, 1000);

        if (counter === 0) {
            history.push('/');
        }

        return () => clearTimeout(timer);
    }, [counter, history]);
    return (
        <div>
            <h1>You are not allowed to visit this page</h1>
            <p>You will be redirected in {counter} seconds.</p>
        </div>
    );
}

export default PageForAdmin;