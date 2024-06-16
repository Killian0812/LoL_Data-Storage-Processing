import React from 'react'

const Chart = () => {
    return (
        <div style={{ marginTop: 50 }}>
            <iframe style={{
                background: '#F1F5F4',
                border: 'none',
                borderRadius: '2px',
                boxShadow: '0 2px 10px 0 rgba(70, 76, 79, .2)',
                width: '100vw',
                height: '100vh'
            }} title='charts'
                src="https://charts.mongodb.com/charts-mern_basic-voqgzjz/embed/dashboards?id=666eb77c-3787-49a0-818f-e5dc24daf0f3&theme=light&autoRefresh=true&maxDataAge=3600&showTitleAndDesc=true&scalingWidth=fixed&scalingHeight=fixed"></iframe>
        </div>
    )
}

export default Chart