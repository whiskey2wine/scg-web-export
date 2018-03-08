import 'jquery-ui';
import 'jquery.tabulator';

// $('body').html('test');
const data = require('../db.json');

console.log(data);

$('#tableUpdate').tabulator({
  movableRows: true,
  movableColumns: true,
  height: 400, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
  layout: 'fitColumns', // fit columns to width of table (optional)
  columnVertAlign: 'middle',
  columns: [
    // Define Table Columns
    { title: 'PINo', field: 'PINo' },
    { title: 'Shipping', field: 'shipping', align: 'right' },
    {
      title: 'จำนวนตู้',
      columns: [{ title: 'เต็ม' }, { title: 'บวก' }, { title: 'รวม' }],
    },
    {
      title: 'จองคิว (Booked)',
      field: 'booked',
      editor: 'number',
      editorParams: { min: 0 },
    },
    {
      title: 'สรุป status',
      columns: [
        {
          title: 'No Action',
          field: 'noaction',
          editor: 'number',
          editorParams: { min: 0 },
        },
        {
          title: 'Loading',
          field: 'loading',
          editor: 'number',
          editorParams: { min: 0 },
        },
        {
          title: 'Completed',
          field: 'completed',
          editor: 'number',
          editorParams: { min: 0 },
        },
        {
          title: '% completed',
          field: 'percent',
        },
      ],
    },
    { title: 'สถานะตู้<br/> Remarks อื่นๆ', field: 'comment', editor: 'textarea' },
  ],
});

// load sample data into the table
$('#tableUpdate').tabulator('setData', data);
