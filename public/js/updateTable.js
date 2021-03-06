import 'jquery-ui';
import 'jquery.tabulator';
import uuuu from './script';
// import { updateChart } from './chartFn';

// console.log(data);
// load sample data into the table

const maximum = function (cell, value, parameters) {
  // cell - the cell component for the edited cell
  // value - the new input value of the cell
  // parameters - the parameters passed in with the validator
  const rowData = cell.getRow().getData();
  const field = cell.getColumn().getField();

  const current = rowData.booked + rowData.loading + rowData.completed;
  const result = current - rowData[field];
  const max = rowData.total - result;

  return value <= max;
};

export default (doc) => {
  console.log(doc);
  $('#tableUpdate').tabulator({
    placeholder: 'No Data Available',
    groupBy: 'location',
    groupToggleElement: 'header',
    groupHeader(value, count, data, group) {
      // value - the value all members of this group share
      // count - the number of rows in this group
      // data - an array of all the row data objects in this group
      // group - the group component for the group
      const item = count === 1 ? 'item' : 'items';

      return `${value.toUpperCase()}<span margin-left:10px;'>(${count} ${item})</span>`;
    },
    height: '100%', // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
    layout: 'fitColumns', // fit columns to width of table (optional)
    layoutColumnsOnNewData: true,
    initialSort: [
      { column: 'PINo', dir: 'asc' }, // sort by this first
    ],
    columnVertAlign: 'middle',
    columns: [
      // Define Table Columns
      { title: 'PINo', field: 'PINo', align: 'center' },
      {
        title: 'Shipping',
        field: 'shipping',
        align: 'center',
        width: 100,
      },
      {
        title: 'จำนวนตู้',
        columns: [
          {
            title: 'เต็ม',
            field: 'single',
            align: 'right',
            bottomCalc: 'sum',
            width: 70,
          },
          {
            title: 'บวก',
            field: 'mix',
            align: 'right',
            bottomCalc: 'sum',
            width: 70,
          },
          {
            title: 'รวม',
            field: 'total',
            align: 'right',
            bottomCalc: 'sum',
            width: 70,
          },
        ],
      },
      {
        title: 'Booked',
        field: 'booked',
        align: 'right',
        bottomCalc: 'sum',
        editor: 'number',
        validator: ['min:0', maximum],
        editorParams: { min: 0 },
        cssClass: 'editable',
        width: 90,
      },
      {
        title: 'สรุป status',
        columns: [
          {
            title: 'No Action',
            field: 'noaction',
            align: 'right',
            bottomCalc: 'sum',
            width: 110,
          },
          {
            title: 'Loading',
            field: 'loading',
            align: 'right',
            bottomCalc: 'sum',
            editor: 'number',
            validator: ['min:0', maximum],
            editorParams: { min: 0 },
            cssClass: 'editable',
            width: 100,
          },
          {
            title: 'Completed',
            field: 'completed',
            align: 'right',
            bottomCalc: 'sum',
            editor: 'number',
            validator: ['min:0', maximum],
            editorParams: { min: 0 },
            cssClass: 'editable',
            width: 110,
          },
          {
            title: 'Progress',
            field: 'percent',
            align: 'left',
            width: 120,
            bottomCalc: 'avg',
            bottomCalcFormatter: 'progress',
            bottomCalcFormatterParams: {
              color(val) {
                const hue = val / 100 * (120 - 0) + 0;
                return `hsl(${hue}, 100%, 50%)`;
              },
              legend(val) {
                return `${parseInt(val, 10).toFixed(0)}%`;
              },
            },
            formatter: 'progress',
            formatterParams: {
              color(val) {
                const hue = val / 100 * (120 - 0) + 0;
                return `hsl(${hue}, 100%, 50%)`;
              },
              legend(val) {
                return `${parseInt(val, 10).toFixed(0)}%`;
              },
            },
          },
        ],
      },
      {
        title: 'สถานะตู้<br/> Remarks อื่นๆ',
        field: 'comment',
        align: 'left',
        editor: 'input',
        formatter: 'textarea',
        minWidth: 135,
        cssClass: 'editable',
      },
    ],
    ajaxResponse(url, params, res) {
      const newRes = res.map((e) => {
        e.total = e.single + e.mix;
        e.percent = e.completed / e.total * 100;
        // e.percent = Math.random().toFixed(2) * 100;
        e.noaction = e.total - (e.booked + e.loading + e.completed);
        return e;
      });
      // console.log(newRes);
      return newRes;
    },
    ajaxLoaderLoading: `
      <div class="preloader-wrapper active">
        <div class="spinner-layer spinner-blue">
          <div class="circle-clipper left">
            <div class="circle"></div>
          </div>
          <div class="gap-patch">
            <div class="circle"></div>
          </div>
          <div class="circle-clipper right">
            <div class=" circle"></div>
          </div>
        </div>
        <div class="spinner-layer spinner-red">
          <div class="circle-clipper left">
            <div class="circle"></div>
          </div>
          <div class="gap-patch">
            <div class="circle"></div>
          </div>
          <div class="circle-clipper right">
            <div class=" circle"></div>
          </div>
        </div>
        <div class="spinner-layer spinner-yellow">
          <div class="circle-clipper left">
            <div class="circle"></div>
          </div>
          <div class="gap-patch">
            <div class="circle"></div>
          </div>
          <div class="circle-clipper right">
            <div class=" circle"></div>
          </div>
        </div>
        <div class="spinner-layer spinner-green">
          <div class="circle-clipper left">
            <div class="circle"></div>
          </div>
          <div class="gap-patch">
            <div class="circle"></div>
          </div>
          <div class="circle-clipper right">
            <div class=" circle"></div>
          </div>
        </div>
      </div>
    `,
    cellEdited(cell) {
      // cell - cell component
      const row = cell.getRow();
      const rowData = row.getData();
      console.log(cell);
      console.log(cell.getField());
      if (cell.getField() === 'completed') {
        const cellValue = cell.getValue();
        row.update({ percent: cellValue / rowData.total * 100 });
      }
      row.update({
        noaction: rowData.total - (rowData.booked + rowData.loading + rowData.completed),
      });
      fetch('http://localhost:3000/update', {
        // fetch('http://172.29.0.143:3000/update', {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(rowData),
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      })
        .then((res) => {
          if (res.status === 200) {
            Materialize.toast('Data has been updated.', 2000);
            // socket.emit('triggerUpdate', data);
            uuuu(rowData);
          } else {
            Materialize.toast('Unable to update table.', 2000);
          }
        })
        .catch(err => Materialize.toast('Unable to connect to server.', 4000));
    },
    rowFormatter(row) {
      // console.log(row);
      if (row.getData().completed / row.getData().total === 1) {
        row.getElement().addClass('success'); // mark rows with age greater than or equal to 18 as successfull;
      } else {
        row.getElement().removeClass('success');
      }
    },
  });
  // $('#tableUpdate').tabulator('setData', doc);
};
