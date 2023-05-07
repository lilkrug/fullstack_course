import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";

function MyLeague() {
    const [tableData, setTableData] = useState([]);

    let history = useHistory();
  
    useEffect(() => {
      const fetchData = async () => {
        const result = await axios.get("http://localhost:3001/results", {
                headers: { accessToken: localStorage.getItem("accessToken") },
            });
  
        // Обрабатываем данные для отображения турнирной таблицы
        const processedData = result.data.map((teamData) => ({
          ...teamData,
          goal_difference: teamData.scored_goals - teamData.conceded_goals // Вычисляем разницу забитых и пропущенных голов
        })).sort((a, b) => {
          // Сортируем данные по убыванию поинтов, а при равенстве по разнице голов, а при дальнейшем равенстве по забитым голам
          if (b.points !== a.points) {
            return b.points - a.points;
          } else if (b.goal_difference !== a.goal_difference) {
            return b.goal_difference - a.goal_difference;
          } else {
            return b.scored_goals - a.scored_goals;
          }
        });
  
        setTableData(processedData);
      };
  
      fetchData();
    }, []);
  
    return (
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Место</th>
              <th>Команда</th>
              <th>Забито голов</th>
              <th>Пропущено голов</th>
              <th>Разница голов</th>
              <th>Очки</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((teamData, index) => (
              <tr key={teamData.id} onClick={() => {
                history.push(`/team/${teamData.id}`);
                }}>
                <td>{index + 1}</td>
                <td>{teamData.Team.name}</td>
                <td>{teamData.scored_goals}</td>
                <td>{teamData.conceded_goals}</td>
                <td>{teamData.goal_difference}</td>
                <td>{teamData.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

export default MyLeague;