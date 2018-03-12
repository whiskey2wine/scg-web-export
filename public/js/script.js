import io from 'socket.io-client';
// import $ from 'jquery';
import 'materialize-css';

import createChart from './chartFn';
import createTable from './updateTable';

$(document).ready(() => {
  $('select').material_select();
});
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
  loaction: 'ws',
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
  IBB: {
    total: 0,
    booked: 0,
    loading: 0,
    completed: 0,
  },
};

let fetchData;
const $piList = $('#pino');
const $pmListElement = $('#pm');

fetch('http://localhost:3000/getdata')
  .then(res => res.json())
  .then((data) => {
    console.log('data', data);
    fetchData = data;

    data.forEach((pi, i) => {
      if (
        pi.bp13 > 0 ||
        pi.mx1316 > 0 ||
        pi.mx1345 > 0 ||
        pi.mx1367 > 0 ||
        pi.mx131645 > 0 ||
        pi.mx131667 > 0 ||
        pi.mx134567 > 0 ||
        pi.mx13164567 > 0
      ) {
        pmList.pm13.push(pi.PINo);
      }
      if (
        pi.bp16 > 0 ||
        pi.mx1316 > 0 ||
        pi.mx1645 > 0 ||
        pi.mx1667 > 0 ||
        pi.mx131645 > 0 ||
        pi.mx131667 > 0 ||
        pi.mx164567 > 0 ||
        pi.mx13164567 > 0
      ) {
        pmList.pm16.push(pi.PINo);
      }
      if (pi.bp17 > 0 || pi.mx1789 > 0) {
        pmList.pm17.push(pi.PINo);
      }
      if (
        pi.ws45 > 0 ||
        pi.mx1345 > 0 ||
        pi.mx1645 > 0 ||
        pi.mx4567 > 0 ||
        pi.mx131645 > 0 ||
        pi.mx134567 > 0 ||
        pi.mx164567 > 0 ||
        pi.mx13164567 > 0
      ) {
        pmList.pm45.push(pi.PINo);
      }
      if (
        pi.ws67 > 0 ||
        pi.mx1367 > 0 ||
        pi.mx1667 > 0 ||
        pi.mx4567 > 0 ||
        pi.mx131667 > 0 ||
        pi.mx134567 > 0 ||
        pi.mx164567 > 0 ||
        pi.mx13164567 > 0
      ) {
        pmList.pm67.push(pi.PINo);
      }
      if (pi.ws89 > 0 || pi.mx1789 > 0) {
        pmList.pm89.push(pi.PINo);
      }
      if (pi.wsIBB) {
        pmList.ibb.push(pi.PINo);
      }

      if (pi.bp13 !== undefined) {
        bp.pm13.total +=
          pi.bp13 +
          pi.mx1316 +
          pi.mx1345 +
          pi.mx1367 +
          pi.mx131645 +
          pi.mx131667 +
          pi.mx134567 +
          pi.mx13164567;
        bp.pm16.total +=
          pi.bp16 +
          pi.mx1316 +
          pi.mx1645 +
          pi.mx1667 +
          pi.mx131645 +
          pi.mx131667 +
          pi.mx164567 +
          pi.mx13164567;
        ws.pm45.total +=
          pi.ws45 +
          pi.mx1345 +
          pi.mx1645 +
          pi.mx4567 +
          pi.mx131645 +
          pi.mx134567 +
          pi.mx164567 +
          pi.mx13164567;
        ws.pm67.total +=
          pi.ws67 +
          pi.mx1367 +
          pi.mx1667 +
          pi.mx4567 +
          pi.mx131667 +
          pi.mx134567 +
          pi.mx164567 +
          pi.mx13164567;
        ws.IBB.total += pi.wsIBB;
      } else {
        bp.pm17.total += pi.bp17 + pi.mx1789;
        ws.pm89.total += pi.ws89 + pi.mx1789;
      }
    });
    console.log(bp);
    console.log(ws);
    // -----------------------------

    console.log('pmList', pmList);
    // const obj = {
    //   init: [bp13, bp16, bp17, ws45, ws67, ws89, wsIBB],
    //   booked: [3, 2, 0, 1, 2, 0, 1],
    //   process: [2, 1, 0, 1, 1, 0, 1],
    //   completed: [4, 2, 0, 1, 1, 0, 1],
    // };
    createChart('chartBp', bp, ['PM13', 'PM16', 'PM17']);
    createChart('chartWs', ws, ['PM45', 'PM67', 'PM89', 'IBB']);
    createTable();

    // Enable PM option that contains PI
    // obj.init.map((val, i) => {
    //   if (val > 0) {
    //     $pmListElement.children()[i + 1].disabled = false;
    //     $('select').material_select();
    //   }
    //   return true;
    // });
  })
  .catch((err) => {
    console.log(err);
  });

// Insert PI when PM option has been selected
$pmListElement.on('change', (e) => {
  let piOption;
  $('textarea.editor').val('');

  if (pmList[e.target.value].length > 0) {
    $piList.prop('disabled', false);
    piOption = '<option value="" disabled selected>Select PI</option>';
  }

  if (pmList[e.target.value] !== undefined) {
    pmList[e.target.value].forEach((el) => {
      piOption += `<option value="${el}">${el}</option>`;
    });
  }

  $piList.html(piOption);
  $('select').material_select();
});

let selectedObj = {};
// Display comment when PI has been selected and enable textarea
$piList.on('change', (e) => {
  $('#submitBtn').prop('disabled', false);
  const found = fetchData.find(val => val.PINo === e.target.value);
  selectedObj = {
    selected: found,
  };
  console.log(selectedObj);
  $('textarea.editor').val(found.remarks);
});

$(document).on('click', '#submitBtn', (e) => {
  const booked = parseInt($('#booked').val(), 10);
  const onProcess = parseInt($('#on-process').val(), 10);
  const completed = parseInt($('#completed').val(), 10);
  selectedObj.booked = booked > 0 ? booked : undefined;
  selectedObj.on_process = onProcess > 0 ? onProcess : undefined;
  selectedObj.completed = completed > 0 ? completed : undefined;
  console.log(selectedObj);
});
