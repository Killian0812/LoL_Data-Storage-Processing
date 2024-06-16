import { useState, useEffect } from 'react';
import axios from 'axios';
import $ from 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables.min.js';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import './App.css';

const url = "http://localhost:8080/api";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => { // init DataTables 
    if (data?.length <= 0)
      return;

    $('#table').DataTable({
      retrieve: true,
      columnDefs: [
        { className: "dt-head-center", targets: [0, 1, 2] },
        { className: "dt-body-center", targets: [0, 1, 2] },
        { orderable: false, targets: [0, 3, 4] }
      ],
      order: []
    });
  }, [data]);

  useEffect(() => { // fetch data
    axios.get(`${url}/winrate`).then(res => {
      setData(res.data);
    }).catch(e => console.error(e));
  }, []);

  const dataList = data.map((x) => {
    return (
      <tr key={x._id}>
        <td style={{ textAlign: "center" }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${x.championName}_0.jpg`}
              style={{ width: 60, height: 60, borderRadius: 50, marginRight: 10 }} alt=''
            ></img>
            <span style={{ width: 100 }} >
              {x.championName}
            </span>
          </div>
        </td>
        <td>Lane</td>
        <td>{x.winRate}</td>
        <td>NULL</td>
        <td>NULL</td>
      </tr>
    );
  });

  return (
    <>
      <div>
        <section>
          <h1>League of Legends winrates</h1><hr></hr><br></br>
          <table id='table' >
            <thead>
              <tr>
                <th>Champion</th>
                <th>Lane</th>
                <th>Winrate</th>
                <th>Best against</th>
                <th>Worst against</th>
              </tr>
            </thead>
            <tbody>
              {
                dataList
              }
            </tbody>
          </table>
        </section>
      </div>
    </>
  );
}

export default App;
