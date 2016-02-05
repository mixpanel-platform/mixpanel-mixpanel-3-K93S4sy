/* global $ */
//var MixpanelChart = document.registerElement('mixpanel-chart', {
//    prototype: Object.create(HTMLElement.prototype, {
//        createdCallback: function() {
//            this.innerHTML = "<b>I'm an x-foo-with-markup!</b>";
//        },
//        attachedCallback: function() {
//            console.log('element attached');
//        },
//        attributeChangedCallback:  function(attrName, oldVal, newVal) {
//            console.log(attrName, oldVal, newVal);
//        }
//    })
//});
//
//const chart = document.createElement('mixpanel-chart');
//document.body.appendChild(chart);

var proto = Object.create(HTMLElement.prototype, {
    data: {
        set: function(data) {
            this._data = data
        },
        get: function() {
            return this._data;
        }
    }
});

proto.attachedCallback = function() {
    console.log('attached');
    console.log(this._data);
    if (this._data) {
        $(this).MPChart({chartType: 'line', data: this._data})
    } else {
        this.innerHTML = "<div>loading...</div>";
    }

};

proto.createdCallback = () => {
    console.log('created');
};

var Chart = document.registerElement('mixpanel-chart', {prototype: proto});

export default Chart;