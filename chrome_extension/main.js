// This is for the "old" Reddit format. May have to look into the new format as well.


// Handles the click. Sends the title and text to the remote server to run prediction on
function handler() {
	var title = $('#title-field').find('textarea[name="title"]').val();
	var text = $('#text-field').find('textarea[name="text"]').val();
	$.ajax
	({
		type: "POST",
		url: "https://insight.barnett.science/api/add_message/1234",
        // TODO: remove following after done with local testing
		//url: "http://localhost:8080/api/add_message/1234",
		dataType: "json",
		data: JSON.stringify({ "title": title, "text" : text}),
		contentType: "application/json",
		success: function (result) {
            // TODO: Make this a link the user can click and then populate the "choose
            // where to post" field or add link to subscribe.
            $('#insightsuggestions').text(" ");
            for (var i = 0; i < result.length; i++) {
                $('#insightsuggestions').append('<a style="font-size: small;" href="#" class="sr-suggestion" tabindex="100">' + result[i] + '</a> ');
            }
            $('#insightlink').html('update my suggestions')
		}
	});
}

// Create a link with a specific ID that will be clicked
$('span:contains("choose where to post")').append('<div style="border: 2px solid red; border-radius: 5px; padding: 5px;"><p><a href="javascript:void(0);" id="insightlink">give me suggestions</a><div id="loadingDiv" class="error">loading...</div><div id="insightsuggestions"></div></p></div>');

$('#loadingDiv').hide();

$(document)
    // Waits for link with ID to be clicked
    .ready(function() {
        $("#insightlink").click(handler);
    })
    .ajaxStart(function () {
        $("#loadingDiv").show();
        $('#insightsuggestions').html("");
    })
    .ajaxStop(function () {
        $("#loadingDiv").hide();
    });


// For submissions pages
$('.entry:eq(0)').append('<div id="insightsuggestions" style="font-size: large;">loading...</div>');

$.ajax
({
    type: "POST",
	url: "https://insight.barnett.science/api/already_posted/1234",
    // TODO: remove following after done with local testing
	//url: "http://localhost:8080/api/already_posted/1234",
	dataType: "json",
	data: JSON.stringify({ "url": window.location.href}),
	contentType: "application/json",
	success: function (result) {
        if (result != "") {
            // TODO: Make this a link the user can click and then populate the "choose
            // where to post" field or add link to subscribe.
            $('#insightsuggestions').html('<h3>communities with similar content:</h3>');
            for (var i = 0; i < result.length; i++) {
                $('#insightsuggestions').append('<a style="font-size: large;" href="https://old.reddit.com/r/' + result[i] + '">' + result[i] + '</a> ');
            }
        }
    },
    error: function(xhr, status, error) {
        $('#insightsuggestions').html('<p class="error">error loading communities with similar content</p>');
    }
});
