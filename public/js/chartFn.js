import Chart from 'chart.js';

export default (id, data, labels) => {
  // console.log(Chart.defaults);
  console.log(data);
  Chart.defaults.global.defaultFontFamily = "'Roboto', 'Helvetica', 'Arial', sans-serif";
  Chart.defaults.scale.ticks.beginAtZero = true;
  // Chart.defaults.global = {
  //   tooltipTemplate: '<%if (label){%><%=label%>: <%}%><%= value %>',
  // };
  let doc;
  if (data.location === 'bp') {
    doc = {
      total: [data.pm13.total, data.pm16.total, data.pm17.total],
      booked: [data.pm13.booked, data.pm16.booked, data.pm17.booked],
      loading: [data.pm13.loading, data.pm16.loading, data.pm17.loading],
      completed: [data.pm13.completed, data.pm16.completed, data.pm17.completed],
    };
  } else {
    doc = {
      total: [data.pm45.total, data.pm67.total, data.pm89.total, data.IBB.total],
      booked: [data.pm45.booked, data.pm67.booked, data.pm89.booked, data.IBB.booked],
      loading: [data.pm45.loading, data.pm67.loading, data.pm89.loading, data.IBB.loading],
      completed: [
        data.pm45.completed,
        data.pm67.completed,
        data.pm89.completed,
        data.IBB.completed,
      ],
    };
  }

  const ctx = document.getElementById(id);
  const myChart = new Chart(ctx, {
    type: 'horizontalBar',
    data: {
      labels,
      datasets: [
        {
          label: 'Booked',
          data: [doc.booked[0], doc.booked[1], doc.booked[2], doc.booked[3]],
          backgroundColor: '#059BFF',
        },
        {
          label: 'On Process',
          data: [doc.loading[0], doc.loading[1], doc.loading[2], doc.loading[3]],
          backgroundColor: '#FF9124',
        },
        {
          label: 'Completed',
          data: [doc.completed[0], doc.completed[1], doc.completed[2], doc.completed[3]],
          backgroundColor: '#22CECE',
        },
        {
          label: 'No Action',
          data: [
            doc.total[0] - (doc.booked[0] + doc.loading[0] + doc.completed[0]),
            doc.total[1] - (doc.booked[1] + doc.loading[1] + doc.completed[1]),
            doc.total[2] - (doc.booked[2] + doc.loading[2] + doc.completed[2]),
            doc.total[3] - (doc.booked[3] + doc.loading[3] + doc.completed[3]),
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
              return `${chart.labels[tooltipItem.index]} | Total: ${doc.total[0]}`;
            } else if (tooltipItem.index === 1) {
              return `${chart.labels[tooltipItem.index]} | Total: ${doc.total[1]}`;
            } else if (tooltipItem.index === 2) {
              return `${chart.labels[tooltipItem.index]} | Total: ${doc.total[2]}`;
            } else if (tooltipItem.index === 3) {
              return `${chart.labels[tooltipItem.index]} | Total: ${doc.total[3]}`;
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
