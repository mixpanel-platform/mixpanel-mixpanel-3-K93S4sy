import Cycle from '@cycle/core'; 
import {div, button, input, ul, li, a, makeDOMDriver} from '@cycle/dom';
import {makeHTTPDriver} from '@cycle/http';
import {Observable} from 'rx'
import '../less/index.less'

function intent(sources) {
    const interval$ = sources.DOM.select('.interval-input').events('change').map(evt => evt.target.value);
    return interval$;
}

function model(interval$) {
    return interval$.map(interval => {
        return {interval}
    })
}

function view(state$) {
    return state$.startWith({interval: 1})
        .map(state => {
            return div([
                div('.top', [
                    ul('.nav .nav-tabs', [
                        li('.active', [
                            a({href: '#'}, 'General'),
                        ]),
                        li([
                            a({href: '#'}, 'Core'),
                        ]),
                        li([
                            a({href: '#'}, 'People'),
                        ]),
                    ]),
                    div('Select')
                ]),
                input('.interval-input', {type: 'text', value: state.interval}),
                div([state.interval]),
            ])
        });
}

function main(sources) {
    return {
        DOM: view(model(intent(sources)))
    }
}

Cycle.run(main, {
  DOM: makeDOMDriver('#app'),
});


function Chart({DOM, props$}) {

    return {
        DOM: props$.map(props => div(props.title)),
        props$: () => Observable.just({title: "Testing"})
    }

}

/*
import '../less/index.less'
import $ from 'jquery'

$(document).ready(function() {
  $('.unit-select').MPSelect({
    items: [
      {label: 'Day(s)', value: 'day'},
      {label: 'Week(s)', value: 'week'},
      {label: 'Month(s)', value: 'month'}
    ]
  })
    .val('month')
    .on('change', runQuery);
    
  $('.intervals-input').on('change', runQuery);
  
  $('.plan-changes .query-type-select').MPSelect({
    items: [
      {label: 'count', value: 'count'},
      {label: '$ amount', value: 'value'},
    ]
  })
    .on('change', runQuery);
    
  $('.charts .chart .body').MPChart({chartType: 'line'})
  runQuery();
});

var runQuery = function() {
  
  var unit = $('.unit-select').val();
  var intervals = $('.intervals-input').val();
  var startDate = moment().subtract(intervals, unit);
  var endDate = moment();
  var globalParams = {
    unit: unit,
    from: startDate,
    to: endDate
  }
  
  // signups query
  MP.api.segment('$signup', Object.assign({where: 'not "@mixpanel.com" in user["$email"]'}, globalParams))
    .done(results => {
      $('.chart.new-users .body').MPChart('setData', results);
    });

  // active users query
  MP.api.segment('Viewed report', Object.assign({
    type: 'unique', 
    where: 'user["Current tally"] > 500'
  }, globalParams))
    .done(results => {
      $('.chart.active-users .body').MPChart('setData', results);
    });
    
  // account changes (new, upsells, downgrades, churns)
  $.ajax({
    type: 'get',
    url: 'https://josh.dev.mixpanel.org/admin/internal/api/plan_changes',
    data: {
      unit: unit,
      from: startDate.format('YYYY-MM-DD'),
      to: endDate.format('YYYY-MM-DD')
    },
    xhrFields: {
      withCredentials: true
    }
  })
    .done(results => {
      $('.chart.plan-changes-count .body').MPChart('setData', results.counts);
      $('.chart.plan-changes-value .body').MPChart('setData', results.values);
    });
    
  // integrations
  MP.api.query('/api/2.0/engage/analytics', {
    x_segment: 'first integration date',
    x_type: 'datetime',
    from_date: startDate.format('YYYY-MM-DD'),
    to_date: endDate.format('YYYY-MM-DD'),
    x_unit: unit,
    where: 'properties["Current tally"] > 0'
  })
    .done(resp => { 
      data = {};
      resp.results.forEach((segmentsAndCounts, date) => {
          segmentsAndCounts.forEach((count, seg) => {
          data[seg] = data[seg] || {};
          data[seg][date] = count;
        })
      })
      $('.chart.integrations .body').MPChart('setData', data);
    });
};
*/
