(function($){

/**
* jQuery UI Multiselect Widget
*
* Converts html multiselect select menus into easy to use
* side by side lists and translates that back to the original
* list maintaining change events
*
* @class multiselect
* @namespace ui
* @extends jQuery.Widget
*/
$.widget("ui.multiselect",{

	/**
	* The default options for the plugin
	*
	* @property options
	* @type {Object}
	* @default {}
	*/
	options: {
		sort: function(a,b) {
			return $(a).text().toLowerCase().localeCompare($(b).text().toLowerCase());
		}
	},

	/**
	* Stores all the references to the elements
	*
	* @property elements
	* @type {Object}
	* @default {}
	*/
	elements: {},

	/**
	* The create function. Initializes the plugin and creates
	* all the sub DOM nodes
	*
	* @method _create
	*/
	_create: function() {

		// generate the elements and add them to the context
		$.extend(this.elements, generateHtmlComponents());

		this.elements.header.text("0 selected of 95");

		// insert the container after the element
		this.elements.container.insertAfter( this.element )
			.attr({
				"role": "select"
			});

		// hide the select dropdown box
		this.element.addClass("ui-helper-hidden").attr({
			"aria-hidden": "true",
			"aria-multiselectable": "true"
		});

		this._on(this.elements.container,{
			"mouseover .ui-multiselect-item": this._onItemMouseover,
			"mouseout .ui-multiselect-item": this._onItemMouseout,
			"mousedown .ui-multiselect-item": this._onItemMousedown,
			"touchstart .ui-multiselect-item": this._onItemMousedown,
			"mouseup .ui-multiselect-item": this._onItemMouseup,
			"touchend .ui-multiselect-item": this._onItemMouseup
		});

		// populate the lists
		this._updateLists();

	},

	/**
	* Adds the ui-state-hover class to an item on mouseover
	*
	* @method _onItemMouseover
	* @private
	*/
	_onItemMouseover: function(event) {
		$(event.currentTarget).addClass("ui-state-hover");
	},

	/**
	* Removes state classes from the item on mouseout
	*
	* @method _onItemMouseout
	* @private
	*/
	_onItemMouseout: function(event) {
		$(event.currentTarget).removeClass("ui-state-hover ui-state-active");
	},

	/**
	* Removes ui-state-hover and adds the active class to a element
	* with the mouse down
	*
	* @method _onItemMousedown
	* @private
	*/
	_onItemMousedown: function(event) {
		$(event.currentTarget).removeClass("ui-state-hover").addClass("ui-state-active");
	},

	/**
	* On mouse up it moves the element from one list to another
	*
	* @method _onItemMouseup
	* @private
	*/
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
		this._updateSelect();
		this.sort();

	},

	/**
	* Transfers the values from the widget to the select menu and triggers
	* a change event on the select menu
	*
	* @method _updateSelect
	* @event change
	* @event input
	* @private
	*/
	_updateSelect: function() {

		var options = this.element.find('option').removeAttr("selected");

		this.elements.selectedList.find('.ui-multiselect-item').each(function(){
			var $item = $(this);
			options.filter("[value="+ $item.data("value") +"]").attr("selected","selected");
		});

		this.element.trigger("change").trigger("input");

	},

	/**
	* Updates the count at the top bar
	*
	* @method _updateCount
	* @private
	*/
	_updateCount: function() {

		var selectedCount = this.elements.selectedList.find('.ui-multiselect-item').length;
		var choicesCount = this.elements.choicesList.find('.ui-multiselect-item').length;

		this.elements.header.text( selectedCount + " selected of " + (selectedCount+choicesCount) );

	},

	/**
	* Populates the lists based on their state
	*
	* @method _updateLists
	* @private
	*/
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

	/**
	* Removes all of the widgets elements
	*
	* @method _destroy
	* @private
	*/
	_destroy: function() {
		this.element.removeClass("ui-helper-hidden")
			.removeAttr("aria-hidden")
			.removeAttr("aria-multiselectable");
		this._off(this.elements.container);
		this.elements.container.remove();
	},

	/**
	* Set an option on the widget then refresh to reflect
	* the change
	*
	* @method _setOption
	* @private
	*/
	_setOption: function(key,value) {
		this._super(key,value);
		this.refresh();
	},

	/**
	* Set multiple options then refresh
	*
	* @method _setOptions
	* @private
	*/
	_setOptions: function(options) {
		this._super(options);
		this.refresh();
	},

	/**
	* Refresh the widgets state and sync with the select menu
	*
	* @method refresh
	*/
	refresh: function() {
		this._updateSelect();
		this._updateLists();
		this._trigger("refresh",this.elements);
	},

	/**
	* Sort the two lists based on the passed sort function
	*
	* @method sort
	*/
	sort: function() {

		var selected = this.elements.selectedList.find(".ui-multiselect-item").detach();
		selected.sort(this.options.sort);
		this.elements.selectedList.append(selected);

		var choices = this.elements.choicesList.find(".ui-multiselect-item").detach();
		choices.sort(this.options.sort);
		this.elements.choicesList.append(choices);

		this._trigger("sort",this.elements);

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

	content.append('<div class="ui-multiselect-selected-header ui-widget-header ui-helper-reset" role="header">Selected</div>');
	content.append('<div class="ui-multiselect-choices-header ui-widget-header ui-helper-reset" role="header">Available</div>');

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
	element.addClass("ui-state-default ui-multiselect-item")
		.attr({
			"aria-selected": selected.toString(),
			"role": "listitem"
		})
		.data("value",option.value)
		.html('<span class="ui-icon '+ icon +'"></span>' + option.innerHTML);
	return element;
}

}(jQuery));