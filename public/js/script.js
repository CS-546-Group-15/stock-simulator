// shell for ajax form -- TODO

$('.ajax-form').on('submit', function(e) {

    e.preventDefault();

    var form = $(this);
    var url = form.prop('action');
    
    $.ajax({
        type: "post",
        url: url,
        dataType: 'json',
        success: function(json) {
            alert(json);

        },
        error: function(json) {
            alert(json);
        },
    });

});