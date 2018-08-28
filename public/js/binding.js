Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.panel.*',
    'Ext.layout.container.Border'
]);

  Ext.define('Book',{
        extend: 'Ext.data.Model',
        fields: [
            // set up the fields mapping into the xml doc
            // The first needs mapping, the others are very basic
            {name: 'Author', type: 'string'},
            {name: 'Title', type: 'string'},
            {name: 'Manufacturer', type: 'string'},
            {name: 'ProductGroup', type: 'string'},
            {name: 'DetailPageURL', type: 'string'}
        ]
    });

var data=[
 {Author: 'Namqv', Title: 'Cốm thúi', Manufacturer: 'Sách', ProductGroup: 'Sách trẻ', DetailPageURL: '.'},
 {Author: 'Namq1', Title: 'Cốm thúi', Manufacturer: 'Sách', ProductGroup: 'Sách trẻ', DetailPageURL: '.'}, {Author: 'Namq2', Title: 'Cốm thúi', Manufacturer: 'Sách', ProductGroup: 'Sách trẻ', DetailPageURL: '.'}, {Author: 'Namq3', Title: 'Cốm thúi', Manufacturer: 'Sách', ProductGroup: 'Sách trẻ', DetailPageURL: '.'}, {Author: 'Namq4', Title: 'Cốm thúi', Manufacturer: 'Sách', ProductGroup: 'Sách trẻ', DetailPageURL: '.'}, {Author: 'Namq5', Title: 'Cốm thúi', Manufacturer: 'Sách', ProductGroup: 'Sách trẻ', DetailPageURL: '.'}
];
Ext.onReady(function(){
  
	
   var store = Ext.create('Ext.data.Store', {
        model: 'Book',
        data: data,
        sorters: {property: 'Author', direction: 'ASC'}
    });
    // create the Data Store
    

    // create the grid
    var grid = Ext.create('Ext.grid.Panel', {
        bufferedRenderer: false,
        store: store,
        columns: [
            {text: "Author  dfdfd", width: 120, dataIndex: 'Author', sortable: true},
            {text: "Title", flex: 1, dataIndex: 'Title', sortable: true},
            {text: "Manufacturer", width: 125, dataIndex: 'Manufacturer', sortable: true},
            {text: "Product Group", width: 125, dataIndex: 'ProductGroup', sortable: true}
        ],
        forceFit: true,
        height:210,
        split: true,
        region: 'north'
    });
        
    // define a template to use for the detail view
    var bookTplMarkup = [
        'Title: <a href="{DetailPageURL}" target="_blank">{Title}</a><br/>',
        'Author: {Author}<br/>',
        'Manufacturer: {Manufacturer}<br/>',
        'Product Group: {ProductGroup}<br/>'
    ];
    var bookTpl = Ext.create('Ext.Template', bookTplMarkup);

    Ext.create('Ext.Panel', {
        renderTo: 'dvGirdMember',
        frame: true,
        title: 'Book List',      
        height: 400,
        layout: 'border',
        items: [
            grid, {
                id: 'detailPanel',
                region: 'center',
                bodyPadding: 7,
                bodyStyle: "background: #ffffff;",
                html: 'Please select a book to see additional details.'
        }]
    });
    
    // update panel body on selection change
    grid.getSelectionModel().on('selectionchange', function(sm, selectedRecord) {
        if (selectedRecord.length) {
            var detailPanel = Ext.getCmp('detailPanel');
            detailPanel.update(bookTpl.apply(selectedRecord[0].data));
        }
    });

    store.load();
});