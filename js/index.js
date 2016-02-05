import Cycle from '@cycle/core'; 
import {div, button, input, ul, li, a,p, h, makeDOMDriver} from '@cycle/dom';
import {makeHTTPDriver} from '@cycle/http';
import {Observable} from 'rx'
import '../less/index.less'

import './webComponents/mixpanel-chart'

const PLAN_CHANGES_URL = 'http://josh.dev.mixpanel.org/admin/internal/api/plan_changes?unit=day&from=2015-01-01&to=2016-01-01';


function intent(sources) {
    const interval$ = sources.DOM.select('.interval-input').events('change').map(evt => evt.target.value);
    const planChanges$ = sources.HTTP
        .filter(res$ => res$.request.url.indexOf(PLAN_CHANGES_URL) === 0)
        .mergeAll()
        .map(res => JSON.parse(res.body));
    return {interval$, planChanges$};
}

function model({interval$, planChanges$}) {
    return Observable.combineLatest(interval$, planChanges$, (interval, planChanges) => {
        return {interval, planChanges}
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
                    div('.controls', [
                        input('.intervals-input', {type: 'text', value: 24}),
                        div('.unit-select')
                    ]),
                ]),
                div('.charts', [
                    div('.chart .new-users', [
                        div('.header', [
                            div('.title', 'New signups'),
                            div('.help-tip', [
                                p('.tooltip', 'The number of "$signup" events excluding users with "@mixpanel.com" email addresses')
                            ])
                        ]),
                        div('.body', [
                            h('mixpanel-chart', {data: state.planChanges})
                        ])
                    ])
                ])
            ])
        })
}

function main(sources) {

    const planChanges$ = Observable.interval(1).take(1).map(() => {
        return {
            url: PLAN_CHANGES_URL,
            method: 'GET',
            withCredentials: true
        };
    });

    const dom = view(model(intent(sources)));

    return {
        DOM: dom,
        HTTP: planChanges$
    }
}



Cycle.run(main, {
    DOM: makeDOMDriver('#app'),
    HTTP: makeHTTPDriver()
});


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
