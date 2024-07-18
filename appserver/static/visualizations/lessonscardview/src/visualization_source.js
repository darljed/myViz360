/*
 * Visualization source
 */

define([
            'jquery',
            'underscore',
            'api/SplunkVisualizationBase',
            'api/SplunkVisualizationUtils',
            "splunkjs/mvc/dropdownview",
            "splunkjs/mvc/searchmanager"
            // Add required assets to this list
        ],
        function(
            $,
            _,
            SplunkVisualizationBase,
            vizUtils,
            DropdownView,
            SearchManager
        ) {
  
    // Extend from SplunkVisualizationBase
    return SplunkVisualizationBase.extend({
  
        initialize: function(a,b) {
            SplunkVisualizationBase.prototype.initialize.apply(this, arguments);
            this.$el = $(this.el);
            this.$el.css('min-height','500px')
            this.$el.addClass('cc-card-view-main')
            this.$el.css('overflow-y','auto')
            this.$el.parents('.ui-resizable').css('min-height','500px')
            this.url_domain = 'https://tutorlim.teachworks.com'
            this.id = this.generateUniqueId()
            this.status_input_id = this.id + '_status'
            console.log(this.$el,this._config,this)
            this.updateTimes = 0
            // //// console.log(this.$el)

            this.options = {
                theme: vizUtils.getCurrentTheme(),
            }

            this.statusColors = {
                'Attended': '#1F7C52',
                'Deleted': '#666D80',
                'Cancelled': '#D7482B',
                'Missed': '#CB7814',
                'Scheduled': '#494AE2',
                default: '#666D80'
            }

            this.statusIcons = {
              attended:`<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M0.5 8C0.5 3.85786 3.85786 0.5 8 0.5C12.1421 0.5 15.5 3.85786 15.5 8C15.5 12.1421 12.1421 15.5 8 15.5C3.85786 15.5 0.5 12.1421 0.5 8ZM10.7772 6.60456C10.9624 6.34528 10.9023 5.98497 10.643 5.79977C10.3837 5.61457 10.0234 5.67462 9.83823 5.9339L7.34946 9.41818L6.10025 8.16898C5.87495 7.94367 5.50966 7.94367 5.28436 8.16898C5.05906 8.39428 5.05906 8.75957 5.28436 8.98487L7.01513 10.7156C7.13505 10.8356 7.30165 10.8966 7.47066 10.8827C7.63967 10.8687 7.79397 10.781 7.89254 10.643L10.7772 6.60456Z" fill="#1F7C52"/>
              </svg>
              `,
              cancelled : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M8 0.5C3.85786 0.5 0.5 3.85786 0.5 8C0.5 12.1421 3.85786 15.5 8 15.5C12.1421 15.5 15.5 12.1421 15.5 8C15.5 3.85786 12.1421 0.5 8 0.5ZM6.67718 5.86128C6.45187 5.63598 6.08659 5.63598 5.86128 5.86128C5.63598 6.08659 5.63598 6.45187 5.86128 6.67718L7.18411 8L5.86128 9.32282C5.63598 9.54813 5.63598 9.91341 5.86128 10.1387C6.08659 10.364 6.45187 10.364 6.67718 10.1387L8 8.81589L9.32282 10.1387C9.54813 10.364 9.91341 10.364 10.1387 10.1387C10.364 9.91341 10.364 9.54813 10.1387 9.32282L8.81589 8L10.1387 6.67718C10.364 6.45187 10.364 6.08659 10.1387 5.86128C9.91341 5.63598 9.54813 5.63598 9.32282 5.86128L8 7.18411L6.67718 5.86128Z" fill="#D7482B"/>
              </svg>
              `,
              deleted: `<svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M10.4375 3.25423V3.42747C11.1667 3.49423 11.89 3.58203 12.6066 3.69025C12.8719 3.73032 13.1363 3.77319 13.3998 3.81882C13.7115 3.87283 13.9205 4.16935 13.8665 4.48111C13.8125 4.79288 13.516 5.00184 13.2042 4.94783C13.151 4.93862 13.0978 4.92953 13.0446 4.92055L12.2766 14.9049C12.1847 16.0988 11.1891 17.0208 9.99168 17.0208H4.00832C2.81086 17.0208 1.81528 16.0988 1.72344 14.9049L0.955416 4.92055C0.902167 4.92953 0.848957 4.93862 0.795787 4.94783C0.484021 5.00184 0.187505 4.79288 0.1335 4.48111C0.0794954 4.16935 0.288452 3.87283 0.600218 3.81882C0.863678 3.77319 1.12808 3.73032 1.3934 3.69025C2.11 3.58203 2.83325 3.49423 3.56255 3.42747V3.25423C3.56255 2.05916 4.48877 1.03897 5.7132 0.999802C6.14047 0.986134 6.56944 0.979248 7 0.979248C7.43056 0.979248 7.85953 0.986134 8.2868 0.999802C9.51123 1.03897 10.4375 2.05916 10.4375 3.25423ZM5.74983 2.14504C6.1649 2.13176 6.58166 2.12507 7 2.12507C7.41834 2.12507 7.83509 2.13176 8.25017 2.14504C8.8266 2.16348 9.29163 2.64752 9.29163 3.25423V3.34027C8.53359 3.29424 7.76949 3.27089 7 3.27089C6.23051 3.27089 5.46641 3.29424 4.70836 3.34027V3.25423C4.70836 2.64752 5.1734 2.16348 5.74983 2.14504ZM5.47881 6.68635C5.46665 6.37017 5.20048 6.12372 4.88431 6.13588C4.56813 6.14804 4.32168 6.41421 4.33384 6.73038L4.59826 13.6053C4.61042 13.9215 4.87659 14.168 5.19276 14.1558C5.50894 14.1436 5.75539 13.8775 5.74323 13.5613L5.47881 6.68635ZM9.66545 6.73038C9.67761 6.41421 9.43116 6.14804 9.11499 6.13588C8.79881 6.12372 8.53264 6.37017 8.52048 6.68635L8.25606 13.5613C8.2439 13.8775 8.49036 14.1436 8.80653 14.1558C9.1227 14.168 9.38887 13.9215 9.40103 13.6053L9.66545 6.73038Z" fill="#666D80"/>
              </svg>
              `,
              missed: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M6.01423 1.88004C6.89654 0.350696 9.10379 0.350696 9.9861 1.88004L15.6066 11.6223C16.4884 13.1508 15.3853 15.0608 13.6207 15.0608H2.37965C0.615028 15.0608 -0.488106 13.1508 0.393715 11.6223L6.01423 1.88004ZM8.00032 5.88975C8.31688 5.88975 8.57351 6.14637 8.57351 6.46294V9.32887C8.57351 9.64543 8.31688 9.90205 8.00032 9.90205C7.68376 9.90205 7.42714 9.64543 7.42714 9.32887V6.46294C7.42714 6.14637 7.68376 5.88975 8.00032 5.88975ZM8.00032 12.1948C8.31688 12.1948 8.57351 11.9382 8.57351 11.6216C8.57351 11.305 8.31688 11.0484 8.00032 11.0484C7.68376 11.0484 7.42714 11.305 7.42714 11.6216C7.42714 11.9382 7.68376 12.1948 8.00032 12.1948Z" fill="#CB7814"/>
              </svg>
              `,
              scheduled: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M8 0.5C3.85786 0.5 0.5 3.85786 0.5 8C0.5 12.1421 3.85786 15.5 8 15.5C12.1421 15.5 15.5 12.1421 15.5 8C15.5 3.85786 12.1421 0.5 8 0.5ZM8.57692 3.38462C8.57692 3.06599 8.31863 2.80769 8 2.80769C7.68137 2.80769 7.42308 3.06599 7.42308 3.38462V8C7.42308 8.31863 7.68137 8.57692 8 8.57692H11.4615C11.7802 8.57692 12.0385 8.31863 12.0385 8C12.0385 7.68137 11.7802 7.42308 11.4615 7.42308H8.57692V3.38462Z" fill="#494AE2"/>
              </svg>
              `,
              requested: `<svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.87454 14.4993C2.7364 14.4858 2.59946 14.4669 2.46434 14.4427C2.26123 14.4063 2.093 14.2643 2.02314 14.0701C1.95328 13.8759 1.99243 13.6593 2.12582 13.5018C2.43606 13.1357 2.6558 12.6921 2.75248 12.2047C2.77006 12.1161 2.73516 11.9611 2.5567 11.7874C1.28815 10.5526 0.5 8.87677 0.5 7.02403C0.5 3.15429 3.90614 0.100952 8 0.100952C12.0939 0.100952 15.5 3.15429 15.5 7.02403C15.5 10.8938 12.0939 13.9471 8 13.9471C7.35907 13.9471 6.73608 13.8728 6.1409 13.7327C5.3419 14.2341 4.39638 14.524 3.38462 14.524C3.21267 14.524 3.04243 14.5157 2.87454 14.4993Z" fill="#666D80"/>
              </svg>
              `
            }

            this.getStatus = function(status){
              return `<span style="color: ${this.statusColors.hasOwnProperty(status) ? this.statusColors[status] : this.statusColors.default }">
              ${this.statusIcons[status.toLowerCase()]} ${status}
              </span>`
            }

            this.config = {
              editMode: false,
              statusList: [
                "Attended",
                "Scheduled",
                "Cancelled",
                "Missed",
                "Requested",
                "Deleted"
              ]
            }
            
            // Initialization logic goes here
        },

        // Optionally implement to format data returned from search. 
        // The returned object will be p`assed to updateView as 'data'
        formatData: function(data) {
            console.log(data)
            // Format data 

            const newData = data.rows.map((r,i)=>{
                let row = {}
                r.forEach((value,i)=>{
                    row[data.fields[i].name]=value
                })
                row['input_id'] = `${this.status_input_id}_${i}`
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
            console.log('editmode',config[this.getPropertyNamespaceInfo().propertyNamespace + 'editMode'])
            this.config.editMode = config[this.getPropertyNamespaceInfo().propertyNamespace + 'editMode'] == 'true' && true;
            this.config.statusList = (config[this.getPropertyNamespaceInfo().propertyNamespace + 'statusList'] ? (config[this.getPropertyNamespaceInfo().propertyNamespace + 'statusList'].split(',').length > 1 ? config[this.getPropertyNamespaceInfo().propertyNamespace + 'statusList'].split(',') : false) : false ) || this.config.statusList;
            this.config.lookup = config[this.getPropertyNamespaceInfo().propertyNamespace + 'lookup'] || 'testlookup';
            this.config.field = config[this.getPropertyNamespaceInfo().propertyNamespace + 'field'] || 'status';
            this.config.spl =  config[this.getPropertyNamespaceInfo().propertyNamespace + 'spl'] || `| inputlookup {{lookup}}
            | eval key = _key
            | search key = "{{key}}"
            | eval "{{field}}" = "{{value}}"
            | outputlookup {{lookup}} append=true key_field=key
            `

            const processSPL = function(lookup,key,field,value) {
              let newSPL = self.config.spl.replaceAll(`\{\{lookup\}\}`,`${lookup}`)
              newSPL = newSPL.replaceAll(`\{\{key\}\}`,`${key}`)
              newSPL = newSPL.replaceAll(`\{\{field\}\}`,`${field}`)
              newSPL = newSPL.replaceAll(`\{\{value\}\}`,`${value}`)
              return newSPL
            }
            

            const statusCallback = function(value,key, input_id){
              // create a search to save the updates
              const spl = processSPL(self.config.lookup,key,self.config.field,value)
              console.log(spl)

              self.updateSearch = new SearchManager({
                preview: false,
                cache: false,
                search: spl
              });

              self.updateSearch.on('search:done',function(e){
                console.log(self.el)
                if(e.content.resultCount == 0){
                  console.warn('No result returned. Please check the query')
                }
                else{
                  console.log('Status update complete!')
                  $(`#${input_id}_status`).html(self.getStatus(value))
                }
              })

              self.updateSearch.on('search:failed',function(e){
                if(e.content.resultCount == 0){
                  console.warn(`${e}, an error occured`)
                }
              })

              self.updateSearch.on('search:error',function(e){
                if(e.content.resultCount == 0){
                  console.warn(`${e}, an error occured`)
                }
              })
              return null
            }

            console.log(this.config)
            let vizHTML =  data.map((d,i)=>{
              return self.template(d,i)
            }).join('')
            
            self.$el.html(`<div class="viz-card-view-main">${vizHTML}</div>`)

            // create dropdown
            console.log(this.config)
            this.dropdownlist = data.map(li=>{
              const dd = new DropdownView({
                choices: this.config.statusList.map(e=>{
                  return { label: e, value: e}
                }),
                default: li.status ? li.status : undefined,
                el: $(`#${li.input_id}`)
              }).render();

              dd.on('change',function(v){
                statusCallback(v,li.key,li.input_id)
              })

              return dd
            })
            

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

        generateUniqueId() {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let uniqueId = '';
        
            for (let i = 0; i < 8; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                uniqueId += characters.charAt(randomIndex);
            }
        
            return `cardview_${uniqueId}`;
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
                  <div id="${data.input_id}_status" style="display: inline-block;">${this.getStatus(data.status)}</div>
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
            <div class="viz-card-view-section viz-card-edit-mode${this.config.editMode ? '-enabled' : '-disabled'}">
              <div class="viz-card-view-item-section">
                <div class="viz-card-edit-mode-item">
                  <span >Status</span>
                  <div id="${data.input_id}"></div>
                </div>
                <div class="viz-card-edit-mode-item">
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