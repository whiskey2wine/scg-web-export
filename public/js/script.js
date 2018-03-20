import io from 'socket.io-client';
import $ from 'jquery';
import moment from 'moment';
import 'materialize-css';

import createChart, { updateChart } from './chartFn';
import createTable from './updateTable';

$(document).ready(() => {
  $('select').material_select();
});

const host = 'http://localhost:3000';
// const host = 'http://172.29.0.143:3000';
const socket = io();
socket.on('connect', () => {
  console.log('Connected to server.');
});

const pmList = {
  pm13: [],
  pm16: [],
  pm17: [],
  pm45: [],
  pm67: [],
  pm89: [],
  ibb: [],
};

const bp = {
  location: 'bp',
  pm13: {
    total: 0,
    booked: 0,
    loading: 0,
    completed: 0,
  },
  pm16: {
    total: 0,
    booked: 0,
    loading: 0,
    completed: 0,
  },
  pm17: {
    total: 0,
    booked: 0,
    loading: 0,
    completed: 0,
  },
};
const ws = {
  location: 'ws',
  pm45: {
    total: 0,
    booked: 0,
    loading: 0,
    completed: 0,
  },
  pm67: {
    total: 0,
    booked: 0,
    loading: 0,
    completed: 0,
  },
  pm89: {
    total: 0,
    booked: 0,
    loading: 0,
    completed: 0,
  },
  ibb: {
    total: 0,
    booked: 0,
    loading: 0,
    completed: 0,
  },
};

let chartBp;
let chartWs;

const $pmListElement = $('#pm');
const banpongLabels = ['pm13', 'pm16', 'pm17'];
const wangsalaLabels = ['pm45', 'pm67', 'pm89', 'ibb'];

const calTotal = (data) => {
  const keys = Object.keys(bp.pm13);
  console.log(keys);
  banpongLabels.forEach((pm) => {
    keys.forEach((x) => {
      bp[pm][x] = 0;
    });
  });
  wangsalaLabels.forEach((pm) => {
    keys.forEach((x) => {
      ws[pm][x] = 0;
    });
  });

  data.forEach((value) => {
    if (banpongLabels.includes(value.location)) {
      bp[value.location].total += value.mix + value.single;
      bp[value.location].booked += value.booked;
      bp[value.location].loading += value.loading;
      bp[value.location].completed += value.completed;
    } else {
      ws[value.location].total += value.mix + value.single;
      ws[value.location].booked += value.booked;
      ws[value.location].loading += value.loading;
      ws[value.location].completed += value.completed;
    }
  });
};

fetch(`${host}/getdata`)
  .then(res => res.json())
  .then((data) => {
    console.log('data', data);

    // push PINo into pmList
    banpongLabels
      .concat(wangsalaLabels)
      .forEach(pm =>
        data.forEach(val => (val.location === pm ? pmList[pm].push(val.PINo) : false)));
    console.log('pmList', pmList);

    // calculate total and insert into object
    calTotal(data);

    // Enable PM option that contains PI
    $.each(pmList, (i, val) => {
      if (val.length > 0) {
        $(`#${i}`).prop('disabled', false);
        $('select').material_select();
      }
    });

    chartBp = createChart('chartBp', bp, banpongLabels, 'Banpong');
    chartWs = createChart('chartWs', ws, wangsalaLabels, 'Wangsala');
    console.log(chartBp.data.datasets);
    const doc = data.map((e) => {
      e.total = e.single + e.mix;
      // e.percent = e.completed / e.total * 100;
      e.percent = Math.random().toFixed(2) * 100;
      e.noaction = e.total - (e.booked + e.loading + e.completed);
      return e;
    });
    createTable(doc);
  })
  .catch((err) => {
    console.error(err);
  });

let selectedPM;
// Insert PI when PM option has been selected
$pmListElement.on('change', (e) => {
  selectedPM = e.target.value;
  if (e.target.value === 'selectAll') {
    $('#tableUpdate').tabulator('setData', '/getdata');
  } else {
    $('#tableUpdate').tabulator('setData', `/getdata/${e.target.value}`);
  }
  // console.log($('.active.selected span').html());
});

$(document).on('click', '#downloadBtn', () => {
  $('#tableUpdate').tabulator(
    'download',
    'xlsx',
    `ConfirmLoad ${moment().format('DD-MM-YYYY')} ${selectedPM}.xlsx`,
  );
});

const uuuu = (data) => {
  console.log(data);
  // socket.emit('triggerUpdate', data);
  fetch(`${host}/getdata`)
    .then(res => res.json())
    .then((newData) => {
      console.log(newData);
      socket.emit('triggerUpdate', newData);
    })
    .catch((err) => {
      console.error(err);
    });
};

socket.on('updateChart', (data) => {
  calTotal(data);
  const newBp = updateChart(bp);
  const newWs = updateChart(ws);
  chartBp.data.datasets.forEach((status) => {
    if (status.label === 'Booked') {
      status.data = newBp.booked;
    }
    if (status.label === 'Loading') {
      status.data = newBp.loading;
    }
    if (status.label === 'Completed') {
      status.data = newBp.completed;
    }
    if (status.label === 'No Action') {
      status.data = status.data.map((val, i) => newBp.total[i] - (newBp.booked[i] + newBp.loading[i] + newBp.completed[i]));
    }
  });
  chartBp.update();
  chartWs.data.datasets.forEach((status) => {
    if (status.label === 'Booked') {
      status.data = newWs.booked;
    }
    if (status.label === 'Loading') {
      status.data = newWs.loading;
    }
    if (status.label === 'Completed') {
      status.data = newWs.completed;
    }
    if (status.label === 'No Action') {
      status.data = status.data.map((val, i) => newWs.total[i] - (newWs.booked[i] + newWs.loading[i] + newWs.completed[i]));
    }
  });
  chartWs.update();
});

export default uuuu;
