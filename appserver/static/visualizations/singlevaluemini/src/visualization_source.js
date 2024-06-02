/*
 * Visualization source
 */

define([
            'jquery',
            'underscore',
            'api/SplunkVisualizationBase',
            'api/SplunkVisualizationUtils'
            // Add required assets to this list
        ],
        function(
            $,
            _,
            SplunkVisualizationBase,
            vizUtils
        ) {
  
    // Extend from SplunkVisualizationBase
    return SplunkVisualizationBase.extend({
  
        initialize: function() {
            SplunkVisualizationBase.prototype.initialize.apply(this, arguments);
            this.$el = $(this.el);
            this.$el.css('min-height','150px')
            this.$el.addClass('cc-single-value-mini-main')
            // //console.log(this.$el)

            this.options = {
                theme: vizUtils.getCurrentTheme(),
            }
            // Initialization logic goes here
        },

        // Optionally implement to format data returned from search. 
        // The returned object will be p`assed to updateView as 'data'
        formatData: function(data) {
            console.log(data)
            // Format data 
            
            return data
        },
  
        // Implement updateView to render a visualization.
        //  'data' will be the data object returned from formatData or from the search
        //  'config' will be the configuration property object
        updateView: function(data, config) {
            //console.log(data)
            // Draw something here
            
            this.$el.html('')

            this.style ={
                upcolor: config[this.getPropertyNamespaceInfo().propertyNamespace + 'upcolor'] || 'green',
                downcolor: config[this.getPropertyNamespaceInfo().propertyNamespace + 'downcolor'] || 'red',
            }

            let items =  ``
            data.rows.forEach(element => {
              items+=`<div class="cc-mini-sv-item" data-label="${element[0]}" data-value="${element[1]}">
              <div class="cc-mini-sv-item-label">${element[0]}</div>
              <span>|</span>
              <div class="cc-mini-sv-item-value ${element[2]} ${element[2] == 'up' ? this.style.upcolor : ( element[2] == 'down' ? this.style.downcolor : '')}">${element[1]} <i class="icon icon-arrow-right"/>
              </div>
            </div>`
            });

            this.$el.append(`<div class="cc-mini-sv">
            ${items}
          </div>`)


          const self = this
          this.$el.on('click','.cc-mini-sv-item',function(e){
            console.log(data)
            const label = $(this).data('label')
            const value = $(this).data('value')
            self.drilldown({
                'action': SplunkVisualizationBase.FIELD_VALUE_DRILLDOWN,
                'data':{
                    'label':label,
                    'value':value,
                    'value2':label
                }
            }, e);
          })

        },

        // Search data params
        getInitialDataParams: function() {
            return ({
                outputMode: SplunkVisualizationBase.ROW_MAJOR_OUTPUT_MODE,
                count: 10000
            });
        },

        // Override to respond to re-sizing events
        reflow: function() {}
    });
});