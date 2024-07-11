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
            this.$el.css('min-height','500px')
            this.$el.addClass('cc-card-view-main')
            this.$el.css('overflow-y','auto')
            this.$el.parents('.ui-resizable').css('min-height','500px')
            this.url_domain = 'https://tutorlim.teachworks.com'
            // //// console.log(this.$el)

            this.options = {
                theme: vizUtils.getCurrentTheme(),
            }

            this.statusColors = {
                'Attended': 'green',
                'Deleted': 'red',
                'Cancelled': 'orange',
                'Missed': 'purple',
                'Scheduled': 'yellow',
                default: 'gray'
            }
            
            // Initialization logic goes here
        },

        // Optionally implement to format data returned from search. 
        // The returned object will be p`assed to updateView as 'data'
        formatData: function(data) {
            console.log(data)
            // Format data 

            const newData = data.rows.map((r)=>{
                let row = {}
                r.forEach((value,i)=>{
                    row[data.fields[i].name]=value
                })
                return row
            })

            
            return newData
        },
  
        // Implement updateView to render a visualization.
        //  'data' will be the data object returned from formatData or from the search
        //  'config' will be the configuration property object
        updateView: function(data, config) {
            console.log(data)
            // Draw something here
            const self = this
            let vizHTML =  data.map(d=>self.template(d))
            
            self.$el.html(`<div class="viz-card-view-main">${vizHTML}</div>`)


            self.$el.closest('.ui-resizable').css('height','unset')

            // handlers 
            // const self = this
            // this.$el.on('click','.cc-single-value-item',function(e){

            //     self.drilldown({
            //         'action': SplunkVisualizationBase.FIELD_VALUE_DRILLDOWN,
            //         'data':{
            //             'label':data.label,
            //             'value':data.value,
            //             'value2':data.label,
            //             'perc': data.diff
            //         }
            //     }, e);
            // })

        },

        // Search data params
        getInitialDataParams: function() {
            return ({
                outputMode: SplunkVisualizationBase.ROW_MAJOR_OUTPUT_MODE,
                count: 0
            });
        },

        // Override to respond to re-sizing events
        reflow: function() {

        },

        template(data){
            return `<div class="viz-card-view-item">
            <div class="viz-card-view-section">
              <div class="viz-card-lesson-details">
                <h4 class="inter-bold">${data.lesson_name}</h4>
                <span class="viz-card-lesson-id">
                  <a href="${this.url_domain}/event_instances/${data.lesson_id}" target="_blank">${data.lesson_id} <i class="icon icon-external"></i></a>
                </span>
              </div>
              <div>Tutoring For ${data.student_name}</div>
              <div class="viz-card-lesson-status">
                <div class="viz-card-less-status-item">
                  Status
                  <span style="color: ${this.statusColors.hasOwnProperty(data.status) ? this.statusColors[data.status] : this.statusColors.default }">
                    ${data.status}</span
                  >
                </div>
                <div class="viz-card-less-status-item">
                  Duration
                  <span style="color: #000; ">
                    <svg style="margin-bottom: -2px;"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M7 1.75C4.1005 1.75 1.75 4.1005 1.75 7C1.75 9.89949 4.1005 12.25 7 12.25C9.89949 12.25 12.25 9.89949 12.25 7C12.25 4.1005 9.89949 1.75 7 1.75ZM7.40385 3.76923C7.40385 3.54619 7.22304 3.36538 7 3.36538C6.77696 3.36538 6.59615 3.54619 6.59615 3.76923V7C6.59615 7.22304 6.77696 7.40385 7 7.40385H9.42308C9.64611 7.40385 9.82692 7.22304 9.82692 7C9.82692 6.77696 9.64611 6.59615 9.42308 6.59615H7.40385V3.76923Z"
                        fill="#AEB5C1"
                      />
                    </svg>
    
                    ${parseInt(data.duration) > 1 ? `${data.duration} Hours` : `${data.duration} Hour` }</span
                  >
                </div>
              </div>
            </div>
            <div class="viz-card-view-section">
              <div class="viz-card-profile-main">
                <div class="viz-card-profile-item">
                  <div class="viz-card-profile-labelheader">
                    <p>Student</p>
                    <div class="inter-bold viz-card-profile-name">${data.student_name}</div>
                  </div>
                  <div class="viz-card-profile-avatar" style="background-image: url('${ data.student_image ? data.student_image : '/static/app/myViz360/img/profile_placeholder.jpg'}')">
                    
                  </div>
                </div>
                <div class="viz-card-profile-item">
                  <div class="viz-card-profile-labelheader">
                    <p>Teacher</p>
                    <div class="inter-bold viz-card-profile-name">${data.employee_name}</div>
                  </div>
                  <div class="viz-card-profile-avatar" style="background-image: url('${ data.employee_image ? data.employee_image : '/static/app/myViz360/img/profile_placeholder.jpg'}')">
                    
                  </div>
                </div>
              </div>
            </div>
            <div class="viz-card-view-section">
              <span class="inter-bold">Created</span> ${data.created_at}
              <svg
                width="6"
                height="6"
                viewBox="0 0 6 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style="margin: 0 10px 5px 10px"
              >
                <circle cx="3" cy="3" r="3" fill="#C5CAD3" />
              </svg>
              <span class="inter-bold">Updated</span> ${data.updated_at}
            </div>
          </div>`
        }
    });
});