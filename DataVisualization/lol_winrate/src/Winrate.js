import { useState, useEffect } from 'react';
import axios from 'axios';
import $ from 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables.min.js';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import './App.css';

const url = "http://localhost:8080/api";

function convertToPercentage(num) {
    const percentage = num * 100;
    const roundedPercentage = percentage.toFixed(2);
    const percentageString = roundedPercentage + '%';
    return percentageString;
}

function Winrate() {
    const [data, setData] = useState([]);

    useEffect(() => { // init DataTables 
        if (data?.length <= 0)
            return;

        $('#table').DataTable({
            retrieve: true,
            columnDefs: [
                { className: "dt-head-center", targets: [0, 1, 2, 3, 4] },
                { className: "dt-body-center", targets: [0, 1, 2, 3, 4] },
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
        if (!x.teamPosition)
            return null
        return (
            <tr key={x._id}>
                <td style={{ textAlign: "center" }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img src={`https://opgg-static.akamaized.net/meta/images/lol/14.12.1/champion/${x.championName}.png`}
                            style={{ width: 60, height: 60 }} alt=''
                        ></img>
                        <span style={{ width: 100 }} >
                            {x.championName}
                        </span>
                    </div>
                </td>
                <td>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img src={`${x.teamPosition}.svg`} alt='' style={{ width: 40, height: 40 }}></img>
                        <span style={{ width: 100 }} >
                            {x.teamPosition}
                        </span>
                    </div>
                </td>
                <td>{convertToPercentage(x.winRate)}</td>
                <td>
                    {
                        x.bestMatchups.map(opponent =>
                            <img src={`https://opgg-static.akamaized.net/meta/images/lol/14.12.1/champion/${opponent}.png`}
                                style={{ width: 60, height: 60 }}
                                alt=''></img>)
                    }
                </td>
                <td>
                    {
                        x.worstMatchups.map(opponent =>
                            <img src={`https://opgg-static.akamaized.net/meta/images/lol/14.12.1/champion/${opponent}.png`}
                                style={{ width: 60, height: 60 }}
                                alt=''></img>)
                    }
                </td>
            </tr>
        );
    });

    if (!data.length)
        return <div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>

    return (
        <>
            <div style={{ marginTop: 100 }}>
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

export default Winrate;
