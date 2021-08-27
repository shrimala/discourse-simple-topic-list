import { registerUnbound } from "discourse-common/lib/helpers";
import { autoUpdatingRelativeAge, relativeAge, relativeAgeTinyShowsYear, tinyDateYear, longDate } from "discourse/lib/formatter";
import { htmlSafe } from "@ember/template";


/**
  Display logic for dates. It is unbound in Ember but will use jQuery to
  update the dates on a regular interval.
**/
registerUnbound("format-date-range-end", function (start, end, params) {
  var leaveAgo,
    format = "medium",
    title = true,
	returnBool = false;

  if (params.leaveAgo) {
    leaveAgo = params.leaveAgo === "true";
  }
  if (params.format) {
    format = params.format;
  }
  if (params.noTitle) {
    title = false;
  }
  if (params.returnBool) {
    returnBool = params.returnBool === "true";
  }
  
  var options = {
        format: format,
        title: title,
        leaveAgo: leaveAgo,
		addAgo: leaveAgo,
      };
 
  if (start) {
    var startDate = new Date(start);
	var startAge = relativeAge(startDate, options);
  }

  if (end) {
    var endDate = new Date(end);
	var nowDate = new Date();
	var endAge = relativeAge(endDate, options);
	var endElement = autoUpdatingRelativeAge(endDate, options);

	var isRange = false;	
	if (startAge) {
      isRange = startAge !== endAge;
	
      // Make format medium if end date is this year and start date is an earlier year.
	  // Otherwise we get things like May 2018 - 27 May.
	  // The match is copied from relativeDateTinyShowYear(), it detects years.
	  if (startAge.match(/'[\d]{2}$/) && endDate.getFullYear() === nowDate.getFullYear()) {
		const distance = Math.round((new Date() - end) / 1000);
		const fiveDaysAgo = 432000;
		if (distance > fiveDaysAgo) {
		  var displayDate = tinyDateYear(end);
          const fullReadable = longDate(end);
	      var endElement = "<span class='date' title='" + fullReadable + "'>" + displayDate + "</span>";
		  isRange = true;
		}
	  }	  
	}
  }	

  if (isRange) {
	return returnBool? true : new Handlebars.SafeString(endElement);
  }
  else {
    return null;
  }
});