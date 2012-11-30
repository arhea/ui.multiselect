/*! jQuery UI Multiselect Widget - v0.1.0 - 2012-11-30
* https://github.com/arhea/multiselect
* Copyright (c) 2012 Alex Rhea; Licensed MIT */

(function($){

$.widget("ui.multiselect",{

	elements: {},

	options: {
		sort: function(a,b) {
			return $(a).text().toLowerCase().localeCompare($(b).text().toLowerCase());
		}
	},

	_create: function() {

		// generate the elements and add them to the context
		$.extend(this.elements, generateHtmlComponents());

		this.elements.header.text("0 selected of 95");

		// insert the container after the element
		this.elements.container.insertAfter( this.element );

		// hide the select dropdown box
		this.element.addClass("ui-helper-hidden");

		this._on(this.elements.container,{
			"mouseover .ui-multiselect-item": this._onItemMouseover,
			"mouseout .ui-multiselect-item": this._onItemMouseout,
			"mousedown .ui-multiselect-item": this._onItemMousedown,
			"touchstart .ui-multiselect-item": this._onItemMousedown,
			"mouseup .ui-multiselect-item": this._onItemMouseup,
			"touchend .ui-multiselect-item": this._onItemMouseup
		});

		this._updateLists();

	},

	_onItemMouseover: function(event) {
		$(event.currentTarget).addClass("ui-state-hover");
	},

	_onItemMouseout: function(event) {
		$(event.currentTarget).removeClass("ui-state-hover ui-state-active");
	},

	_onItemMousedown: function(event) {
		$(event.currentTarget).removeClass("ui-state-hover").addClass("ui-state-active");
	},

	_onItemMouseup: function(event) {

		event.preventDefault();

		var $this = $(event.currentTarget);

		$this.removeClass("ui-state-hover ui-state-active");
		$this.find('.ui-icon').toggleClass("ui-icon-plus ui-icon-minus");

		if( $this.parent().hasClass("ui-multiselect-selected") ) {
			this.elements.choicesList.append($this);
		} else {
			this.elements.selectedList.append($this);
		}

		this._updateCount();
		this._setValues();
		this.sort();

	},

	_setValues: function() {

		var options = this.element.find('option').removeAttr("selected");

		this.elements.selectedList.find('.ui-multiselect-item').each(function(){
			var $item = $(this);
			options.filter("[value="+ $item.data("value") +"]").attr("selected","selected");
		});

		this.element.trigger("change");

	},

	_updateCount: function() {

		var selectedCount = this.elements.selectedList.find('.ui-multiselect-item').length;
		var choicesCount = this.elements.choicesList.find('.ui-multiselect-item').length;

		this.elements.header.text( selectedCount + " selected of " + (selectedCount+choicesCount) );

	},

	_updateLists: function() {

		// get all the options in the original element
		var options = this.element.find('option');

		// store a reference to the selected list
		var selectedList = this.elements.selectedList;

		// store a reference to the choices list
		var choicesList = this.elements.choicesList;

		// loop through all of the options and sort them
		options.each(function(){

			// create a list item from the option
			var item = createListItem(this,this.selected);

			// check if selected to decide what list it goes in
			if(this.selected) {
				// append the item to the selected list
				selectedList.append(item);
			} else {
				choicesList.append(item);
			}

		});

		this._updateCount();
		this.sort();

	},

	_destory: function() {
		this.element.removeClass("ui-helper-hidden");
		this._off(this.elements.container);
		this.container.remove();
	},

	_setOption: function(key,value) {
		this._superApply("_setOption",key,value);
		this.refresh();
	},

	_setOptions: function(options) {
		this._superApply("_setOptions",options);
		this.refresh();
	},

	refresh: function() {
		this._setValues();
		this._updateLists();
	},

	sort: function() {

		var selected = this.elements.selectedList.find(".ui-multiselect-item").detach();
		selected.sort(this.options.sort);
		this.elements.selectedList.append(selected);

		var choices = this.elements.choicesList.find(".ui-multiselect-item").detach();
		choices.sort(this.options.sort);
		this.elements.choicesList.append(choices);

	}

});

function generateHtmlComponents() {

	var container = $(document.createElement("div"));
	container.addClass("ui-multiselect ui-widget ui-helper-reset");

	var header = $(document.createElement("div"));
	header.addClass("ui-widget-header ui-helper-reset ui-state-default");

	var content = $(document.createElement("div"));
	content.addClass("ui-multiselect-body ui-widget-content ui-helper-reset ui-state-default");

	var selectedList = $(document.createElement("ul"));
	selectedList.addClass("ui-helper-reset ui-state-default");

	var choicesList = selectedList.clone().addClass("ui-multiselect-choices");
	selectedList.addClass("ui-multiselect-selected");

	content.append('<div class="ui-multiselect-selected-header ui-widget-header ui-helper-reset">Selected</div>');
	content.append('<div class="ui-multiselect-choices-header ui-widget-header ui-helper-reset">Available</div>');

	content.append(selectedList,choicesList);

	container.append(header,content);

	return {
		container: container,
		header: header,
		selectedHeader: content.find('.ui-multiselect-selected-header'),
		choicesHeader: content.find('.ui-multiselect-choices-header'),
		selectedList: selectedList,
		choicesList: choicesList,
		content: content
	};

}

function createListItem(option,selected) {
	var icon = selected ? "ui-icon-minus" : "ui-icon-plus";
	var element = $(document.createElement("li"));
	element.addClass("ui-state-default ui-multiselect-item");
	element.data("value",option.value);
	element.html('<span class="ui-icon '+ icon +'"></span>' + option.innerHTML);
	return element;
}

}(jQuery));