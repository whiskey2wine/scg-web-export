import 'jquery-ui';
import 'jquery.tabulator';
import uuuu from './script';
// import { updateChart } from './chartFn';

// console.log(data);
// load sample data into the table
export default (doc) => {
  $('#tableUpdate').tabulator({
    placeholder: 'No Data Available',
    height: '100%', // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
    layout: 'fitData', // fit columns to width of table (optional)
    initialSort: [
      { column: 'PINo', dir: 'asc' }, // sort by this first
    ],
    columnVertAlign: 'middle',
    columns: [
      // Define Table Columns
      { title: 'PINo', field: 'PINo', align: 'center' },
      { title: 'Shipping', field: 'shipping', align: 'center' },
      {
        title: 'จำนวนตู้',
        columns: [
          {
            title: 'เต็ม',
            field: 'single',
            align: 'right',
            bottomCalc: 'sum',
          },
          {
            title: 'บวก',
            field: 'mix',
            align: 'right',
            bottomCalc: 'sum',
          },
          {
            title: 'รวม',
            field: 'total',
            align: 'right',
            bottomCalc: 'sum',
          },
        ],
      },
      {
        title: 'Booked',
        field: 'booked',
        align: 'right',
        bottomCalc: 'sum',
        editor: 'number',
        validator: 'min:0',
        editorParams: { min: 0 },
      },
      {
        title: 'สรุป status',
        columns: [
          {
            title: 'No Action',
            field: 'noaction',
            align: 'right',
            bottomCalc: 'sum',
            editor: 'number',
            validator: 'min:0',
            editorParams: { min: 0 },
          },
          {
            title: 'Loading',
            field: 'loading',
            align: 'right',
            bottomCalc: 'sum',
            editor: 'number',
            validator: 'min:0',
            editorParams: { min: 0 },
          },
          {
            title: 'Completed',
            field: 'completed',
            align: 'right',
            bottomCalc: 'sum',
            editor: 'number',
            validator: 'min:0',
            editorParams: { min: 0 },
          },
          {
            title: '% completed',
            field: 'percent',
            align: 'left',
            bottomCalc: 'avg',
            bottomCalcFormatter: 'progress',
            bottomCalcFormatterParams: {
              color(val) {
                const hue = val / 100 * (120 - 0) + 0;
                return `hsl(${hue}, 100%, 50%)`;
              },
              legend(val) {
                return `${val}%`;
              },
            },
            formatter: 'progress',
            formatterParams: {
              color(val) {
                const hue = val / 100 * (120 - 0) + 0;
                return `hsl(${hue}, 100%, 50%)`;
              },
              legend(val) {
                return `${val}%`;
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
      },
    ],
    ajaxResponse(url, params, res) {
      const newRes = res.map((e) => {
        e.total = e.single + e.mix;
        // e.percent = e.completed / e.total * 100;
        e.percent = Math.random().toFixed(2) * 100;
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
      const { data } = cell.cell.row;
      console.log(cell);
      fetch('http://localhost:3000/update', {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(data),
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      })
        .then((res) => {
          if (res.status === 200) {
            Materialize.toast('Data has been updated.', 2000);
            // socket.emit('triggerUpdate', data);
            uuuu(data);
          } else {
            Materialize.toast('Unable to update table.', 2000);
          }
        })
        .catch(err => Materialize.toast('Unable to connect to server.', 4000));
    },
  });
  // $('#tableUpdate').tabulator('setData', doc);
};
