var $test = $('#test-container');
var $select = $test.find('select');

test("Create",function(){

  $select.multiselect();

  var $multi = $test.find('.ui-multiselect');

  ok( $select.hasClass("ui-helper-hidden") , "Added the ui hidden helper class to the select element." );
  ok( $multi.length == 1 , "Created the container with the class .ui-multiselect" );

  var $mainHeader = $multi.find("> .ui-widget-header");

  ok( $mainHeader.length == 1 , "Created the main header to show the selected" );
  ok( $mainHeader.text() == "2 selected of 4" , "Displaying the proper number of selected" );

  var $body = $multi.find(".ui-multiselect-body");
  var $headers = $body.find(".ui-widget-header");
  var $lists = $body.find("ul");

  ok( $body.length == 1 , "Created a body container to host the lists" );
  ok( $headers.length == 2  ,"Created two headers for the lists" );
  ok( $lists.length == 2 , "Created two lists to hold the items" );

  ok( $body.find('.ui-multiselect-selected .ui-multiselect-item').length == 2 , "Added 2 items to the selected list" );
  ok( $body.find('.ui-multiselect-choices .ui-multiselect-item').length == 2 , "Added 2 items to the choices list" );

  $select.multiselect('destroy');

  $multi.remove();

});

test("Destroy",function(){

  $select.multiselect();

  $select.multiselect('destroy');

  var $multi = $test.find('.ui-multiselect');

  ok( !$select.hasClass("ui-helper-hidden") , "Removed the ui hidden helper class to the select element." );
  ok( $multi.length == 0 , "Removed the container with the class .ui-multiselect" );

});

test("Events",function(){

  expect( 4 );

  $select.multiselect().on( "multiselectsort" , function(){
    ok( true , "Sort event fired" );
  }).on( "change" , function(){
    ok( true , "Native change event fired on select" );
    ok( $(this).find('option[selected=selected]').length == 3 , "Successfully updated the select element to reflect new changes" );
  });

  var $multi = $test.find('.ui-multiselect');

  // fire the sort with a method expect 1 event
  $select.multiselect('sort');

  // trigger a mouseup on a choices element and expect 3 events
  $multi.find('.ui-multiselect-choices .ui-multiselect-item:first').trigger('mouseup')

  $select.off( "multiselectsort change" );

  $select.multiselect('destroy');

});