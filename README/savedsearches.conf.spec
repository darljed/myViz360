# Declare properties here

# General 
display.visualizations.custom.myViz360.singlevalue360.versionStyle = <integer>
display.visualizations.custom.myViz360.singlevalue360.grouping = <string>
display.visualizations.custom.myViz360.singlevalue360.groupPosition = <string>

# Setup 
display.visualizations.custom.myViz360.singlevalue360.upcolor = <string>
display.visualizations.custom.myViz360.singlevalue360.downcolor = <string>
display.visualizations.custom.myViz360.singlevalue360.iconSet = <string>
display.visualizations.custom.myViz360.singlevalue360.colorBar = <string>

display.visualizations.custom.myViz360.singlevaluemini.versionStyle = <integer>
display.visualizations.custom.myViz360.singlevaluemini.columnCount = <integer>
display.visualizations.custom.myViz360.singlevaluemini.upcolor = <string>
display.visualizations.custom.myViz360.singlevaluemini.downcolor = <string>

display.visualizations.custom.myViz360.lessonscardview.editMode = <string>
display.visualizations.custom.myViz360.lessonscardview.statusList = <string>
display.visualizations.custom.myViz360.lessonscardview.lookup = 
display.visualizations.custom.myViz360.lessonscardview.field = 
display.visualizations.custom.myViz360.lessonscardview.spl = | inputlookup {{lookup}}
            | eval key = _key
            | search key = "{{key}}"
            | eval "{{field}}" = "{{value}}