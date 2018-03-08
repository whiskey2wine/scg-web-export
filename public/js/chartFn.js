import Chart from 'chart.js';

console.log('bacon');
export default (id, data) => {
  // console.log(Chart.defaults);
  // console.log(data);
  Chart.defaults.global.defaultFontFamily = "'Roboto', 'Helvetica', 'Arial', sans-serif";
  Chart.defaults.scale.ticks.beginAtZero = true;
  // Chart.defaults.global = {
  //   tooltipTemplate: '<%if (label){%><%=label%>: <%}%><%= value %>',
  // };
  const ctx = document.getElementById(id);
  const myChart = new Chart(ctx, {
    type: 'horizontalBar',
    data: {
      labels: ['PM1,3', 'PM16', 'PM17', 'PM4-5', 'PM6-7', 'PM8-9', 'IBB'],
      datasets: [
        {
          label: 'Booked',
          data: [
            data.booked[0],
            data.booked[1],
            data.booked[2],
            data.booked[3],
            data.booked[4],
            data.booked[5],
            data.booked[6],
          ],
          backgroundColor: '#059BFF',
        },
        {
          label: 'On Process',
          data: [
            data.process[0],
            data.process[1],
            data.process[2],
            data.process[3],
            data.process[4],
            data.process[5],
            data.process[6],
          ],
          backgroundColor: '#FF9124',
        },
        {
          label: 'Completed',
          data: [
            data.completed[0],
            data.completed[1],
            data.completed[2],
            data.completed[3],
            data.completed[4],
            data.completed[5],
            data.completed[6],
          ],
          backgroundColor: '#22CECE',
        },
        {
          label: 'No Action',
          data: [
            data.init[0] - (data.booked[0] + data.process[0] + data.completed[0]),
            data.init[1] - (data.booked[1] + data.process[1] + data.completed[1]),
            data.init[2] - (data.booked[2] + data.process[2] + data.completed[2]),
            data.init[3] - (data.booked[3] + data.process[3] + data.completed[3]),
            data.init[4] - (data.booked[4] + data.process[4] + data.completed[4]),
            data.init[5] - (data.booked[5] + data.process[5] + data.completed[5]),
            data.init[6] - (data.booked[6] + data.process[6] + data.completed[6]),
          ],
          backgroundColor: '#FF4C52',
        },
      ],
    },
    options: {
      responsive: true,
      tooltips: {
        callbacks: {
          title: (tooltipItems, chart) => {
            const [tooltipItem] = tooltipItems;
            if (tooltipItem.index === 0) {
              return `${chart.labels[tooltipItem.index]} | Total: ${data.init[0]}`;
            } else if (tooltipItem.index === 1) {
              return `${chart.labels[tooltipItem.index]} | Total: ${data.init[1]}`;
            } else if (tooltipItem.index === 2) {
              return `${chart.labels[tooltipItem.index]} | Total: ${data.init[2]}`;
            } else if (tooltipItem.index === 3) {
              return `${chart.labels[tooltipItem.index]} | Total: ${data.init[3]}`;
            } else if (tooltipItem.index === 4) {
              return `${chart.labels[tooltipItem.index]} | Total: ${data.init[4]}`;
            } else if (tooltipItem.index === 5) {
              return `${chart.labels[tooltipItem.index]} | Total: ${data.init[5]}`;
            } else if (tooltipItem.index === 6) {
              return `${chart.labels[tooltipItem.index]} | Total: ${data.init[6]}`;
            }
          },
        },
      },
      scales: {
        xAxes: [
          {
            stacked: true,
          },
        ],
        yAxes: [
          {
            stacked: true,
          },
        ],
      },
      legend: {
        display: true,
        labels: {
          fontColor: 'rgb(255, 99, 132)',
        },
      },
    },
  });
};

// module.exports.createChart = createChart;
// export { createChart };
