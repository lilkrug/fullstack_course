import React, { useState, useEffect } from "react";
import axios from "axios";

const Table = () => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get("http://localhost:3001/results", {
        headers: { accessToken: localStorage.getItem("accessToken") },
      });

      // Обрабатываем данные для отображения турнирной таблицы
      const processedData = result.data.sort(
        (a, b) => b.points - a.points // Сортируем данные по убыванию поинтов
      );

      setTableData(processedData);
    };

    fetchData();
  }, []);

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Команда</th>
            <th>Забито голов</th>
            <th>Пропущено голов</th>
            <th>Очки</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((teamData, index) => (
            <tr key={teamData.id}>
              <td>{teamData.Team.name}</td>
              <td>{teamData.scored_goals}</td>
              <td>{teamData.conceded_goals}</td>
              <td>{teamData.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;