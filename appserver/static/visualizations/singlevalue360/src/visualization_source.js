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
            this.$el.addClass('cc-single-value-main')
            // //// console.log(this.$el)

            this.options = {
                theme: vizUtils.getCurrentTheme(),
            }
            
            // Initialization logic goes here
        },

        // Optionally implement to format data returned from search. 
        // The returned object will be p`assed to updateView as 'data'
        formatData: function(data) {
            // console.log(data)
            // Format data 
            if(data.rows.length > 0){
               
                const val = data.rows[data.rows.length - 1][1]
                const comp = data.rows.length > 1 ? data.rows[data.rows.length - 2][1] : null;
                const diff = val - comp
                const trend = diff!=null ? diff > 0 ? "up" : (diff == 0 ? "side" : "down") : null ;


                //// console.log(data)

                return {
                    label: data.fields[1].name,
                    value: val,
                    diff: diff,
                    trend: trend,
                    fields: data.fields,
                    rows: data.rows
                }; 
            }
            else{
                return {}
            }
        },
  
        // Implement updateView to render a visualization.
        //  'data' will be the data object returned from formatData or from the search
        //  'config' will be the configuration property object
        updateView: function(data, config) {
            // console.log()
            // Draw something here
            
            this.style = {
                grouping: config[this.getPropertyNamespaceInfo().propertyNamespace + 'grouping'] || true,
                groupPosition: config[this.getPropertyNamespaceInfo().propertyNamespace + 'groupPosition'] || 'middle',
                upcolor: config[this.getPropertyNamespaceInfo().propertyNamespace + 'upcolor'] || 'green',
                downcolor: config[this.getPropertyNamespaceInfo().propertyNamespace + 'downcolor'] || 'red',
                fontColor: vizUtils.getCurrentTheme() == 'dark' ? 'color: var(--darkfont);' : ''
            }

            let margin1 = this.style.groupPosition == 'start' ? 'margin-left: 10px;border-top-left-radius: 10px; border-bottom-left-radius: 10px;' : (this.style.groupPosition == 'end' ? 'margin-right: 10px; border-top-right-radius: 10px; border-bottom-right-radius: 10px;' : '')
            let margin2 = this.style.groupPosition == 'start' ? 'margin-left: 10px;' : (this.style.groupPosition == 'end' ? 'margin-right: 10px;margin-left: 10px;' : 'margin-left: 10px;')
            // if(margin == false)



            if(data != {}){
                this.$el.html('')

                const trend = data.diff!=null ? `<div class="cc-single-value-item-icon ${data.trend} ${data.trend == 'up' ? this.style.upcolor : ( data.trend == 'down' ? this.style.downcolor : '')}">${data.diff} <i class="icon icon-arrow-right"></i></div>` : '';
                
                this.$el.append(`<div class="cc-single-value"  style="${margin1};${'color: var(--darkfont);'}">
                    <div class="cc-single-value-item" style="${margin2}">
                    <span class="cc-single-value-item-title">${data.label}</span>
                    ${trend}
                    <h2 class="cc-single-value-item-value" style="${'color: var(--darkfont);'}">${data.value} <i class="icon icon-info-circle" style="display: none;"></i></h2>
                    </div>
                </div>`)
            }
            else{
                this.$el.html('')
                this.$el.append(`<div class="cc-single-value"  style="${margin1}">
                    <p style="text-align: center; padding: 9px 0 9px 0;">No results found.</p>
                </div>`)
            }


            // this.$el
            // .css('padding','10px')

            //// console.log(this.style.grouping)
            if(this.style.grouping != 'true' || !this.style.grouping){
                this.style.grouping = false
            }
            else{
                this.style.grouping = true
            }
            if(this.style.grouping){
                this.$el.closest('.dashboard-panel').css('display','flex')
                this.$el.closest('.panel-element-row').css('flex',1)
            }

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