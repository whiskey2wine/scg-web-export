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

let fetchData;
const $piList = $('#pino');
const $pmListElement = $('#pm');

fetch('http://localhost:3000/getdata')
  .then(res => res.json())
  .then((data) => {
    console.log('data', data);
    fetchData = data;

    data.map(value => (value.location === 'pm13' ? pmList.pm13.push(value.PINo) : false));
    data.map(value => (value.location === 'pm16' ? pmList.pm16.push(value.PINo) : false));
    data.map(value => (value.location === 'pm17' ? pmList.pm17.push(value.PINo) : false));
    data.map(value => (value.location === 'pm45' ? pmList.pm45.push(value.PINo) : false));
    data.map(value => (value.location === 'pm67' ? pmList.pm67.push(value.PINo) : false));
    data.map(value => (value.location === 'pm89' ? pmList.pm89.push(value.PINo) : false));
    data.map(value => (value.location === 'ibb' ? pmList.ibb.push(value.PINo) : false));

    const banpong = ['pm13', 'pm16', 'pm17'];
    const wangsala = ['pm45', 'pm67', 'pm89', 'ibb'];
    data.map((value) => {
      if (banpong.includes(value.location)) {
        bp[value.location].total += value.mix + value.single;
      } else if (wangsala.includes(value.location)) {
        ws[value.location].total += value.mix + value.single;
      } else {
        console.log('error:', value);
      }
      return true;
    });

    // -----------------------------

    console.log('pmList', pmList);
    createChart('chartBp', bp, ['PM13', 'PM16', 'PM17']);
    createChart('chartWs', ws, ['PM45', 'PM67', 'PM89', 'IBB']);
    createTable();

    // continue here ------------------------
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
