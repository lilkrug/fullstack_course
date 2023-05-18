import React from "react";
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

function PageNotFound() {
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
            <h1>Страница не найдена</h1>
            <p>Вы будете перенаправлены через {counter} секунд.</p>
        </div>
    );
}

export default PageNotFound;
