import Chart from 'chart.js';
import 'chartjs-plugin-datalabels';

export default (id, data, labels, name) => {
  // console.log(Chart.defaults);
  console.log(data);
  Chart.defaults.global.defaultFontFamily = "'Roboto', 'Helvetica', 'Arial', sans-serif";
  Chart.defaults.scale.ticks.beginAtZero = true;
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
      total: [data.pm45.total, data.pm67.total, data.pm89.total, data.ibb.total],
      booked: [data.pm45.booked, data.pm67.booked, data.pm89.booked, data.ibb.booked],
      loading: [data.pm45.loading, data.pm67.loading, data.pm89.loading, data.ibb.loading],
      completed: [
        data.pm45.completed,
        data.pm67.completed,
        data.pm89.completed,
        data.ibb.completed,
      ],
    };
  }

  const ctx = document.getElementById(id);
  return new Chart(ctx, {
    type: 'horizontalBar',
    data: {
      labels: labels.map(e => e.toUpperCase()),
      datasets: [
        {
          label: 'Booked',
          data: doc.booked.map(val => val),
          backgroundColor: '#0081FF',
        },
        {
          label: 'Loading',
          data: doc.loading.map(val => val),
          backgroundColor: '#FF9124',
        },
        {
          label: 'Completed',
          data: doc.completed.map(val => val),
          backgroundColor: '#16FF0B',
        },
        {
          label: 'No Action',
          data: doc.total.map((val, i) => {
            const result = val - (doc.booked[i] + doc.loading[i] + doc.completed[i]);
            return result;
          }),
          // data: [
          //   doc.total[0] - (doc.booked[0] + doc.loading[0] + doc.completed[0]),
          //   doc.total[1] - (doc.booked[1] + doc.loading[1] + doc.completed[1]),
          //   doc.total[2] - (doc.booked[2] + doc.loading[2] + doc.completed[2]),
          //   doc.total[3] - (doc.booked[3] + doc.loading[3] + doc.completed[3]),
          // ],
          backgroundColor: '#FF4C52',
        },
      ],
    },
    options: {
      title: {
        display: true,
        fontSize: 14,
        text: name,
      },
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
      plugins: {
        datalabels: {
          color: '#fff',
          font: {
            weight: 500,
            size: 13,
          },
          display: (context) => {
            const index = context.dataIndex;
            const value = context.dataset.data[index];

            return value > 0;
          },
        },
      },
    },
  });
};

const updateChart = (id, data, labels) => {
  // id.data.labels.push(labels);
  console.log(id.data);
  id.data.datasets.forEach((dataset) => {
    // dataset.data.push(data);
    console.log(dataset);
  });
  // console.log(id.data);
};

// module.exports.createChart = createChart;
export { updateChart };
